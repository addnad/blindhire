'use client'
import { motion } from 'motion/react'
import React from 'react'

interface AnimatedGroupProps {
  children: React.ReactNode
  className?: string
  variants?: any
}

export function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants?.container}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child) ? (
          <motion.div key={i} variants={variants?.item}>
            {child}
          </motion.div>
        ) : child
      )}
    </motion.div>
  )
}
