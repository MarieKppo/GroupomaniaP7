<template>
    <div>
        <login></login>
        <footer-bottom></footer-bottom>
    </div>
</template>

<script>
import Login from '../components/Login/Login.vue'
import FooterBottom from '../components/FooterBottom/FooterBottom.vue'


export default {
    name: 'Login',
    components: {
        'login': Login,        
        'footer-bottom': FooterBottom
    }
}
</script>

<style >

</style>