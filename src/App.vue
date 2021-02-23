<template>
  <div id="app">
    <div v-if="productos" class="contenedor">
      <Cabecera/>
      <router-view></router-view>
      <Pie/>
    </div>
    <div v-if="!productos" class="loading">
      <Loading/>
    </div>
  </div>
</template>

<script>
import Cabecera from './components/cabecera.vue'
import Pie from './components/pie.vue'
import Loading from './components/loading.vue'

import {db} from "./db.js"

export default {
  name: 'App',
  components: {
    Cabecera, 
    Pie,
    Loading
  },
  data() {
    return {
      productos: null
    }
  },
  firestore: {
    productos: db.collection('productos'),
  },
}
</script>

<style scoped lang="scss">
@import "./scss/main.scss";
* {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
}

html {
     /*10/16=0.625
    redimensionable. Raíz es ahora 10px*/
    font-size: 62.5%;
    @include response(md){
        font-size: 56.25%;
    }

    @include response (sm){
        font-size: 50%;
    }
}

#app{
   display: grid;
   grid-template-columns: minmax(6rem, 1fr) repeat(8, minmax(min-content, 16rem)) minmax(6rem, 1fr);
   grid-template-rows: repeat(4, min-content);
   grid-row-gap: 1.5rem;
   background-color: color(tertiary);

   .contenedor{
     grid-column: 1 / -1;
     grid-row: 1 / 5;
   }
   .loading{
     grid-column: 1 / -1;
     grid-row: 1 / 5;
     background: white;
   }
}
</style>
