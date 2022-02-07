<template>
  <Loading :active="isLoading"></Loading>
  <table class="table d-none">
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
            <!-- <button
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
            </button> -->
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
  <div class="container py-5">
    <ul class="row list-unstyled">
      <li class="col-9 mb-4" v-for="item in products" :key="item.id">
        <a
          href="#"
          class="text-decoration-none d-block"
          @click.prevent="getProduct(item.id)"
        >
          <div class="card mb-3 border-dark" style="height: 250px">
            <div class="row g-0 h-100">
              <div class="col-3 h-100">
                <div class="h-100">
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    class="card-img-top img-fluid d-block h-100"
                    style="object-fit: cover"
                    :alt="item.title"
                  />
                </div>
              </div>
              <div class="col-9">
                <div class="card-body h-100 d-flex flex-column">
                  <!-- title -->
                  <div class="d-flex align-items-center">
                    <h3 class="card-title mb-1">
                      {{ item.title }}
                    </h3>
                    <small class="ms-auto text-dark flex-shrink-0"
                      >popularity:
                      <span class="fs-5">{{
                        parseFloat(item.content.split('|')[1]).toFixed(0)
                      }}</span></small
                    >
                  </div>

                  <!-- overview -->
                  <div class="card-text">
                    <small class="text-dark">{{
                      item.content.split('|')[2]
                    }}</small>

                    <p class="mt-3">{{ item.description }}</p>
                  </div>

                  <!-- see more -->
                  <div class="text-end mt-auto px-2">
                    <span> &#171; see more &#187;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    Pagination
  },
  data() {
    return {
      products: [],
      cart: [],
      status: {
        loadingItemsID: ''
      },
      isLoading: false,
      baseImageUrl: 'https://image.tmdb.org/t/p/w200',
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      pagination: {}
    };
  },
  methods: {
    async getProducts(page = 1) {
      // this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      const response = await this.$http.get(api).catch((err) => {
        console.log(err);
      });
      this.products = response.data.products;
      this.pagination = response.data.pagination;

      console.log('res', response.data);
      // this.isLoading = false;
    },
    getProduct(id) {
      this.$router.push({ name: 'UserProduct', params: { productID: id } });
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

<style lang="scss" scoped>
ul a:hover {
  .card {
    background-color: #343a40;
    background-color: #55595c;
    color: #fff;
  }

  & small {
    color: #fff !important;
  }
}

img {
  // height: 500px;
  object-fit: cover;
  object-position: top center;
}

.card-text p {
  display: -webkit-box;
  // max-width: 90%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
