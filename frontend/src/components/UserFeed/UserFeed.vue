<template>
    <section>
        <div class="my-3 bg-light p-2 rounded" v-if="userId == ProfileId">
            <h5>Publier du contenu</h5>    
            <form @submit.prevent=createPost() class="card" alt="zone de saisie de publication"> 
                <textarea 
                    type="textarea" 
                    name="textContent" 
                    id="textContent" 
                    class="border-light" 
                    v-model=" textContent " 
                    placeholder="Que voulez-vous partager aujoud'hui ?"
                    minlength="3" 
                    maxlength="1000" 
                    size="150"
                    alt="vous pouvez saisir ici le message que vous souhaitez partager">
                </textarea>
                <input 
                    type="file" 
                    name="visualContent" 
                    id="visualContent" 
                    class="input-group border-light bg-white" 
                    placeholder="Votre image"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    v-on:change="fileChangePost"
                    alt="vous pouvez sélectionner l'image que vous voulez publier"
                > 
                <button type="submit" class="btn mt-1">Publier</button>
            </form>
        </div>
        <div class="my-3 bg-light p-2 rounded">
            <h5>Publications</h5>
            <div class="card noPosts mb-3"> 
            </div>
            <div v-bind:key="id" :id="`card-`+id" v-for="(post, id) in posts" class="card mb-3">
                    <div class="card-body">
                        <!-- info utilisateur et options suppr -->
                        <div class="card-title d-flex justify-content-between">
                            <div class="d-flex">
                                <img class="profilePicU" v-if="post.profilePic" v-bind:src="post.profilePic" v-bind:alt="`Photo de profil de ${post.pseudo}`"> 
                                <p class="card-title p-2 font-weight-bold">{{ post.pseudo }}</p>
                                <p class="card-title p-2" v-if="(post.pseudo == null) || (post.pseudo == '')">{{ post.firstName }} {{ post.lastName }}</p>
                            </div>
                            <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'Publié')" @click="deletePost(post.postId)" role="button"></b-icon>
                            <b-icon icon="trash-fill" v-if="(admin == true || userId == post.userId) && (post.type == 'Partagé')" @click="deleteShare(post.shareId, id)" role="button"></b-icon>
                        </div> 
                        <!-- contenu publication -->
                        <p class="card-text">{{ post.content }}</p>
                        <img class="card-img mb-2" v-if="post.visualContent" v-bind:src="post.visualContent" :alt="'image du post : ' + post.postId"/>
                        <!-- info publication et option partage -->
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-column">
                                <small>{{ post.type }} le : {{ post.date | formatDate}}</small>
                                <small v-if="(post.type == 'partage' || post.type == 'Partagé')">Auteur : <a :href="/profile/+post.authorId">{{ post.authorFirstName }} {{ post.authorLastname }}</a></small>
                            </div>
                            <div class="postOptions">
                                <button class="card-link btn" @click="sharePost(post.postId)" role="button">Partager</button> 
                                <!-- <button class="card-link btn" role="button">Commenter</button> -->
                            </div>
                        </div>
                    </div>
                <br>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
export default {
    name: 'FeedUser',
    data(){
        return {
            admin: false,
            userId: "",
            token: "",
            posts: [], // stocke la data de chaque post 
            textContent: null,
            visualContent: null,
            ProfileId: ""
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
            this.ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            //afficher les posts
            axios
                .get(`http://localhost:3000/api/posts/profile/${this.ProfileId}/posts`, {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                    }
                })
                .then((response) => {
                    this.posts = response.data.userFeed;
                })
                .catch((error) => {
                    document.querySelector(".noPosts").innerHTML = `<div class="card-body">${error.response.data.message}</div>`
                    });
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

            if (this.textContent === null && this.visualContent === null) {
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
                    console.log("Posté avec succés !")
                    this.textContent = null,
                    this.visualContent = null,
                    document.querySelector("#textContent").value = null;
                    document.querySelector("#visualContent").value = null;
                    this.displayAllUserPosts();
                    window.location.reload()
                })
                .catch((error) => {
                    console.log(error);
                    alert("Votre message n'a pas pu etre posté !");
                })
            }
    
        },
        //partager un post 
        sharePost(postId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));

            if (confirm("Voulez vous vraiment partager ce post ?")) {
                axios({
                    method: "post",
                    url: `http://localhost:3000/api/posts/share/${postId}`,
                    headers: { 
                        Authorization: `Bearer ${userData.token}`
                    },
                    })
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((error) => console.log(error));
            }
        },
        //supprimer un post
        deletePost(postId) {
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            this.token = userData.token;
            if (confirm("Voulez vous vraiment supprimer ce post ?")) {
                axios
                    .delete(`http://localhost:3000/api/posts/${postId}`, {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                        }
                    })   
                    .then(() => {
                        // this.displayAllUserPosts();
                        window.location.reload()
                    })
                    .catch((error) => console.log(error));
            }
        },
        //supprimer un partage
        deleteShare(shareId, id) {
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
                        // this.displayAllUserPosts();
                        document.querySelector(`#card-${id}`).remove();
                        // window.location.reload()
                    })
                    .catch((error) => console.log(error));
            }
        },
        // afficher les posts
        displayAllUserPosts(){
            let userData = JSON.parse(localStorage.getItem("connectedUser"));
            let ProfileId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            axios
                .get(`http://localhost:3000/api/posts/profile/${ProfileId}/posts`, {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                    }
                })                
                .then((response) => {
                this.posts = response.data.userFeed;
                })
                .catch((error) => console.log(error));
        }
    }
}
</script>

<style>

</style>