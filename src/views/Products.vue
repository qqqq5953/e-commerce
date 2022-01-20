<template>
  <Loading :active="isLoading"></Loading>
  <div class="text-end">
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
      <tr v-for="item in products" :key="item.id">
        <th scope="row">{{ item.category }}</th>
        <td>{{ item.title }}</td>
        <td>{{ item.origin_price }}</td>
        <td>{{ item.price }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openModal(false, item)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="openDeleteModal(item)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <EditModal
    ref="editModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></EditModal>
  <DeleteModal
    :product="tempProduct"
    @delete-product="deleteProduct"
    ref="deleteModal"
  ></DeleteModal>
</template>

<script>
import EditModal from '@/components/EditModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
export default {
  components: {
    EditModal,
    DeleteModal
  },
  inject: ['emitter'],
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
      // ref
      editModal: {},
      deleteModal: {}
    };
  },
  methods: {
    updateProduct(item) {
      this.tempProduct = item;

      // 新增
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';
      }

      this.$http[httpMethod](api, { data: this.tempProduct }).then((res) => {
        this.getProducts(item, '更新');
        this.editModal.hideModal();
      });
    },
    deleteProduct(item) {
      console.log('deleteProduct', item.id);

      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;

      this.$http.delete(api).then((res) => {
        console.log('delete', res.data);
        this.getProducts(item, '刪除');
        this.deleteModal.hideModal();
      });
    },
    openModal(isNew, item) {
      if (isNew) this.tempProduct = {};
      this.tempProduct = { ...item };
      this.isNew = isNew;
      this.editModal.showModal();
    },
    openDeleteModal(item) {
      this.tempProduct = { ...item };
      this.deleteModal.showModal();
    },
    getProducts(product, action) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        console.log(res);

        this.isLoading = false;
        if (res.data.success) {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }

        // 畫面刷新時不執行
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
    }
  },
  created() {
    this.getProducts();
  },
  mounted() {
    this.editModal = this.$refs.editModal;
    this.deleteModal = this.$refs.deleteModal;
    // console.log('this.editModal', this.editModal);
    // console.log('this.deleteModal', this.deleteModal);
  }
};
</script>
