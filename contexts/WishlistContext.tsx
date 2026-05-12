'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type WishlistItem = {
  id: string
  slug: string
  title: string
  image: string
  price: number
  type: 'hotel' | 'tour'
}

type WishlistContextType = {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (slug: string, type: 'hotel' | 'tour') => void
  isInWishlist: (slug: string, type: 'hotel' | 'tour') => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist')
      if (stored) {
        try {
          setWishlist(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage:', e)
        }
      }
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isMounted])

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.slug === item.slug && w.type === item.type)
      if (exists) return prev
      return [...prev, item]
    })
  }

  const removeFromWishlist = (slug: string, type: 'hotel' | 'tour') => {
    setWishlist((prev) => prev.filter((item) => !(item.slug === slug && item.type === type)))
  }

  const isInWishlist = (slug: string, type: 'hotel' | 'tour') => {
    return wishlist.some((item) => item.slug === slug && item.type === type)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
