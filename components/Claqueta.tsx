/**
 * Franja de claqueta — the brand's signature separator: alternating volt /
 * dark segments, like the leader strip on a film slate.
 */
export default function Claqueta({ height = 14 }: { height?: number }) {
  return (
    <div
      role="presentation"
      className="w-full shrink-0"
      style={{
        height,
        backgroundImage: 'repeating-linear-gradient(90deg, #C6FF00 0 28px, #1E1E1E 28px 56px)',
      }}
    />
  )
}
