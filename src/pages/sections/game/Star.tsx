"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface StarProps {
  fillProgress: number,
  size: string,
  id: string,
  shouldShowConfeti: boolean
  
}

export default function Star({fillProgress, size, id, shouldShowConfeti}: StarProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    console.log(fillProgress, size)
  }, [fillProgress])
  // const handleClick = () => {
  //   if (fillProgress < 1) {
  //     setFillProgress(prev => Math.min(prev + 0.2, 1))
  //   }
  // }

  useEffect(() => {
    if (fillProgress === 1 && shouldShowConfeti) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [fillProgress])

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer relative"
      >
        <svg width={size} height={size} viewBox="0 0 24 24">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset={`${fillProgress * 100}%`} stopColor="#FFFFFF" />
              <stop offset={`${fillProgress * 100}%`} stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
          <motion.path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={`url(#${id})`}
            stroke="#FFD700"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: fillProgress === 1 ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
        </motion.div>
      </motion.div>
      {showConfetti && <Confetti />}
    </div>
  )
}