<template>
        <div role="navigation" class="navbar mx-1 justify-content-center flex-row">
        <!-- d-grid gap-2 d-md-flex justify-content-md-end -->
            <img class="logo navbar-brand" src="../../assets/icon-left-font-monochrome-black.svg">   
            <a class="justify-content-center flex-row" @click="$router.go(-1)" alt="Revenir à la page précédente"><b-icon icon="backspace" ></b-icon></a>
            <router-link :to="`/feed`" class="m-1">Fil d'actu</router-link>
            <a @click="showUserProfile()" class="m-1">Mon profil</a>
            <a @click="disconnect()" class="m-1" >Me déconnecter</a>
            <router-view/>
        </div>

</template>

<script>
export default {
    name: 'HeaderTop',
    methods: {
        disconnect() {
            alert("Êtes vous sur de vouloir vous déconnecter ?")
            localStorage.clear();
            this.$router.push(`/`); 
            console.log('utilisateur déconnecté')
        },
        showUserProfile(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.$router.push(`/profile/${userData.userId}`)
        }
    }
}
</script>

<style>
.logo{
    width: auto;
    height: 30px!important; 
}
a {
    cursor: pointer;
}
</style>