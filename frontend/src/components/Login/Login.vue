<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../../assets/icon-above-font.png">
        <!-- formulaire de connexion -->
        <h4 class="text-center">Le réseau social de votre entreprise.</h4><br>
        <h5 class="mx-3">Connexion :</h5>
        <form @submit.prevent=connect()>
            <div class="form-group mb-2 d-flex flex-column">
                <label for="identifiant">
                <input type="text" id="identifiant" class="mb-2" required v-model=" userEmail " placeholder="Mon email - ex : marc.dupont@groupomania.fr">
                </label>

                <label>
                <input type="password" id="password" required v-model=" userPassword " placeholder="Mon mot de passe">
                <switch-v-1/>
                <!-- <div class="password-icon" @click="switchVisibility()">
                    <b-icon icon="eye-fill" class="eye-fill"></b-icon>
                    <b-icon icon="eye-slash-fill" class="eye-slash-fill"></b-icon>
                </div> -->
                </label>
                <p v-if="noMatch" class="rounded border border-danger px-3 mt-1 text-danger">{{ noMatchMsg }}</p>
                <button type="submit" class="btn btn-secondary btn-block m-1">Se connecter</button>
            </div>
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
import SwitchVisibility1 from '../switchVisibility1.vue'
// const passwordField = document.querySelector('#password')
 
export default {
    name: 'Login',
    data(){
        return {
            userEmail: "",
            userPassword: "",
            userId: "",
            noMatch: false,
            noMatchMsg: ""
        };
    },
    components:{
        'switchV1' : SwitchVisibility1
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
                this.noMatch = true;
                this.noMatchMsg = err.response.data.error;
                console.log("loupé");
            })
        }
    },
    mounted(){
        if(localStorage.getItem("connectedUser") !== null){
            console.log(localStorage.getItem("connectedUser"))
            this.$router.push(`/feed`)
        }
    }
}
</script>

<style>
    
</style>
