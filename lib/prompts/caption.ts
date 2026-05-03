// SPEC §7.2 — source of truth for the caption prompt. Edit the spec first.

import type { CaptionTone } from '@/types/studio';

export function captionPrompt(args: {
  tone: CaptionTone;
  handle: string;
  content: string;
}): string {
  const { tone, handle, content } = args;
  return `You are a LinkedIn growth expert for AI/ML creators. Write a high-engagement caption.

Tone: ${tone}
Author: ${handle}

Graphic content:
${content}

Style:
- Strong hook in first line
- Short paragraphs (1–2 sentences) with line breaks
- Use → for bullet points (not • or -)
- Include "Key Takeaways" section
- End with engagement question
- 5–8 hashtags at end
- 200–400 words

Output ONLY the caption.`;
}
