import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { TiLocationArrow } from 'react-icons/ti'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
gsap.registerPlugin(ScrollTrigger)

import { ScrollTrigger } from 'gsap/all'

import HeroMouseMoviment from './HeroMouseMoviment'

type HeroProps = {
  playMusic?: React.RefObject<(() => void) | null>
}

export default function Hero({ playMusic }: HeroProps) {
  // Estado para rastrear qual vídeo estamos exibindo (1-4)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1)
  // Estado para controlar qual vídeo físico (1 ou 2) está ativo
  const [activeVideoElement, setActiveVideoElement] = useState(1)
  // Estado para evitar cliques durante transições
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [loadedVideos, setLoadedVideos] = useState(0)
  const totalVideos = 4

  const loadingRef = useRef<HTMLDivElement>(null)

  const [showMiniVd, setShowMiniVd] = useState(false)
  const [transformStyleMiniVd, setTransformStyleMiniVd] = useState('')

  // Referências para os dois elementos de vídeo físicos
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`

  const handleMiniVdClick = () => {
    if (playMusic?.current) {
      playMusic.current()
    }
    if (isTransitioning) return
    // evita que mini video seja visivel durante a transição
    setShowMiniVd(false)
    setIsTransitioning(true)
    // Determinar qual vídeo será o próximo na sequência
    const nextVideoIndex = currentVideoIndex === 4 ? 1 : currentVideoIndex + 1
    // Determinar qual elemento de vídeo está inativo para torná-lo ativo
    const nextVideoElement = activeVideoElement === 1 ? 2 : 1

    // Referências para o vídeo atual e o próximo
    const currentVideoRef = activeVideoElement === 1 ? videoRef1 : videoRef2
    const nextVideoRef = activeVideoElement === 1 ? videoRef2 : videoRef1

    // Garantir que o próximo vídeo tenha a URL correta antes da animação
    if (
      nextVideoRef.current &&
      nextVideoRef.current.src.replace(`${window.location.origin}/`, '') !==
        getVideoSrc(nextVideoIndex)
    ) {
      nextVideoRef.current.src = getVideoSrc(nextVideoIndex)
      // Carregar o vídeo
      nextVideoRef.current.load()
      // Pre-load de imagens de miniatura
      // const preloadImg = new Image()
      // preloadImg.src = `thumbnails/hero-${nextVideoIndex}.jpg`
    }
    //setando css inicial para visivel
    gsap.set(nextVideoRef.current, {
      visibility: 'visible',
      opacity: 100,
      width: '16rem',
      height: '16rem',
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      zIndex: 20,
      borderRadius: '16px'
    })
    //animação fazendo video crescer
    gsap.to(nextVideoRef.current, {
      width: '100%',
      height: '100%',
      duration: 1,
      transformOrigin: 'center center',
      borderRadius: 0,
      ease: 'power1.inOut',
      onStart: () => {
        // Iniciar o próximo vídeo
        if (nextVideoRef.current) {
          nextVideoRef.current.play()
        }
      },
      onComplete: () => {
        //animação fazendo video anterior diminuir e sumir
        gsap.to(currentVideoRef.current, {
          width: '16rem',
          height: '16rem',
          borderRadius: '16px',
          zIndex: 10,
          duration: 0.1,
          onStart: () => {
            // Pausar o vídeo atual
            if (currentVideoRef.current) {
              currentVideoRef.current.pause()
            }
          },
          onComplete: () => {
            // Calcular o próximo vídeo a ser carregado (dois à frente)
            const nextPreloadIndex =
              nextVideoIndex === 4
                ? 1
                : nextVideoIndex === 3
                ? 4
                : nextVideoIndex + 1

            // Atualizar o src do vídeo atual que diminuiu para o próximo da sequência e garante que ele não seja exibido
            if (currentVideoRef.current) {
              currentVideoRef.current.src = getVideoSrc(nextPreloadIndex)
              currentVideoRef.current.load()
              gsap.set(currentVideoRef.current, { visibility: 'hidden' })
            }
            // indica fim da animação e atualiza os estados
            setIsTransitioning(false)
            setCurrentVideoIndex(nextVideoIndex)
            setActiveVideoElement(nextVideoElement)
          }
        })
      }
    })
  }

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setIsLoading(false)
    }
  }, [loadedVideos])

  const handleVideoLoad = () => {
    setLoadedVideos(prevCount => prevCount + 1)
  }

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
      borderRadius: '0% 0% 40% 10%'
    })
    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true
      }
    })
  })
  useGSAP(() => {
    gsap.set(loadingRef.current, {
      borderRadius: '50%',
      width: loadingRef.current ? loadingRef.current.offsetHeight : '100%',
      delay: 1
    })

    gsap.to(loadingRef.current, {
      scale: 0,
      duration: 0.5,
      delay: 1,
      onComplete: () => {
        gsap.set(loadingRef.current, {
          zIndex: -1
        })
      }
    })
  }, [isLoading])

  return (
    <div className="relative h-dvh w-screen  overflow-x-hidden text-blue-200">
      <HeroMouseMoviment
        setShowMiniVd={setShowMiniVd}
        setTransformStyleMiniVd={setTransformStyleMiniVd}
      >
        <div className="h-dvh w-screen flex-center absolute">
          <div
            ref={loadingRef}
            className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50"
          >
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        </div>

        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg  "
        >
          <div>
            {!isTransitioning && (
              <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                <div
                  style={{
                    transform: transformStyleMiniVd
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: showMiniVd ? 1 : 0.5,
                      opacity: showMiniVd ? 1 : 0
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleMiniVdClick}
                    className="origin-center "
                  >
                    <video
                      src={getVideoSrc(
                        currentVideoIndex === 4 ? 1 : currentVideoIndex + 1
                      )}
                      muted
                      loop
                      playsInline
                      id="current-video"
                      className="z-50 size-64 origin-center scale-150 object-cover object-center"
                      onLoadedData={handleVideoLoad}
                    />
                  </motion.div>
                </div>
              </div>
            )}
            <video
              ref={videoRef1}
              src={getVideoSrc(1)}
              loop
              muted
              autoPlay
              playsInline
              className="absolute-center absolute z-20 size-full -mt-[1px] object-cover object-center"
              onLoadedData={handleVideoLoad}
              style={{
                zIndex: activeVideoElement === 1 ? 10 : 5
              }}
            />
            <video
              ref={videoRef2}
              src={getVideoSrc(2)}
              autoPlay={false}
              muted
              loop
              playsInline
              className="absolute-center absolute  size-64 object-cover -mt-[1px] object-center"
              onLoadedData={handleVideoLoad}
              style={{
                zIndex: activeVideoElement === 2 ? 10 : 5
              }}
            />
          </div>
          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75 ">
            Gaming
          </h1>
          <div className="absolute left-0  top-0  z-40 size-full ">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font text-blue-100 hero-heading">
                redefine
              </h1>
              <p className="mb-5 max-w-64 font-robert-regular text-blue-100 ">
                Enter the Metagame Layer <br />
                Unleash the Play Economy
              </p>
              <Button
                id="next-trailer"
                title="Next Trailer"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
                onClick={handleMiniVdClick}
              />
              {/* Indicador do vídeo atual (para debug) */}

              {import.meta.env.MODE === 'development' && (
                <div className="mt-4 bg-black bg-opacity-50 p-2 text-white rounded inline-block">
                  <p>Video Atual: {currentVideoIndex}</p>
                  <p>
                    Próximo Video:{' '}
                    {currentVideoIndex === 4 ? 1 : currentVideoIndex + 1}
                  </p>{' '}
                  <p>Player Ativo: {activeVideoElement}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5  text-black ">
          Gaming
        </h1>
      </HeroMouseMoviment>
    </div>
  )
}
