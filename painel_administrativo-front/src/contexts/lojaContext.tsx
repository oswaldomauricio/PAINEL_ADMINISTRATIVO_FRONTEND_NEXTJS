"use client"

import { createContext, useContext, useState } from "react"

import type { ReactNode } from "react"

interface StoreContextType {
  store: number | null
  setStore: React.Dispatch<React.SetStateAction<number | null>>
}

const StoreContext = createContext<StoreContextType>({
  store: null,
  setStore: () => {},
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<number | null>(null)
  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
