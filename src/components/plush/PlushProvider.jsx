import { createContext, useContext, useEffect, useState } from 'react'
import PlushHost from './host.js'

const PlushContext = createContext(null)

/* Holds the one PlushHost. Mount it once, around every PlushTile that should share
   the canvas (the shell, when the dock and Herbario land; /lab until then). */
export function PlushProvider({ children }) {
  const [host] = useState(() => new PlushHost())
  useEffect(() => () => host.dispose(), [host])
  return <PlushContext.Provider value={host}>{children}</PlushContext.Provider>
}

export function usePlush() {
  const host = useContext(PlushContext)
  if (!host) throw new Error('usePlush must be used within PlushProvider')
  return host
}
