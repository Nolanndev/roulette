import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'

let socket: Socket | null = null
const token = reactive({ value: "" })
const username = reactive({ value: "" })


export default defineNuxtPlugin((nuxtApp) => {
  if (!socket) {
    socket = io(`ws://localhost:3003`, {
        transports: ['websocket'],
        autoConnect: true,
    });
  }

  nuxtApp.provide('socket', socket)
  nuxtApp.provide('token', token)
  nuxtApp.provide('username', username)
})
