<template>
    <div>
        <h1>Profil de /UserName/</h1>
        <div class="d-inline-flex" id="profileId"> <!--carte profil-->
            <img id="profilePic" class="card-img" src="../../assets/defaultProfilePic.jpg" alt="balise alt de la photo de profil">
            <!-- infos utilisateur -->
            <div class="card col">
                <div class="card-body">
                    <h5 class="card-title">pseudo</h5>
                    <p class="card-text">{{ userName }} {{ userData.lastName }}</p>
                    <button href="#" class="btn btn-secondary" role="button">Contacter</button>
                    <div id="EditPic" class="mt-1"> <!-- faire de cette div un seul block bouton-->
                        <!-- <b-icon icon="arrow-down-square" font-scale="2"></b-icon> -->
                        <input type="file" id="newPic" name="newPic" placeholder="Modifier ma photo" accept="image/png, image/jpg, image/jpeg">
                        <button for="newPic" class="btn btn-secondary">
                            <span class="d-none d-lg-block">Télécharger ma photo</span>
                            <span class="d-lg-none"><b-icon icon="arrow-down-square" font-scale="1"></b-icon></span>
                        </button>
                    </div>
                    <div id="DeleteProfile" class="card-link mt-1"> <!-- boutons de suppression du profil -->
                        <button role="button" class="btn btn-danger">Supprimer mon compte</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from 'axios'; 


export default {
    name: 'Profile',
    data() {
        return {
            userData: "",
            userName: ""
        };
    },
    //if userIdparam == userid token : 
    //afficher btn suppr et modif 
    // if != 
    //afficher bouton contact
    methods : {
    },
    mounted() {
            console.log("localStorage");
            console.log(JSON.parse(localStorage.getItem("connectedUser")));
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            console.log("userData.firstName");
            console.log(userData.firstName);
            this.userName = userData.firstName
            

    }
}
</script>

<style>
#profileId {
    width: 100%;
}
#profilePic {
    width: 45%;
    height: fit-content;
    border: solid;
}
</style>