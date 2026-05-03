// Class-based, framework-agnostic PNG exporter for inline SVG.
// Returns base64 data URLs only — never blob URLs (SPEC §9, CLAUDE.md rule 5).

const VIEWBOX_SIZE = 1200;

const STYLE_PROPS: readonly string[] = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-linejoin',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'text-anchor',
  'dominant-baseline',
  'color',
  'mix-blend-mode',
];

export interface ToPngOptions {
  width?: number;
  height?: number;
}

export class SvgExporter {
  constructor(private readonly svgEl: SVGSVGElement) {}

  /** Returns a base64 data URL (NOT a blob URL — required for iframe sandbox). */
  async toPng(opts?: ToPngOptions): Promise<string> {
    const width = opts?.width ?? VIEWBOX_SIZE;
    const height = opts?.height ?? VIEWBOX_SIZE;

    const svgString = this.serializeSvg();
    const image = await this.svgToImage(svgString);
    const canvas = this.imageToCanvas(image, width, height);
    return this.canvasToDataUrl(canvas);
  }

  /** Triggers a browser download via a hidden <a> tag. */
  async download(filename: string, opts?: ToPngOptions): Promise<void> {
    const dataUrl = await this.toPng(opts);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  private serializeSvg(): string {
    const clone = this.svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const { width, height } = this.naturalSize();
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));

    inlineStyles(this.svgEl, clone);

    return new XMLSerializer().serializeToString(clone);
  }

  private naturalSize(): { width: number; height: number } {
    const viewBox = this.svgEl.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
        return { width: parts[2], height: parts[3] };
      }
    }
    return { width: VIEWBOX_SIZE, height: VIEWBOX_SIZE };
  }

  private async svgToImage(svgString: string): Promise<HTMLImageElement> {
    const dataUrl = `data:image/svg+xml;base64,${utf8ToBase64(svgString)}`;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load serialized SVG.'));
      img.src = dataUrl;
    });
  }

  private imageToCanvas(
    img: HTMLImageElement,
    width: number,
    height: number,
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not acquire 2d canvas context.');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  }

  private canvasToDataUrl(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }
}

/**
 * Walk source + cloned target in lockstep, reading computed styles from
 * the live source nodes and writing them as inline `style="..."` on the clone.
 * Required because the clone is rendered out-of-document and won't pick up
 * stylesheet rules.
 */
function inlineStyles(source: Element, target: Element): void {
  const computed = window.getComputedStyle(source);
  let cssText = '';
  for (const prop of STYLE_PROPS) {
    const value = computed.getPropertyValue(prop);
    if (value) cssText += `${prop}:${value};`;
  }
  if (cssText) target.setAttribute('style', cssText);

  const sourceChildren = source.children;
  const targetChildren = target.children;
  const len = Math.min(sourceChildren.length, targetChildren.length);
  for (let i = 0; i < len; i++) {
    inlineStyles(sourceChildren[i], targetChildren[i]);
  }
}

/**
 * UTF-8 safe base64 encoder. `btoa` is latin-1 only and throws on most
 * non-ASCII characters; templates routinely contain glyphs (em-dashes,
 * arrows, math symbols) that need this path.
 */
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
