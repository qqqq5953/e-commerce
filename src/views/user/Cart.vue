<template>
  <Loading :active="isLoading"></Loading>
  <div class="table-responsive">
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
              class="btn btn-outline-danger px-2 py-1"
            >
              <i class="bi bi-x"></i>
            </button>
          </th>
          <td>
            <div>{{ item.product.title }}</div>
            <span v-if="isCouponUsed" class="text-success">已套用優惠券</span>
          </td>
          <td class="w-25">
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
          </td>
          <td class="text-end">{{ item.product.price }}</td>
          <td class="text-end">
            <div v-if="!isCouponUsed">原價：{{ item.total }}</div>
            <div v-if="isCouponUsed">
              <del>原價：{{ item.total }}</del>
              <div class="text-success">
                折扣價： {{ item.final_total.toFixed() }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <th colspan="3"></th>
        <td class="text-end">
          <div>總計</div>
          <div v-if="isCouponUsed" class="text-success">折扣價</div>
        </td>
        <td class="text-end">
          <div v-if="!isCouponUsed">{{ totalAmount.total }}</div>
          <del v-if="isCouponUsed">{{ totalAmount.total }}</del>
          <div v-if="isCouponUsed" class="text-success">
            {{ totalAmount.finalTotal.toFixed() || 0 }}
          </div>
        </td>
      </tfoot>
    </table>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
          <th scope="col">Heading</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 優惠券 -->
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="請輸入優惠碼"
      v-model="couponCode"
      aria-label="input coupon"
      aria-describedby="button-addon2"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="useCoupon"
      id="button-addon2"
    >
      套用優惠碼
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      discountTotal: '',
      couponCode: 'fifty',
      status: {
        loadingItemsID: ''
      },
      isLoading: false,
      isCouponUsed: false
    };
  },
  computed: {
    totalAmount() {
      const total = this.cart.reduce((total, item) => {
        return total + item.total;
      }, 0);
      const finalTotal = this.cart.reduce((total, item) => {
        return total + item.final_total;
      }, 0);
      return { total, finalTotal };
    }
  },
  methods: {
    async useCoupon() {
      try {
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
        const coupon = {
          code: this.couponCode
        };
        const response = await this.$http.post(api, { data: coupon });
        console.log('useCoupon', response);

        await this.getCartProduct();
        this.isCouponUsed = response.data.success;
        this.discountTotal = response.data.data.final_total;
      } catch (err) {
        console.log(err);
      }
    },
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
        console.log('cart', this.cart);
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
    const x = 3.5999999999999996;
    console.log('rounded', x.toFixed());
  }
};
</script>
