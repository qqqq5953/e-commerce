<template>
  <Loading :active="isLoading"></Loading>
  <div class="text-end mt-3">
    <button type="button" class="btn btn-primary" @click="openModal(true)">
      新增產品
    </button>
  </div>
  <!-- table -->
  <table class="table">
    <thead>
      <tr>
        <th scope="col">分類</th>
        <th scope="col">產品名稱</th>
        <th scope="col">原價</th>
        <th scope="col">售價</th>
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
  <Pagination
    :pages="pagination"
    @change-page="getProducts"
    @previous-page="getProducts"
    @next-page="getProducts"
  ></Pagination>
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
  inject: ['emitter'],
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
    getProducts(page, product, action) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        console.log(res);

        this.isLoading = false;
        if (res.data.success) {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }

        // 畫面刷新 及 換頁時不執行
        if (!product) return;
        if (res.data.success) {
          console.log('傳送成功訊息');

          this.emitter.emit('push-message', {
            style: 'success',
            title: product.title,
            status: `${action}成功`
          });
        } else {
          console.log('接收失敗訊息');

          this.emitter.emit('push-message', {
            style: 'danger',
            title: product.title,
            status: `${action}失敗`,
            content: res.data.message.join('、')
          });
        }
      });
    },
    updateProduct(item) {
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

      // 存進 tempProduct
      this.tempProduct = item;
      console.log('updateProduct', this.tempProduct);

      // API
      this.$http[httpMethod](api, { data: this.tempProduct }).then((res) => {
        this.getProducts(currentPage, item, currentPage ? '更新' : '新增');
        this.editModal.hideModal();
      });
    },
    deleteProduct(item) {
      console.log('deleteProduct', item.id);

      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;

      this.$http.delete(api).then((res) => {
        console.log('delete', res.data);
        this.getProducts(item.current_page, item, '刪除');
        this.deleteModal.hideModal();
      });
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
