<template>
    <div class="UserProfile">
        <h1 class="mt-3">Profil de {{ userName }}</h1>
        <!--carte profil-->
        <div class="d-inline-flex" id="profileId"> 
            <img id="profilePic" class="card-img" v-if="profilePic" v-bind:src="profilePic" :alt="`photo de profil de ` + userPseudo">
            <!-- infos utilisateur -->
            <div class="card col">
                <div class="card-body">
                    <h5 class="card-title">{{ userPseudo }}</h5>
                    <p class="card-text">{{ userName }} {{ userLastName }}</p>
                    <!-- boutons de suppression du profil -->
                    <div v-if="showUpdate === true " id="showUpdate" class="card-link d-flex justify-content-around flex-wrap" > 
                        <button role="button" class="btn btn-light mt-1 pencil" alt="modifier mon mot de passe" @click="showUpdateOption()"><b-icon icon="pencil-square" ></b-icon></button>
                        <button role="button" class="btn btn-light mt-1 camera" alt="modifier ma photo de profil" @click="showUpdateOption()"><b-icon icon="camera"></b-icon></button>
                        <button role="button" class="btn btn-light mt-1 lock-fill" alt="modifier mon mot de passe" @click="showUpdateOption()"><b-icon icon="lock-fill" ></b-icon></button>
                        <button role="button" class="btn btn-light mt-1 trash" alt="supprimer mon profil" @click="showUpdateOption()"><b-icon icon="trash-fill"></b-icon></button>
                    </div>
                </div>
            </div>
        </div>
        <!-- modification profil -->
            <!-- changement pseudo -->
            <div id="udpdatePseudo" class="mt-1 card mb-3 bg-light p-2 rounded border-dark" v-if="updatePsd"> 
                    <p>Quel est votre nouveau pseudo ?</p>
                <label>Saisir le nouveau pseudo :
                    <input type="text" id="newPseudo" name="newPseudo" v-model="newPseudo" placeholder="Mon nouveau pseudo">
                </label>
                <label>Renseigner votre mot de passe :
                    <input type="password" required v-model="password" id="password" name="password" placeholder="Confirmer le changement avec mon mot de passe :" class="mb-2">
                    <switch-v/>
                </label>
                <p v-if="checkPseudo" class="rounded border border-danger px-3 mt-1 text-danger">Votre pseudo doit contenir au moins 3 caractères :)</p>
                <button for="newPseudo" class="btn" @click="updatePseudo()">Modifier mon pseudo</button>
            </div>
            <!-- changement profilePic -->
            <div id="updatePic" class="mt-1 card mb-3 bg-light p-2 rounded border-dark" v-if="updatePic"> <!-- faire de cette div un seul block bouton-->
                    <p>Changer de photo de profil : </p>
                <label>Sélectionner une nouvelle photo (format : jpg, jpeg ou png) :
                <input type="file" id="newPic" name="newPic" v-on:change="changeFilePic" accept="image/png, image/jpg, image/jpeg">
                </label>
                <button for="newPic" class="btn" @click="updateProfilePic()">Modifier ma photo</button>
            </div>
            <!-- changement mdp -->
            <div id="updatePwd" class="mt-1 card mb-3 bg-light p-2 rounded border-dark" v-if="updatePwd"> <!-- faire de cette div un seul block bouton-->
                    <p>Pour changer de mot de passe : </p>
                <div>
                    <label>Saisir votre mot de passe actuel :
                        <input type="password" required v-model="password" id="password" name="password" placeholder="Mon mot de passe actuel" class="mb-2">
                        <switch-v/>
                    </label>
                    <label>Saisir votre nouveau mot de passe : 
                        <input type="password" required  v-model="newPassword" id="newPassword" name="newPassword" placeholder="Mon nouveau mot de passe">
                        <switch-v/>
                    </label>
                    <label>Confirmer votre nouveau mot de passe :          
                        <input type="password" required v-model="newPassword2" id="newPassword2" name="newPassword2" placeholder="Confirmez mon nouveau mot de passe" class="pb-2">                            <switch-v-1/>
                    </label>
                        <p v-if="newPassword!==newPassword2" class="rounded border border-danger px-3 mt-1 text-danger" >Les mots de passe saisis ne correspondent pas</p>
                </div>
                <button for="newPwd" class="btn btn-secondary mt-3" @click="updatePassword()">Modifier mot de passe</button>
            </div>
            <!-- suppression compte -->
            <div id="deleteProfile" class="mt-1 card mb-3 bg-light p-2 rounded border-danger" v-if="deleteProfile"> <!-- faire de cette div un seul block bouton-->
                    <p>Pour supprimer votre compte : </p>
                <div>
                    <label class="mb-1">Saisir votre adresse email : 
                        <input type="text" id="email" name="email" class="border-danger" required v-model="userEmail" placeholder="Mon email">
                    </label>
                    <label>Saisir votre mot de passe :
                        <input type="password" id="password" name="password" class="border-danger" required v-model="password" placeholder="Mon mot de passe :">
                        <switch-v/>
                    </label>
                </div>
                <button for="newPic" class="btn btn-danger mt-2" @click="deleteUser()">Supprimer mon compte</button>
            </div>
    </div>
</template>

<script>
import axios from 'axios'; 
import switchVisibility from '../switchVisibility.vue'

export default {
    name: 'Profile',
    data() {
        return {
            userId: "",
            userPseudo: "",
            userName: "",
            userLastName: "",
            userEmail: "",
            profilePic: "",
            newPseudo: "",
            checkPseudo: false,
            newProfilePic: "",
            password: null,
            newPassword: null,
            newPassword2: null,
            token: "",
            showUpdate: false,
            updatePsd: false,
            updatePic: false,
            updatePwd: false,
            deleteProfile: false
        };
    },
    components: {
        'switchV': switchVisibility
    },
    methods : {
        // afficher options de modif ou suppression
        showUpdateOption(){
            const pic = document.querySelector(".camera");
            const pen = document.querySelector(".pencil");
            const lockFill = document.querySelector(".lock-fill")
            const trash = document.querySelector(".trash");
            
            pen.addEventListener("click", () => {
                if(this.updatePsd === true){
                    this.updatePsd = false
                }else{
                    this.updatePsd = true;
                    this.updatePic = false;
                    this.updatePwd = false;
                    this.deleteProfile = false;
                }
            });
            pic.addEventListener("click", () => {
                if(this.updatePic === true){
                    this.updatePic = false
                }else{
                    this.updatePsd = false;
                    this.updatePic = true;
                    this.updatePwd = false;
                    this.deleteProfile = false;
                }
            });
            lockFill.addEventListener("click", () => {
                if(this.updatePwd === true) {
                    this.updatePwd = false;
                } else {
                    this.updatePsd = false;
                    this.updatePwd = true;
                    this.updatePic = false;
                    this.deleteProfile = false;
                }
            });
            trash.addEventListener("click", () => {
                if(this.deleteProfile === true){
                    this.deleteProfile = false
                }else {
                    this.updatePsd = false;
                    this.updatePic = false;
                    this.updatePwd = false;
                    this.deleteProfile = true;
                }
            });
        },
        changeFilePic(e){
            this.newProfilePic = e.target.files[0] || e.dataTransfer.files;
        },
        updateProfilePic(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            if(this.newProfilePic === ""){
                alert("Sélectionnez un fichier image pour modifier votre photo de profil svp.")
            }else {
                const formData = new FormData();
                formData.append("profilePic", this.newProfilePic)
                axios({
                    method: "put",
                    url: `http://localhost:3000/api/users/${ProfileId}/profilePic`,
                    data: formData,
                    headers: { // définir les données requises + le token pour auth
                        "content-type": "multipart/form-data",
                        Authorization: `Bearer ${userData.token}`
                    },
                })
                .then(() => {
                    document.querySelector("#newPic").value = null;
                    this.updatePic = false;
                    this.displayUser();
                })
                .catch((err) =>  {
                    console.log("l'erreur est ici")
                    console.log(err)
                });
            }
        },
        switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi 
            const eye = document.querySelector(".eye");
            const eyeoff = document.querySelector(".eyeoff");
            const passwordField = document.querySelector("#newPassword2");
            
            eye.addEventListener("click", () => {
                eye.style.display = "none";
                eyeoff.style.display = "block";
                passwordField.type = "text";
            });

            eyeoff.addEventListener("click", () => {
                eyeoff.style.display = "none";
                eye.style.display = "block";
                passwordField.type = "password";
            })
        },
        updatePseudo() {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);   
    
            if ((userData.userId == ProfileId || userData.isAdmin) && this.password != null){
                if((/^[\w'\-,.0-9_ !¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,30}$/).test(this.newPseudo) === true){
                    if(userData.isAdmin || userData.userId == ProfileId){
                        axios({
                            method: 'put',
                            url: `http://localhost:3000/api/users/${ProfileId}/pseudo`,
                            data: {
                                "pseudo": this.newPseudo,
                                "password": this.password
                            },
                            headers: {
                                Authorization: `Bearer ${userData.token}`
                            },
                        }).then(() => {
                            this.displayUser()
                        }).catch((err) => {
                            alert(JSON.stringify(err.response.data.error))
                        })
                    }
                } else {
                    this.checkPseudo = true
                }
            }
            else {
                if(this.password === null){
                    alert("Merci de saisir votre mot de passe pour modifier votre pseudo.")
                }
                else {
                    alert("Vous ne pouvez pas modifier le pseudo d'un de vos collègues !")
                }
            }
        },
        updatePassword(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            let verifP = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

            if (this.password === null && this.newPassword === null && this.newPassword2 === null) {
                (alert("Veuillez renseigner les champs pour pouvoir modifier votre mdp"));
            } else {
                if (this.newPassword != this.newPassword2){ 
                    alert("Attention, le nouveau mot de passe saisi et sa confirmation ne sont pas identiques !")
                }
                if (verifP.test(this.newPassword) === false){
                    alert("Votre mot de passe doit contenir au moins : 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.")
                }
                else{ // appel api avec ancien mdp + nouveau mdp 
                    console.log("mots de passe identiques et conformes")
                    axios({
                        method: "put", 
                        url: `http://localhost:3000/api/users/${ProfileId}/password`,
                        data: {
                            "password": this.password,
                            "newPassword": this.newPassword
                        },
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        },
                    })
                    .then(() => {
                        this.updatePwd = false;
                    })
                    .catch((err) => {
                        alert(JSON.stringify(err.response.data.message))
                    });
                }
            }
        },
        deleteUser(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            if((userData.userId != ProfileId) && (userData.isAdmin != 1)){
                alert("Cette opération ne vous est pas permise.")
            }
            else{
                if(this.password === null || this.userEmail === null){
                    alert("Pour supprimer votre compte, vous devez saisir vos identifiant et mot de passe.")
                }
                if(confirm("Vous allez supprimer votre compte et toutes vos publications. Merci de confirmer :")) {
                    axios({
                        method: "DELETE",
                        url: `http://localhost:3000/api/users/${ProfileId}`,
                        data: {
                            "email" : this.userEmail,
                            "password": this.password
                        },
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    })
                    .then(() => {
                        if(userData.isAdmin == 1) {
                            this.$router.push('/feed');
                        }
                        else {
                            localStorage.clear()
                            this.$router.push('/');
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        alert(JSON.stringify(err.response.data.error))
                    });
                }
            }
            

        },
        displayUser(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            axios
                .get(`http://localhost:3000/api/users/${ProfileId}`, {
                    headers: { 
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                .then((response) => {
                    let userInfo = response.data[0]
                    this.userPseudo = userInfo.pseudo;
                    this.userName = userInfo.firstName;
                    this.userLastName = userInfo.lastName;
                    this.profilePic = userInfo.profilePic;
                    window.location.reload(); // un peu long à charger voir si judicieux
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    },
    mounted() {
        if(!localStorage.getItem("connectedUser")){
            this.$router.push(`/`);
        }
        else {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            axios
                .get(`http://localhost:3000/api/users/${ProfileId}`, {
                    headers: { // définir les données requises + le token pour auth
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                .then((response) => {
                    if((ProfileId == userData.userId) || (userData.isAdmin == 1)){
                        this.showUpdate = true
                        // console.log(this.showUpdate)
                    } else {
                        this.showUpdate = false
                    }
                    this.userPseudo = response.data[0].pseudo;
                    this.userName = response.data[0].firstName;
                    this.userLastName = response.data[0].lastName;
                    this.profilePic = response.data[0].profilePic;
                })
                .catch((err) => {
                    console.log(err.response.data.message)
                    this.$router.push(`/notFound`);
            });
        }
    }
}
</script>

<style>
label {
    display: flex;
    justify-content: center;
    position: relative;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    width: 100%;
}
label .password-icon {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
    width: 30px;
    border: none;
    background: transparent;
}
label .password-icon:hover {
    cursor: pointer;
}
label .password-icon .eye-slash-fill {
    display: none;
}
</style>