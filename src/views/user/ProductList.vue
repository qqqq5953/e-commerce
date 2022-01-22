<template>
  <Loading :active="isLoading"></Loading>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">圖片</th>
        <th scope="col">商品名稱</th>
        <th scope="col" class="text-end">價格</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <th scope="row" style="width: 200px">
          <div
            style="
              height: 100px;
              background-size: cover;
              background-position: center;
            "
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
          ></div>
        </th>
        <td>
          <router-link :to="{ name: 'UserProducts' }" class="text-dark">{{
            item.title
          }}</router-link>
        </td>
        <td>
          <div class="h5" v-if="!item.price">{{ item.origin_price }}</div>
          <del class="h5" v-if="item.price"
            >原價 {{ item.origin_price }} 元</del
          >
          <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="getProduct(item.id)"
            >
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger position-relative"
              @click="addProductToCart(item.id)"
              :disabled="status.loadingItemsID === item.id"
            >
              <span
                v-if="status.loadingItemsID === item.id"
                class="spinner-border spinner-grow-sm"
              ></span>
              <span>加到購物車</span>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      cart: [],
      status: {
        loadingItemsID: ''
      },
      isLoading: false
    };
  },
  methods: {
    async getProducts() {
      try {
        this.isLoading = true;
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
        const response = await this.$http.get(api);
        this.products = response.data.products;

        console.log('res', response.data);
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    getProduct(id) {
      this.$router.push({ name: 'UserProduct', params: { productID: id } });
      // this.$router.push({ name: 'UserProduct', params: { productID: id } });
    },
    async addProductToCart(id) {
      try {
        this.status.loadingItemsID = id;
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
        const response = await this.$http.post(api, {
          data: { product_id: id, qty: 1 }
        });
        this.status.loadingItemsID = {};
        console.log('response.data', response.data);
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.getProducts();
  }
};
</script>
