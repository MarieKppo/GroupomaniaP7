<template>
    <div>
        <h1>Profil de {{ userName }}</h1>
        <!--carte profil-->
        <div class="d-inline-flex" id="profileId"> 
            <img id="profilePic" class="card-img" v-if="profilePic" v-bind:src="profilePic" :alt="`photo de profil de ` + userPseudo">
            <!-- infos utilisateur -->
            <div class="card col">
                <div class="card-body">
                    <h5 class="card-title">{{ userPseudo }}</h5>
                    <p class="card-text">{{ userName }} {{ userLastName }}</p>
                    <!-- <p v-if="userEmail" :href="`mailto:` + userEmail" class="btn btn-secondary w-100 mb-2" role="button">Contacter </p> -->
                    <div id="updateProfile" class="card-link d-flex flex-row flex-wrap" > <!-- boutons de suppression du profil -->
                        <button role="button" class="btn btn-light w-25 mx-auto" alt="modifier ma photo de profil" @click="showUpdatePic()"><b-icon icon="camera-fill"></b-icon></button>
                        <button role="button" class="btn btn-light w-25 mx-auto" alt="modifier mon mot de passe"><b-icon icon="pencil-square"></b-icon></button>
                        <button role="button" class="btn btn-light w-25 mx-auto" alt="supprimer mon profil"><b-icon icon="trash-fill"></b-icon></button>
                    </div>
                </div>
            </div>
        </div>
        <!-- modification profil -->
        <div id="EditPic" class="mt-1" v-if="updatePic"> <!-- faire de cette div un seul block bouton-->
            <input type="file" id="newPic" name="newPic" v-on:change="changeFilePic" accept="image/png, image/jpg, image/jpeg">
            <button for="newPic" class="btn btn-secondary" @click="updateProfilePic()">
                <span class="d-none d-lg-block">Modifier ma photo</span>
                <span class="d-lg-none"><b-icon icon="arrow-down-square" font-scale="1"></b-icon></span>
            </button>
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
            token: "",
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
        showUpdatePic() {
            console.log("icone photo cliqué");
            this.updatePic = true;
        },
        showUpdatePwd(){
            console.log('icone modi pwd cliqué')
            this.updatePwd = true;
        },
        showDeleteProfile(){
            console.log('icone poubelle cliqué')
            this.deleteProfile = true;
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
                    this.userEmail = userInfo.email;
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
                this.userEmail = userInfo.email;
                this.profilePic = userInfo.profilePic;
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