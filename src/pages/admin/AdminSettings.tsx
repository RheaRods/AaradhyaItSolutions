import { useState, useEffect } from 'react'
import { Bell, User, Save, Camera, Shield, Building2, BellRing, Settings2, ChevronRight, Loader2, CheckCircle, XCircle } from 'lucide-react'

type Tab = 'profile' | 'security' | 'company' | 'notifications' | 'system'

const API_BASE = 'http://localhost:5000/api/admin'

const getToken = () => localStorage.getItem('adminToken') || ''

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

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Profile state
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', role: '' })

  // Password state
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  // Company state
  const [company, setCompany] = useState({
    companyName: '', legalName: '', gstin: '', incorporationDate: '',
    supportEmail: '', salesEmail: '', primaryPhone: '', whatsapp: '',
    address1: '', address2: '', city: '', state: '', pin: '',
    linkedin: '', twitter: '', facebook: ''
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    newInquiry: true, stockAlerts: false, weeklySummary: true, customerReviews: true,
    loginActivity: true, securityUpdates: true, dataExport: false, whatsappForwarding: false
  })

  // System state
  const [system, setSystem] = useState({
    maintenanceMode: false, language: 'English - India', timezone: 'IST - UTC+5:30',
    googleMapsKey: '', cloudStorage: 'AWS S3', autoBackup: true, backupFrequency: 'Daily'
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
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
        if (res.ok) showToast('Profile saved successfully!', 'success')
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

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-teal-500' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-all ${value ? 'right-1' : 'left-1'}`} />
    </div>
  )

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
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-gray-400" />
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
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
                        <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {profile.fullName?.charAt(0) || 'A'}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold hover:underline">
                            <Camera size={14} /> Change Photo
                          </button>
                          <button className="text-red-500 text-sm font-semibold hover:underline">Remove</button>
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
                    </div>

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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Auto-Backup</p>
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
                        <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 text-sm">
                          🗑 Clear Cache
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings