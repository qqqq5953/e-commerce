<template>
  <!-- <div class="container-fluid"></div> -->
  <router-view></router-view>
</template>

<script>
// import Navbar from '@/components/Navbar.vue';
import sortData from '@/methods/sortData';
import emitter from '@/methods/emitter';

export default {
  components: {
    // Navbar
  },
  provide() {
    return {
      sortData,
      emitter
    };
  },
  created() {
    // console.log('movieID', this.movieID);
  }
};
</script>
