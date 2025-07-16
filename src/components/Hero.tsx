import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense
} from 'react'
import Button from './Button'
import { TiLocationArrow } from 'react-icons/ti'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
gsap.registerPlugin(ScrollTrigger)

import { ScrollTrigger } from 'gsap/all'

import HeroMouseMoviment from './HeroMouseMoviment'
const DecryptedText = lazy(() => import('./DecryptedText'))

type HeroProps = {
  playMusic?: React.RefObject<(() => void) | null>
}
const videos = [
  { id: 1, mp4: '/videos/hero-1.mp4', poster: '/posters/hero-1.jpg' },
  { id: 2, mp4: '/videos/hero-2.mp4', poster: '/posters/hero-2.jpg' },
  { id: 3, mp4: '/videos/hero-3.mp4', poster: '/posters/hero-3.jpg' },
  { id: 4, mp4: '/videos/hero-4.mp4', poster: '/posters/hero-4.jpg' }
]

const words = ['Gaming', 'Economy', 'Metagame', 'Radiant']

export default function Hero({ playMusic }: HeroProps) {
  // Estados combinados para reduzir re-renders
  const [videoState, setVideoState] = useState({
    currentVideoIndex: 0,
    activeVideoElement: 1,
    isTransitioning: false
  })

  const [uiState, setUiState] = useState({
    isReady: false,
    showMiniVd: false,
    transformStyleMiniVd: ''
  })

  const loadingRef = useRef<HTMLDivElement>(null)

  // Referências para os dois elementos de vídeo físicos
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Esconde a tela de loading para exibir a página o mais rápido possível.
    const timer = setTimeout(
      () => setUiState(prev => ({ ...prev, isReady: true })),
      500
    ) // Pequeno delay para a UI estabilizar.
    return () => clearTimeout(timer)
  }, [])
  // Lazy loading de vídeos - carrega apenas quando necessário
  const preloadVideo = (videoIndex: number) => {
    const video = videos[videoIndex]
    if (!video) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'video'
    link.href = video.mp4
    document.head.appendChild(link)
  }

  useEffect(() => {
    // Preload apenas o próximo vídeo quando necessário
    const nextVideoIndex = (videoState.currentVideoIndex + 1) % videos.length
    const timer = setTimeout(() => {
      preloadVideo(nextVideoIndex)
    }, 1000) // Delay para não interferir no carregamento inicial

    return () => clearTimeout(timer)
  }, [videoState.currentVideoIndex])

  const handleMiniVdClick = useCallback(() => {
    if (playMusic?.current) {
      playMusic.current()
    }
    if (videoState.isTransitioning) return
    // evita que mini video seja visível durante a transição
    setUiState(prev => ({ ...prev, showMiniVd: false }))
    setVideoState(prev => ({ ...prev, isTransitioning: true }))
    // Determinar qual vídeo será o próximo na sequência
    const nextVideoIdx = (videoState.currentVideoIndex + 1) % videos.length
    const nextVideoData = videos[nextVideoIdx]
    // Determinar qual elemento de vídeo está inativo para torná-lo ativo
    const nextVideoElement = videoState.activeVideoElement === 1 ? 2 : 1

    // Referências para o vídeo atual e o próximo
    const currentVideoRef =
      videoState.activeVideoElement === 1 ? videoRef1 : videoRef2
    const nextVideoRef =
      videoState.activeVideoElement === 1 ? videoRef2 : videoRef1

    // Garantir que o próximo vídeo tenha a URL correta antes da animação
    if (nextVideoRef.current) {
      nextVideoRef.current.src = nextVideoData.mp4
      nextVideoRef.current.poster = nextVideoData.poster
      nextVideoRef.current.preload = 'auto' // Força carregamento apenas quando necessário
      // Carregar o vídeo
      nextVideoRef.current.load()
    }
    //setando css inicial para visível
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
            const videoToPreloadIdx = (nextVideoIdx + 1) % videos.length
            const videoToPreloadData = videos[videoToPreloadIdx]

            // Atualizar o src do vídeo atual que diminuiu para o próximo da sequência e garante que ele não seja exibido
            if (currentVideoRef.current) {
              currentVideoRef.current.src = videoToPreloadData.mp4
              currentVideoRef.current.poster = videoToPreloadData.poster
              currentVideoRef.current.load()
              gsap.set(currentVideoRef.current, { visibility: 'hidden' })
            }
            // indica fim da animação e atualiza os estados
            setVideoState({
              currentVideoIndex: nextVideoIdx,
              activeVideoElement: nextVideoElement,
              isTransitioning: false
            })
          }
        })
      }
    })
  }, [
    playMusic,
    videoState.isTransitioning,
    videoState.currentVideoIndex,
    videoState.activeVideoElement
  ])

  useGSAP(() => {
    if (!uiState.isReady) return

    // Defer animações não críticas
    const setupAnimations = () => {
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
    }

    // Use requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(setupAnimations)
    } else {
      setTimeout(setupAnimations, 100)
    }
  }, [uiState.isReady])
  useGSAP(() => {
    if (!uiState.isReady) return
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
          zIndex: -1,
          display: 'none'
        })
      }
    })
  }, [uiState.isReady])
  // Obtém os dados do próximo vídeo para o mini player (memorizado)
  const nextMiniVideo = useMemo(() => {
    return videos[(videoState.currentVideoIndex + 1) % videos.length]
  }, [videoState.currentVideoIndex])
  return (
    <div className="relative h-dvh w-screen  overflow-x-hidden text-blue-200">
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
      <HeroMouseMoviment
        setShowMiniVd={(show: React.SetStateAction<boolean>) =>
          setUiState(prev => ({ ...prev, showMiniVd: typeof show === 'function' ? show(prev.showMiniVd) : show }))
        }
        setTransformStyleMiniVd={(transform: React.SetStateAction<string>) => {
          setUiState(prev => ({
            ...prev,
            transformStyleMiniVd:
              typeof transform === 'function'
                ? transform(prev.transformStyleMiniVd)
                : transform
          }))
        }}
      >
        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg  "
        >
          <div>
            {!videoState.isTransitioning && (
              <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                <div
                  style={{
                    transform: uiState.transformStyleMiniVd
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: uiState.showMiniVd ? 1 : 0.5,
                      opacity: uiState.showMiniVd ? 1 : 0
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleMiniVdClick}
                    className="origin-center "
                  >
                    <video
                      key={nextMiniVideo.id}
                      src={nextMiniVideo.mp4}
                      poster={nextMiniVideo.poster}
                      muted
                      loop
                      preload="none"
                      playsInline
                      id="current-video"
                      className="z-50 size-64 origin-center scale-150 object-cover object-center"
                    />
                  </motion.div>
                </div>
              </div>
            )}
            <video
              ref={videoRef1}
              src={videos[0].mp4}
              poster={videos[0].poster}
              loop
              preload="metadata"
              muted
              autoPlay
              playsInline
              className="absolute-center absolute z-20 size-full -mt-[1px] object-cover object-center"
              style={{
                zIndex: videoState.activeVideoElement === 1 ? 10 : 5
              }}
            />
            <video
              ref={videoRef2}
              src={videos[1].mp4}
              poster={videos[1].poster}
              autoPlay={false}
              muted
              loop
              preload="none"
              playsInline
              className="absolute-center absolute  size-64 object-cover -mt-[1px] object-center"
              style={{
                zIndex: videoState.activeVideoElement === 2 ? 10 : 5
              }}
            />
          </div>
          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75 ">
            <Suspense
              fallback={<span>{words[videoState.currentVideoIndex]}</span>}
            >
              <DecryptedText
                key={videoState.currentVideoIndex}
                text={words[videoState.currentVideoIndex]}
                speed={50}
                maxIterations={50}
                sequential
                animateOn="view"
                revealDirection="start"
              />
            </Suspense>
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
                  <p>Video Atual: {videoState.currentVideoIndex + 1}</p>
                  <p>
                    Próximo Video:{' '}
                    {videoState.currentVideoIndex === 3
                      ? 1
                      : videoState.currentVideoIndex + 2}
                  </p>{' '}
                  <p>Player Ativo: {videoState.activeVideoElement}</p>
                  <p>isTransitioning: {`${videoState.isTransitioning}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5  text-black ">
          <Suspense
            fallback={<span>{words[videoState.currentVideoIndex]}</span>}
          >
            <DecryptedText
              key={videoState.currentVideoIndex}
              text={words[videoState.currentVideoIndex]}
              speed={50}
              maxIterations={50}
              sequential
              animateOn="view"
              revealDirection="start"
            />
          </Suspense>
        </h1>
      </HeroMouseMoviment>
    </div>
  )
}
