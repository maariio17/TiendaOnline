<template lang="html">

  <section class="carrito">
    <div class="row">
      <div class="col-12">
        <h1>Carrito</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Cantidad</th>
              <th scope="col">SubTotal (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in listaCompra" v-bind:key="producto.id">
              <td>{{producto.nombre}}</td>
              <td>{{producto.precio}}€</td>
              <td><input class="form-control" value="1" type="number" :id="producto.id" min="1" :max="producto.stock" @change="cambiarUnidades"></td>
              <td>{{producto.precioTotal}}€</td>
              <td><button type="button" class="btn btn-danger" v-on:click="eliminarProducto(producto)"><i class="fas fa-trash"></i></button></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Total: {{precioTotal}}€</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row botones">
      <div class="col-12 col-lg-6 bg-primary">
        <router-link to="/"><button class="continuarCompra">Continuar Comprando</button></router-link>
      </div>
      <div class="col-12 col-lg-6">
        <input class="realizarCompra" type="button" value="Realizar Compra" v-on:click="pedidoCompletado">
      </div>
      <notifications group="pedidoCompletado"/>
    </div>
  </section>

</template>

<script lang="js">
import {db} from "../db.js"
import firebase from "../db.js"

  export default  {
    name: 'carrito',
    props: [],
    mounted () {
      firebase.auth.onAuthStateChanged( user => {
        if (user) {
          this.user.loggedIn = true;
          this.user.data = user;
          this.$bind('listaCompra', db.collection('carrito').where("user","==",firebase.auth.currentUser.email))
        }
        else {
          this.user.loggedIn = false;
          this.user.data = {};
          this.$bind('listaCompra', db.collection('carrito').where("user","==",""))
        }
      })
    },
    data () {
      return {
        productos: [],
        listaCompra: [],
        subTotal: 0,
        user: {
          loggedIn: false,
          data: {},
        },
        idProducto: "",
        unidades: 0,
      }
    },
    methods: {
      cambiarUnidades: function(e){
        this.listaCompra.forEach(doc => {
          this.subTotal = parseFloat((doc.precio*e.target.value).toFixed(2))
          console.log("SubTotal: "+typeof(this.subTotal))
          console.log("precioTotal: "+typeof(doc.precioTotal))
          db.collection('carrito').doc(e.target.id).
          update({
            unidades: e.target.value,
            precioTotal: this.subTotal
          })
        });
        
      },
      eliminarProducto: function(productoEliminar){
        db.collection('carrito')
        .doc(productoEliminar.id)
        .delete()
      },
      pedidoCompletado: function(){
        this.$notify({
          group: 'pedidoCompletado',
          title: 'Pedido Completado',
          text: 'El pedido ha sido completado correctamente.'
        });
        this.listaCompra.forEach(doc => {
          this.idProducto = doc.idProducto;
          this.unidades = doc.unidades;
        });
        this.productos.forEach(doc => {
          db.collection('productos').doc(this.idProducto).
          update({
            Stock: doc.Stock - this.unidades,
          })
        });
      }
    },
    computed: {
      precioTotal: function(){
        let suma = 0;
        this.listaCompra.forEach(doc => {
          suma += parseFloat((doc.precioTotal).toFixed(2));
        });
        console.log("Suma: "+typeof(suma))
        return suma;
      },
    },
    firestore: {
      listaCompra: db.collection('carrito').where("user","==", firebase.auth.currentUser ? firebase.auth.currentUser.email: ""),
      productos: db.collection('productos'),
  },
}


</script>

<style scoped lang="scss">
@import "../scss/abstracts/_variables.scss";
@import "../scss/abstracts/_mixins.scss";
  .carrito {
    grid-column: 1 / -1;
    grid-row: 2 / 4;
    font-size: size(xs);
    h1{
      font-size: size(md);
      margin: 0 15px;
    }
    table{
      width: 90vw;
      th{
        width: 1rem;
        font-size: size(xs);
      }
      td{
        width: 1rem;
        text-align: center;
        font-size: size(xs);
        button{
          border-radius: 50%;
          font-size: size(sm);
          text-decoration: none;
          outline: none;
          padding: 5px 10px;
        }
      }
    }
    .botones{
      display: flex;
      justify-content: center;
      .continuarCompra{
        @include botonesCarrito();
        background-color: rgba(color(primary),0.9);
        color: color(secondary);
      }
      .realizarCompra{
        @include botonesCarrito();
        background-color: color(quaternary);
        color: rgba(color(primary),0.9);
      }
    }
  }
</style>
