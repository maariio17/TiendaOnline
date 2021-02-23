import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire'
import VueRouter from 'vue-router'
import Notifications from 'vue-notification'
import { BootstrapVue } from 'bootstrap-vue'
 
Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(firestorePlugin)


Vue.config.productionTip = false

import producto from './components/producto.vue'
import main from './components/main.vue'
import login from './components/login.vue'
import carrito from './components/carrito.vue'
import firebase from "./db.js"
Vue.component(producto)

const routes = [
  { path: '/', component: main },
  { path: '/producto/:id', component: producto },
  { path: '/login', component: login },
  { path: '/carrito', component: carrito }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(ruta => ruta.meta.requiresAuth)){
    const user = firebase.auth().currentUser;
    if (user) {
      next()
    }else{
       next({
         name: 'login'
       })
     }
    }else{
      next();
    }
 })

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
