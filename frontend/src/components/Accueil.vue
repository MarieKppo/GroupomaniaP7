<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../assets/icon-above-font.png">
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
        <div type="button" class="btn btn-secondary btn-block m-1">Créer un compte</div>
        <br>
        <br>
        <br>
        <br>
    </div>
</template>

<script lang="ts">

export default {
    name: 'Accueil',
    data(){
        return {
            txt: "Je suis le texte de l'accueil"
        }
    }
}
</script>

<style scoped>
    .container {
        max-width: 500px;
    }
    .logo-accueil{
        max-width : 80%;
        max-height: 40%;
        display: block;
    }
</style>
