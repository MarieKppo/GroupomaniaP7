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
                    <label for="identifiant">
                        <input type="text" id="pseudo" v-model="pseudo" class=""  placeholder="Mon pseudo - ex : L3o ">
                        <p v-if="noMatchPseudo" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre pseudo doit contenir au moins 3 caratères (lettres, chiffres et caractères spéciaux).</p>
                    </label>

                    <label for="lastName">
                        <input type="text" id="lastName" v-model.lazy="lastName" class="" required placeholder="Mon nom* - ex : Dupont">
                        <p v-if="noMatchLName" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre nom doit contenir au moins 2 lettres ou caractères spéciaux</p>
                    </label>

                    <label for="firstName"> 
                        <input type="text" id="firstName" v-model="firstName" class="" required placeholder="Mon prénom* - ex : Paul">
                        <p v-if="noMatchFName" class="rounded border border-danger px-3 mt-1 text-danger">
                            Votre prenom doit contenir au moins 2 lettres ou caractères spéciaux</p>
                    </label>

                    <label for="email">
                        <input type="text" id="email" v-model="email" class="" placeholder="Mon email* - ex : pauldupont@groupomania.fr">
                        <p v-if="noMatchEmail" class="rounded border border-danger px-3 mt-1 text-danger">test {{  }}</p>
                    </label>

                    <label for="password">
                        <input type="password" id="password" v-model="password" placeholder="Mon mot de passe* - ex : m0td&pass3!">
                        <switch-v-1/>
                    </label>
                        <p v-if="noMatchPwd" class="rounded border border-danger px-3 mt-1 text-danger">Votre mot de passe doit contenir au moins 8 caractères dont au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.</p>
                    <label>
                        <input type="password" id="confirmPwd" v-model="confirmPwd" placeholder="Confirmer votre mot de passe">
                        <div class="password-icon" @click="switchVisibility()">
                            <b-icon icon="eye-fill" class="eye-fillx"></b-icon>
                            <b-icon icon="eye-slash-fill" class="eye-slash-fillx"></b-icon>
                        </div>
                    </label>
                        <p v-if="noMatchingPwd" class="rounded border border-danger px-3 mt-1 text-danger">Vérifiez la correspondance des 2 mots de passe saisis.</p>
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
import switchVisibility1 from '../switchVisibility1.vue'
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
            noMatchPseudo: false,
            noMatchLName: false,
            noMatchFName: false,
            noMatchEmail: false,
            noMatchPwd: false,
            noMatchingPwd: false
        }
    },
    components:{
        'switchV1': switchVisibility1
    },
    methods:{
        // switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi 
        //     const eyex = document.querySelector(".eye-fillx");
        //     const eyeoffx = document.querySelector(".eye-slash-fillx");
        //     const passwordField = document.querySelector("input[id=confirmPwd]");
            
        //     eyex.addEventListener("click", () => {
        //         eyex.style.display = "none";
        //         eyeoffx.style.display = "block";
        //         passwordField.type = "text";
        //     });

        //     eyeoffx.addEventListener("click", () => {
        //         eyex.style.display = "block";
        //         eyeoffx.style.display = "none";
        //         passwordField.type = "password";
        //     });
        // },
        InputChecking(){
            //aurait pu être fait avec eventListener change
            // Regex 
            let verifPseudo = /^[\w'\-,.0-9_!¡?#ˆ&*()][^÷¿/\\+=@$%{}|~<>;:[\]]{2,}$/;
            let verifName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
            let verifEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            let verifPwd = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
            if((this.pseudo != "") && (verifPseudo.test(this.pseudo) === false)){
                this.noMatchPseudo = true
            }else{
                this.noMatchPseudo = false
            }
            if(verifName.test(this.firstName) === false){
                this.noMatchFName = true;
            }else{
                this.noMatchFName = false
            }
            if(verifName.test(this.lastName) === false){
                this.noMatchLName = true;
            }else{
                this.noMatchLName = false
            }
            if(verifEmail.test(this.email) === false){
                console.log("input checking")
                console.log(this.email)
                console.log("this.checkemail before change : " + this.noMatchEmail)
                this.noMatchEmail= true;
                console.log("this.checkemail after change : " + this.noMatchEmail)
            }else{
                this.noMatchEmail = false
            }
            if(verifPwd.test(this.password) === false){
                this.noMatchPwd= true;
            }else{
                this.noMatchPwd = false
            }
            if(this.password !== this.confirmPwd){
                this.noMatchingPwd = true;
            }else{
                this.noMatchingPwd = false
            }
        },
        signUp(){
            this.InputChecking();
            console.log("signup fonction")
            
            if (this.noMatchPseudo === false &&
                this.noMatchFName === false &&
                this.noMatchLName === false &&
                this.noMatchEmail === false &&
                this.noMatchPwd === false &&
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

<style> 
label .password-icon .eye-slash-fillx  {
  display: none;
}
label .password-icon .eye-fillx  {
  display: block;
}
</style>
