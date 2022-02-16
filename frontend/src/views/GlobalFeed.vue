<template>
    <div>
        <header-top></header-top>
        <global-feed></global-feed>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import GlobalFeed from '../components/GlobalFeed/GlobalFeed.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'header-top': HeaderTop,
        'global-feed': GlobalFeed,        
        'footer-bottom': FooterBottom
    }
}
</script>

<style>

</style>