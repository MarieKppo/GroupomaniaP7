<template>
    <div>
        <header-top></header-top>
        <!-- <post></post> -->
        <global-feed></global-feed>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
// import Post from '../components/Post/Post.vue'
import GlobalFeed from '../components/GlobalFeed/GlobalFeed.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'header-top': HeaderTop,
        // 'post': Post,
        'global-feed': GlobalFeed,        
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>