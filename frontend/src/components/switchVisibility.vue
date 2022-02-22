<template>
    <div class="password-icon" @click="switchVisibility()">
        <b-icon icon="eye-fill" class="eye-fill"></b-icon>
        <b-icon icon="eye-slash-fill" class="eye-slash-fill"></b-icon>
    </div>
</template>

<script>
export default {
    name: 'SwitchVisibility1',
    methods: {
        switchVisibility() { // changer la visibilité du mdp pour contrôler ce qui est saisi 
            const eye = document.querySelector(".eye-fill");
            const eyeoff = document.querySelector(".eye-slash-fill");
            const passwordField = document.querySelector("input[type=password]");
            
            eye.addEventListener("click", () => {
                eye.style.display = "none";
                eyeoff.style.display = "block";
                passwordField.type = "text";
            });

            eyeoff.addEventListener("click", () => {
                eyeoff.style.display = "none";
                eye.style.display = "block";
                passwordField.type = "password";
            });
        },
    }
}
</script>