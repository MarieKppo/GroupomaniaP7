import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './Routes'
// import router from './router'

import moment from 'moment'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Vue.use(require('vue-moment'));
// modifier le format de la date et heure
Vue.filter('formatDate', function(value) {
  if (value) {
      return moment(String(value)).format('DD/MM/YYYY hh:mm')
  }
});

const router = new VueRouter({
  routes: Routes,
  mode: 'history' // cache le #
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

