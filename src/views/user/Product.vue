<template>USERPRODUCT</template>

<script>
export default {
  props: {
    productID: {
      type: String
    }
  },
  created() {
    console.log('productID', this.productID);
  }
};
</script>
