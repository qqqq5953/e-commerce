<template>
  <Loading :active="isLoading"></Loading>
  <div class="text-end mt-3">
    <button type="button" class="btn btn-primary" @click="openModal(true)">
      新增產品
    </button>
  </div>
  <Pagination
    :pages="pagination"
    @change-page="getProducts"
    @previous-page="getProducts"
    @next-page="getProducts"
  ></Pagination>
  <!-- table -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">分類</th>
        <th scope="col">產品名稱</th>
        <th scope="col" class="text-end">原價</th>
        <th scope="col" class="text-end">售價</th>
        <th scope="col">是否啟用</th>
        <th scope="col">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <th scope="row">{{ item.category }}</th>
        <td>{{ item.title }}</td>
        <td class="text-end">{{ $filters.currency(item.origin_price) }}</td>
        <td class="text-end">{{ $filters.currency(item.price) }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openModal(false, item, pagination)"
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
  <!-- <Pagination
    :pages="pagination"
    @change-page="getProducts"
    @previous-page="getProducts"
    @next-page="getProducts"
  ></Pagination> -->
  <EditModal
    ref="editModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></EditModal>
  <DeleteModal
    :product="tempDeleteProduct"
    @delete-product="deleteProduct"
    ref="deleteModal"
  ></DeleteModal>
</template>

<script>
import EditModal from '@/components/EditModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import Pagination from '@/components/Pagination.vue';
export default {
  components: {
    EditModal,
    DeleteModal,
    Pagination
  },
  inject: ['emitter', 'pushMessageState'],
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      tempDeleteProduct: {},
      isNew: false,
      isLoading: false
      // ref
      // editModal: {},
      // deleteModal: {}
    };
  },
  methods: {
    async getProducts(page) {
      try {
        this.isLoading = true;

        // axios
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
        const response = await this.$http.get(api);

        // 儲存回傳資料
        this.products = response.data.products;
        this.pagination = response.data.pagination;

        this.isLoading = false;
        console.log('getProducts', response);
      } catch (err) {
        console.log(err);
      }
    },
    async updateProduct(item) {
      // 新增
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      // 編輯
      let currentPage;
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';

        // 存取當前頁面
        currentPage = item.pagination.current_page;
      }

      // 刪除 pagination 這個 key
      delete item.pagination;

      // item 存進 tempProduct（API參數）
      this.tempProduct = item;

      try {
        // axios
        const response = await this.$http[httpMethod](api, {
          data: this.tempProduct
        });

        // 重新渲染畫面
        await this.getProducts(currentPage);

        // 關閉modal
        this.$refs.editModal.hideModal();

        // toast
        this.pushMessageState(response, item, currentPage ? '更新' : '新增');
      } catch (err) {
        console.log(err);
      }
    },
    async deleteProduct(item) {
      try {
        // axios
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        const response = await this.$http.delete(api);

        // 重新渲染畫面
        await this.getProducts(item.current_page);

        // 關閉modal
        this.$refs.deleteModal.hideModal();

        // toast
        this.pushMessageState(response, item, '刪除');
      } catch (err) {
        console.log(err);
      }
    },
    openModal(isNew, item, pagination) {
      // 新增
      if (isNew) this.tempProduct = {};

      // 編輯
      this.tempProduct = { ...item, pagination };

      // 打開 modal
      this.$refs.editModal.showModal();

      // 儲存modal狀態
      this.isNew = isNew;
    },
    openDeleteModal(item, pagination) {
      this.tempDeleteProduct = { ...item, ...pagination };
      this.$refs.deleteModal.showModal();
    }
  },
  created() {
    this.getProducts();
  },
  mounted() {
    // this.editModal = this.$refs.editModal;
    // this.deleteModal = this.$refs.deleteModal;
  }
};
</script>
