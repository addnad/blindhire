'use client'
import React from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

interface Props {
  text: string
  speed?: number
  className?: string
  animateOn?: 'view' | 'hover' | 'mount'
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  useOriginalCharsOnly?: boolean
}

export default function DecryptedText({ text, speed = 50, className, animateOn = 'mount' }: Props) {
  const [displayed, setDisplayed] = React.useState(text)
  const [revealed, setRevealed] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  const animate = React.useCallback(() => {
    if (revealed) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayed(
        text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      if (iteration >= text.length) {
        clearInterval(interval)
        setDisplayed(text)
        setRevealed(true)
      }
      iteration += 1 / 3
    }, speed)
  }, [text, speed, revealed])

  React.useEffect(() => {
    if (animateOn === 'mount') { animate(); return }
    if (animateOn !== 'view') return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) animate() },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate, animateOn])

  return <span ref={ref} className={className}>{displayed}</span>
}
