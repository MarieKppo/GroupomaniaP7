<template>
    <div>
        <header-top></header-top>
        <profile></profile>
        <!-- <post></post> -->
        <user-feed></user-feed>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import Profile from '../components/Profile/Profile.vue'
// import Post from '../components/Post/Post.vue'
import UserFeed from '../components/UserFeed/UserFeed.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'header-top': HeaderTop,
        'profile': Profile,       
        // 'post': Post, 
        'user-feed': UserFeed,
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>