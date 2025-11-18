import { useEffect, useState } from 'react'

const EventsList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const backend = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${backend}/events`)
        const data = await res.json()
        setEvents(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [backend])

  if (loading) return <p className="text-white/70">Loading events…</p>

  return (
    <section id="events" className="relative">
      <h3 className="text-xl font-semibold text-white mb-3">Recent events</h3>
      <div className="grid gap-3">
        {events.length === 0 && <p className="text-white/60">No events yet.</p>}
        {events.map((e) => (
          <div key={e.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
            <p className="text-white font-medium">{e.name}</p>
            <p className="text-white/60 text-sm">Organizer: {e.organizer_name} • {e.organizer_email}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EventsList
