import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import Footer from '../components/public/Footer'
import API_URL from '../config/api'
import { getActiveAnnouncement } from '../services/public/announcementsService'

// ─── Maintenance screen ────────────────────────────
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

// ─── Announcement ticker ───────────────────────────
type AnnouncementData = {
  announcement_id: number
  title: string | null
  message: string
}

const AnnouncementTicker = ({ announcement }: { announcement: AnnouncementData }) => {
  const text = announcement.title
    ? `${announcement.title}: ${announcement.message}`
    : announcement.message

  return (
    <div className="bg-blue-600 text-white py-2 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-600 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-3 animate-ticker whitespace-nowrap">
        {/* Repeat the text so the loop looks seamless */}
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-sm font-medium px-8 flex items-center gap-2">
            <span className="text-blue-200">📢</span>
            {text}
            <span className="text-blue-300 mx-4">•</span>
          </span>
        ))}
      </div>

      {/* Ticker animation — injected as a style tag so we don't need Tailwind JIT */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-flex;
          animation: ticker 28s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

// ─── Main layout ───────────────────────────────────
const PublicLayout = () => {
  const [maintenance, setMaintenance] = useState(false)
  const [checking, setChecking] = useState(true)
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)

  useEffect(() => {
    // Check maintenance mode
    fetch(`${API_URL}/api/public/maintenance`)
      .then(res => res.json())
      .then(data => setMaintenance(data.maintenanceMode || false))
      .catch(() => setMaintenance(false))
      .finally(() => setChecking(false))

    // Fetch active announcement (independent — doesn't block render)
    getActiveAnnouncement().then(data => setAnnouncement(data))
  }, [])

  if (checking) return null
  if (maintenance) return <Maintenance />

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ticker shown only when there's an active announcement */}
      {announcement && <AnnouncementTicker announcement={announcement} />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout