/* eslint-disable @typescript-eslint/no-unused-vars */


import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { TiLocationArrow } from 'react-icons/ti'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// Registrar plugins do GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function TestHero() {
  // Estado para rastrear qual vídeo estamos exibindo (1-4)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(1)

  // Estado para controlar qual vídeo físico (1 ou 2) está ativo
  const [activeVideoElement, setActiveVideoElement] = useState(1)

  // Estado para evitar cliques durante transições
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [loadedVideos, setLoadedVideos] = useState(0)


  // Referências para os dois elementos de vídeo físicos
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)

  // Função para obter o URL do vídeo com base no índice (1-4)
  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`

  // Debug: Adiciona mensagens para acompanhar a transição
  const logTransition = (message: string) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`🎬 ${message}`)
    }
  }

  // Função para alternar entre os vídeos físicos
  const handleVideoToggle = () => {
    // Evitar cliques múltiplos durante uma transição
    if (isTransitioning) {
      logTransition('Transição já em andamento, ignorando clique')
      return
    }

    // Ativar o estado de transição
    setIsTransitioning(true)

    // Determinar qual vídeo será o próximo na sequência
    const nextVideoIndex = currentVideoIndex === 4 ? 1 : currentVideoIndex + 1

    // Determinar qual elemento de vídeo está inativo para torná-lo ativo
    const nextVideoElement = activeVideoElement === 1 ? 2 : 1

    // Referências para o vídeo atual e o próximo
    const currentVideoRef = activeVideoElement === 1 ? videoRef1 : videoRef2
    const nextVideoRef = activeVideoElement === 1 ? videoRef2 : videoRef1

    logTransition(
      `Alternando de ${currentVideoIndex} para ${nextVideoIndex} (elemento ${activeVideoElement} → ${nextVideoElement})`
    )

    // Garantir que o próximo vídeo tenha a URL correta antes da animação
    if (nextVideoRef.current) {
      nextVideoRef.current.src = getVideoSrc(nextVideoIndex)
      // Carregar o vídeo
      nextVideoRef.current.load()

      // Pre-load de imagens de miniatura
      const preloadImg = new Image()
      preloadImg.src = `thumbnails/hero-${nextVideoIndex}.jpg`
    }

    // Tornar o próximo vídeo visível no centro da tela com tamanho pequeno
    gsap.set(nextVideoRef.current, {
      visibility: 'visible',
      opacity: 1,
      scale: 0.25, // Iniciar bem pequeno para o efeito de crescimento ser mais aparente
      width: '16rem',
      height: '16rem',
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      zIndex: 20, // Garantir que fique acima do vídeo atual durante a transição
      borderRadius: '16px' // Arredondar os cantos para o efeito visual
    })

    // Animar o próximo vídeo para crescer e ocupar a tela
    gsap.to(nextVideoRef.current, {
      scale: 1,
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      xPercent: 0,
      yPercent: 0,
      borderRadius: 0, // Remover o arredondamento quando em tela cheia
      transformOrigin: 'center center',
      duration: 1.5, // Duração maior para ver melhor o efeito
      ease: 'back.out(1.2)', // Efeito de ultrapassagem para enfatizar o crescimento
      onStart: () => {
        // Iniciar a reprodução do próximo vídeo
        if (nextVideoRef.current) {
          nextVideoRef.current.play()
          logTransition('Iniciando a reprodução do próximo vídeo')
        }
      },
      onComplete: () => {
        logTransition('Crescimento do novo vídeo concluído')

        // Animar o vídeo atual para diminuir e ficar invisível
        gsap.to(currentVideoRef.current, {
          width: '16rem',
          height: '16rem',
          scale: 0.25,
          borderRadius: '16px', // Arredondar cantos enquanto diminui
          position: 'absolute',
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          zIndex: 10,
          transformOrigin: 'center center',
          duration: 1.2,
          ease: 'power2.inOut',
          onStart: () => {
            // Pausar o vídeo atual
            if (currentVideoRef.current) {
              currentVideoRef.current.pause()
              logTransition('Pausando o vídeo atual')
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

            // Atualizar o src do vídeo atual para o próximo da sequência
            if (currentVideoRef.current) {
              logTransition(`Preparando o próximo vídeo: ${nextPreloadIndex}`)
              currentVideoRef.current.src = getVideoSrc(nextPreloadIndex)
              currentVideoRef.current.load()
              gsap.set(currentVideoRef.current, { visibility: 'hidden' })
            }

            // Terminar a transição
            setIsTransitioning(false)
            logTransition('Transição concluída')
          }
        })

        // Atualizar os estados
        setCurrentVideoIndex(nextVideoIndex)
        setActiveVideoElement(nextVideoElement)
      }
    })
  }

  // Função para lidar com o clique no mini vídeo ou no botão
  const handleMiniVdClick = () => {
    handleVideoToggle()
  }

  // Efeito para verificar se os vídeos foram carregados
  useEffect(() => {
    if (loadedVideos >= 2) {
      setIsLoading(false)
    }
  }, [loadedVideos])

  // Função para incrementar o contador de vídeos carregados
  const handleVideoLoad = () => {
    setLoadedVideos(prevCount => prevCount + 1)
  }

  // Configuração das animações GSAP para o frame do vídeo
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
  }, [])

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden text-blue-200">
      {/* Loader exibido enquanto os vídeos estão sendo carregados */}
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div className="relative h-full w-full">
          {/* Mini vídeo no centro que serve como botão para trocar vídeos */}
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-0 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                src={getVideoSrc(
                  currentVideoIndex === 4 ? 1 : currentVideoIndex + 1
                )}
                muted
                loop
                playsInline
                id="mini-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white bg-opacity-80 p-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center">
                    <TiLocationArrow size={20} className="text-blue-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primeiro elemento de vídeo físico */}
          <video
            ref={videoRef1}
            src={getVideoSrc(1)} // Começa com o vídeo 1
            autoPlay={activeVideoElement === 1}
            muted
            loop
            playsInline
            className="absolute size-full object-cover object-center transition-all duration-300"
            style={{
              visibility: activeVideoElement === 1 ? 'visible' : 'hidden',
              opacity: activeVideoElement === 1 ? 1 : 0,
              zIndex: activeVideoElement === 1 ? 10 : 5,
              boxShadow:
                activeVideoElement === 1
                  ? '0 0 30px rgba(0, 0, 0, 0.5)'
                  : 'none'
            }}
            onLoadedData={handleVideoLoad}
          />

          {/* Segundo elemento de vídeo físico */}
          <video
            ref={videoRef2}
            src={getVideoSrc(2)} // Começa com o vídeo 2
            autoPlay={false}
            muted
            loop
            playsInline
            className="absolute size-full object-cover object-center transition-all duration-300"
            style={{
              visibility: activeVideoElement === 2 ? 'visible' : 'hidden',
              opacity: activeVideoElement === 2 ? 1 : 0,
              zIndex: activeVideoElement === 2 ? 10 : 5,
              boxShadow:
                activeVideoElement === 2
                  ? '0 0 30px rgba(0, 0, 0, 0.5)'
                  : 'none'
            }}
            onLoadedData={handleVideoLoad}
          />
        </div>

        {/* Texto de sobreposição */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          Gaming
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefine
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br />
              Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
              onClick={handleMiniVdClick}
            />

            {/* Indicador do vídeo atual (para debug) */}
            {import.meta.env.MODE === 'development' && (
              <div className="mt-4 bg-black bg-opacity-50 p-2 text-white rounded inline-block">
                <p>Video Atual: {currentVideoIndex}</p>
                <p>Elemento Ativo: {activeVideoElement}</p>
                <p>
                  Próximo: {currentVideoIndex === 4 ? 1 : currentVideoIndex + 1}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Texto de fundo */}
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        Gaming
      </h1>
    </div>
  )
}
