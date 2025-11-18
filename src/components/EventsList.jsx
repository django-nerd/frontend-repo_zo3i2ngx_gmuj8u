import { useEffect, useMemo, useState } from 'react'

const EventsList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [participantsByEvent, setParticipantsByEvent] = useState({})
  const [pLoadingByEvent, setPLoadingByEvent] = useState({})
  const [pErrorByEvent, setPErrorByEvent] = useState({})
  const [formByEvent, setFormByEvent] = useState({})
  const [drawStatusByEvent, setDrawStatusByEvent] = useState({})

  const backend = import.meta.env.VITE_BACKEND_URL

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/events`)
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend])

  const fetchParticipants = async (eventId) => {
    setPLoadingByEvent((s) => ({ ...s, [eventId]: true }))
    setPErrorByEvent((s) => ({ ...s, [eventId]: '' }))
    try {
      const res = await fetch(`${backend}/events/${eventId}/participants`)
      if (!res.ok) throw new Error('Failed to load participants')
      const data = await res.json()
      setParticipantsByEvent((s) => ({ ...s, [eventId]: Array.isArray(data) ? data : [] }))
    } catch (e) {
      setPErrorByEvent((s) => ({ ...s, [eventId]: e.message || 'Error' }))
    } finally {
      setPLoadingByEvent((s) => ({ ...s, [eventId]: false }))
    }
  }

  const toggleExpand = (eventId) => {
    setExpanded((cur) => (cur === eventId ? null : eventId))
    if (expanded !== eventId) {
      // load participants when opening
      fetchParticipants(eventId)
    }
  }

  const handleFormChange = (eventId, e) => {
    const { name, value } = e.target
    setFormByEvent((s) => ({
      ...s,
      [eventId]: { ...(s[eventId] || { name: '', email: '' }), [name]: value },
    }))
  }

  const addParticipant = async (eventId) => {
    const form = formByEvent[eventId] || { name: '', email: '' }
    const payload = { event_id: eventId, name: (form.name || '').trim(), email: (form.email || '').trim(), wishlist: [] }
    if (!payload.name || !payload.email) {
      setPErrorByEvent((s) => ({ ...s, [eventId]: 'Name and valid email are required' }))
      return
    }
    setPLoadingByEvent((s) => ({ ...s, [eventId]: true }))
    setPErrorByEvent((s) => ({ ...s, [eventId]: '' }))
    try {
      const res = await fetch(`${backend}/events/${eventId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.detail || 'Failed to add participant'
        throw new Error(msg)
      }
      setFormByEvent((s) => ({ ...s, [eventId]: { name: '', email: '' } }))
      fetchParticipants(eventId)
    } catch (e) {
      setPErrorByEvent((s) => ({ ...s, [eventId]: e.message || 'Error' }))
    } finally {
      setPLoadingByEvent((s) => ({ ...s, [eventId]: false }))
    }
  }

  const drawNames = async (eventId) => {
    setDrawStatusByEvent((s) => ({ ...s, [eventId]: { loading: true, message: '', error: '' } }))
    try {
      const res = await fetch(`${backend}/events/${eventId}/draw`, { method: 'POST' })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.detail || 'Failed to draw names'
        throw new Error(msg)
      }
      const pairs = data?.pairs || {}
      const count = Object.keys(pairs).length
      setDrawStatusByEvent((s) => ({ ...s, [eventId]: { loading: false, message: `Paired ${count} participants`, error: '' } }))
      // refresh participants to reflect match_id
      fetchParticipants(eventId)
    } catch (e) {
      setDrawStatusByEvent((s) => ({ ...s, [eventId]: { loading: false, message: '', error: e.message || 'Error' } }))
    }
  }

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      alert('Event ID copied to clipboard')
    } catch {
      // no-op
    }
  }

  if (loading) return <p className="text-white/70">Loading events…</p>

  return (
    <section id="events" className="relative">
      <h3 className="text-xl font-semibold text-white mb-3">Your events</h3>
      <div className="grid gap-3">
        {events.length === 0 && <p className="text-white/60">No events yet.</p>}
        {events.map((e) => {
          const isOpen = expanded === e.id
          const plist = participantsByEvent[e.id] || []
          const pLoading = pLoadingByEvent[e.id]
          const pError = pErrorByEvent[e.id]
          const pForm = formByEvent[e.id] || { name: '', email: '' }
          const draw = drawStatusByEvent[e.id] || { loading: false, message: '', error: '' }
          return (
            <div key={e.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{e.name}</p>
                  <p className="text-white/60 text-sm">Organizer: {e.organizer_name} • {e.organizer_email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyId(e.id)} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/15">Copy ID</button>
                  <button onClick={() => toggleExpand(e.id)} className="px-3 py-1.5 rounded-lg bg-green-500/90 hover:bg-green-600 text-white text-sm">{isOpen ? 'Hide' : 'Manage'}</button>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Participants</h4>
                    <button onClick={() => fetchParticipants(e.id)} className="text-white/70 text-sm hover:text-white">Refresh</button>
                  </div>

                  {pLoading && <p className="text-white/70">Loading…</p>}
                  {pError && <p className="text-red-300 text-sm">{pError}</p>}

                  {!pLoading && (
                    <div className="space-y-2">
                      {plist.length === 0 && <p className="text-white/60">No participants yet.</p>}
                      {plist.map((p) => (
                        <div key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                          <div>
                            <p className="text-white text-sm">{p.name} <span className="text-white/50">• {p.email}</span></p>
                            {p.match_id && <p className="text-xs text-emerald-300/90">Matched!</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input name="name" value={pForm.name} onChange={(ev) => handleFormChange(e.id, ev)} placeholder="Participant name" className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
                    <input name="email" type="email" value={pForm.email} onChange={(ev) => handleFormChange(e.id, ev)} placeholder="Participant email" className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
                    <button disabled={!!pLoading} onClick={() => addParticipant(e.id)} className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white">Add participant</button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button disabled={plist.length < 2 || draw.loading} onClick={() => drawNames(e.id)} className="px-3 py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-60 text-white">{draw.loading ? 'Drawing…' : 'Draw names'}</button>
                    {plist.length < 2 && <span className="text-white/60 text-sm">Add at least two participants</span>}
                  </div>
                  {draw.message && <p className="text-emerald-300 text-sm">{draw.message}</p>}
                  {draw.error && <p className="text-red-300 text-sm">{draw.error}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default EventsList
