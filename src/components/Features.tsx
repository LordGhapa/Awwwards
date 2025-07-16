import { TiLocationArrow } from 'react-icons/ti'

export default function Features() {
  return (
    <section className="bg-black pb-52 -mb-[1px]">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Metagame Layer
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-80">
            Immerse yourself in a rich and ever-expanding universe where a
            vibrant array of products converge into an interconnected overlay
            experience on your world.
          </p>
        </div>
        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
          <BentoCard
            src="videos/feature-1.mp4"
            title={<> radiant</>}
            description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
          />
        </BentoTilt>
        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="row-span-1 bento-tilt-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="videos/feature-2.mp4"
              title={<> zigma</>}
              description="An anime and gaming-inspired NFT collection - the IP primed for expansion."
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt-1 row-span-1 ms-32 md:col-span-1 md:ms-0">
            <BentoCard
              src="videos/feature-3.mp4"
              title={<>nexus</>}
              description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt-1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              src="videos/feature-4.mp4"
              title={<>azul</>}
              description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
            />
          </BentoTilt>

          <div className="bento-tilt-2 ">
            <div className="-font flex size-full flex-col justify-between bg-violet-300 p-5">
              <h1 className="bento-title special-font max-w-64  text-black ">
                More Comming Soon!
              </h1>
              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </div>
          <div className="bento-tilt-2 group">
            <video
              src="videos/feature-5.mp4"
              className="absolute inset-0  h-full w-full object-cover transition-all duration-700  "
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="group-hover:opacity-0 absolute inset-0 cursor-pointer bg-radial-[at_50%_50%]  from-transparent to-black/30  rounded-md transition-all duration-300  " />
          </div>
        </div>
      </div>
    </section>
  )
}
type BentoCardProps = {
  src: string
  title: React.ReactNode
  description?: string
}

const BentoCard = ({ src, title, description }: BentoCardProps) => (
  <div className="group relative size-full  ">
    <video
      src={src}
      className={`absolute left-0 top-0 size-full object-cover object-center   group-hover:contrast-150 transition-all duration-1000 $`}
      autoPlay
      loop
      muted
      playsInline
    />

    <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
      <div className=" ">
        <h2 className="bento-title special-font ">{title}</h2>
        {description && (
          <p className="mt-3 max-w-64 text-xs md:text-base ">{description}</p>
        )}
      </div>
    </div>
    <div className="group-hover:opacity-0 absolute inset-0 cursor-pointer bg-radial-[at_50%_50%] from-transparent to-black/80  rounded-md transition-all duration-700  " />
  </div>
)

import { useRef, useState, type ReactNode } from 'react'

type BentoTiltProps = {
  children: ReactNode
  className?: string
}

export const BentoTilt = ({ children, className = '' }: BentoTiltProps) => {
  const [transformStyle, setTransformStyle] = useState('')
  const itemRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return

    const { left, top, width, height } = itemRef.current.getBoundingClientRect()

    const relativeX = (e.clientX - left) / width
    const relativeY = (e.clientY - top) / height

    const tilt = 10
    const tiltX = (relativeY - 0.5) * tilt
    const tiltY = (relativeX - 0.5) * -tilt

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`
    setTransformStyle(newTransform)
  }

  const handleMouseLeave = () => {
    setTransformStyle('')
  }

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  )
}
