<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../../assets/icon-above-font.png">
        <h1>Le réseau social de votre entreprise : Groupomania !</h1>
        <!-- formulaire de connexion -->
        <form @submit.prevent=connect()>
            <div class="form-group mb-2">
                <label for="identifiant">Votre identifiant : </label>
                <input type="text" id="identifiant" class="form-control" required v-model=" userEmail " placeholder="marc.dupont@groupomania.fr">
                <label for="password">Votre mot de passe : </label>
                <!-- <div class="d-flex align-items-center form-control"> -->
                    <input type="password" id="password" class="form-control" required v-model="userPassword" placeholder="m0tdEpass3">
                    <!-- <button onclick=" switchVisibility() "><b-icon icon="eye-fill"></b-icon></button> 
                </div> -->
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
        // switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi
        //     if (passwordField.getAttribute('type') === 'password') passwordField.setAttribute('type', 'text')
        //     else passwordField.setAttribute('type', 'password')
        // },
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
