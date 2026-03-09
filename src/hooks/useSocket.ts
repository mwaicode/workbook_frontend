// src/hooks/useSocket.ts
import { useEffect } from 'react'
import { socket } from '../lib/socket'  // ← adjust path to your file

export function useSocketEvent(event: string, handler: (...args: any[]) => void) {
  useEffect(() => {
    socket.on(event, handler)
    return () => { socket.off(event, handler) }
  }, [event, handler])
}