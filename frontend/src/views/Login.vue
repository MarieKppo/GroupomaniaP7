<template>
    <div>
        <!-- <header-top></header-top> -->
        <login></login>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
// import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import Login from '../components/Login/Login.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        // 'header-top': HeaderTop,
        'login': Login,        
        'footer-bottom': FooterBottom
    }
}
</script>

<style >

</style>