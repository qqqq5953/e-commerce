<template>
  <Loading :active="isLoading"></Loading>

  <div class="text-end">
    <button
      type="button"
      class="btn btn-primary"
      @click="openCouponEditModal(true)"
    >
      新增優惠券
    </button>
  </div>
  <Pagination
    :pages="pagination"
    @change-page="getCoupons"
    @previous-page="getCoupons"
    @next-page="getCoupons"
  ></Pagination>
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
              @click="openCouponEditModal(false, item, pagination)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="openCouponDeleteModal(item, pagination)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <CouponEditModal
    ref="couponEditModal"
    :coupon="tempCoupon"
    @update-coupon="updateCoupons"
  ></CouponEditModal>
  <CouponDeleteModal
    ref="couponDeleteModal"
    :coupon="tempDeleteCoupon"
    @delete-coupon="deleteCoupon"
  ></CouponDeleteModal>
</template>

<script>
import CouponEditModal from '@/components/CouponEditModal.vue';
import CouponDeleteModal from '@/components/CouponDeleteModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    CouponEditModal,
    CouponDeleteModal,
    Pagination
  },
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      tempDeleteCoupon: {},
      isNew: false,
      isLoading: false
    };
  },
  methods: {
    openCouponDeleteModal(item, pagination) {
      this.tempDeleteCoupon = { ...item, ...pagination };
      this.$refs.couponDeleteModal.showModal();
    },
    async deleteCoupon(coupon) {
      console.log('deleteCoupon coupon', coupon);
      try {
        const currentPage = coupon.current_page;
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
        const response = await this.$http.delete(api);
        this.getCoupons(currentPage);
        console.log('deleteCoupon', response);
      } catch (err) {
        console.log(err);
      }
      this.$refs.couponDeleteModal.hideModal();
    },
    openCouponEditModal(isNew, item, pagination) {
      // 新增
      if (isNew) this.tempCoupon = {};

      // 編輯
      if (!isNew) {
        // 將日期轉換為YYYY-MM-DD
        const coupon = { ...item };
        const localDate = this.$filters.date(coupon.due_date);
        coupon.due_date = this.$filters.formatDate(localDate);
        this.tempCoupon = { ...coupon, ...pagination };
      }

      this.$refs.couponEditModal.showModal();
      this.isNew = isNew;
    },
    async updateCoupons(coupon) {
      console.log('updateCoupons coupon', coupon);
      try {
        // 新增
        let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
        let httpMethod = 'post';

        // 編輯
        let currentPage;
        if (!this.isNew) {
          api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
          httpMethod = 'put';

          currentPage = coupon.current_page;
        }

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

        this.getCoupons(currentPage);

        console.log('updateCoupons res', response);
      } catch (err) {
        console.log(err);
      }
      this.$refs.couponEditModal.hideModal();
    },
    async getCoupons(page) {
      try {
        this.isLoading = true;

        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
        const response = await this.$http.get(api);
        this.coupons = response.data.coupons;
        this.pagination = response.data.pagination;

        this.isLoading = false;
        console.log('getCoupons', response.data);
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
