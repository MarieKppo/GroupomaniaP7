<template>
  <div id="app" class="main-container">
    <div class="container">
      <!-- <header-top></header-top> -->
      <router-view></router-view>
      <!-- <Login/> -->
    </div>
  </div>
</template>

<script>
// import HeaderTop from './components/HeaderTop/HeaderTop'

export default {
  name: 'App',
  components: {
    // HeaderTop
  }
}
</script>

<style src="./style.css">

</style>
