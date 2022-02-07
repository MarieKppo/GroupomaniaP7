<template>
    <div class="my-3 bg-light p-2 rounded">
        <!-- <div class="d-flex justify-content-between align-items-center"> -->
            <h5>Publier du contenu</h5>
            <!-- <b-icon icon="caret-down-fill" font-scale="1"></b-icon> -->
        <!-- </div> -->
        <div class="card ">
            <input class="input-group border-light bg-white" id="visualContent" type="file" name="visualContent" accept="image/png, image/jpg, image/jpeg">
            <textarea id="postContent" class="border-light" type="textarea" name="textContent" minlength="3" maxlength="300" size="150" placeholder="Que voulez-vous partager aujoud'hui ?"></textarea>
            <button class="btn btn-secondary mt-1">Publier</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post'
}
</script>

<style>

</style>