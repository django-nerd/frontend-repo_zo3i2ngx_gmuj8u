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
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const toNumberOrNull = (v) => {
    if (v === undefined || v === null) return null
    const trimmed = String(v).trim()
    if (trimmed === '') return null
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        organizer_name: form.organizer_name.trim(),
        organizer_email: form.organizer_email.trim(),
        budget_min: toNumberOrNull(form.budget_min),
        budget_max: toNumberOrNull(form.budget_max),
      }
      const res = await fetch(`${backend}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const maybeJson = await res.json().catch(() => null)

      if (!res.ok) {
        const detail = maybeJson?.detail || (typeof maybeJson === 'string' ? maybeJson : '')
        throw new Error(detail || 'Failed to create event')
      }

      const data = maybeJson || {}
      setMessage(`Created event: ${data.name}`)
      setForm({ name: '', organizer_name: '', organizer_email: '', budget_min: '', budget_max: '' })
    } catch (err) {
      setError(err.message || 'Something went wrong')
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
            <input inputMode="decimal" name="budget_min" value={form.budget_min} onChange={handleChange} placeholder="Min budget" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
            <input inputMode="decimal" name="budget_max" value={form.budget_max} onChange={handleChange} placeholder="Max budget" className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none" />
          </div>
          <button disabled={loading} className="md:col-span-2 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold transition">
            {loading ? 'Creating…' : 'Create event'}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-green-200">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </section>
  )
}

export default CreateEventForm
