import { useState, useEffect } from 'react'
import { Megaphone, Plus, Edit, Trash2, X, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  toggleAnnouncement,
  deleteAnnouncement,
} from '../../services/admin/announcementsService'

type Announcement = {
  announcement_id: number
  title: string | null
  message: string
  is_active: boolean
  created_at: string
}

const emptyForm = { title: '', message: '', is_active: false }

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${type === 'success' ? 'bg-teal-600 text-white' : 'bg-red-500 text-white'}`}>
    {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
    {message}
  </div>
)

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAll = async () => {
    try {
      const data = await getAnnouncements()
      setAnnouncements(data)
    } catch {
      showToast('Failed to load announcements', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  const openEdit = (a: Announcement) => {
    setEditing(a)
    setForm({ title: a.title || '', message: a.message, is_active: a.is_active })
    setShowForm(true)
  }

  const resetModal = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ ...emptyForm })
  }

  const handleSave = async () => {
    if (!form.message.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateAnnouncement(editing.announcement_id, {
          title: form.title || undefined,
          message: form.message,
          is_active: form.is_active,
        })
        setAnnouncements(prev =>
          prev.map(a => a.announcement_id === updated.announcement_id ? updated : { ...a, is_active: form.is_active ? false : a.is_active })
        )
        showToast('Announcement updated!', 'success')
      } else {
        await createAnnouncement({
          title: form.title || undefined,
          message: form.message,
          is_active: form.is_active,
        })
        await fetchAll()
        showToast('Announcement created!', 'success')
      }
      resetModal()
    } catch (e: any) {
      showToast(e.message || 'Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (a: Announcement) => {
    try {
      await toggleAnnouncement(a.announcement_id, !a.is_active)
      await fetchAll()
      showToast(!a.is_active ? 'Announcement is now live!' : 'Announcement deactivated', 'success')
    } catch {
      showToast('Failed to toggle', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id)
      setAnnouncements(prev => prev.filter(a => a.announcement_id !== id))
      setDeleteId(null)
      showToast('Announcement deleted', 'success')
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <span>Home</span><span>/</span>
            <span className="text-gray-700 font-medium">Announcements</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      <div className="p-8 max-w-4xl mx-auto">

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <Megaphone size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            Only <span className="font-semibold">one announcement</span> can be active at a time.
            When active, it shows as a scrolling ticker on the customer-facing website.
            Activating a new one automatically deactivates the previous one.
          </p>
        </div>

        {/* Announcement list */}
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Megaphone size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No announcements yet.</p>
            <button
              onClick={openCreate}
              className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
            >
              Create your first announcement →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map(a => (
              <div
                key={a.announcement_id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${a.is_active ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {a.title && (
                        <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                      )}
                      {a.is_active && (
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Created {new Date(a.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggle(a)}
                      title={a.is_active ? 'Deactivate' : 'Set as Live'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        a.is_active
                          ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {a.is_active ? 'Deactivate' : 'Set Live'}
                    </button>
                    <button
                      onClick={() => openEdit(a)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(a.announcement_id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button onClick={resetModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Festival Offer, New Product Launch"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={3}
                  placeholder="This message will scroll across the top of the website..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.message.length} characters</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Set as Live</p>
                  <p className="text-xs text-gray-400">Show this on the website immediately after saving</p>
                </div>
                <div
                  onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${form.is_active ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.message.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-xl text-sm flex items-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Announcement?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAnnouncements