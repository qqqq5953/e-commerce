<template>
  <Loading :active="isLoading"></Loading>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" colspan="2" class="text-center">品名</th>
        <th scope="col">數量</th>
        <th scope="col" class="text-end">單價</th>
        <th scope="col" class="text-end">總共</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in cart" :key="item.id">
        <th scope="row">
          <button
            @click.prevent="deleteProduct(item)"
            type="button"
            class="btn btn-outline-danger"
          >
            <i class="bi bi-x"></i>
          </button>
        </th>
        <td>{{ item.product.title }}</td>
        <td>
          <div class="input-group mb-3">
            <div class="input-group">
              <input
                type="number"
                class="form-control"
                aria-label="number"
                v-model.number="item.qty"
                min="1"
                @change="updateProductTotal(item)"
              />
              <!-- :disabled="status.loadingItemsID === item.id" -->
              <span class="input-group-text">/ {{ item.product.unit }}</span>
            </div>
          </div>
        </td>
        <td class="text-end">{{ item.product.price }}</td>
        <td class="text-end">{{ item.total }}</td>
      </tr>
    </tbody>
    <tfoot>
      <th colspan="3"></th>
      <td class="text-end">總計</td>
      <td class="text-end">{{ totalAmount }}</td>
    </tfoot>
  </table>
  <!-- 優惠券 -->
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="請輸入優惠碼"
      aria-label="Recipient's username"
      aria-describedby="button-addon2"
    />
    <button class="btn btn-outline-secondary" type="button" id="button-addon2">
      套用優惠碼
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      status: {
        loadingItemsID: ''
      },
      isLoading: false
    };
  },
  computed: {
    totalAmount() {
      const total = this.cart.reduce((total, item) => {
        return total + item.total;
      }, 0);
      return total;
    }
  },
  methods: {
    async updateProductTotal(item) {
      try {
        // this.status.loadingItemsID = item.id;
        // this.isLoading = true;

        const cart = {
          product_id: item.product_id,
          qty: item.qty
        };
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
        const response = await this.$http.put(api, { data: cart });
        this.getCartProduct();

        // this.status.loadingItemsID = '';
        // this.isLoading = false;
        console.log('updateProductTotal', response.data);
      } catch (err) {
        console.log(err);
      }
    },
    async getCartProduct() {
      try {
        this.isLoading = true;

        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
        const response = await this.$http.get(api);
        this.cart = response.data.data.carts;

        this.isLoading = false;
        console.log('getCartProduct', response.data.data.carts);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteProduct(item) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const response = await this.$http.delete(api);
      this.getCartProduct();
      console.log('deleteProduct', response);
    }
  },
  created() {
    this.getCartProduct();
  }
};
</script>
