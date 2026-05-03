/**
 * Greedy word-wrap. Returns one string per visual line, suitable for emitting
 * into <text> as a sequence of <tspan> elements.
 *
 * - Preserves explicit "\n" paragraph breaks (each becomes a line).
 * - Words longer than `maxCharsPerLine` overflow rather than break mid-word
 *   (matches the prototype in Old-code.ts:89).
 * - Returns `['']` for empty input so callers can render a single empty <tspan>.
 */
export function wrapText(text: string, maxCharsPerLine: number): string[] {
  if (!text) return [''];

  const lines: string[] = [];

  for (const paragraph of text.split('\n')) {
    if (!paragraph) {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
  }

  return lines;
}
