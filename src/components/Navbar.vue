<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link
        class="navbar-brand nav-link active"
        :to="{ name: 'UserCMDB' }"
        >CMDB</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Pricing' }"
              >Pricing</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Login' }"
              >Admin</router-link
            >
          </li>
        </ul>
        <form class="d-flex flex-grow-1">
          <div class="input-group">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ selectedGenre }}
            </button>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li v-for="genre in searchBy" :key="genre">
                <button
                  class="dropdown-item"
                  type="button"
                  @click="selectGenre(genre)"
                >
                  {{ genre }}
                </button>
              </li>
            </ul>
            <div class="flex-grow-1 position-relative">
              <!-- search bar -->
              <input
                class="form-control h-100"
                type="search"
                placeholder="Search"
                v-model.trim="keywords"
                aria-label="Search with dropdown button"
                ref="searchBar"
                @input="searchInput"
              />
              <a
                href="#"
                class="position-absolute end-0 top-0 bottom-0 p-4 d-flex align-items-center"
                @click.prevent="clearSearchBar"
              >
                <i class="bi bi-x-lg"></i>
              </a>

              <!-- 搜尋結果 :class="{ 'd-none': !keywords.length }"-->
              <ul
                class="text-white list-unstyled position-absolute bg-dark mb-0 start-0 end-0 pt-3 search-list"
                ref="searchList"
                v-if="keywords"
              >
                <Loading :active="isLoading" :is-full-page="false"></Loading>
                <template v-if="match.length">
                  <li
                    class="px-4 py-2 search-item"
                    v-for="item in match"
                    :key="item"
                  >
                    <router-link
                      :to="{
                        name: 'UserProduct',
                        params: {
                          productID: item.id
                        }
                      }"
                      class="text-decoration-none d-flex"
                      @click="clearSearchBar"
                    >
                      <img
                        v-if="item.imageUrl"
                        :src="item.imageUrl"
                        class="card-img-top img-fluid d-block"
                        :alt="item.title"
                      />
                      <div class="ms-3 text-light">
                        <h5 class="text-light mb-0">
                          {{ item.title }}
                        </h5>
                        <small class="text-light">{{
                          item.content.split('|')[2]
                        }}</small>
                      </div>
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider my-0" /></li>
                  <li class="px-4 py-3 search-item">
                    <a href="#" class="text-light" @click.prevent="toAllResult"
                      >See all results</a
                    >
                  </li>
                </template>
                <template v-else>
                  <li class="px-4 pb-3 search-item">no result</li>
                </template>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  </nav>

  <!-- 測試區 -->
  <div class="row">
    <!-- <div class="col-4">
      <h3>finalData ({{ finalData.length }})</h3>
      <div class="" v-for="item in finalData" :key="item.id + 1">
        {{ item.title || item.name }} | {{ item.popularity }}
      </div>
    </div>
    <div class="col-4">
      <h3>matchedKeyword ({{ matchedKeyword.length }})</h3>
      <div class="" v-for="item in matchedKeyword" :key="item.id + 2">
        {{ item.title || item.name }} | {{ item.popularity }}
      </div>
    </div>
    <div class="col-4">
      <h3>noRepeatData ({{ noRepeatData.length }})</h3>
      <div class="" v-for="item in noRepeatData" :key="item.id">
        {{ item.title || item.name }} | {{ item.popularity }}
      </div>
      <h3>topEightResult ({{ topEightResult.length }})</h3>
      <div class="" v-for="item in topEightResult" :key="item.id">
        {{ item.title || item.name }} | {{ item.popularity }}
      </div>
      <hr />
      <h3>difference ({{ difference.length }})</h3>
      <div class="" v-for="item in difference" :key="item.id">
        {{ item.title || item.name }} | {{ item.popularity }}
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseImageUrl: 'https://image.tmdb.org/t/p/w200',
      keywords: '',
      searchBy: ['Movie', 'TV', 'Person'],
      selectedGenre: '' || 'Movie',
      language: '',
      isLoading: false,
      // new
      products: [],
      match: []
    };
  },
  methods: {
    async getProducts() {
      this.isLoading = true;

      // api
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      const response = await this.$http.get(api).catch((err) => {
        console.log(err);
      });
      console.log('res', response.data);

      // 儲存資料
      this.products = response.data.products;

      this.isLoading = false;
    },
    searchInput() {
      if (!this.keywords) return;

      this.match = this.products.filter((item) => {
        if (item.title) {
          // console.log('有 title', item.title);
          return item.title
            .split('-')
            .join(' ')
            .toUpperCase()
            .match(this.keywords.toUpperCase());
        }
      });
    },
    selectGenre(genre) {
      this.selectedGenre = genre;
      this.clearSearchBar();
    },
    toggleSearchMenu() {
      window.addEventListener('click', (e) => {
        const target = e.target;

        // 點擊 searchBar 以外區域，將 searchList 關閉
        if (target !== this.$refs.searchBar && this.keywords.length) {
          this.$refs.searchList.classList.add('d-none');
        }

        // 點擊 searchBar 區域，將 searchList 打開
        if (target === this.$refs.searchBar && this.keywords.length) {
          this.$refs.searchList.classList.remove('d-none');
        }
      });
    },
    clearSearchBar() {
      this.keywords = '';
    },
    toAllResult() {
      if (!this.keywords) return;
      this.$router.push({
        name: 'UserProducts',
        params: {
          genre: 'all'
        }
      });
      this.clearSearchBar();
    }
  },
  mounted() {
    this.toggleSearchMenu();
    this.getProducts();
  }
};
</script>

<style lang="scss" scoped>
input[type='search']::-webkit-search-cancel-button {
  display: none;
}

img {
  height: 70px;
  width: 50px;
  object-fit: cover;
  // object-position: top center;
}

.search-list {
  z-index: 2;
}

.search-item:hover {
  background-color: rgba(81, 84, 87, 0.4);
  // background-color: #55595c;
}
</style>
