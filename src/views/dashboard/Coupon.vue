<template>
  <Loading :active="isLoading"></Loading>

  <div class="text-end">
    <button
      type="button"
      class="btn btn-primary"
      @click="openCouponModal(true)"
    >
      新增優惠券
    </button>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">名稱</th>
        <th scope="col">代碼</th>
        <th scope="col" class="text-end">折扣百分比</th>
        <th scope="col">到期日</th>
        <th scope="col">是否套用</th>
        <th scope="col">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in coupons" :key="item.id">
        <th scope="row">{{ item.title }}</th>
        <td>{{ item.code }}</td>
        <td class="text-end">{{ item.percent }} %</td>
        <td>{{ $filters.date(item.due_date) }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openCouponModal(false, item, pagination)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="openDeleteModal(item, pagination)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <CouponModal
    ref="couponModal"
    :coupon="tempCoupon"
    @update-coupon="updateCoupons"
  ></CouponModal>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';

export default {
  components: {
    CouponModal
  },
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      isNew: false,
      isLoading: false
    };
  },
  methods: {
    openCouponModal(isNew, item, pagination) {
      if (isNew) this.tempCoupon = {};
      this.$refs.couponModal.showModal();

      // 將日期轉換為YYYY-MM-DD
      const coupon = { ...item };
      const localDate = this.$filters.date(coupon.due_date);
      coupon.due_date = this.$filters.formatDate(localDate);

      this.tempCoupon = { ...coupon, pagination };
      this.isNew = isNew;
    },
    async updateCoupons(coupon) {
      console.log('updateCoupons coupon', coupon);
      try {
        // 新增
        let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
        let httpMethod = 'post';

        // 編輯
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
        httpMethod = 'put';

        const couponDetail = {
          title: coupon.title,
          code: coupon.code,
          percent: coupon.percent,
          due_date: this.$filters.toUnixTimeStamp(coupon.due_date),
          is_enabled: coupon.is_enabled
        };

        const response = await this.$http[httpMethod](api, {
          data: couponDetail
        });

        this.getCoupons();

        console.log('updateCoupons res', response);
      } catch (err) {
        console.log(err);
      }
      this.$refs.couponModal.hideModal();
    },
    async getCoupons() {
      try {
        this.isLoading = true;

        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons`;
        const response = await this.$http.get(api);
        this.coupons = response.data.coupons;

        this.isLoading = false;
        console.log('response.data', response.data);
      } catch (err) {
        console.log(err);
      }
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>
