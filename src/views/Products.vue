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
      <tr :data-num="i" v-for="(item, i) in products" :key="item.id">
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
      isLoading: false,
      // ref
      editModal: {},
      deleteModal: {}
    };
  },
  methods: {
    async getProducts(page) {
      try {
        this.isLoading = true;

        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
        const response = await this.$http.get(api);
        console.log('getProducts', response);

        this.products = response.data.products;
        this.pagination = response.data.pagination;

        this.isLoading = false;
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

      // item 存進 tempProduct
      this.tempProduct = item;

      try {
        const response = await this.$http[httpMethod](api, {
          data: this.tempProduct
        });
        await this.getProducts(currentPage);

        this.editModal.hideModal();
        this.pushMessageState(response, item, currentPage ? '更新' : '新增');
      } catch (err) {
        console.log(err);
      }
    },
    async deleteProduct(item) {
      try {
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        const response = await this.$http.delete(api);
        await this.getProducts(item.current_page);

        this.deleteModal.hideModal();
        this.pushMessageState(response, item, '刪除');
      } catch (err) {
        console.log(err);
      }
    },
    openModal(isNew, item, pagination) {
      if (isNew) this.tempProduct = {};
      this.tempProduct = { ...item, pagination };
      this.isNew = isNew;
      this.editModal.showModal();
    },
    openDeleteModal(item, pagination) {
      this.tempDeleteProduct = { ...item, ...pagination };
      this.deleteModal.showModal();
    }
  },
  created() {
    this.getProducts();
  },
  mounted() {
    this.editModal = this.$refs.editModal;
    this.deleteModal = this.$refs.deleteModal;
  }
};
</script>
