<template>
    <div>
        <div role="navigation" class="navbar mx-1 justify-content-center flex-row">
            <img class="logo navbar-brand" src="../../assets/icon-left-font-monochrome-black.svg">   
            <a class="justify-content-center flex-row" @click="$router.go(-1)" alt="Revenir à la page précédente"><b-icon icon="backspace" ></b-icon></a>
            <router-link :to="`/`" class="m-1">Se connecter</router-link>
            <router-view/>
        </div>
        <div>
            <h2>Créer mon compte</h2>
            <p>{{ txt }}</p>

            <!-- formulaire de connexion -->
            <form class="form-control" @submit.prevent=signUp()>
                <div class="form-group mb-2 mx-auto d-flex flex-column">
                    <label for="identifiant">Mon pseudo : 
                        <input type="text" id="pseudo" v-model="pseudo" class=""  placeholder="Votre pseudo doit contenir au moins 3 caractères. Ex : L3o ">
                        <p v-if="checkPseudo" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre pseudo doit contenir au moins 3 caratères (lettres, chiffres et caractères spéciaux).</p>
                    </label>

                    <label for="lastName">Mon nom* : 
                        <input type="text" id="lastName" v-model="lastName" class="" required placeholder="Dupont">
                        <p v-if="checkLName" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre nom doit contenir au moins 2 lettres ou caractères spéciaux</p>
                    </label>

                    <label for="firstName">Mon prénom* : 
                        <input type="text" id="firstName" v-model="firstName" class="" required placeholder="Paul">
                        <p v-if="checkFName" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre prenom doit contenir au moins 2 lettres ou caractères spéciaux</p>
                    </label>

                    <label for="email">Mon email* : 
                        <input type="text" id="email" v-model="email" class="" placeholder="pauldupont@groupomania.fr">
                        <p v-if="checkEmail" class="rounded border border-danger px-3 mt-1 text-danger">test {{  }}</p>
                    </label>

                    <label for="password">Mon mot de passe* : 
                        <input type="password" id="password" v-model="password" placeholder="m0td&pass3!" class="">
                        <p v-if="checkPwd" class="rounded border border-danger px-3 mt-1 text-danger">Votre mot de passe doit contenir au moins 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.</p>
                        <input type="password" id="confirmPwd" v-model="confirmPwd" placeholder="Confirmer votre mot de passe">
                        <p v-if="noMatchingPwd" class="rounded border border-danger px-3 mt-1 text-danger">Vérifiez la correspondance des 2 mots de passe saisis.</p>
                    </label>
                    <small>* : champs obligatoires</small>
                <button type="submit" class="btn btn-secondary btn-block m-1">Créer un compte</button>
                </div>
            </form>
            <router-link :to="`/`" class="font-weight-lighter"><small>J'ai déjà un compte, je me connecte</small></router-link>
            <br>
            <br>
            <br>
            <br>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'

export default {
    name: 'SignUp',
    data(){
        return {
            txt: "Pour vous inscrire, veuillez renseigner les champs suivants : ",
            pseudo: "",
            lastName: "",
            firstName: "",
            email: "",
            password:"",
            confirmPwd:"",
            checkPseudo: false,
            checkLName: false,
            checkFName: false,
            checkEmail: false,
            checkPwd: false,
            noMatchingPwd: false
        }
    },
    methods:{
        InputChecking(){
            // Regex 
            let verifPseudo = /^[\w'\-,.0-9_!¡?#ˆ&*()][^÷¿/\\+=@$%{}|~<>;:[\]]{2,}$/;
            let verifName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
            let verifEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            let verifPwd = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
            if((this.pseudo != "") && (verifPseudo.test(this.pseudo) === false)){
                console.log('verif pseudo : ' + verifPseudo.test(this.pseudo))
                console.log(this.pseudo)
                this.checkPseudo = true
            }
            if(verifName.test(this.firstName) === false){
                this.checkFName = true;
            }
            if(verifName.test(this.lastName) === false){
                this.checkLName = true;
            }
            if(verifEmail.test(this.email) === false){
                this.checkEmail= true;
            }
            if(verifPwd.test(this.password) === false){
                this.checkPwd= true;
            }
            if(this.password !== this.confirmPwd){
                this.noMatchingPwd = true;
            }
        },
        signUp(){
            this.InputChecking();
            console.log(this.email)
            
            if (this.checkPseudo === false &&
                this.checkFName === false &&
                this.checkLName === false &&
                this.checkEmail === false &&
                this.checkPwd === false &&
                this.noMatchingPwd === false) {
                console.log("on peut envoyer les données dans l'api")

                axios({
                    method: 'post',
                    url: `http://localhost:3000/api/users/signup`,
                    data: {
                        "firstName" : this.firstName,
                        "lastName": this.lastName,
                        "email": this.email,
                        "password": this.password,
                        "pseudo": this.pseudo
                    }
                })
                .then(() => {
                    console.log("creation réussie");
                    alert("Votre compte est bien créé ! Vous pouvez vous connecter : ")
                    this.$router.push(`/`)
                })
                .catch((error) =>{ 
                    console.log(error.response)
                    alert(JSON.stringify(error.response.data.message));
                    // return error;
                })
            }
            else {
                console.log('remplir correctement tous les champs')
                confirm("Pour pouvoir valider votre inscription, tous les champs requis doivent être complétés correctement.")
            }
        }
    }
}
</script>

<style scoped> 
/* src="./style.css"> */
    
</style>
