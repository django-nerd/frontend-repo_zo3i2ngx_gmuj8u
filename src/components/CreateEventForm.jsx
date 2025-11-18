import { useState } from 'react'

const CreateEventForm = () => {
  const [form, setForm] = useState({
    name: '',
    organizer_name: '',
    organizer_email: '',
    budget_min: '',
    budget_max: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${backend}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          organizer_name: form.organizer_name,
          organizer_email: form.organizer_email,
          budget_min: form.budget_min ? Number(form.budget_min) : null,
          budget_max: form.budget_max ? Number(form.budget_max) : null,
        }),
      })
      if (!res.ok) throw new Error('Failed to create event')
      const data = await res.json()
      setMessage(`Created event: ${data.name}`)
      setForm({ name: '', organizer_name: '', organizer_email: '', budget_min: '', budget_max: '' })
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create" className="relative">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Create a new event</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Event name" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" required />
          <input name="organizer_name" value={form.organizer_name} onChange={handleChange} placeholder="Your name" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" required />
          <input type="email" name="organizer_email" value={form.organizer_email} onChange={handleChange} placeholder="Your email" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none md:col-span-2" required />
          <div className="grid grid-cols-2 gap-3">
            <input name="budget_min" value={form.budget_min} onChange={handleChange} placeholder="Min budget" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
            <input name="budget_max" value={form.budget_max} onChange={handleChange} placeholder="Max budget" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
          </div>
          <button disabled={loading} className="md:col-span-2 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition">
            {loading ? 'Creating…' : 'Create event'}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-white/80">{message}</p>}
      </div>
    </section>
  )
}

export default CreateEventForm
