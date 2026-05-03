// SPEC §7.3 — source of truth for the code-explainer prompt. Edit the spec first.

export function codeExplainerPrompt(args: {
  language: string;
  code: string;
}): string {
  const { language, code } = args;
  return `You are explaining ${language} code to a LinkedIn audience of ML/coding creators.

Code:
${code}

Return ONLY valid JSON:
{ "points": ["…", "…", "…"] }   // 3–5 bullet points, each ≤ 90 chars`;
}
