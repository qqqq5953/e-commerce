<template>
  <router-link :to="{ name: 'Login' }">Login</router-link> |
  <router-link :to="{ name: 'UserProducts' }">ProductList</router-link>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
};
</script>
