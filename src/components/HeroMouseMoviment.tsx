import { useEffect, useRef } from 'react'

export default function HeroMouseMoviment({
  children,
  setSetshowMiniVd
}: {
  children: React.ReactNode
  setSetshowMiniVd: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const currentPositionRef = useRef({ x: 0, y: 0 })
  const lastPositionRef = useRef({ x: 0, y: 0 })

  const heroDiv = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentPosition = { x: e.clientX, y: e.clientY }
    currentPositionRef.current = currentPosition
  }

  const handleMouse = () => {
    if (!heroDiv.current) return
    const width = heroDiv.current.offsetWidth
    const height = heroDiv.current.offsetHeight
    const threshold = 10 / 100

    const thresholdX = width * threshold
    const thresholdY = height * threshold

    const lastPos = lastPositionRef.current
    const currentPos = currentPositionRef.current

    const dx = Math.abs(currentPos.x - lastPos.x)
    const dy = Math.abs(currentPos.y - lastPos.y)

    if (dx > thresholdX || dy > thresholdY) {
      setSetshowMiniVd(true)
    } else {
      setSetshowMiniVd(false)
    }
    lastPositionRef.current = currentPositionRef.current
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleMouse()
    }, 500)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      ref={heroDiv}
      onMouseMove={handleMouseMove}
      className="inset-0 absolute flex-center"
    >
      {children}
    </div>
  )
}
