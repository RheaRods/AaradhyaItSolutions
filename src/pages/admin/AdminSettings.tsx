import { useState, useEffect } from 'react'
import { Bell, User, Save, Camera, Shield, Building2, BellRing, Settings2, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react'

type Tab = 'profile' | 'security' | 'company' | 'notifications' | 'system'

import API_URL from "../../config/api"
const API_BASE = `${API_URL}/api/admin`

// Changed to strictly check sessionStorage to align with Issue 1 fix
const getToken = () => sessionStorage.getItem('adminToken') || ''

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

// Toast component
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${type === 'success' ? 'bg-teal-600 text-white' : 'bg-red-500 text-white'}`}>
    {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
    {message}
  </div>
)

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <div onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-teal-500' : 'bg-gray-200'}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${value ? 'right-1' : 'left-1'}`} />
  </div>
) 

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Profile state
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', role: '', avatarPath: '' })
  const [avatarUploading, setAvatarUploading] = useState(false)
  // Password state
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const [company, setCompany] = useState({
  companyName: '', legalName: '', gstin: '', incorporationDate: '',
  supportEmail: '', salesEmail: '', primaryPhone: '', whatsapp: '',
  address1: '', address2: '', city: '', state: '', pin: '',
  linkedin: '', twitter: '', facebook: '', logoPath: ''
})
const [logoUploading, setLogoUploading] = useState(false)

  // Notifications state
  const [notifications, setNotifications] = useState({
    newInquiry: true, stockAlerts: false, weeklySummary: true, customerReviews: true,
    loginActivity: true, securityUpdates: true, dataExport: false, whatsappForwarding: false
  })

  const [backupList, setBackupList] = useState<any[]>([])
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoringId, setRestoringId] = useState<number | null>(null)
  const [confirmRestore, setConfirmRestore] = useState<any | null>(null)

  // System state
  const [system, setSystem] = useState({
    maintenanceMode: false, language: 'English - India', timezone: 'IST - UTC+5:30',
    googleMapsKey: '', cloudStorage: 'AWS S3', autoBackup: true, backupFrequency: 'Daily'
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  setLogoUploading(true)
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_BASE}/settings/upload-logo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    })
    const data = await res.json()
    if (res.ok) {
      setCompany(prev => ({ ...prev, logoPath: data.url }))
      showToast('Logo uploaded!', 'success')
    } else {
      showToast('Upload failed', 'error')
    }
  } catch {
    showToast('Upload failed', 'error')
  } finally {
    setLogoUploading(false)
  }
}

const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  setAvatarUploading(true)
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_BASE}/settings/upload-logo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    })
    const data = await res.json()
    if (res.ok) {
      setProfile(prev => ({ ...prev, avatarPath: data.url }))
      
      // ISSUE 3 FIX: Save avatar directly to localStorage and trigger sidebar update
      localStorage.setItem('adminAvatar', data.url)
      window.dispatchEvent(new Event('storage'))
      
      showToast('Photo uploaded!', 'success')
    } else {
      showToast('Upload failed', 'error')
    }
  } catch {
    showToast('Upload failed', 'error')
  } finally {
    setAvatarUploading(false)
  }
}

  // Fetch data when tab changes
  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true)
      try {
        if (activeTab === 'profile') {
          const res = await fetch(`${API_BASE}/settings/profile`, { headers: authHeaders() })
          const data = await res.json()
          if (res.ok) setProfile(data)
        } else if (activeTab === 'company') {
          const res = await fetch(`${API_BASE}/settings/company`, { headers: authHeaders() })
          const data = await res.json()
          if (res.ok) setCompany(data)
        } else if (activeTab === 'notifications') {
          const res = await fetch(`${API_BASE}/settings/notifications`, { headers: authHeaders() })
          const data = await res.json()
          if (res.ok) setNotifications(data)
        } else if (activeTab === 'system') {
          const res = await fetch(`${API_BASE}/settings/system`, { headers: authHeaders() })
          const data = await res.json()
          if (res.ok) setSystem(data)
          const r2 = await fetch(`${API_BASE}/settings/backups`, { headers: authHeaders() })
          const d2 = await r2.json()
          setBackupList(d2.data || [])
        }
      } catch {
        showToast('Failed to load settings', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchTabData()
  }, [activeTab])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (activeTab === 'profile') {
        const res = await fetch(`${API_BASE}/settings/profile`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(profile)
        })
        const data = await res.json()
        if (res.ok) {
          showToast('Profile saved successfully!', 'success')
          
          // ISSUE 2 FIX: Sync the updated name to localStorage and dispatch event for sidebar
          localStorage.setItem('adminName', profile.fullName)
          window.dispatchEvent(new Event('storage'))
        }
        else showToast(data.message || 'Failed to save', 'error')

      } else if (activeTab === 'security') {
        if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
          showToast('Please fill in all password fields', 'error')
          setSaving(false)
          return
        }
        const res = await fetch(`${API_BASE}/settings/password`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(password)
        })
        const data = await res.json()
        if (res.ok) {
          showToast('Password updated successfully!', 'success')
          setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } else showToast(data.message || 'Failed to update password', 'error')

      } else if (activeTab === 'company') {
        const res = await fetch(`${API_BASE}/settings/company`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(company)
        })
        const data = await res.json()
        if (res.ok) showToast('Company info saved successfully!', 'success')
        else showToast(data.message || 'Failed to save', 'error')

      } else if (activeTab === 'notifications') {
        const res = await fetch(`${API_BASE}/settings/notifications`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(notifications)
        })
        const data = await res.json()
        if (res.ok) showToast('Notification preferences saved!', 'success')
        else showToast(data.message || 'Failed to save', 'error')

      } else if (activeTab === 'system') {
        const res = await fetch(`${API_BASE}/settings/system`, {
          method: 'PUT', headers: authHeaders(), body: JSON.stringify(system)
        })
        const data = await res.json()
        if (res.ok) showToast('System config saved successfully!', 'success')
        else showToast(data.message || 'Failed to save', 'error')
      }
    } catch {
      showToast('Something went wrong', 'error')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Admin Profile', icon: <User size={15} /> },
    { id: 'security' as Tab, label: 'Security & Password', icon: <Shield size={15} /> },
    { id: 'company' as Tab, label: 'Company Information', icon: <Building2 size={15} /> },
    { id: 'notifications' as Tab, label: 'Notification Preferences', icon: <BellRing size={15} /> },
    { id: 'system' as Tab, label: 'System Configuration', icon: <Settings2 size={15} /> },
  ]



  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <span>Home</span><span>&gt;</span>
            <span className="text-gray-700 font-medium">Settings</span>
            {activeTab !== 'profile' && (
              <>
                <span>&gt;</span>
                <span className="text-blue-600 font-medium">
                  {tabs.find(t => t.id === activeTab)?.label}
                </span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        
        {/* Removed Bell and User icons from here, keeping only the Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg text-sm transition-colors bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto text-teal-400" />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">

            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center">
                <Loader2 size={28} className="animate-spin text-teal-500" />
              </div>
            ) : (
              <>
                {/* Admin Profile */}
                {activeTab === 'profile' && (
                  <>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-bold text-gray-900 text-lg mb-1">Admin Profile</h2>
                      <p className="text-sm text-gray-400 mb-6">Manage your personal account information</p>
                      <div className="flex items-center gap-4 mb-6">
  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-teal-600 shrink-0">
    {profile.avatarPath ? (
      <img src={profile.avatarPath} alt="Avatar" className="w-full h-full object-cover" />
    ) : (
      <span className="text-white font-bold text-xl">{profile.fullName?.charAt(0) || 'A'}</span>
    )}
  </div>
  <div className="flex items-center gap-3">
    <label className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:underline cursor-pointer">
      {avatarUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
      {avatarUploading ? 'Uploading...' : 'Change Photo'}
      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={avatarUploading} />
    </label>
    <button onClick={() => {
      setProfile(prev => ({ ...prev, avatarPath: '' }))
      localStorage.setItem('adminAvatar', '')
      window.dispatchEvent(new Event('storage'))
    }} className="text-red-500 text-sm font-semibold hover:underline">Remove</button>
  </div>
</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Full Name', key: 'fullName', type: 'text' },
                          { label: 'Email Address', key: 'email', type: 'email' },
                          { label: 'Phone Number', key: 'phone', type: 'tel' },
                          { label: 'Role', key: 'role', type: 'text' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                            <input
                              type={field.type}
                              value={profile[field.key as keyof typeof profile]}
                              onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-5">Security & Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={password.currentPassword}
                          onChange={e => setPassword({ ...password, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
                          <input
                            type="password"
                            value={password.newPassword}
                            onChange={e => setPassword({ ...password, newPassword: e.target.value })}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
                          <input
                            type="password"
                            value={password.confirmPassword}
                            onChange={e => setPassword({ ...password, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Shield size={18} className="text-teal-600" />
                          <div>
                            <p className="text-sm font-semibold text-teal-600">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-400">Protect your account with an extra security layer</p>
                          </div>
                        </div>
                        <div className="w-11 h-6 bg-teal-500 rounded-full relative cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Company Information */}
                {activeTab === 'company' && (
                  <>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Building2 size={18} className="text-teal-600" />
                        <h2 className="font-bold text-gray-900 text-lg">Business Identity</h2>
                      </div>

                      {/* Company Logo */}
                      <div className="flex items-center gap-5 mb-6 p-4 border border-gray-100 rounded-xl">
                        <div className="w-20 h-20 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
                          {company.logoPath ? (
                            <img src={company.logoPath} alt="Company Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <Building2 size={28} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">Company Logo</p>
                          <p className="text-xs text-gray-400 mb-3">Recommended: 200x200px, PNG or JPG</p>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors">
                              {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                              {logoUploading ? 'Uploading...' : 'Upload Logo'}
                              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={logoUploading} />
                            </label>
                            {company.logoPath && (
                              <button onClick={() => setCompany(prev => ({ ...prev, logoPath: '' }))} className="text-red-500 text-sm font-semibold hover:underline">
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {[
                          { label: 'Company Name', key: 'companyName' },
                          { label: 'Legal Entity Name', key: 'legalName' },
                          { label: 'Tax ID / GSTIN', key: 'gstin' },
                          { label: 'Incorporation Date', key: 'incorporationDate', type: 'date' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                            <input
                              type={field.type || 'text'}
                              value={company[field.key as keyof typeof company] as string}
                              onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>{/* END Business Identity card */}

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg">📞</span>
                        <h2 className="font-bold text-gray-900 text-lg">Contact Details</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Support Email', key: 'supportEmail' },
                          { label: 'Sales Email', key: 'salesEmail' },
                          { label: 'Primary Phone', key: 'primaryPhone' },
                          { label: 'WhatsApp Business', key: 'whatsapp' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                            <input
                              value={company[field.key as keyof typeof company] as string}
                              onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg">📍</span>
                        <h2 className="font-bold text-gray-900 text-lg">Registered Address</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Address Line 1</label>
                          <input
                            value={company.address1}
                            onChange={e => setCompany({ ...company, address1: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Address Line 2</label>
                          <input
                            value={company.address2}
                            onChange={e => setCompany({ ...company, address2: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'City', key: 'city' },
                            { label: 'State', key: 'state' },
                            { label: 'PIN Code', key: 'pin' },
                          ].map(field => (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                              <input
                                value={company[field.key as keyof typeof company] as string}
                                onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg">🔗</span>
                        <h2 className="font-bold text-gray-900 text-lg">Social Profiles</h2>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: '🔵', key: 'linkedin', placeholder: 'https://linkedin.com/company/...' },
                          { label: '🐦', key: 'twitter', placeholder: 'https://twitter.com/...' },
                          { label: '📘', key: 'facebook', placeholder: 'https://facebook.com/...' },
                        ].map(field => (
                          <div key={field.key} className="flex items-center gap-3">
                            <span className="text-xl w-8">{field.label}</span>
                            <input
                              placeholder={field.placeholder}
                              value={company[field.key as keyof typeof company] as string}
                              onChange={e => setCompany({ ...company, [field.key]: e.target.value })}
                              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-bold text-gray-900 text-lg mb-1">Email Notifications</h2>
                      <p className="text-sm text-gray-400 mb-5">Control which updates you receive via email.</p>
                      <div className="space-y-4">
                        {[
                          { label: 'New Inquiry Alerts', desc: 'Receive email when a customer submits a new inquiry.', key: 'newInquiry' },
                          { label: 'Product Stock Alerts', desc: 'Notifications for low stock or out-of-stock items.', key: 'stockAlerts' },
                          { label: 'Weekly Performance Summary', desc: 'A summary of dashboard stats and site activity.', key: 'weeklySummary' },
                          { label: 'Customer Reviews', desc: 'Alerts for new Google reviews fetched.', key: 'customerReviews' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle
                              value={notifications[item.key as keyof typeof notifications] as boolean}
                              onChange={v => setNotifications({ ...notifications, [item.key]: v })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <h2 className="font-bold text-gray-900 text-lg mb-1">System & Security</h2>
                      <p className="text-sm text-gray-400 mb-5">Critical alerts regarding your account security and system status.</p>
                      <div className="space-y-4">
                        {[
                          { label: 'Login Activity', desc: 'Notify me of new logins from unrecognized devices.', key: 'loginActivity' },
                          { label: 'Security Updates', desc: 'Critical security patches and system maintenance.', key: 'securityUpdates' },
                          { label: 'Data Export Notifications', desc: 'Alerts when a CSV export is completed.', key: 'dataExport' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle
                              value={notifications[item.key as keyof typeof notifications] as boolean}
                              onChange={v => setNotifications({ ...notifications, [item.key]: v })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-gray-900 text-lg">WhatsApp Integration</h2>
                        <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">BETA</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-5">Receive instant updates directly on your business WhatsApp number.</p>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Direct Inquiry Forwarding</p>
                          <p className="text-xs text-gray-400 mt-0.5">Send new inquiry summaries to WhatsApp.</p>
                        </div>
                        <Toggle
                          value={notifications.whatsappForwarding}
                          onChange={v => setNotifications({ ...notifications, whatsappForwarding: v })}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Note: Standard messaging rates may apply for WhatsApp notifications.</p>
                    </div>
                  </>
                )}

                {/* System Configuration */}
                {activeTab === 'system' && (
                  <>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Settings2 size={18} className="text-teal-600" />
                        <h2 className="font-bold text-gray-900 text-lg">Application Settings</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl col-span-2 sm:col-span-1">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Maintenance Mode</p>
                            <p className="text-xs text-gray-400 mt-0.5">Disable front-end access</p>
                          </div>
                          <Toggle value={system.maintenanceMode} onChange={v => setSystem({ ...system, maintenanceMode: v })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Primary Language</label>
                          <select
                            value={system.language}
                            onChange={e => setSystem({ ...system, language: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                          >
                            <option>English - India</option>
                            <option>Hindi</option>
                            <option>Konkani</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Server Timezone</label>
                          <select
                            value={system.timezone}
                            onChange={e => setSystem({ ...system, timezone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                          >
                            <option>IST - UTC+5:30</option>
                            <option>UTC</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg">⚙️</span>
                        <h2 className="font-bold text-gray-900 text-lg">Integration & API</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Google Maps API Key</label>
                          <div className="relative">
                            <input
                              type="password"
                              value={system.googleMapsKey}
                              onChange={e => setSystem({ ...system, googleMapsKey: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Cloud Storage</label>
                          <select
                            value={system.cloudStorage}
                            onChange={e => setSystem({ ...system, cloudStorage: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                          >
                            <option>AWS S3</option>
                            <option>Google Cloud Storage</option>
                            <option>Local Storage</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-lg">🔄</span>
                        <h2 className="font-bold text-gray-900 text-lg">Backup & Maintenance</h2>
                      </div>

                      {/* Auto-Backup + Frequency + Clear Cache */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6">
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Auto-Backup</p>
                            <p className="text-xs text-gray-400">Daily at midnight</p>
                          </div>
                          <Toggle value={system.autoBackup} onChange={v => setSystem({ ...system, autoBackup: v })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Backup Frequency</label>
                          <select
                            value={system.backupFrequency}
                            onChange={e => setSystem({ ...system, backupFrequency: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                          >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`${API_BASE}/settings/clear-cache`, {
                                method: 'POST', headers: authHeaders()
                              })
                              const data = await res.json()
                              showToast(data.message || 'Cache cleared!', res.ok ? 'success' : 'error')
                            } catch {
                              showToast('Failed to clear cache', 'error')
                            }
                          }}
                          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm"
                        >
                          🗑 Clear Cache
                        </button>
                      </div>

                      {/* Manual Backup */}
                      <div className="border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Manual Backup</p>
                            <p className="text-xs text-gray-400">Saves all products, categories and data to DB</p>
                          </div>
                          <button
                            disabled={backupLoading}
                            onClick={async () => {
                              setBackupLoading(true)
                              try {
                                const res = await fetch(`${API_BASE}/settings/backup`, {
                                  method: 'POST', headers: authHeaders()
                                })
                                const data = await res.json()
                                if (res.ok) {
                                  showToast('Backup created successfully!', 'success')
                                  const r2 = await fetch(`${API_BASE}/settings/backups`, { headers: authHeaders() })
                                  const d2 = await r2.json()
                                  setBackupList(d2.data || [])
                                } else {
                                  showToast(data.message || 'Backup failed', 'error')
                                }
                              } catch {
                                showToast('Backup failed', 'error')
                              } finally {
                                setBackupLoading(false)
                              }
                            }}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                          >
                            {backupLoading
                              ? <Loader2 size={14} className="animate-spin" />
                              : '💾'}
                            {backupLoading ? 'Creating...' : 'Backup Now'}
                          </button>
                        </div>

                        {/* Backup List */}
                        {backupList.length > 0 ? (
                          <div className="space-y-2 mt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                              Saved Backups ({backupList.length}/30)
                            </p>
                            {backupList.map((b: any) => (
                              <div key={b.backup_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.label === 'manual' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
                                      {b.label === 'manual' ? 'Manual' : 'Auto'}
                                    </span>
                                    <p className="text-sm font-medium text-gray-700">
                                      Backup #{b.backup_id}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(b.backed_up_at).toLocaleString('en-IN', {
                                      day: '2-digit', month: 'short', year: 'numeric',
                                      hour: '2-digit', minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`${API_BASE}/settings/backups/${b.backup_id}/download`}
                                    download={`backup_${b.backup_id}.json`}
                                    className="text-xs font-semibold text-teal-600 hover:underline px-3 py-1.5 border border-teal-200 rounded-lg"
                                    onClick={e => {
                                      e.preventDefault()
                                      fetch(`${API_BASE}/settings/backups/${b.backup_id}/download`, {
                                        headers: authHeaders()
                                      })
                                        .then(r => r.blob())
                                        .then(blob => {
                                          const url = URL.createObjectURL(blob)
                                          const a = document.createElement('a')
                                          a.href = url
                                          a.download = `backup_${b.backup_id}.json`
                                          a.click()
                                          URL.revokeObjectURL(url)
                                        })
                                    }}
                                  >
                                    ⬇ Download
                                  </a>
                                  {/* Restore */}
                                  <button
                                    onClick={() => setConfirmRestore(b)}
                                    disabled={restoringId === b.backup_id}
                                    className="text-xs font-semibold text-orange-600 hover:underline px-3 py-1.5 border border-orange-200 rounded-lg disabled:opacity-50"
                                  >
                                    {restoringId === b.backup_id
                                      ? <Loader2 size={12} className="animate-spin" />
                                      : '↩ Restore'}
                                  </button>
                                  {/* Delete */}
                                  <button
                                    onClick={async () => {
                                      if (!window.confirm('Delete this backup?')) return
                                      await fetch(`${API_BASE}/settings/backups/${b.backup_id}`, {
                                        method: 'DELETE', headers: authHeaders()
                                      })
                                      setBackupList(prev => prev.filter(x => x.backup_id !== b.backup_id))
                                      showToast('Backup deleted', 'success')
                                    }}
                                    className="text-xs font-semibold text-red-500 hover:underline px-3 py-1.5 border border-red-200 rounded-lg"
                                  >
                                    🗑
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-4">
                            No backups yet. Click "Backup Now" or wait for auto-backup.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* RESTORE CONFIRM MODAL */}
      {confirmRestore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Restore Backup?</h3>
            <p className="text-sm text-gray-500 mb-2">
              This will <span className="font-semibold text-red-600">replace all current products and categories</span> with data from Backup #{confirmRestore.backup_id}.
            </p>
            <p className="text-xs text-gray-400 mb-5">
              Created: {new Date(confirmRestore.backed_up_at).toLocaleString('en-IN')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmRestore(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setRestoringId(confirmRestore.backup_id)
                  setConfirmRestore(null)
                  try {
                    const res = await fetch(`${API_BASE}/settings/backups/${confirmRestore.backup_id}/restore`, {
                      method: 'POST', headers: authHeaders()
                    })
                    const data = await res.json()
                    if (res.ok) showToast('Data restored successfully!', 'success')
                    else showToast(data.message || 'Restore failed', 'error')
                  } catch {
                    showToast('Restore failed', 'error')
                  } finally {
                    setRestoringId(null)
                  }
                }}
                className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold"
              >
                Yes, Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings