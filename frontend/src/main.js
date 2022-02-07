import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueRouter from 'vue-router'
import Routes from './Routes'
// import store from './store'

// Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: Routes,
  mode: 'history' // cache le #
})

new Vue({
  // store,
  router,
  render: h => h(App),
}).$mount('#app')

// traitement des dates
// Vue.use(require('vue-moment'));
