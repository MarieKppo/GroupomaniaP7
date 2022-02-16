<template>
    <div>
        <header-top></header-top>
        <profile></profile>
        <user-feed></user-feed>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import Profile from '../components/Profile/Profile.vue'
import UserFeed from '../components/UserFeed/UserFeed.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'header-top': HeaderTop,
        'profile': Profile,       
        'user-feed': UserFeed,
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>