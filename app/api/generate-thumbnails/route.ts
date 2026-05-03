import { NextRequest, NextResponse } from 'next/server';
import {
  extractJson,
  extractText,
  getClaude,
  MissingApiKeyError,
} from '@/lib/api/claude';
import { thumbnailPrompt } from '@/lib/prompts/thumbnail';
import type {
  ThumbnailStyle,
  ThumbnailVariant,
} from '@/types/studio';

const MODEL = 'claude-opus-4-7';
const MAX_TOKENS = 1024;

const HOOK_MAX = 35;
const SUBLINE_MAX = 30;
const CONTEXT_MAX = 25;
const ELLIPSIS = '…';

const IDEA_MIN = 5;
const IDEA_MAX = 200;

const STYLES: ThumbnailStyle[] = ['shock', 'question', 'stat', 'reveal'];

interface RawVariant {
  style?: unknown;
  hook?: unknown;
  subline?: unknown;
  context?: unknown;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const idea = (body as { idea?: unknown })?.idea;
  if (typeof idea !== 'string') {
    return NextResponse.json({ error: 'idea is required.' }, { status: 400 });
  }
  const trimmed = idea.trim();
  if (trimmed.length < IDEA_MIN || trimmed.length > IDEA_MAX) {
    return NextResponse.json(
      {
        error: `idea must be between ${IDEA_MIN} and ${IDEA_MAX} characters.`,
      },
      { status: 400 },
    );
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
      messages: [{ role: 'user', content: thumbnailPrompt(trimmed) }],
    });

    const text = extractText(message);
    const parsed = extractJson<{ variants?: RawVariant[] }>(text);

    if (!Array.isArray(parsed.variants)) {
      return NextResponse.json(
        { error: 'Claude response missing variants array.' },
        { status: 500 },
      );
    }

    const variants = normalizeVariants(parsed.variants);
    if (variants.length !== 4) {
      return NextResponse.json(
        { error: 'Claude returned an incomplete variant set.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ variants });
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

function clamp(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const s = value.trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - ELLIPSIS.length)}${ELLIPSIS}`;
}

/**
 * Returns variants in the canonical order [shock, question, stat, reveal],
 * pulling each style from `raw` if present. Missing styles are skipped (caller
 * checks the final length).
 */
function normalizeVariants(raw: RawVariant[]): ThumbnailVariant[] {
  const byStyle = new Map<ThumbnailStyle, RawVariant>();
  for (const v of raw) {
    if (typeof v?.style === 'string' && (STYLES as string[]).includes(v.style)) {
      byStyle.set(v.style as ThumbnailStyle, v);
    }
  }

  const out: ThumbnailVariant[] = [];
  for (const style of STYLES) {
    const v = byStyle.get(style);
    if (!v) continue;
    out.push({
      style,
      hook: clamp(v.hook, HOOK_MAX),
      subline: clamp(v.subline, SUBLINE_MAX),
      context: clamp(v.context, CONTEXT_MAX),
    });
  }
  return out;
}
