import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase environment variables are not set")
}

if (!openaiApiKey) {
  // eslint-disable-next-line no-console
  console.warn("OPENAI_API_KEY is not set")
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
})

type NoteRecord = {
  id: string
  user_id?: string
  title: string | null
  content: string | null
  tags?: string[] | null
  created_at: string
  updated_at?: string | null
}

type RecallRequestBody = {
  question?: string
  query?: string
}

type RecallResponse = {
  success: boolean
  answer?: string
  matchedNotes?: NoteRecord[]
  error?: string
}

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "if",
  "then",
  "else",
  "when",
  "what",
  "where",
  "why",
  "how",
  "is",
  "are",
  "was",
  "were",
  "be",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "about",
  "as",
  "at",
  "by",
  "from",
])

function extractKeywords(question: string): string[] {
  return question
    .toLowerCase()
    .split(/[^a-z0-9]+/gi)
    .filter((token) => token && token.length >= 3 && !STOP_WORDS.has(token))
}

function scoreNote(note: NoteRecord, keywords: string[], now: Date): number {
  if (!keywords.length) return 0

  const title = (note.title ?? "").toLowerCase()
  const content = (note.content ?? "").toLowerCase()
  const tags = (note.tags ?? []).map((t) => String(t).toLowerCase())

  let score = 0

  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      score += 5
    }
    if (content.includes(keyword)) {
      score += 2
    }
    if (tags.some((tag) => tag.includes(keyword))) {
      score += 3
    }
  }

  // Simple recency boost: newer notes get a small bump.
  const createdAt = new Date(note.created_at)
  const diffMs = now.getTime() - createdAt.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  const recencyBoost = Math.max(0, 5 - diffDays * 0.2)

  return score + recencyBoost
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RecallRequestBody
    const question = (body?.question ?? body?.query ?? "").trim()

    if (!question) {
      return NextResponse.json(
        { error: "Question is required", success: false },
        { status: 400 },
      )
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are not configured", success: false },
        { status: 500 },
      )
    }

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured", success: false },
        { status: 500 },
      )
    }

    const authHeader = req.headers.get("authorization") ?? ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null

    if (!token) {
      return NextResponse.json<RecallResponse>(
        { success: false, error: "Unauthorized: missing access token" },
        { status: 401 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      // eslint-disable-next-line no-console
      console.error("Error verifying Supabase user in /api/recall:", userError)
      return NextResponse.json<RecallResponse>(
        { success: false, error: "Failed to verify user" },
        { status: 401 },
      )
    }

    if (!user) {
      return NextResponse.json<RecallResponse>(
        { success: false, error: "Unauthorized: user not found" },
        { status: 401 },
      )
    }

    // Fetch this user's notes for simple in-memory ranking.
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("id, user_id, title, content, tags, created_at, updated_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(200)

    if (notesError) {
      // eslint-disable-next-line no-console
      console.error("Error fetching notes from Supabase:", notesError)
      return NextResponse.json(
        { error: "Failed to fetch notes", success: false },
        { status: 500 },
      )
    }

    const typedNotes = (notes ?? []) as NoteRecord[]
    const keywords = extractKeywords(question)
    const now = new Date()

    const scored = typedNotes
      .map((note) => ({
        note,
        score: scoreNote(note, keywords, now),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)

    const matchedNotes = scored.map((item) => item.note)

    const notesText =
      matchedNotes.length > 0
        ? matchedNotes
            .map((note) => {
              const contentPreview = (note.content ?? "").slice(0, 1000)
              const tags = (note.tags ?? []).join(", ")
              return [
                `ID: ${note.id}`,
                `Title: ${note.title ?? "Untitled"}`,
                `Created at: ${note.created_at}`,
                tags ? `Tags: ${tags}` : "",
                "",
                "Content:",
                contentPreview,
              ]
                .filter(Boolean)
                .join("\n")
            })
            .join("\n\n---\n\n")
        : "No relevant notes were found for this question."

    const prompt = [
      {
        role: "system" as const,
        content:
          "You are MindSync, an assistant that answers questions based strictly on the user's personal notes. " +
          "Use the provided notes as your only source of truth. If the notes do not contain the answer, say you don't know. " +
          "When helpful, briefly reference which notes you used (by title or a short description) so the user can trace the answer back.",
      },
      {
        role: "user" as const,
        content: [
          "User question:",
          question,
          "",
          "Relevant notes (most to least relevant):",
          notesText,
          "",
          "Answer the user's question in a concise, helpful way, citing the notes you used.",
        ].join("\n"),
      },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: prompt,
      temperature: 0.2,
    })

    const answer = completion.choices[0]?.message?.content ?? ""

    // Best-effort: save the recall query for later analysis.
    try {
      const matchedNoteIds = matchedNotes.map((n) => n.id)
      await supabase.from("recall_queries").insert({
        user_id: user.id,
        question,
        answer,
        note_ids: matchedNoteIds,
      })
    } catch (saveError) {
      // eslint-disable-next-line no-console
      console.error("Failed to save recall query:", saveError)
      // Do not fail the main request if logging the query fails.
    }

    return NextResponse.json<RecallResponse>(
      {
        success: true,
        answer,
        matchedNotes,
      },
      { status: 200 },
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in /api/recall route:", error)
    return NextResponse.json(
      { error: "Unexpected server error", success: false },
      { status: 500 },
    )
  }
}

