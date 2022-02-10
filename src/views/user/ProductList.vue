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
              @click="getProductDetails(item.id)"
            >
              查看更多
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="bg-light">
    <div class="container py-5">
      <Pagination
        :pages="pagination"
        @change-page="getProducts"
        @previous-page="getProducts"
        @next-page="getProducts"
      ></Pagination>
      <div class="row justify-content-center">
        <div class="col-8">
          <ul class="list-unstyled">
            <li class="mb-5" v-for="item in products" :key="item.id">
              <a
                href="#"
                class="text-decoration-none d-block"
                @click.prevent="getProductDetails(item.id)"
              >
                <!-- card -->
                <div class="movie-card">
                  <div class="info_section">
                    <div class="p-4" style="width: 65%">
                      <div class="row">
                        <div class="col-3">
                          <img
                            v-if="item.imageUrl[0]"
                            :src="item.imageUrl[0]"
                            class="card-img-top img-fluid d-block"
                            style="
                              object-fit: cover;
                              object-position: center center;
                              aspect-ratio: 2 / 3;
                              max-height: 250px;
                            "
                            :alt="item.title"
                          />
                        </div>
                        <div class="col-9">
                          <h3 class="card-title mb-1">
                            {{ item.title }}
                          </h3>
                          <small class="text-dark d-inline-block me-2">{{
                            item.content.split('|')[2]
                          }}</small>
                          |
                          <small class="ms-2 text-dark d-inline-block"
                            >Popularity:
                            <span class="">{{
                              parseFloat(item.content.split('|')[1]).toFixed(0)
                            }}</span></small
                          >
                        </div>
                      </div>
                      <div class="row mt-4">
                        <div class="col-12">
                          <div class="card-text d-flex flex-column">
                            <p>{{ item.description }}</p>

                            <div class="text-end mt-auto px-2">
                              <span> &#171; see more &#187;</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="backdrop_image"
                    :style="{ backgroundImage: `url(${item.imageUrl[1]})` }"
                  ></div>

                  <!-- 第二版 -->
                  <!-- <div class="d-flex">
                    <div class="flex-shrink-0">
                      <img
                        v-if="item.imageUrl[0]"
                        :src="item.imageUrl[0]"
                        class="card-img-top img-fluid"
                        style="
                          object-fit: cover;
                          object-position: center center;
                          aspect-ratio: 2 / 3;
                          max-height: 250px;
                        "
                        :alt="item.title"
                      />
                    </div>

                    <div
                      class="card-body d-flex flex-column"
                      style="height: auto"
                    >
                      
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

                      
                      <div class="card-text">
                        <small class="text-dark">{{
                          item.content.split('|')[2]
                        }}</small>

                        <p class="mt-3">{{ item.description }}</p>
                      </div>

                      
                      <div class="text-end mt-auto px-2">
                        <span> &#171; see more &#187;</span>
                      </div>
                    </div>
                  </div> -->

                  <!-- 原版 -->
                  <!-- <div class="row g-0 h-100">
                    <div class="col-3 h-100">
                      <div class="h-100">
                        <img
                          v-if="item.imageUrl"
                          :src="item.imageUrl"
                          class="card-img-top img-fluid d-block h-100"
                          style="object-fit: cover; object-position: center center"
                          :alt="item.title"
                        />
                      </div>
                    </div>
                    <div class="col-9">
                      <div class="card-body h-100 d-flex flex-column">
                        
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

                        
                        <div class="card-text">
                          <small class="text-dark">{{
                            item.content.split('|')[2]
                          }}</small>

                          <p class="mt-3">{{ item.description }}</p>
                        </div>

                        
                        <div class="text-end mt-auto px-2">
                          <span> &#171; see more &#187;</span>
                        </div>
                      </div>
                    </div>
                  </div> -->
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';

export default {
  props: {
    genre: {
      type: String
    }
  },
  components: {
    Pagination
  },
  inject: ['emitter'],
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
      pagination: {},
      genrePassIn: ''
    };
  },
  computed: {
    queriesChange() {
      return this.$route.params.genre;
    }
  },
  watch: {
    queriesChange(newVal) {
      const newGenre = newVal;

      // 防止跳回首頁會更新資料
      if (this.$route.name === 'UserProducts') {
        this.genrePassIn = newGenre.toLowerCase();
        this.getProducts();
      }
    }
  },
  methods: {
    async getProducts(page = 1) {
      this.isLoading = true;

      // api
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      const response = await this.$http.get(api).catch((err) => {
        console.log(err);
      });

      // 資料存入
      this.pagination = response.data.pagination;

      if (this.genrePassIn === 'nowplaying') {
        // 首頁傳來為 NowPlaying
        this.products = response.data.products.filter((item) => {
          const genre = item.category.split('|')[1];
          return genre === 'nowplaying';
        });
      } else if (this.genrePassIn === 'upcoming') {
        // 首頁傳來為 Upcoming
        this.products = response.data.products.filter((item) => {
          const genre = item.category.split('|')[1];
          return genre === 'upcoming';
        });
      } else {
        // see all results
        this.products = response.data.products.filter((item) => {
          return item.title
            .split('-')
            .join(' ')
            .toUpperCase()
            .match(this.genrePassIn.toUpperCase());
        });
      }

      this.products.reverse();

      this.isLoading = false;
      console.log('res', response.data);
    },
    getProductDetails(id) {
      this.$router.push({ name: 'UserProduct', params: { productID: id } });
    }
  },
  created() {
    this.genrePassIn = this.$route.params.genre;
    this.getProducts();
  }
};
</script>

<style lang="scss" scoped>
.movie-card {
  position: relative;
  overflow: hidden;
  transition: all 0.4s;
  border-radius: 10px;
  box-shadow: 0px 0px 120px -20px rgba(0, 0, 0, 0.5);
  // box-shadow: 0px 0px 80px -25px rgba(0, 0, 0, 0.5);
  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 80px -25px rgba(0, 0, 0, 0.5);
    transition: all 0.4s;
  }

  .info_section {
    background: linear-gradient(to right, #e5e6e6 50%, transparent 100%);
    background-blend-mode: multiply;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .backdrop_image {
    background-repeat: no-repeat;
    background-position: center center;
    background-position: -100% 10% !important;
    background-size: cover;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    height: 100%;
    width: 80%;
  }
}

ul a:hover {
  .card {
    // background-color: #343a40;
    // background-color: rgb(255, 255, 255);
    // color: #fff;
    box-shadow: 0px 0px 2px 2px rgba(238, 237, 237, 0.9);
  }

  .card-body {
    // box-shadow: 2px 0px 1px 1px rgba(164, 164, 164, 0.9);
  }

  & small {
    // color: #fff !important;
  }
}

.card-text p {
  display: -webkit-box;
  // max-width: 90%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
