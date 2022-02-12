<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../../assets/icon-above-font.png">
        <h1>Le réseau social de votre entreprise : Groupomania !</h1>
        <!-- formulaire de connexion -->
        <div>
            Connexion :
        </div>
        <form @submit.prevent=connect()>
            <div class="form-group mb-2 d-flex flex-column">
                <label for="identifiant">
                <input type="text" id="identifiant" required v-model=" userEmail " placeholder="marc.dupont@groupomania.fr">
                </label>

                <label>
                <input type="password" id="password" required v-model=" userPassword " placeholder="Mot de passe">

                <div class="password-icon" @click="switchVisibility()">
                    <b-icon icon="eye-fill" class="eye-fill"></b-icon>
                    <b-icon icon="eye-slash-fill" class="eye-slash-fill"></b-icon>
                </div>
                </label>
            </div>
            <button type="submit" class="btn btn-secondary btn-block m-1">Se connecter</button>
        </form>
        <!-- boutons de connexion ou création de compte -->
        <router-link to="/signup" class="m-1"><small>Je n'ai pas de compte, je m'inscris</small></router-link>
        <!-- if !regex alors bouton outline-->
        <br>
        <br>
        <br>
        <br>
        <br>
    </div>
</template>

<script>
import axios from 'axios';

// const passwordField = document.querySelector('#password')
 
export default {
    name: 'Login',
    data(){
        return {
            userEmail: "",
            userPassword: "",
            id: ""
        };
    },
    methods: {
        switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi 
            const eye = document.querySelector(".eye-fill");
            const eyeoff = document.querySelector(".eye-slash-fill");
            const passwordField = document.querySelector("input[type=password]");
            
            eye.addEventListener("click", () => {
                eye.style.display = "none";
                eyeoff.style.display = "block";
                passwordField.type = "text";
            });

            eyeoff.addEventListener("click", () => {
                eyeoff.style.display = "none";
                eye.style.display = "block";
                passwordField.type = "password";
            });
        },
        connect(){
            axios
            .post("http://localhost:3000/api/users/login", {
                email: this.userEmail,
                password: this.userPassword
            })
            .then(response => {
                this.id = response.data.userId;
                localStorage.setItem("connectedUser", JSON.stringify(response.data));
                console.log("connexion réussie");
                console.log("userId : "+ this.id);
                this.$router.push(`/feed`);    
            })
            .catch(err =>{
                console.log("loupé");
                console.log(err);
            })
        }
    }
}
</script>

<style src="./style.css">
    
</style>
