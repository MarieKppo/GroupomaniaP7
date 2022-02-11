<template>
    <div>
        <!-- <header-top></header-top> -->
        <signup></signup>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
// import HeaderTop from '../components/HeaderTop/HeaderTop.vue'
import SignUp from '../components/SignUp/SignUp.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'

export default {
    name: 'Login',
    components: {
        // 'header-top': HeaderTop,
        'signup': SignUp,
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>