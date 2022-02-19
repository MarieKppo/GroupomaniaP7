<template>
        <div role="navigation" class="navbar mx-1 justify-content-center flex-row">
            <a :href="`/feed`" alt="Lien vers l'accueil de Groupomania" name="Accueil"><img class="logo navbar-brand" alt="Logo de Groupomania en noir sur fond blanc" src="../../assets/icon-left-font-monochrome-black.svg"></a>
            <a class="justify-content-center flex-row menu" @click="$router.go(-1)" alt="Revenir à la page précédente"> <b-icon icon="backspace" ></b-icon> </a>
            <router-link :to="`/feed`" class="m-1 menu" alt="Lien vers le fil d'actualités de Groupomania">Fil d'actu</router-link>
            <a :href="`/profile/` + userId " class="m-1 menu" alt="lien vers mon profil personnel Groupomania">Mon profil</a>
            <a @click="disconnect()" class="m-1 menu" alt="lien pour me déconnecter de Groupomania">Me déconnecter</a>
            <router-view/>
        </div>

</template>

<script>
export default {
    name: 'HeaderTop',
    data(){
        return {
            userId: JSON.parse(localStorage.getItem("connectedUser")).userId,
        }
    },
    methods: {
        disconnect:function() {
            if(confirm("Vous allez être déconnecté.e.")) {
                localStorage.clear();
                this.$router.push(`/`); 
                console.log('utilisateur déconnecté')
            }        
        }
    }
}
</script>

<style>

</style>