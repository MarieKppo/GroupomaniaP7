<template>
    <div class="container">
        <h2>Créer mon compte</h2>
        <p>{{ txt }}</p>
        <!-- formulaire de connexion -->
        <form>
            <div class="form-group mb-2">
                <label for="identifiant">Mon pseudo : </label>
                <input type="text" id="identifiant" class="form-control">
                <label for="identifiant">Mon nom* : </label>
                <input type="text" id="identifiant" class="form-control">
                <label for="identifiant">Mon prénom* : </label>
                <input type="text" id="identifiant" class="form-control">
                <label for="identifiant">Mon email* : </label>
                <input type="text" id="identifiant" class="form-control">
                <label for="password">Mon mot de passe* : </label>
                <input type="text" id="password" class="form-control">
                <p>* : champs obligatoires</p>
            </div>
        </form>
        <!-- boutons de connexion ou création de compte -->
        <!-- if !regex alors bouton outline-->
        <router-link to="/signup" class="btn btn-secondary btn-block m-1">Créer mon compte</router-link>
        <br>       
        <br>
        <router-link to="/login" class="font-weight-lighter">J'ai déjà un compte, je me connecte</router-link>
        <br>
        <br>
        <br>
        <br>
    </div>
</template>

<script lang="ts">

export default {
    name: 'SignUp',
    data(){
        return {
            txt: "Pour vous inscrire, veuillez renseigner les champs suivants : "
        }
    }
}
</script>

<style scoped> 
/* src="./style.css"> */
    
</style>
