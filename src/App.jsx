import Hero from './components/Hero'
import CreateEventForm from './components/CreateEventForm'
import EventsList from './components/EventsList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1220] via-[#0d1b2a] to-[#0b1220] relative">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      <header className="max-w-6xl mx-auto px-6 py-10">
        <Hero />
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-10 pb-20">
        <CreateEventForm />
        <EventsList />
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-white/60 text-sm">
          Built with love for the holidays
        </div>
      </footer>

      <style>{`
        .snow, .snow2, .snow3 {
          position: absolute; width: 100%; height: 100%; top: 0; left: 0;
          background-image: url('https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM0MTE5NzJ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80');
          background-repeat: repeat; background-size: contain; opacity: 0.6;
          animation: snow 18s linear infinite;
        }
        .snow2 { animation-duration: 28s; opacity: 0.4; filter: blur(1px); }
        .snow3 { animation-duration: 38s; opacity: 0.25; filter: blur(2px); }
        @keyframes snow { from { background-position: 0 0; } to { background-position: 0 100%; } }
      `}</style>
    </div>
  )
}

export default App
