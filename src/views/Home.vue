<template>
  <Navbar></Navbar>
  <router-view></router-view>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import sortData from '@/methods/sortData';

export default {
  components: {
    Navbar
  },
  provide() {
    return {
      sortData
    };
  },
  created() {
    // console.log('movieID', this.movieID);
  }
};
</script>
