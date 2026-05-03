import { NextRequest, NextResponse } from 'next/server';
import { extractText, getClaude, MissingApiKeyError } from '@/lib/api/claude';
import { captionPrompt } from '@/lib/prompts/caption';
import type { CaptionTone } from '@/types/studio';

const MODEL = 'claude-opus-4-7';
const MAX_TOKENS = 1500;

const TONES: CaptionTone[] = ['professional', 'casual', 'bold', 'storytelling'];

interface RequestBody {
  tone: CaptionTone;
  authorHandle: string;
  graphicSummary: string;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validation = parseBody(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { tone, authorHandle, graphicSummary } = validation.value;

  let client;
  try {
    client = getClaude();
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return NextResponse.json({ error: 'AI not configured.' }, { status: 503 });
    }
    throw err;
  }

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: captionPrompt({
            tone,
            handle: authorHandle,
            content: graphicSummary,
          }),
        },
      ],
    });

    const caption = extractText(message).trim();
    if (!caption) {
      return NextResponse.json(
        { error: 'Claude returned an empty caption.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ caption });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Claude request failed: ${err.message}`
            : 'Claude request failed.',
      },
      { status: 500 },
    );
  }
}

type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

function parseBody(body: unknown): Validated<RequestBody> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Body must be a JSON object.' };
  }
  const { tone, authorHandle, graphicSummary } = body as Record<string, unknown>;

  if (typeof tone !== 'string' || !(TONES as string[]).includes(tone)) {
    return {
      ok: false,
      error: `tone must be one of: ${TONES.join(', ')}.`,
    };
  }
  if (typeof authorHandle !== 'string' || !authorHandle.trim()) {
    return { ok: false, error: 'authorHandle is required.' };
  }
  if (typeof graphicSummary !== 'string' || !graphicSummary.trim()) {
    return { ok: false, error: 'graphicSummary is required.' };
  }

  return {
    ok: true,
    value: {
      tone: tone as CaptionTone,
      authorHandle: authorHandle.trim(),
      graphicSummary: graphicSummary.trim(),
    },
  };
}
