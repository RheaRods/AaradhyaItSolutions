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
  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white py-3 overflow-hidden relative border-b border-blue-400/30 shadow-xs antialiased">
      {/* Soft gradient fade on the sides for a seamless loop */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-blue-700 via-blue-700/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-blue-700 via-blue-700/80 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-4 animate-ticker whitespace-nowrap">
        {/* Repeat content 4 times for a continuous loop */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-6 flex items-center gap-3">
            {/* Pulsing Announcement Badge */}
            <span className="inline-flex items-center gap-1.5 bg-blue-900/40 border border-white/20 text-yellow-300 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              Notice
            </span>

            {/* Title & Message */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-medium">
              {announcement.title && (
                <span className="text-white font-bold tracking-wide">
                  {announcement.title}:
                </span>
              )}
              <span className="text-blue-50 font-medium">{announcement.message}</span>
            </div>

            {/* Separator */}
            <span className="text-blue-300/60 mx-4 text-xs">•</span>
          </div>
        ))}
      </div>

      {/* Smooth CSS Ticker Animation */}
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-flex;
          animation: ticker 32s linear infinite;
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

    // Fetch active announcement
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