<template>movie</template>

<script>
export default {
  props: {
    name: {
      type: String
    }
  },
  created() {
    console.log('name', this.name);
  }
};
</script>
