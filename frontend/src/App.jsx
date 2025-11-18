import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function CreateEventForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    organizer_name: '',
    organizer_email: '',
    budget: '',
    currency: 'USD',
  })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: form.budget ? parseFloat(form.budget) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create event')
      onCreated(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white/10 backdrop-blur rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Event name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="input" placeholder="Organizer name" value={form.organizer_name} onChange={e=>setForm({...form,organizer_name:e.target.value})} />
        <input className="input" placeholder="Organizer email" type="email" value={form.organizer_email} onChange={e=>setForm({...form,organizer_email:e.target.value})} />
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Budget" type="number" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} />
          <select className="input w-28" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}>
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
      </div>
      <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create event'}</button>
    </form>
  )
}

function Snow() {
  // simple CSS snow via gradients
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-snow1 absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      <div className="animate-snow2 absolute inset-0 bg-[radial-gradient(white_1.5px,transparent_1.5px)] [background-size:26px_26px] opacity-20"></div>
      <div className="animate-snow3 absolute inset-0 bg-[radial-gradient(white_2px,transparent_2px)] [background-size:34px_34px] opacity-15"></div>
    </div>
  )
}

export default function App() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/events`).then(r=>r.json()).then(setEvents).catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#0b1020] via-[#0b1020] to-[#0e1326] text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/5fQlL0qinzob1I8q/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,90,0.25),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(0,200,255,0.25),transparent_50%)] pointer-events-none" />
      </div>
      <Snow />

      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">GiftFlow</h1>
        <a href="#create" className="btn-secondary">Create Event</a>
      </header>

      <main className="relative z-10 container mx-auto px-6">
        <section className="grid lg:grid-cols-2 gap-10 items-center py-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">Make Secret Santa magical</h2>
            <p className="text-white/80">Create a festive gift exchange, build wishlists with affiliate picks, and let the draw reveal sparkle.</p>
            <div className="flex gap-3">
              <a href="#create" className="btn-primary">Start your event</a>
              <a href="#events" className="btn-secondary">View events</a>
            </div>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
            <Spline scene="https://prod.spline.design/5fQlL0qinzob1I8q/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        </section>

        <section id="create" className="py-12">
          <h3 className="text-2xl font-semibold mb-4">Create an exchange</h3>
          <CreateEventForm onCreated={(ev)=>setEvents([ev, ...events])} />
        </section>

        <section id="events" className="py-12">
          <h3 className="text-2xl font-semibold mb-4">Recent events</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-sm text-white/70">Code {ev.code}</div>
                <div className="font-semibold text-lg">{ev.name}</div>
                <div className="text-white/70">Organized by {ev.organizer_name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .input{ @apply bg-white/10 rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-white/30 placeholder-white/60; }
        .btn-primary{ @apply inline-flex items-center justify-center rounded-lg bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 transition; }
        .btn-secondary{ @apply inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/10 transition; }
        .animate-snow1{ animation: snow 20s linear infinite; }
        .animate-snow2{ animation: snow 30s linear infinite; }
        .animate-snow3{ animation: snow 45s linear infinite; }
        @keyframes snow { from{ background-position:0 -1000px } to{ background-position:0 1000px } }
      `}</style>
    </div>
  )
}
