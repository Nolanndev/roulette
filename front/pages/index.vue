<template>
<div>
    <form class="container p-3" @submit.prevent="connexion">
        <input class="input-group" type="text" placeholder="Nom d'utilisateur" v-model="username">
        <input class="input-group" type="password" placeholder="Mot de passe" v-model="password">
        <button class="btn btn-primary" type="submit">Se connecter</button>
    </form>
</div>
</template>

<script setup lang="ts">
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const formMessage = ref('there you go')
const state = reactive({ messages: [] })

const username = ref('nolann.parcheminer')
const password = ref('coucou')

let socket: Socket | undefined

const sendMessage = () => {
    socket?.emit('message', formMessage.value)
    formMessage.value = ""
}

function connexion() {
    socket?.emit('connexion',
        {
            username: username.value,
            password: password.value
        }
    )
    console.log(`Connexion : ${username.value} - ${password.value}`)
}

onMounted(async () => {
    const url = `${location.protocol === 'https:' ? 'wss://' : 'ws://'}localhost:3003`
    console.log(url)
    socket = io(url, {
        transports: ['websocket'],
        autoConnect: true,
    });

    socket.on('connexion', (data) => {
        console.log('Réponse de la connexion :')
        console.log(data)
    })
})

onUnmounted(() => {
    socket?.disconnect()
})
</script>
