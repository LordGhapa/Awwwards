import Hero from './components/Hero'

export default function App() {
  return (
    <>
      <main className="relative min-h-screen w-screen overflow-x-hidden ">
        {/* <TestHero /> */}
        <Hero />
        <section className="z-0 min-h-screen bg-blue-500"></section>
      </main>
    </>
  )
}
