/**
 * Kuadra wordmark as inline SVG.
 * The brand dot is part of the mark and carries the rec blink, so there is
 * a single dot and the letters scale with it. The viewBox is trimmed to the
 * glyph bounds so `height` maps to the cap height, not to padding.
 *
 * Letters use `currentColor`; set the text color on the parent.
 */
type Props = {
  className?: string
  /** Set to false to keep the dot static (e.g. reduced-motion contexts). */
  blink?: boolean
}

const GLYPHS = [
  [194.0, 'M540 688H814L567 405L819 0H558L415 252L295 154V0H74V688H295V394Z'],
  [
    377.26,
    'M417 -12Q253 -12 163.5 62.0Q74 136 74 277V688H295V280Q295 222 326.0 187.5Q357 153 416 153Q475 153 506.5 188.0Q538 223 538 280V688H759V277Q759 136 670.0 62.0Q581 -12 417 -12Z',
  ],
  [560.52, 'M535 0 506 97H265L236 0H10L261 688H518L769 0ZM311 251H460L388 496H384Z'],
  [
    731.68,
    'M733 344Q733 0 372 0H74V688H372Q733 688 733 344ZM295 165H368Q507 165 507 314V374Q507 523 368 523H295Z',
  ],
  [
    902.84,
    'M594 288 747 0H499L377 251H295V0H74V688H495Q569 688 621.5 659.5Q674 631 700.5 582.5Q727 534 727 477Q727 414 693.0 363.0Q659 312 594 288ZM440 531H295V404H440Q466 404 484.0 422.5Q502 441 502 468Q502 495 484.0 513.0Q466 531 440 531Z',
  ],
  [1074.0, 'M535 0 506 97H265L236 0H10L261 688H518L769 0ZM311 251H460L388 496H384Z'],
] as const

export default function Wordmark({ className = '', blink = true }: Props) {
  return (
    <svg
      viewBox="90 140 1153 160"
      className={className}
      role="img"
      aria-label="Kuadra"
    >
      <circle
        cx="120"
        cy="220"
        r="30"
        className={`fill-volt ${blink ? 'u-rec' : ''}`}
      />
      {GLYPHS.map(([x, d]) => (
        <path
          key={x}
          transform={`translate(${x},295.68) scale(0.22,-0.22)`}
          d={d}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
