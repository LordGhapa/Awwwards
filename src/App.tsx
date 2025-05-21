import { useRef } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import Features from './components/Features'
import Footer from './components/Footer'
import Hero from './components/Hero'
import NavBar from './components/NavBar'
import Story from './components/Story'

export default function App() {
  const playMusic = useRef<() => void>(null)

  return (
    <>
      <main className=" relative min-h-screen w-screen overflow-x-hidden ">
        <NavBar playMusicRef={playMusic} />
 
        <Hero playMusic={playMusic} />
        <About />
        <Features />
        <Story />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
