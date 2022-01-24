<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">購買時間</th>
        <th scope="col">Email</th>
        <th scope="col">購買品項</th>
        <th scope="col" class="text-end">應付金額</th>
        <th scope="col">是否付款</th>
        <th scope="col">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <th scope="row">{{ $filters.date(order.paid_date) }}</th>
        <td>{{ order.user.email }}</td>
        <td>
          <div v-for="item in order.products" :key="item.id">
            {{ item.product.title }}
          </div>
        </td>
        <td class="text-end">{{ order.total }}</td>
        <td>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              :checked="order.is_paid"
              :disabled="!order.is_paid"
              ref="finishPayment"
              @click="onCheckedPayment"
            />
            <label
              class="form-check-label"
              for="flexSwitchCheckChecked"
              v-if="isPaid"
              >已付款</label
            >
            <label class="form-check-label" for="flexSwitchCheckChecked" v-else
              >未付款</label
            >
          </div>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-outline-primary">檢視</button>
            <button type="button" class="btn btn-outline-danger">刪除</button>
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
      isPaid: true,
      isLoading: false,
      orders: [],
      pagination: {}
    };
  },
  methods: {
    onCheckedPayment() {
      this.isPaid = this.$refs.finishPayment.checked;
    },
    getOrders() {
      try {
      } catch (err) {
        console.log(err);
      }
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders`;
      this.$http.get(api).then((res) => {
        console.log('res', res);
        this.orders = res.data.orders;
        this.pagination = res.data.pagination;
      });
    }
  },
  created() {
    this.getOrders();
  }
};
</script>
