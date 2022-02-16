<template>
    <div class="alert-info p-3 rounded-top">
        <h1 class="m-3" alt="Page d'erreur, la page demandée n'existe pas">404 not found</h1>
        <p>Le contenu que vous souhaitez afficher n'existe pas !</p><br>
        <router-link :to="`/`" class="btn btn-dark" alt="bouton pour retourner à l'accueil de l'application"><b-icon icon="arrow-right" ></b-icon> Retour accueil</router-link><br>
        <a @click="showUserProfile()" class="btn btn-dark mt-1" alt="bouton pour rejoindre mon profil utilisateur"><b-icon icon="arrow-right" ></b-icon> Aller sur mon profil</a>
        <br>
        <br>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
    methods: {
        showUserProfile(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            if (userData) {
                this.$router.push(`/profile/${userData.userId}`)
            }
            else {
                this.$router.push(`/`)
            }
        }
    }
}
</script>

<style>

</style>