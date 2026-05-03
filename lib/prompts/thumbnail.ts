// SPEC §7.1 — source of truth for the thumbnail prompt. Edit the spec first.

export function thumbnailPrompt(idea: string): string {
  return `You are a LinkedIn thumbnail designer for AI/ML/coding content.
User idea: "${idea}"

Generate 4 scroll-stopping thumbnail variations. Return ONLY valid JSON:
{
  "variants": [
    { "style": "shock",    "hook": "...", "subline": "...", "context": "..." },
    { "style": "question", "hook": "...", "subline": "...", "context": "..." },
    { "style": "stat",     "hook": "...", "subline": "...", "context": "..." },
    { "style": "reveal",   "hook": "...", "subline": "...", "context": "..." }
  ]
}

Rules:
- "shock":    ALL CAPS, 3-5 powerful words, urgent
- "question": Provocative question
- "stat":     Big number/multiplier with context
- "reveal":   Personal/story-driven
- hook    ≤ 35 chars
- subline ≤ 30 chars
- context ≤ 25 chars
- Power words allowed: STOP, NEVER, WHY, HOW, SECRET, TRUTH, MISTAKE
- Be specific to the topic. No generic filler.`;
}
