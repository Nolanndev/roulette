<template>
<div>
    <form class="container p-3" @submit.prevent="connexion">
        <span v-if="failedConnection" class="alert alert-danger" role="alert">Le nom d'utilisateur ou le mot de passe est incorrecte</span>
        <input class="input-group" type="text" placeholder="Nom d'utilisateur" v-model="username">
        <input class="input-group" type="password" placeholder="Mot de passe" v-model="password">
        <button class="btn btn-primary" type="submit">Se connecter</button>
    </form>
</div>
</template>

<script setup lang="ts">
// import io from 'socket.io-client'
// import type { Socket } from 'socket.io-client'


const username = ref('nicolas.ferret')
const password = ref('coucou')
const failedConnection = ref(false)

// let socket: Socket | undefined
const { $socket, $token, $username } = useNuxtApp()

function connexion() {
    // return socket?.emit('connexion', { username: username.value, password: password.value })
    return $socket?.emit('connexion', { username: username.value, password: password.value })
}

onMounted(async () => {
    $socket.on('connexion', (data) => {
        console.log(data)
        if (data.success) {
            localStorage.setItem('token', data.token)
            $token.value = data.token
            $username.value = username
            if (data.goTo === 'formateur') {
                navigateTo('/dashboard')
            } else {
                navigateTo('/jeu')
            }
        } else {
            failedConnection.value = true
        }
    })
})

</script>
