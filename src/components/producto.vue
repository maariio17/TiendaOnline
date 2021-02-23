<template lang="html">
  <section class="producto">
    <p>{{obtenerProducto(this.$route.params.id)}}</p>
    <div class="containerProducto">
      <div class="fotosProducto">
        <div class="fotoPequeña">
          <img v-bind:src="producto.Imagen1" width="100%" height="100%">
        </div>
        <div class="fotoPequeña">
          <img v-bind:src="producto.Imagen2" width="100%" height="100%">
        </div>
        <div class="fotoPequeña">
          <img v-bind:src="producto.Imagen3" width="100%" height="100%">
        </div>
      </div>
      <div class="fotoProducto">
        <div class="foto">
          <img v-bind:src="producto.Portada" width="100%" height="100%">
        </div>
      </div>
    </div>
    <div class="datosProducto">
      <h3><b>{{producto.Nombre}}</b></h3>
      <p>{{producto.Precio}}</p>
      <p>{{producto.Descripcion}}</p>
      <form class="valoracion">
        <p class="clasificacion">
          <input id="radio1" type="radio" name="estrellas" value="5"><!--
          --><label for="radio1">★</label><!--
          --><input id="radio2" type="radio" name="estrellas" value="4"><!--
           --><label for="radio2">★</label><!--
          --><input id="radio3" type="radio" name="estrellas" value="3"><!--
          --><label for="radio3">★</label><!--
          --><input id="radio4" type="radio" name="estrellas" value="2"><!--
          --><label for="radio4">★</label><!--
          --><input id="radio5" type="radio" name="estrellas" value="1"><!--
          --><label for="radio5">★</label>
        </p>         
      </form>
      <p>Color:</p>
      <div class="colores">
        <div class="color">
          <a href="producto.html"><img v-bind:src="producto.Color1" width="100%" height="100%"></a>
        </div>
        <div class="color">
          <a href="producto.html"><img v-bind:src="producto.Color2" width="100%" height="100%"></a>
        </div>
      </div>
      <div class="tallas">
        <select class="talla" name="talla">
          <option value="none">Elige tu talla</option>
          <option value="XXS">39</option>
          <option value="XS">40</option>
          <option value="S">41</option>
          <option value="M">42</option>
          <option value="L">43</option>
          <option value="XL">44</option>
          <option value="XXL">45</option>
        </select>
      </div>
      <!--<router-link v-bind:to="'/carrito/'"><button v-on:click="agregarProducto">Añadir al Carrito</button></router-link>-->
      <button v-on:click="agregarProducto">Añadir al Carrito</button>
      <notifications group="Compra"/>
      
      <div class="devolucion">
        <i class="fas fa-dolly-flatbed"></i><br>
        <p><b>Entrega en 6-9 días laborables</b></p>
        <p>Envío estándar: Gratuito</p>
        <p><i class="fas fa-box-open"></i> derecho de devolución 60 días</p>
      </div>
    </div>
  </section>

</template>

<script lang="js">
//:id="producto.id" min="1" :max="producto.Stock" v-model="producto.Unidades" @change="cambiarUnidades(e)"
import {db} from "../db.js"
import firebase from "../db.js"

  export default  {
    name: 'producto',
    props: [],
    mounted () {
      firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
        }
      })
    },
    data () {
      return {
        producto: [],
        productos: [],
        idProducto: this.$route.params.id,
        user: {
          loggedIn: false,
          data: {},
        }
      }
    },
    methods: {
      obtenerProducto: function(id){
        db.collection('productos').doc(id).get().then( response => {
          if (response.exists) {
            this.producto = response.data();
          } else {
            console.log("No such document!");
          }
        });
      },
      agregarProducto: function(){
        if(!this.user.loggedIn){
          this.$notify({
            group: 'Compra',
            title: 'Error Compra Producto',
            text: 'Debe loguearse para poder comprar',
            type: 'warn',
          });
        } else{
          db.collection("carrito").where("idProducto", "==", this.idProducto)
          .get()
          .then((querySnapshot) => {
            this.$notify({
              group: 'Compra',
              title: 'Producto Añadido',
              text: 'Producto añadido al carrito',
              type: 'success',
            });
            
            if(querySnapshot.empty){
              db.collection('carrito').add({
                idProducto: this.idProducto,
                nombre:this.producto.Nombre,
                stock:this.producto.Stock,
                unidades:1,
                precio:this.producto.Precio, 
                precioTotal:this.producto.Precio,
                user: this.user.data.email,
              })
            }else {
              querySnapshot.forEach((doc) => {
              if(doc.data().unidades<this.producto.Stock){
                let unidadesTotales= doc.data().unidades+1;
                let total= unidadesTotales * doc.data().Precio;

                db.collection('carrito').doc(doc.id).update({
                  unidades: unidadesTotales,
                  precioTotal: total
                })
              }
              });
            }
          });
        }
      }
    },
    computed: {
      authenticated(){
          return this.user.loggedIn
      },
    },
    firestore: {
      productos: db.collection('productos'),
  },
}


</script>

<style scoped lang="scss">
@import "../scss/abstracts/_variables.scss";
@import "../scss/abstracts/_mixins.scss";
  section {
    grid-column: 1 / -1;
    grid-row: 2 / 4;

    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(1, min-content);
    grid-gap: 2rem;

    .containerProducto{
      grid-column: 1 / 7;
      grid-row: 1 / 2;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      @include response(lg){
        flex-wrap: nowrap;
      }
      @include response(xl){
        flex-wrap: nowrap;
      }

      .foto{
        border: 1px solid black;
        background: white;
        width: auto;
        width: 60vw;
        /*max-width: 800px;*/
        height: 500px;
        min-height: 500px;
        @include response(lg){
          max-width: 450px;
          margin-left: 5rem;
          height: 700px;
        }
        @include response(xl){
          max-width: 800px;
          width: 40vw;
        }
        img{
          display: block;
          object-fit: contain;
        }
      }

      .fotoPequeña{
        margin: 10px;
        height: 150px;
        min-height: 150px;
        max-width: 150px;
        min-width: 100px;
        border: 1px solid black;
        @include response(lg){
          height: 200px;
          width: 150px;
        }
        img{
          display: block;
          object-fit: cover;
        }
      }
    }

    .datosProducto{
      grid-column: 1 / -1;
      grid-row: 2 / 3;
      margin-left: 5vh;
      margin-bottom: 3rem;
      @include response(sm){
        grid-row: 2 / 3;
      }
      @include response(lg){
        margin-left: 5vh;
        grid-row: 2 / 3;
        grid-column: 1 / -1;
      }
      @include response(xl){
        grid-column: 7 / -1;
        grid-row: 1 / 2;
      }

      .descuento, .oferta{
        color: red;
      }

      p s{
        color: color(primary);
      }

      .valoracion{
        width: min-content;
        p{
          text-align: center;
          font-size: size(xs);
        }
        input[type="radio"]{
          display: none;
        }

        label{
          &:hover{
            color: color(quaternary);
          }
        }
      }
      .colores{
        display: flex;

        .color{
          border: 1px solid black;
          height: 150px;
          width: 120px;
          margin: 10px;

          img{
            object-fit: cover;
            background: white;
          }
        }
      }

      .talla{
        border: 1px solid black;
        width: 350px;
        height: 40px;
        margin-bottom: 10px;
      }

      button{
        background: rgba(color(tertiary), 0.2);
        width: 350px;
        height: 40px;
        border: 1px solid black;
      }

      .devolucion{
        border: 1px solid black;
        margin-top: 10px;
        padding: 10px;
        width: fit-content;
      }
    }
  }

  .valoracion label:hover ~ label {
    color: color(quaternary);
  }

  .valoracion input[type="radio"]:checked ~ label {
    color: color(quaternary);
  }
</style>
