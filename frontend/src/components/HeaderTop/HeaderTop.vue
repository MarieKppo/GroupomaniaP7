<template>
    <div role="navigation" class="navbar mx-1 justify-content-center flex-row">
        <!-- d-grid gap-2 d-md-flex justify-content-md-end -->
        <img class="logo navbar-brand" src="../../assets/icon-left-font-monochrome-black.svg">    
        <feed class="btn">Fil d'actu</feed>
        <profile  class="btn">Profil</profile>
        <deconnect class="btn">Me déconnecter</deconnect>
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