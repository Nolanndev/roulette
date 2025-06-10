<template>
    <div>
        <div v-if="tokenValide">
            <h1>Dashboard</h1>
            <select class="form-select" v-model="classeSelectionnee">
                <option selected disabled>Choisir une classe</option>
                <option v-for="classe in classes" :value="classe">{{ classe }}</option>
            </select>
            <button class="btn btn-primary" @click="demarrerPartie">Démarrer un jeu</button>
        </div>
        <div v-else>
            <h1>Dashboard</h1>
            Impossible d'accéder à cette page
        </div>
    </div>
</template>

<script setup>

    const tokenValide = ref(false)
    const classes = ref([])
    const classeSelectionnee = ref('')

    const { $socket, $token, $username } = useNuxtApp();
    if ($token.value !== '') {
        tokenValide.value = true
    } else {
        tokenValide.value = false
    }

    console.warn('username.value')
    console.warn($username.value)

    $socket.emit('classes-formateur', { username: $username.value })

    function demarrerPartie() {
        if (classeSelectionnee.value === '') return

        console.log('démarrer partie', classeSelectionnee.value)

        $socket.emit('demarrer-partie', { classe: classeSelectionnee.value, formateur: $username.value })
    }

    onMounted(async () => {
        $socket.on('verif-token', (res) => {
            tokenValide.value = res
        })

        $socket.on('classes-formateur', (data) => {
            classes.value = data.classes
        })

        $socket.on('demarrer-partie', (data) => {
            console.log(data)
        })
    })
</script>