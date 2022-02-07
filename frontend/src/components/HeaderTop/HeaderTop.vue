<template>
    <div role="navigation" class="navbar mx-1 justify-content-center flex-row">
        <!-- d-grid gap-2 d-md-flex justify-content-md-end -->
        <img class="logo navbar-brand" src="../../assets/icon-left-font-monochrome-black.svg">    
        <router-link to="/feed" class="m-1">Fil d'actu</router-link>
        <router-link to="/profile" class="m-1">Mon profil</router-link>
        <router-link to="/" class="m-1">Me déconnecter</router-link>
    </div>
</template>

<script>
export default {
    name: 'HeaderTop'
}
</script>

<style>
.logo{
    width: auto;
    height: 30px!important; 
}
</style>