import React, { createContext, useContext, useState, useCallback } from 'react'

type RouteContextType = {
  currentRoute: string
  setCurrentRoute: (route: string) => void
}

const RouteContext = createContext<RouteContextType>({
  currentRoute: '',
  setCurrentRoute: () => {},
})

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState('')
  const set = useCallback((route: string) => setCurrentRoute(route), [])
  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute: set }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useCurrentRoute() {
  return useContext(RouteContext)
}
