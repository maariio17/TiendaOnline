<template lang="html">
  <section>
    <div class="slideshow">
      <div class="slideshow-slide" v-for="novedad in novedades" v-bind:key="novedad.id">
        <div class="slideshow-content">
          <h2>{{novedad.Nombre}}</h2>
          <div class="precio">
            <p class="precioReal">{{novedad.Precio}}€</p>
            <p class="precioOferta">{{novedad.PrecioOferta}}€</p>
          </div>
        </div>
        <img v-bind:src="novedad.Imagen">
      </div>
    </div>
    <section class="products">
      <div class="productos">
        <div class="card" v-for="producto in productos" v-bind:key="producto.id">
          <div class="imgBx">
            <img v-bind:src="producto.Portada">
            <h2>{{productos.Nombre}}</h2>
          </div>
          <div class="content">
            <div class="price">
              <h3>Precio: </h3>
                <span>{{producto.Precio}}€</span>
                <span>{{stockDisponible(producto.Stock)}}</span>
            </div>
            <router-link v-bind:to="'/producto/'+producto.id"><button v-bind:disabled="botonDeshabilitado(producto.Stock)">Buy Now</button></router-link>
          </div>
        </div>
      </div>
    </section>
  </section>

</template>

<script lang="js">
import {db} from "../db.js"
import firebase from "../db.js"
  export default  {
    name: 'main',
    props: [],
    mounted () {

    },
    data () {
      return {
        productos: [],
        listaCompra: [],
        novedades: [],
        disponible: "Disponible",
        pocasUnidades: "Pocas Unidades",
        noDisponible: "No Disponible"
      }
    },
    methods: {
      stockDisponible: function(stock){
        if(stock > 10){
          return this.disponible;
        } else if(stock >=1 && stock <=10){
          return this.pocasUnidades;
        } else{
          return this.noDisponible;
        }
      },
      botonDeshabilitado: function(stock){
        if (stock > 1){
          return false;
        } else{
          return true;
        }
      }
    },
    computed: {

    },
    firestore: {
      listaCompra: db.collection('carrito').where("user","==", firebase.auth.currentUser ? firebase.auth.currentUser.email: ""),
      productos: db.collection('productos'),
      novedades: db.collection('novedades')
    }
}


</script>

<style scoped lang="scss">
@import "../scss/abstracts/_variables.scss";
@import "../scss/abstracts/_mixins.scss";
section{
  grid-column: 1 / -1;
  grid-row: 2 / 4;

  display: grid;
  grid-template-columns: minmax(1fr, min-content) repeat(10, 1fr);
  grid-template-rows: repeat(2, min-content);
  grid-gap: 2rem;
}
.slideshow{
  /* posicionar nuestros slides en grid container*/
  grid-column: 1 /-1;
  grid-row: 2 / 3;
  position: relative;
  width: 100%;
  height: 70vh;

  /*colocar cada slide*/
  &-slide{
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    animation: slideshow 20s linear infinite;
    img{
      width: inherit;
      height: inherit;
      object-fit: cover;
    }
  }
  &-content{
    background-color: rgba(color(secondary), 0.9);
    position: absolute;
    bottom: 1rem;
    left: 6rem;
    max-width: 40rem;
    padding: 2rem;
    @include response(lg){
      padding: 2rem;
    }

    h2{
      font-size: size(sm);
    }
    p{
      margin: 2rem 0;
      font-size: size(xs);
    }
  }
  .precio{
    display: flex;

    .precioReal{
      text-decoration: line-through;
      margin: 10px;
    }
    .precioOferta{
      margin: 10px;
      color: red;
    }
  }
}

/*si uso lista*/
$animlist:1 0s, 2 4s, 3 8s, 4 12s;

@each $item in $animlist{
  .slideshow-slide:nth-child(#{nth($item, 1)}){
    animation-delay: nth($item , 2 );
  }
}

@keyframes slideshow{
  0%{
    visibility: hidden;
    opacity: 0;
  }
  2%{
    visibility: visible;
    opacity: 1;
  }
  18%{
    visibility: visible;
    opacity: 1;
  }
  20%{
    visibility: hidden;
    opacity: 0;
  }
  100%{
    visibility: hidden;
    opacity: 0;
  }
}

.products {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
    display: flex;
    justify-content: center;
    min-height: min-content;
    background: rgba(color(primary), 0.3);
    overflow: hidden;
    box-sizing: border-box;

    .productos{
      position: relative;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .card{
        position: relative;
        width: 350px;
        height: 400px;
        margin: 20px 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: rgba(color(primary), 0.05);
        box-shadow: 0 10px 25px rgba(color(primary), 0.05);
        backdrop-filter: blur(15px);
        &:hover{
          .imgBx{
            img{
              transform: translate(-20px, -40px) rotate(-25deg) scale(1.4);
            }
          }
        }

        .imgBx{
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 20px;
          transition: 0.5s ease-in-out;
          text-align: center;
          img{
            max-width: 100%;
            margin: 0 0 20px;
            transition: 0.5s ease-in-out;
          }
          h2{
            color: color(secondary);
          }
        }

        .content{
          position: absolute;
          bottom: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transition: 0.5s ease-in-out;

          .price{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 20px;
            h3{
                color: color(secondary);
                font-weight: 300;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-right: 10px;
            }
            span{
              width: min-content;
              height: min-content;
              padding: 2px;
              text-align: center;
              line-height: 24px;
              display: inline-block;
              color: color(primary);
              background: color(secondary);
              border-radius: 4px;
              font-size: size(xs);
              margin: 0 5px;
              margin-right: 10px;
              font-weight: 500;
              transition: 0.5s;
              cursor: pointer;
              &:hover{
                background: color(quaternary);
              }
            }
          }
          a{
            position: relative;
            top: 10px;
            padding: 12px 30px;
            border-radius: 40px;
            font-weight: 600;
            letter-spacing: 1px;
            text-decoration: none;
            text-transform: uppercase;
            button{
              padding: 0.6rem 1rem;
              border: 1px solid color(quaternary);
              border-radius: 4px;
              background-color: color(quaternary);
              color: color(tertiary);

              font-size: 1.5rem;
              text-shadow: 0 -1px 0 rgba(color(primary), 0.5);
              box-shadow: 0 1px 0 rgba(color(primary), 0.5) inset,
                0 1px 3px rgba(color(primary), 0.5);
              background-color: color(quaternary);
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
