'use client'

import { useEffect, useState, useRef } from 'react'
import { TrendingDown } from 'lucide-react'

interface CountUpNumberProps {
    value: string
    duration?: number
    className?: string
}

export default function CountUpNumber({ value, duration = 2000, className }: CountUpNumberProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    // Parse the numeric part
    const numericMatch = value.match(/[\d,]+/)

    // If no number found, just render the text
    if (!numericMatch) {
        return <span className={className}>{value}</span>
    }

    const numberStr = numericMatch[0].replace(/,/g, '')
    const targetNumber = parseInt(numberStr, 10)

    // Find prefix and suffix
    const numericIndex = value.indexOf(numericMatch[0])
    const prefix = value.substring(0, numericIndex)
    const suffix = value.substring(numericIndex + numericMatch[0].length)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [hasAnimated])

    useEffect(() => {
        if (!hasAnimated) return

        let startTime: number | null = null
        let animationFrameId: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percentage = Math.min(progress / duration, 1)

            // Ease out quart
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4)

            const current = Math.floor(targetNumber * easeOutQuart)
            setDisplayValue(current)

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setDisplayValue(targetNumber)
            }
        }

        animationFrameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrameId)
    }, [hasAnimated, targetNumber, duration])

    if (isNaN(targetNumber)) {
        return <span className={className}>{value}</span>
    }

    return (
        <span ref={elementRef} className={className}>
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
        </span>
    )
}
