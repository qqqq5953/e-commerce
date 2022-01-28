<template>
  <Navbar></Navbar>
  <router-view></router-view>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  created() {
    // console.log('movieID', this.movieID);
  }
};
</script>
