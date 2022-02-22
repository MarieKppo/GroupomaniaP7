<template>
    <div class="container">
        <img class="logo-accueil img-fluid mx-auto" src="../../assets/icon-above-font.png" alt="Logo de groupomania rouge sur fond blanc">
        <!-- formulaire de connexion -->
        <h4 class="text-center">Le réseau social de votre entreprise.</h4><br>
        <h5 class="mx-3">Connexion :</h5>
        <form @submit.prevent=connect() alt="formulaire de connexion au réseau socil Groupomania">
            <div class="form-group mb-2 d-flex flex-column">
                <label name="idenditifiant" alt="saisissez votre identifiant" for="identifiant">Saississez votre identifiant
                    <input type="text" id="identifiant" class="mb-2" required v-model=" userEmail " placeholder="Mon email - ex : marc.dupont@groupomania.fr" alt="emplacement pour saisir l'adresse mail et se connecter">
                </label>
                <label name="motDePasse" alt="saisissez votre mot de passe" for="password">Saississez votre mot de passe
                    <input type="password" id="password" required v-model=" userPassword " placeholder="Mon mot de passe" alt="emplacement pour saisir le mot de passe de connexion">
                    <switch-v/>
                </label>
                <p v-if="noMatch" class="rounded border border-danger px-3 mt-1 text-danger">{{ noMatchMsg }}</p>
                <button type="submit" class="btn btn-secondary btn-block m-1" alt="Bouton pour se connecter à l'application">Se connecter</button>
            </div>
        </form>
        <!-- boutons de connexion ou création de compte -->
        <router-link to="/signup" class="m-1"><small>Je n'ai pas de compte, je m'inscris</small></router-link>
        <br>
        <br>
    </div>
</template>

<script>
import axios from 'axios';
import SwitchVisibility from '../switchVisibility.vue'

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
        'switchV' : SwitchVisibility
    },
    methods: {
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
                this.$router.push(`/feed`);    
            })
            .catch(err =>{
                this.noMatch = true;
                this.noMatchMsg = err.response.data.error;
                console.log("échec de connexion");
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
