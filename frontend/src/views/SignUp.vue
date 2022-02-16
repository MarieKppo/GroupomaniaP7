<template>
    <div>
        <signup></signup>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import SignUp from '../components/SignUp/SignUp.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'

export default {
    name: 'Login',
    components: {
        'signup': SignUp,
        'footer-bottom': FooterBottom
    }
}
</script>

<style scoped>

</style>