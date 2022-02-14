<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="text-center my-2 card-title">Bienvenu sur le fil de publications des membres de Groupomania</h5>
                <p class="text-center my-2card-text">Vous pouvez écrire des articles et les partager avec les autres membres de la communauté ! <br>
                Veuillez à respecter le réglement de l'entreprise et à faire preuve de bienveillance les uns envers les autres.</p>
            </div>
        </div>
        <!-- publier du contenu    -->
        <div class="my-3 bg-light p-2 rounded">
            <!-- <div class="d-flex justify-content-between align-items-center"> -->
                <h5>Publier du contenu</h5>
                <!-- <b-icon icon="caret-down-fill" font-scale="1"></b-icon> -->
            <!-- </div> -->
            <form @submit.prevent=createPost() class="card"> 
                <textarea 
                    type="textarea" 
                    name="textContent" 
                    id="textContent" 
                    class="border-light" 
                    v-model=" textContent " 
                    placeholder="Que voulez-vous partager aujoud'hui ?"
                    minlength="3" 
                    maxlength="300" 
                    size="150">
                </textarea>
                <input 
                    type="file" 
                    name="visualContent" 
                    id="visualContent" 
                    class="input-group border-light bg-white" 
                    placeholder="Votre image"
                    accept="image/png, image/jpg, image/jpeg"
                    v-on:change="fileChangePost"
                >   <!-- v-on:change remplace v-model -->
                <button type="submit" class="btn btn-secondary mt-1">Publier</button> <!-- v-if="textContent != null || visualContent != null" -->
            </form>

        </div>
        <!-- Afficher les publications -->
        <div class="my-3 bg-light p-2 rounded">
            <h5 class="px-2">Fil de publications</h5>
                    <div class="card" v-if="posts.length < 1">
                        <div class="card-body">
                            Il n'y a pas de publications à afficher. Rédigez la première !
                        </div>
                    </div>
                <div v-bind:key="date" v-for="(post, date) in posts" class="card my-3 mx-1" name="publication"> <!-- class="p-2" -->
                        <div class="card-body">
                            <!-- info utilisateur et options suppr -->
                            <div class="card-title d-flex justify-content-between">
                                <div class="d-flex">
                                    <img class="profilePic" v-if="post.profilePic" v-bind:src="post.profilePic" v-bind:alt="`Photo de profil de ${post.pseudo}`" @click="showUserProfile(post.userId)"> <!-- ajouter la miniature profilePic -->
                                    <p class="card-title p-2 font-weight-bold">{{ post.pseudo }}</p>
                                    <p class="card-title p-2" v-if="post.pseudo === null">{{ post.firstName }} {{ post.lastName }}</p>
                                </div>
                                <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'post' || post.type == 'Posté')" @click="deletePost(post.postId)" role="button"></b-icon>
                                <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'partage' || post.type == 'Partagé')" @click="deleteShare(post.shareId)" role="button"></b-icon>
                            </div> 
                            <!-- contenu publication -->
                            <p class="card-text">{{ post.content }}</p>
                            <img class="card-img mb-2" v-if="post.visualContent" v-bind:src="post.visualContent" :alt="'image du post : ' + post.postId"/>
                            <!-- info publication et options interactions -->
                            <div class="d-flex justify-content-between">
                                <small>{{ post.type }} le : {{ post.date | formatDate}}</small>
                                <div class="postOptions">
                                    <button name="partager" alt="Partager ce contenu sur mon profil" class="card-link btn btn-secondary" @click="sharePost(post.postId)" role="button">Partager</button> 
                                    <!-- <button name="commenter" class="card-link btn btn-secondary" role="button">Commentaires</button> -->
                                </div>
                            </div>
                        </div>
                </div> 

        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'GlobalFeed',
    data(){
        return {
            admin: false,
            userId: "",
            token: "",
            posts: [], // stocke la data de chaque post 
            comments: [],
            textContent: null,
            visualContent: null
        };
    },
    created() {
        let userData = JSON.parse(localStorage.getItem("connectedUser"));
        this.admin = !!userData.isAdmin;
        console.log("userData admin : "+ this.admin)
        this.userId = userData.userId;
        this.token = userData.token;

        //afficher les posts
        axios
            .get("http://localhost:3000/api/posts", {
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                }
            })
            .then((response) => {
                this.posts = response.data;
                console.log(this.posts);
            })
            .catch((error) => console.log(error));
    },
    methods: {
        // update props visuel qd sélectionné car v-model ne supporte pas les fichiers
        fileChangePost(e){
            this.visualContent = e.target.files[0] || e.dataTransfer.files;
        },
        // créer une publication
        createPost(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            console.log('dans la fonction publier vue postId //  token : '+ userData.token)
            console.log('textContent '+ this.textContent)
            console.log('visualContent ')
            console.log( this.visualContent)

            const formData = new FormData(); //créer paire clé/valeur pour req
            formData.append("textContent", this.textContent);
            formData.append("visualContent", this.visualContent);

            if ((this.textContent === null || this.textContent === " ") && this.visualContent === null) {
                (alert("Vous ne pouvez pas partager du vide"));
            } else {
                axios({
                    method: "post",
                    url: `http://localhost:3000/api/posts/`,
                    data: formData,
                    headers: { // définir les données requises + le token pour auth
                        "content-type": "multipart/form-data",
                        Authorization: `Bearer ${userData.token}`
                    },
                })
                .then(reponse => {
                    console.log("Posté avec succés !")
                    console.log(reponse);
                    this.textContent = null,
                    this.visualContent = null,
                    document.querySelector("#textContent").value = null;
                    document.querySelector("#visualContent").value = null;
                    this.displayAllPosts();
                })
                .catch((error) => {
                    console.log(error);
                    console.log("Votre message n'a pas pu etre posté !");
                })
            }
    
        },
        //partager un post A REVOIR PASSE PAS L'AUTH !!!
        sharePost(postId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;
            console.log('dans la fonction share post vue postId : '+ postId + ' token : '+ this.token);

            if (confirm("Voulez vous vraiment partager ce post ?")) {
                axios({
                    method: "post",
                    url: `http://localhost:3000/api/posts/share/${postId}`,
                    headers: { // définir les données requises + le token pour auth
                        Authorization: `Bearer ${userData.token}`
                    },
                    })
                    .then(() => {
                        this.displayAllPosts();
                    })
                    .catch((error) => console.log(error));
            }
        },
        //supprimer un post
        deletePost(postId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;
            console.log('dans la fonction delete post vue postId : '+ postId + ' token : '+ this.token)
            if (confirm("Voulez vous vraiment supprimer ce post ?")) {
                axios({
                    method: "delete",
                    data: postId,
                    url: `http://localhost:3000/api/posts/${postId}`,
                    headers: { // définir le token pour auth
                        Authorization: `Bearer ${userData.token}`
                    },
                })
                .then(() => {
                    this.displayAllPosts();
                })
                .catch((error) => console.log(error));
            }
        },
        //supprimer un partage
        deleteShare(shareId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;
            console.log('dans la fonction delete share vue shareId : '+ shareId + ' token :'+this.token)
            if (confirm("Voulez vous vraiment supprimer ce partage ?")) {
                axios
                    .delete(`http://localhost:3000/api/posts/share/${shareId}`, {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                        }
                    })   
                    .then(() => {
                        this.displayAllPosts();
                    })
                    .catch((error) => console.log(error));
            }
        },
        // afficher les posts
        displayAllPosts(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;
            this.userId = userData.userId
            axios
                .get("http://localhost:3000/api/posts", {
                    headers: {
                        Authorization: `Bearer ${userData.token}`,
                    }
                })                
                .then((response) => {
                this.posts = response.data;
                })
                .catch((error) => console.log(error));
        },
        showUserProfile(id){
            this.$router.push(`/profile/${id}`)
        }

    }

}
</script>

<style>
.profilePic{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid grey;
    object-fit: cover;
    cursor: pointer;
}

</style>