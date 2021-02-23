<template lang="html">

  <section>
    <div class="loader">
      <div class="dot" style="--i:0;"></div>
      <div class="dot" style="--i:1;"></div>
      <div class="dot" style="--i:2;"></div>
      <div class="dot" style="--i:3;"></div>
      <div class="dot" style="--i:4;"></div>
      <div class="dot" style="--i:5;"></div>
      <div class="dot" style="--i:6;"></div>
      <div class="dot" style="--i:7;"></div>
      <div class="dot" style="--i:8;"></div>
      <div class="dot" style="--i:9;"></div>
    </div>
    <h2>Loading...</h2>
    <div class="loader">
      <div class="dot" style="--i:0;"></div>
      <div class="dot" style="--i:1;"></div>
      <div class="dot" style="--i:2;"></div>
      <div class="dot" style="--i:3;"></div>
      <div class="dot" style="--i:4;"></div>
      <div class="dot" style="--i:5;"></div>
      <div class="dot" style="--i:6;"></div>
      <div class="dot" style="--i:7;"></div>
      <div class="dot" style="--i:8;"></div>
      <div class="dot" style="--i:9;"></div>
    </div>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'loading',
    props: [],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped>
  section{
    position: relative;
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    animation: changeColor 5s linear infinite;
  }

  @keyframes changeColor {
    0%{
      filter: hue-rotate(0deg);
    }
    100%{
      filter: hue-rotate(300deg);
    }
  }

  section h2{
    color: rgb(0, 0, 0);
    font-weight: 300;
    letter-spacing: 10px;
  }

  section .loader{
    position: relative;
    display: flex;
  }
  section .loader .dot{
    position: relative;
    display: block;
    width: 20px;
    height: 20px;
    background: #00ff0a;
    box-shadow: 0 0 10px #00ff0a,
                0 0 10px #00ff0a,
                0 0 10px #00ff0a,
                0 0 10px #00ff0a,
                0 0 10px #00ff0a,
                0 0 10px #00ff0a,
                0 0 10px #00ff0a;
    margin: 20px 10px;
    transform: scale(0.1);
    border-radius: 50%;
    animation: animateDot 2s linear infinite;
    animation-delay: calc(0.1s * var(--i));
  }

  section .loader:last-child .dot{
    animation-delay: calc(-0.1s * var(--i));
  }

  @keyframes animateDot{
    0%{
      transform: scale(0.1);
    }
    10%{
      transform: scale(1);
    }

    50%,100%{
      transform: scale(0.1);
    }
  }
</style>
