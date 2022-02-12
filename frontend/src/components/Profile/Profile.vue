<template>
    <div>
        <h1>Profil de {{ userName }}</h1>
        <!--carte profil-->
        <div class="d-inline-flex" id="profileId"> <!-- changer css d-sm-block -->
            <img id="profilePic" class="card-img" v-if="profilePic" v-bind:src="profilePic" :alt="`photo de profil de ` + userPseudo">
            <!-- infos utilisateur -->
            <div class="card col">
                <div class="card-body">
                    <h5 class="card-title">{{ userPseudo }}</h5>
                    <p class="card-text">{{ userName }} {{ userLastName }}</p>
                    <!-- <p v-if="userEmail" :href="`mailto:` + userEmail" class="btn btn-secondary w-100 mb-2" role="button">Contacter </p> -->
                    <div v-if="showUpdate = true" id="showUpdate" class="card-link d-flex flex-row" > <!-- boutons de suppression du profil -->
                        <b-icon role="button" class="btn btn-light w-25 mx-auto camera" alt="modifier ma photo de profil" @click="showUpdateOption()" icon="camera-fill" font-scale="2"></b-icon>
                        <b-icon role="button" class="btn btn-light w-25 mx-auto pencil" alt="modifier mon mot de passe" @click="showUpdateOption()" icon="pencil-square" font-scale="2"></b-icon>
                        <b-icon role="button" class="btn btn-light w-25 mx-auto trash" alt="supprimer mon profil" @click="showUpdateOption()" icon="trash-fill" font-scale="2"></b-icon>
                    </div>
                </div>
            </div>
        </div>
        <!-- modification profil -->
        <!-- changement profilePic -->
        <div id="updatePic" class="mt-1 card mb-3 bg-light p-2 rounded border-dark" v-if="updatePic"> <!-- faire de cette div un seul block bouton-->
                <p>Sélectionnez une nouvelle image (format : jpg, jpeg ou png) : </p>
            <label>
            <input type="file" id="newPic" name="newPic" v-on:change="changeFilePic" accept="image/png, image/jpg, image/jpeg">
            </label>
            <button for="newPic" class="btn btn-secondary" @click="updateProfilePic()">Modifier ma photo</button>
        </div>
        <!-- changement mdp -->
        <div id="updatePwd" class="mt-1 card mb-3 bg-light p-2 rounded border-dark" v-if="updatePwd"> <!-- faire de cette div un seul block bouton-->
                <p>Pour changer de mot de passe : </p>
            <label>
                <label>Renseignez votre mot de passe actuel : 
                    <input type="password" required v-model="password" id="password" name="password" placeholder="Votre mot de passe actuel" class="mb-2">
                    <div class="password-icon" @click="switchVisibility()">
                        <b-icon icon="eye-fill" class="eye-fill eye1"></b-icon>
                        <b-icon icon="eye-slash-fill" class="eye-slash-fill eyeoff1"></b-icon>
                    </div>
                </label>
                <!-- <label for="newPassword"> -->
                    <label>Saisissez votre mot nouveau mot de passe : 
                        <input type="password" required  v-model="newPassword" id="newPassword" name="newPassword" placeholder="Votre nouveau mot de passe">
                        <div class="password-icon" @click="switchVisibility()">
                            <b-icon icon="eye-fill" class="eye-fill eye2"></b-icon>
                            <b-icon icon="eye-slash-fill" class="eye-slash-fill eyeoff2"></b-icon>
                        </div>
                        <!-- <p v-if="newPassword!==verifP" class="rounded border border-danger px-3 mt-1 text-danger" >Les mots de passe saisis ne correspondent pas</p> -->
                    </label>
                    <label>Confirmer votre nouveau mot de passe :                
                        <input type="password" required v-model="newPassword2" id="newPassword2" name="newPassword2" placeholder="Confirmez votre nouveau mot de passe">
                        <div class="password-icon" @click="switchVisibility()">
                            <b-icon icon="eye-fill" class="eye-fill eye3"></b-icon>
                            <b-icon icon="eye-slash-fill" class="eye-slash-fill eye3"></b-icon>
                        </div>
                        <p v-if="newPassword!==newPassword2" class="rounded border border-danger px-3 mt-1 text-danger" >Les mots de passe saisis ne correspondent pas</p>
                    </label>
                </label>
            <!-- </label> -->
            <button for="newPic" class="btn btn-secondary mt-3" @click="updatePassword()">Modifier mot de passe</button>
        </div>
        <!-- suppression compte -->
        <div id="deleteProfile" class="mt-1 card mb-3 bg-light p-2 rounded border-danger" v-if="deleteProfile"> <!-- faire de cette div un seul block bouton-->
                <p>Pour supprimer votre compte : </p>
            <label>
                <label class="mb-1">Renseignez votre adresse email :
                    <input type="text" id="email" name="email" class="border-danger" required v-model="userEmail" placeholder="Votre email">
                </label>
                <label>Saisissez votre mot de passe :
                    <input type="password" id="password" name="password" class="border-danger" required v-model="password" placeholder="Votre mot de passe">
                </label>
            </label>
            <button for="newPic" class="btn btn-danger mt-2" @click="deleteUser()">Supprimer mon compte</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'; 


export default {
    name: 'Profile',
    data() {
        return {
            // profileId: URLSearchParams.id,
            userId: "",
            userPseudo: "",
            userName: "",
            userLastName: "",
            userEmail: "",
            profilePic: "",
            newProfilePic: "",
            password: null,
            newPassword: null,
            newPassword2: null,
            // verifP = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"),
            token: "",
            showUpdate: false,// vérif si profileId = userId || admin = true et si oui passer variable à true poru montrer bloc modif
            updatePic: false,
            updatePwd: false,
            deleteProfile: false
        };
    },
    //if userIdparam == userid token : 
    //afficher btn suppr et modif 
    // if != 
    //afficher bouton contact
    methods : {
        // afficher options de modif ou suppression
        showUpdateOption(){
            console.log("bouton option de modif cliqué")
            const pic = document.querySelector(".camera");
            const pen = document.querySelector(".pencil");
            const trash = document.querySelector(".trash");
            
            pic.addEventListener("click", () => {
                this.updatePic = true;
                this.updatePwd = false;
                this.deleteProfile = false;
            });
            pen.addEventListener("click", () => {
                this.updatePwd = true;
                this.updatePic = false;
                this.deleteProfile = false;
            });
            trash.addEventListener("click", () => {
                this.updatePic = false;
                this.updatePwd = false;
                this.deleteProfile = true;
            });

        },
        changeFilePic(e){
            this.newProfilePic = e.target.files[0] || e.dataTransfer.files;
        },
        updateProfilePic(){
            console.log('changer la photo');
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            const formData = new FormData();
            formData.append("profilePic", this.newProfilePic)
            axios({
                method: "put",
                url: `http://localhost:3000/api/users/profilePic/${ProfileId}`,
                data: formData,
                headers: { // définir les données requises + le token pour auth
                    "content-type": "multipart/form-data",
                    Authorization: `Bearer ${userData.token}`
                },
            })
            .then(response => {
                console.log("photo modifiée avec succés");
                console.log(response)
                document.querySelector("#newPic").value = null;
                this.updatePic = false;
                this.displayUser();
                // this.profilePic = "";
            })
            .catch((err) =>  {
                console.log("l'erreur est ici")
                console.log(err)
            });
        },
        // switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi 
        //     const eye = document.querySelector(".eye-fill");
        //     const eyeoff = document.querySelector(".eye-fill-slash");
        //     // const eye1 = document.querySelector(".eye1");
        //     // const eye2 = document.querySelector(".eye2");
        //     // const eye3 = document.querySelector(".eye3");
        //     // const eyeoff1 = document.querySelector(".eyeoff1");
        //     // const eyeoff2 = document.querySelector(".eyeoff2");
        //     // const eyeoff3 = document.querySelector(".eyeoff3");
        //     const passwordField = document.querySelector("input[type=password]");
        //     // const newPasswordField = document.querySelector("input[name=newPassword]");
        //     // const newPasswordField2 = document.querySelector("input[name=newPassword2]");
            
        //     eye.addEventListener("click", () => {
        //         eye.style.display = "none";
        //         eyeoff.style.display = "block";
        //         passwordField.type = "text";
        //     });

        //     eyeoff.addEventListener("click", () => {
        //         eyeoff.style.display = "none";
        //         eye.style.display = "block";
        //         passwordField.type = "password";
        //     });
        // },
        updatePassword(){
            console.log('changer le mdp');
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            // console.log(this.password)
            // console.log(this.newPassword)
            // console.log(this.newPassword2)
            let verifP = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
            // console.log(verifP.test(this.newPassword))

            if (this.password === null && this.newPassword === null && this.newPassword2 === null) {
                (alert("Veuillez renseigner les champs pour pouvoir modifier votre mdp"));
            } else {
                if (this.newPassword != this.newPassword2){ // ajouter verif regex
                    alert("Attention, le nouveau mot de passe saisi et sa confirmation ne sont pas identiques !")
                }
                if (!verifP.test(this.newPassword)){
                    alert("Votre mot de passe doit contenir au moins : 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.")
                    // console.log("Votre mot de passe doit contenir au moins : 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.")
                }
                else{ // appel api avec ancien mdp + nouveau mdp 
                    console.log("mots de passe identiques et conformes")
                    axios({
                        method: "put", 
                        url: `http://localhost:3000/api/users/password/${ProfileId}`,
                        data: {
                            "password": this.password,
                            "newPassword": this.newPassword
                        },
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        },
                    })
                    .then((response) => {
                        console.log('mot de passe modifié avec succés');
                        console.log(response)
                    })
                    .catch((err) => {
                        console.log('erreur de modif mdp' + err)
                    });
                }
            }
        },
        deleteUser(){
            console.log('supprimer le compte');
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            console.log('userdata id : ' +userData.userId + ' profileId : ' + ProfileId)
            console.log("userData admin : "+userData.isAdmin)
            if((userData.userId != ProfileId) && (userData.isAdmin != 1)){
                alert("Cette opération ne vous est pas permise.")
            }
            else{
                if(this.password === null || this.userEmail === null){
                    alert("Pour supprimer votre compte, vous devez saisir vos identifiant et mot de passe.")
                }
                console.log(this.userEmail + " " + this.password)
                confirm("Vous allez supprimer votre compte et toutes vos publications. Merci de confirmer :")
                axios({
                    method: "DELETE",
                    url: `http://localhost:3000/api/users/profile/${ProfileId}`,
                    data: {
                        "email" : this.userEmail,
                        "password": this.password
                    },
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                .then((response) => {
                    console.log('compte supprimé avec succés');
                    console.log(response);
                    this.$router.push('/');
                })
                .catch((err) => {
                    console.log(err)
                    alert(JSON.stringify(err.response.data))
                });
            }
            

        },
        displayUser(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            //récup id de l'url
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            // console.log(ProfileId);

            axios
                .get(`http://localhost:3000/api/users/profile/${ProfileId}`, {
                    headers: { // définir les données requises + le token pour auth
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                .then((response) => {
                    console.log("display user after update")
                    let userInfo = response.data[0]
                    // console.log(userInfo)
                    this.userPseudo = userInfo.pseudo;
                    this.userName = userInfo.firstName;
                    this.userLastName = userInfo.lastName;
                    // this.userEmail = userInfo.email;
                    this.profilePic = userInfo.profilePic;
                    window.location.reload(); // un peu long à charger voir si judicieux
                })
                .catch((err) => {
                    console.log("l'erreur du get profile id est ici")
                    console.log(err)
                });
        }
    },
    mounted() {
        let userData = JSON.parse(localStorage.getItem("connectedUser"));
        //récup id de l'url
        let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        // console.log(ProfileId);

        axios
            .get(`http://localhost:3000/api/users/profile/${ProfileId}`, {
                headers: { // définir les données requises + le token pour auth
                    Authorization: `Bearer ${userData.token}`
                }
            })
            .then((response) => {
                console.log("reponse de get user id from url")
                let userInfo = response.data[0]
                console.log(userInfo)
                this.userPseudo = userInfo.pseudo;
                this.userName = userInfo.firstName;
                this.userLastName = userInfo.lastName;
                // this.userEmail = userInfo.email;
                this.profilePic = userInfo.profilePic;
                if(ProfileId === userData.userId || userData.isAdmin === 1){
                    console.log("ProfileId : " + ProfileId + " userDataId : " + userData.userId)
                    console.log("userData Admin : " + userData.isAdmin)
                    console.log("showUpdate" + this.showUpdate)
                    this.showUpdate = true
                } else {
                    this.showUpdate = false
                }
            })
            .catch((err) => {
                console.log("l'erreur du get profile id est ici")
                console.log(err)
            });
    }
}
</script>

<style>
#profileId {
    width: 100%;
}
#profilePic {
    display: inline-block;
    width: 200px;
    height: 200px;
    /* border-radius: 50%; */
    border: 1px solid grey;
    object-fit: cover;
}
</style>