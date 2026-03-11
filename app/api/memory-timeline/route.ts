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

type RawNote = {
  id: string
  title: string | null
  content: string | null
  created_at: string
  updated_at: string | null
}

type TimelineDay = {
  date: string
  entries: string[]
}

export async function GET(req: NextRequest) {
  try {
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

    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = new URL(req.url)
    const daysParam = url.searchParams.get("days")
    const days = Math.min(Math.max(Number(daysParam) || 7, 1), 30)

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("id, title, content, created_at, updated_at")
      .gte("created_at", sinceDate.toISOString())
      .order("created_at", { ascending: true })
      .limit(500)

    if (notesError) {
      // eslint-disable-next-line no-console
      console.error("Error fetching notes for memory timeline:", notesError)
      return NextResponse.json(
        { error: "Failed to fetch notes", success: false },
        { status: 500 },
      )
    }

    if (!notes || notes.length === 0) {
      return NextResponse.json(
        {
          success: true,
          days: [] as TimelineDay[],
        },
        { status: 200 },
      )
    }

    const dailyNotes: Record<string, RawNote[]> = {}
    for (const note of notes as RawNote[]) {
      const dateKey = note.created_at.slice(0, 10)
      if (!dailyNotes[dateKey]) {
        dailyNotes[dateKey] = []
      }
      dailyNotes[dateKey].push(note)
    }

    const dailySummariesInput = Object.entries(dailyNotes).map(([date, dayNotes]) => ({
      date,
      notes: dayNotes.map((n) => ({
        id: n.id,
        title: n.title ?? "Untitled note",
        contentPreview: (n.content ?? "").slice(0, 800),
      })),
    }))

    const systemPrompt =
      "You are MindSync's memory timeline engine. " +
      "Given a set of notes grouped by date, you create a concise 'AI memory timeline' for the user. " +
      "For each day, infer 1–3 high-level activities or themes that would feel meaningful to a human reviewing their past week. " +
      "Use short, past-tense phrases similar to: 'You researched Solana NFT royalties', 'You wrote mint strategy notes', 'You asked MindSync about NFTs'. " +
      "Focus on what the user did or thought about, not low-level implementation details."

    const userPrompt = [
      "Here are the user's notes grouped by date.",
      "",
      "Return a JSON object with this exact shape:",
      "",
      '{ "days": [ { "date": "YYYY-MM-DD", "entries": ["short memory 1", "short memory 2"] } ] }',
      "",
      "Only include dates that appear in the input. For each date, include at most 3 entries.",
      "",
      "Notes by date:",
      JSON.stringify(dailySummariesInput, null, 2),
    ].join("\n")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    const rawContent = completion.choices[0]?.message?.content ?? "{}"

    let parsed: { days?: TimelineDay[] } = {}
    try {
      parsed = JSON.parse(rawContent)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to parse memory timeline JSON:", err, rawContent)
    }

    const daysResult: TimelineDay[] = Array.isArray(parsed.days) ? parsed.days : []

    return NextResponse.json(
      {
        success: true,
        days: daysResult,
      },
      { status: 200 },
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in /api/memory-timeline route:", error)
    return NextResponse.json(
      { error: "Unexpected server error", success: false },
      { status: 500 },
    )
  }
}

