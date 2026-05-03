import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Thrown by getClaude() when ANTHROPIC_API_KEY is unset.
 * Routes catch this specifically and return 503 { error: 'AI not configured' }
 * (CLAUDE.md, SPEC §12) so the UI can hide Quick AI buttons gracefully instead
 * of treating it like a runtime failure.
 */
export class MissingApiKeyError extends Error {
  constructor() {
    super(
      'ANTHROPIC_API_KEY environment variable is not set. ' +
        'Copy .env.example to .env.local and fill in your Claude API key.',
    );
    this.name = 'MissingApiKeyError';
  }
}

let cached: Anthropic | undefined;

/** Server-only Anthropic client factory. Caches one client per Node process. */
export function getClaude(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new MissingApiKeyError();
  if (!cached) cached = new Anthropic({ apiKey });
  return cached;
}

/** Concatenates the text of every text block in a Claude message response. */
export function extractText(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

/**
 * Best-effort JSON extractor: handles bare JSON, ```json fences, and JSON
 * embedded in surrounding prose. Throws if no parseable object is found.
 */
export function extractJson<T>(text: string): T {
  // 1. raw parse
  try {
    return JSON.parse(text) as T;
  } catch {}

  // 2. fenced block
  const fenced = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]) as T;
    } catch {}
  }

  // 3. first { ... last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1)) as T;
    } catch {}
  }

  throw new Error('Could not parse JSON from Claude response.');
}
