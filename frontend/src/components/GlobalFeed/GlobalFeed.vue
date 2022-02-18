<template>
    <div>
        <div class="card bg-blue text-white">
            <div class="card-body">
                <h5 class="text-center my-2 card-title">Bienvenu sur Groupomania, réseau social de votre entreprise !</h5>
                <p class="text-center my-2card-text">Vous pouvez écrire des articles et les partager avec les autres membres de la communauté ! <br>
                <small>Veuillez à respecter le réglement de l'entreprise et à faire preuve de bienveillance les uns envers les autres.</small></p>
            </div>
        </div>
        <!-- publier du contenu    -->
        <div class="my-3 bg-light p-2 rounded" alt="fil de publication de Groupomania">
            <h5>Publier du contenu</h5>
            <form @submit.prevent=createPost() class="card"> 
                <textarea 
                    type="textarea" 
                    name="textContent" 
                    id="textContent" 
                    class="border-light" 
                    v-model=" textContent " 
                    placeholder="Que voulez-vous partager aujoud'hui ?"
                    minlength="3" 
                    maxlength="3000" 
                    size="150">
                </textarea>
                <input 
                    type="file" 
                    name="visualContent" 
                    id="visualContent" 
                    class="input-group border-light bg-white" 
                    placeholder="Votre image"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    v-on:change="fileChangePost"
                >   
                <button type="submit" class="btn mt-1">Publier</button> 
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
                <div v-bind:key="id" :id="`card-`+ id" v-for="(post, id) in posts" class="card my-3 mx-1" name="publication"> 
                        <div class="card-body">
                            <!-- info utilisateur et options suppr -->
                            <div class="card-title d-flex justify-content-between">
                                <div class="d-flex">
                                    <img class="profilePic" v-if="post.profilePic" v-bind:src="post.profilePic" v-bind:alt="`Photo de profil de ${post.pseudo}`" @click="showUserProfile(post.userId)"> <!-- ajouter la miniature profilePic -->
                                    <p class="card-title p-2">{{ post.pseudo }}</p>
                                    <p class="card-title p-2" v-if="(post.pseudo == null) || (post.pseudo == '')">{{ post.firstName }} {{ post.lastName }}</p>
                                </div>
                                <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'Publié')" @click="deletePost(post.postId)" role="button"></b-icon>
                                <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'Partagé')" @click="deleteShare(post.shareId)" role="button"></b-icon>
                            </div> 
                            <!-- contenu publication -->
                            <p class="card-text">{{ post.content }}</p>
                            <img class="card-img mb-2" v-if="post.visualContent" v-bind:src="post.visualContent" :alt="'image du post : ' + post.postId"/>
                            <!-- info publication et option de partage -->
                            <div class="d-flex justify-content-between">
                                <div class="d-flex flex-column">
                                    <small>{{ post.type }} le : {{ post.date | formatDate}}</small>
                                    <small v-if="(post.type == 'partage' || post.type == 'Partagé')">Auteur : <a :href="/profile/+post.authorId">{{ post.authorFirstName }} {{ post.authorLastname }}</a></small>
                                </div>
                                <div class="postOptions">
                                    <button name="partager" alt="Partager ce contenu sur mon profil" class="card-link btn" @click="sharePost(post.postId)" role="button">Partager</button> 
                                    <!-- <button name="commenter" class="card-link btn" role="button" @click="showComments(post.postId)">Voir les commentaires</button> -->
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
            posts: [],  
            comments: [],
            textContent: "",
            visualContent: null
        };
    },
    created() {
        if(!localStorage.getItem("connectedUser")){
            this.$router.push(`/`);
        }
        else {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.admin = !!userData.isAdmin;
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
        }
    },
    methods: {
        // update props visuel qd sélectionné car v-model ne supporte pas les fichiers
        fileChangePost(e){
            this.visualContent = e.target.files[0] || e.dataTransfer.files;
        },
        // créer une publication
        createPost(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));

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
                    headers: { 
                        "content-type": "multipart/form-data",
                        Authorization: `Bearer ${userData.token}`
                    },
                })
                .then(() => {
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
        //partager un post 
        sharePost(postId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;

            if (confirm("Voulez vous vraiment partager ce post ?")) {
                axios({
                    method: "post",
                    url: `http://localhost:3000/api/posts/share/${postId}`,
                    headers: { 
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
            if (confirm("Voulez vous vraiment supprimer ce partage ?")) {
                axios
                    .delete(`http://localhost:3000/api/posts/share/${shareId}`, {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                        }
                    })   
                    .then(() => {
                        this.displayAllPosts();
                        window.location.reload()
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