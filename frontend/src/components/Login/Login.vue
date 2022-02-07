<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../../assets/icon-above-font.png">
        <h1>Le réseau social de votre entreprise : Groupomania !</h1>
        <p>{{ txt }}</p>
        <!-- formulaire de connexion -->
        <form>
            <div class="form-group mb-2">
                <label for="identifiant">Votre identifiant : </label>
                <input type="text" id="identifiant" class="form-control">
                <label for="password">Votre mot de passe : </label>
                <input type="text" id="password" class="form-control">
            </div>
        </form>
        <!-- boutons de connexion ou création de compte -->
        <!-- if !regex alors bouton outline-->
        <div type="button" class="btn btn-secondary btn-block m-1">Se connecter</div>
        <br>
        <router-link to="/signup" class="m-1">Je n'ai pas de compte, je m'inscris</router-link>
        <br>
        <br>
        <br>
        <br>
    </div>
</template>

<script lang="ts">

export default {
    name: 'Login',
    data(){
        return {
            txt: "Je suis le texte de l'accueil"
        }
    }
}
</script>

<style src="./style.css">
    
</style>
