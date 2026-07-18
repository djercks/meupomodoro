import { useMemo } from 'react'

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function AmbientEffect({ type }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        left: `${randomBetween(0, 100)}%`,
        duration: `${randomBetween(10, 22)}s`,
        delay: `${randomBetween(0, 20)}s`,
        size: `${randomBetween(2, 5)}px`,
      })),
    []
  )

  const raindrops = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: `${randomBetween(0, 100)}%`,
        duration: `${randomBetween(0.6, 1.4)}s`,
        delay: `${randomBetween(0, 2)}s`,
      })),
    []
  )

  const bubbleList = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: `${randomBetween(0, 100)}%`,
        duration: `${randomBetween(9, 18)}s`,
        delay: `${randomBetween(0, 16)}s`,
        size: `${randomBetween(8, 22)}px`,
      })),
    []
  )

  if (type === 'off') return null

  if (type === 'particles') {
    return (
      <div className="particles" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>
    )
  }

  if (type === 'rain') {
    return (
      <div className="rain" aria-hidden="true">
        {raindrops.map((r, i) => (
          <span
            key={i}
            style={{
              left: r.left,
              animationDuration: r.duration,
              animationDelay: r.delay,
            }}
          />
        ))}
      </div>
    )
  }

  if (type === 'bubbles') {
    return (
      <div className="bubbles" aria-hidden="true">
        {bubbleList.map((b, i) => (
          <span
            key={i}
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: b.duration,
              animationDelay: b.delay,
            }}
          />
        ))}
      </div>
    )
  }

  // stars (default)
  return <div className="stars" aria-hidden="true" />
}
