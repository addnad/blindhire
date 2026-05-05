'use client'
import { motion, AnimatePresence } from 'motion/react'
import React from 'react'

type Preset = 'fade-in-blur' | 'fade' | 'slide'

interface TextEffectProps {
  children?: React.ReactNode
  text?: string
  as?: keyof React.JSX.IntrinsicElements
  preset?: Preset
  className?: string
  delay?: number
  speedSegment?: number
  per?: 'word' | 'char' | 'line'
}

export function TextEffect({
  text,
  children,
  as: Tag = 'p',
  preset = 'fade-in-blur',
  className,
  delay = 0,
  speedSegment = 0.3,
  per = 'word',
}: TextEffectProps) {
  const content = text || (typeof children === 'string' ? children : '')
  const segments = per === 'char' ? content.split('') : per === 'line' ? [content] : content.split(' ')

  const variants = {
    hidden: preset === 'fade-in-blur'
      ? { opacity: 0, filter: 'blur(8px)', y: 8 }
      : { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { delay: delay + i * speedSegment, duration: 0.5, ease: 'easeOut' },
    }),
  }

  const MotionTag = motion[Tag as keyof typeof motion] as any

  return (
    <MotionTag className={className}>
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={variants}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block', marginRight: per === 'word' ? '0.25em' : undefined }}>
          {seg}
        </motion.span>
      ))}
    </MotionTag>
  )
}
