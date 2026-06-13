import React, { useEffect, useRef } from 'react'

interface Options {
  threshold?: number
  delay?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useScrollReveal(options: Options = {}): React.RefObject<any> {
  const { delay = '0s', threshold = 0.15 } = options
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
    }, { threshold })
    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    el.style.transition = `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

export function useScrollRevealList(count: number, baseDelay = 0.1) {
  const itemRefs = useRef<(HTMLElement | null)[]>(Array(count).fill(null))
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const delay = `${(i * baseDelay).toFixed(1)}s`
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).style.opacity = '1'
          ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
        }
      }, { threshold: 0.1 })
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])
  return (i: number) => (el: HTMLElement | null) => { itemRefs.current[i] = el }
}
