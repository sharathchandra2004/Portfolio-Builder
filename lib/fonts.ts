export const fontOptions = [
  { id: "Space Grotesk", label: "Space Grotesk", stack: '"Space Grotesk", system-ui, sans-serif' },
  { id: "Instrument Serif", label: "Instrument Serif", stack: '"Instrument Serif", Georgia, serif' },
  { id: "IBM Plex Mono", label: "IBM Plex Mono", stack: '"IBM Plex Mono", ui-monospace, monospace' },
  { id: "DM Sans", label: "DM Sans", stack: '"DM Sans", system-ui, sans-serif' },
] as const;

export function fontStack(font: string): string {
  return fontOptions.find((f) => f.id === font)?.stack ?? fontOptions[0].stack;
}
