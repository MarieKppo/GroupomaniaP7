<template>
    <div>
        <header-top></header-top>
        <login></login>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import Login from '../components/Login/Login.vue'

export default {
    name: 'LoginPage',
    components: {
        'header-top': HeaderTop,
        'login': Login
    }
}
</script>

<style scoped>

</style>