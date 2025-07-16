import { useEffect, useRef } from 'react'

interface HeroMouseMovimentProps {
  children: React.ReactNode
  setShowMiniVd: React.Dispatch<React.SetStateAction<boolean>>
  setTransformStyleMiniVd: React.Dispatch<React.SetStateAction<string>>
}

export default function HeroMouseMoviment({
  children,
  setShowMiniVd,
  setTransformStyleMiniVd
}: HeroMouseMovimentProps) {
  const currentPositionRef = useRef({ x: 0, y: 0 })
  const lastPositionRef = useRef({ x: 0, y: 0 })

  const heroDiv = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentPosition = { x: e.clientX, y: e.clientY }
    currentPositionRef.current = currentPosition
    handleMouseMoveStyle(e)
  }

  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastCheckTimeRef = useRef<number>(0)

  const handleMouse = () => {
    if (!heroDiv.current) return
    const width = heroDiv.current.offsetWidth
    const height = heroDiv.current.offsetHeight
    const threshold = 5 / 100

    const thresholdX = width * threshold
    const thresholdY = height * threshold

    const lastPos = lastPositionRef.current
    const currentPos = currentPositionRef.current

    const dx = Math.abs(currentPos.x - lastPos.x)
    const dy = Math.abs(currentPos.y - lastPos.y)

    if (dx > thresholdX || dy > thresholdY) {
      setShowMiniVd(true)
    } else {
      setShowMiniVd(false)
    }
    lastPositionRef.current = currentPositionRef.current
  }

  const checkMouseMovement = (timestamp: number) => {
    // Throttle para verificar apenas a cada 1000ms
    if (timestamp - lastCheckTimeRef.current >= 1000) {
      handleMouse()
      lastCheckTimeRef.current = timestamp
    }
    animationFrameRef.current = requestAnimationFrame(checkMouseMovement)
  }

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(checkMouseMovement)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //setTransformStyleMiniVd `perspective(500px) rotateX(-20deg) rotateY(20deg) scale3d(.98, .98, .98)`
  const handleMouseMoveStyle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroDiv.current) return

    const { left, top, width, height } = heroDiv.current.getBoundingClientRect()

    const relativeX = (e.clientX - left) / width
    const relativeY = (e.clientY - top) / height

    const tilt = 50
    const tiltX = (relativeY - 0.5) * -tilt
    const tiltY = (relativeX - 0.5) * tilt

    const newTransform = `perspective(300px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`

    setTransformStyleMiniVd(newTransform)
  }

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
