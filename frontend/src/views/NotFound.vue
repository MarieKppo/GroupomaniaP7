<template>
    <div>
        <header-top></header-top>
        <not-found></not-found>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import NotFound from '../components/NotFound/NotFound.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'header-top': HeaderTop,
        'not-found': NotFound,        
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>