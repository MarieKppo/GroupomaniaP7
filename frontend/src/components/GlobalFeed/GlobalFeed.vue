<template>
    <div>
        <h5>Global Feed</h5>
        <!-- <div class="card-group"> -->
            
            <div class="card"> <!-- v-for v-model -->
                <div class="card-body">
                    <!-- info utilisateur et options suppr -->
                    <div class="card-title d-flex justify-content-between">
                        <div class="d-flex">
                            <img class="profilePic" src="../../assets/tempProfilePic.jpg">
                            <small class="card-title">Pseudo user<br>Nom et prénom</small>
                        </div>
                        <a>x</a>
                    </div>
                    <!-- contenu publication -->
                    <p class="card-text">Contenu de la publication Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, tenetur sed voluptatem, quae excepturi maiores ab blanditiis accusamus error incidunt earum a exercitationem rerum numquam, dolores velit quis commodi? Modi!</p>
                    <img class="card-img" src="../../assets/grumpy-cat.jpg">
                    <!-- info publication et options interactions -->
                    <div class="d-flex justify-content-between">
                        <small>Partagé/Publié le : 14/02/2022 - 14h30</small>
                        <div class="postOptions">
                            <a class="card-link" role="button">Partager</a>
                            <a class="card-link" role="button">Commenter</a>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            
        <!-- </div> -->

    </div>
</template>

<script>
export default {
    name: 'GlobalFeed'
}
</script>

<style>
.profilePic{
    width: 10%;
    /* height: auto; */
    margin: 2px;
    border: solid;
}

</style>