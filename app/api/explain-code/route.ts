import { NextRequest, NextResponse } from 'next/server';
import {
  extractJson,
  extractText,
  getClaude,
  MissingApiKeyError,
} from '@/lib/api/claude';
import { codeExplainerPrompt } from '@/lib/prompts/code-explainer';

const MODEL = 'claude-opus-4-7';
const MAX_TOKENS = 512;

const POINT_MAX = 90;
const ELLIPSIS = '…';
const MIN_POINTS = 3;
const MAX_POINTS = 5;
const CODE_MAX = 8000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { code, language } = (body ?? {}) as {
    code?: unknown;
    language?: unknown;
  };

  if (typeof code !== 'string' || !code.trim()) {
    return NextResponse.json({ error: 'code is required.' }, { status: 400 });
  }
  if (code.length > CODE_MAX) {
    return NextResponse.json(
      { error: `code must be ${CODE_MAX} characters or fewer.` },
      { status: 400 },
    );
  }
  if (typeof language !== 'string' || !language.trim()) {
    return NextResponse.json({ error: 'language is required.' }, { status: 400 });
  }

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
          content: codeExplainerPrompt({ language: language.trim(), code }),
        },
      ],
    });

    const text = extractText(message);
    const parsed = extractJson<{ points?: unknown }>(text);

    if (!Array.isArray(parsed.points)) {
      return NextResponse.json(
        { error: 'Claude response missing points array.' },
        { status: 500 },
      );
    }

    const points = parsed.points
      .filter((p): p is string => typeof p === 'string')
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, MAX_POINTS)
      .map(clampPoint);

    if (points.length < MIN_POINTS) {
      return NextResponse.json(
        { error: `Claude returned fewer than ${MIN_POINTS} bullet points.` },
        { status: 500 },
      );
    }

    return NextResponse.json({ points });
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

function clampPoint(s: string): string {
  if (s.length <= POINT_MAX) return s;
  return `${s.slice(0, POINT_MAX - ELLIPSIS.length)}${ELLIPSIS}`;
}
