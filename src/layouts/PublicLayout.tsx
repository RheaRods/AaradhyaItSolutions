import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import Footer from '../components/public/Footer'
import API_URL from '../config/api'

const Maintenance = () => (
  <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🔧</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">We'll be back soon!</h1>
      <p className="text-blue-300 text-lg mb-6">
        Aaradhya IT Solution is currently undergoing scheduled maintenance.
        We'll be back shortly.
      </p>
      <div className="bg-blue-900/50 rounded-xl p-4 border border-blue-800">
        <p className="text-blue-200 text-sm">Need urgent help?</p>
        <a href="tel:+919146192757" className="text-white font-semibold text-lg hover:text-blue-300 transition-colors">
          +91 91461 92757
        </a>
      </div>
    </div>
  </div>
)

const PublicLayout = () => {
  const [maintenance, setMaintenance] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/public/maintenance`)
      .then(res => res.json())
      .then(data => setMaintenance(data.maintenanceMode || false))
      .catch(() => setMaintenance(false))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return null

  if (maintenance) return <Maintenance />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout