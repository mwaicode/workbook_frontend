// import { io } from 'socket.io-client'
// export const socket = io('http://localhost:3001')


import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
})