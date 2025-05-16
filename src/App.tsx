import About from './components/About'
import Hero from './components/Hero'
import NavBar from './components/NavBar'

export default function App() {
  
  return (
    <>
      <main className=" relative min-h-screen w-screen overflow-x-hidden ">
        <NavBar />
        <Hero />
        <About />
      </main>
    </>
  )
}
