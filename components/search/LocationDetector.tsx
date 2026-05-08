'use client'

import axios from '@/lib/axios'
import { Globe, LoaderCircle, LocateFixed, MapPin, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LocationSource } from '@/types/search'

const CACHE_DURATION = 30 * 60 * 1000

export default function LocationDetector() {
  const [location, setLocation] = useState("Detecting location...")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [source, setSource] = useState<LocationSource>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userLocation") || "null")

    if (saved?.city && Date.now() - saved.timestamp < CACHE_DURATION) {
      setLocation(saved.city)
      setSource(saved.source ?? null)
      setLoading(false)
      return
    }

    void getFreshLocation()
  }, [])

  const getFreshLocation = async () => {
    setRefreshing(true)

    if (!navigator.geolocation) {
      await getFromIP()
      setRefreshing(false)
      return
    }

    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log(`Detected GPS coordinates: ${latitude}, ${longitude}`)

          try {
            const res = await axios.get(`/location/gps?lat=${latitude}&lng=${longitude}`)
            const city = res.data.city || 'Location Detected'

            setLocation(city)
            setSource('gps')
            setLoading(false)

            localStorage.setItem(
              "userLocation",
              JSON.stringify({ city, source: 'gps', timestamp: Date.now() })
            )
          } catch (error) {
            console.error('Error fetching GPS location:', error)
            await getFromIP()
          } finally {
            resolve()
          }
        },
        async () => {
          await getFromIP()
          resolve()
        },
        {
          timeout: 5000,
          enableHighAccuracy: true,
          maximumAge: 0
        }
      )
    })

    setRefreshing(false)
  }

  const getFromIP = async () => {
    try {
      const res = await axios.get('/location/ip')
      const city = res.data.city || 'India'

      setLocation(city)
      setSource('ip')
      setLoading(false)

      localStorage.setItem(
        "userLocation",
        JSON.stringify({ city, source: 'ip', timestamp: Date.now() })
      )
    } catch (error) {
      console.error('Error fetching IP location:', error)
      setLocation("India")
      setSource('ip')
      setLoading(false)
    }
  }

  const label = loading ? 'Detecting...' : location
  const sourceLabel = source === 'gps' ? 'Live GPS' : source === 'ip' ? 'Approximate' : 'Location'

  return (
    <div className="group flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2.5 py-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-white/70 backdrop-blur">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : source === 'gps' ? (
          <LocateFixed className="h-4 w-4" />
        ) : source === 'ip' ? (
          <Globe className="h-4 w-4" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </div>

      <div className="min-w-0 leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {sourceLabel}
        </p>
        <p className="max-w-[8rem] truncate font-medium text-slate-700 sm:max-w-[10rem]">
          {label}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void getFreshLocation()}
        disabled={refreshing}
        aria-label="Refresh location"
        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
