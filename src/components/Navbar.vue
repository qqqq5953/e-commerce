<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand nav-link active" to="/CMDB"
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
            <router-link class="nav-link disabled" :to="{ name: 'Products' }"
              >Genres</router-link
            >
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'SearchResult' }"
              >SearchResult</router-link
            >
          </li> -->
          <!-- <li class="nav-item">
            <router-link class="nav-link disabled" :to="{ name: 'Orders' }"
              >Watchlist</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link disabled" :to="{ name: 'Coupon' }"
              >Cart</router-link
            >
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'UserProducts' }"
              >ProductList</router-link
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
              />
              <a
                href="#"
                class="position-absolute end-0 top-0 bottom-0 p-4 d-flex align-items-center"
                @click.prevent="clearSearchBar"
              >
                <i class="bi bi-x-lg"></i>
              </a>

              <!-- 搜尋結果 -->
              <ul
                class="text-white list-unstyled position-absolute bg-dark mb-0 start-0 end-0 pt-3 search-list"
                :class="{ 'd-none': !keywords.length }"
                ref="searchList"
              >
                <Loading :active="isLoading" :is-full-page="false"></Loading>
                <template v-if="topEightResult.length">
                  <li
                    class="px-4 py-2 search-item"
                    v-for="item in topEightResult"
                    :key="item"
                  >
                    <router-link
                      :to="{
                        name: 'Movie',
                        query: {
                          genre: selectedGenre,
                          language: language,
                          id: item.id
                        }
                      }"
                      class="text-decoration-none d-flex"
                      @click="clearSearchBar"
                    >
                      <img
                        v-if="item.poster_path"
                        :src="baseImageUrl + item.poster_path"
                        class="card-img-top img-fluid d-block"
                        :alt="item.title"
                      />
                      <div class="ms-3 text-light">
                        <h5 class="text-light mb-0">
                          {{ item.title || item.name }}
                        </h5>
                        <small class="text-light">{{
                          item.release_date || item.first_air_date
                        }}</small>
                      </div>
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider my-0" /></li>
                  <li class="px-4 py-3 search-item">
                    <a href="#" class="text-light" @click.prevent="searchButton"
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
          <button
            class="btn btn-outline-success"
            type="button"
            @click="searchButton"
          >
            Search
          </button>
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
      allData: [],
      finalData: [],
      matchedKeyword: [],
      noRepeatData: [],
      topEightResult: [],
      difference: [],
      baseImageUrl: 'https://image.tmdb.org/t/p/w200',
      keywords: '',
      searchBy: ['Movie', 'TV', 'Person'],
      selectedGenre: '' || 'Movie',
      language: '',
      isLoading: false
    };
  },
  watch: {
    keywords() {
      this.showInputResult();
    }
  },
  methods: {
    validateChinese(text) {
      return /^[\u4e00-\u9fa5\0-9]/.test(text);
    },
    validateEnglish(text) {
      return /^[ A-Za-z\0-9]/.test(text);
    },
    async checkSearchLanguage() {
      this.language = '';
      if (this.validateChinese(this.keywords)) {
        console.log('中文');
        this.language = 'zh-TW';
        return await this.getPopularData(this.allData, this.language, 3);
      } else if (this.validateEnglish(this.keywords)) {
        console.log('英文');
        this.language = 'en-US';
        return await this.getPopularData(this.allData, this.language, 3);
      } else {
        console.log('都不是');
        return undefined;
      }
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
      this.clearArrays();
    },
    clearArrays() {
      this.matchedKeyword.splice(0, this.matchedKeyword.length);
      this.topEightResult.splice(0, this.topEightResult.length);
      this.allData.splice(0, this.allData.length);

      // console.log('clearKeywords allData', this.allData);
      // console.log('clearKeywords matchedKeyword', this.matchedKeyword);
      // console.log('clearKeywords topEightResult', this.topEightResult);
    },
    matchKeyword(data) {
      return data.filter((item) => {
        if (item.title) {
          // console.log('有 title', item.title);
          return item.title
            .split('-')
            .join(' ')
            .toUpperCase()
            .match(this.keywords.toUpperCase());
        } else {
          // console.log('有 name', item.name);
          return item.name
            .split('-')
            .join(' ')
            .toUpperCase()
            .match(this.keywords.toUpperCase());
        }
      });
    },
    sortData(array, bySomething) {
      return array.sort((a, b) => {
        return b[bySomething] - a[bySomething];
      });
    },
    async getPopularData(dataArray, language, topPages) {
      // avoid 422 error
      if (this.keywords === '') return;

      const temp = [];
      for (let page = 1; page <= topPages; page++) {
        // avoid 422 error
        if (this.keywords === '') return;
        this.isLoading = true;

        const genre = this.selectedGenre.toLowerCase();
        const response = await this.$http.get(
          `https://api.themoviedb.org/3/search/${genre}?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${language}&query=${this.keywords}&page=${page}&include_adult=false`
        );

        this.isLoading = false;

        response.data.results.forEach((item) => {
          temp.push(item);
        });
      }

      dataArray.push(temp);
      return dataArray[dataArray.length - 1];
    },
    async showInputResult() {
      if (this.keywords === '') return;
      this.clearArrays();

      // 取得前三頁結果
      this.finalData = await this.checkSearchLanguage();

      // 無結果
      if (this.finalData === undefined) return;

      // 將 finalData 與關鍵字比對
      this.matchedKeyword = this.matchKeyword(this.finalData);
      if (!this.matchKeyword(this.finalData).length) {
        // 比對結果如果為空陣列，finalData 直接賦值 matchedKeyword
        this.matchedKeyword = this.finalData;
      }

      // 依照熱度排名
      this.matchedKeyword = this.sortData(this.matchedKeyword, 'popularity');

      // 剔除重複
      this.noRepeatData = this.matchedKeyword.filter((item, index, arr) => {
        return (
          index ===
          arr.findIndex((element) => {
            // for search of TV and Person
            if (item.name) {
              return element.name === item.name;
            }
            // for search of Movie
            return element.title === item.title;
          })
        );
      });

      // 前8
      this.topEightResult = this.noRepeatData.slice(0, 8);
      console.log('allData', this.allData);
      console.log('finalData', this.finalData);
      console.log('noRepeatData', this.noRepeatData);
      console.log('topEightResult', this.topEightResult);

      // this.isLoading = false;

      // this.difference = this.matchedKeyword.filter(
      //   (x) => !this.noRepeatData.includes(x)
      // );
      // console.log('difference', this.difference);

      // this.difference.forEach((item) => {
      //   if (item.title) {
      //     console.log('title', item.title);
      //   } else {
      //     console.log('name', item.name);
      //   }
      // });
    },
    searchButton() {
      this.$router.push({
        name: 'SearchResult',
        query: {
          genre: this.selectedGenre.toLowerCase(),
          title: this.keywords,
          language: this.language
        }
      });
      this.clearSearchBar();
      // this.$router.push({
      //   name: 'SearchResult',
      //   params: {
      //     title: this.keywords
      //   }
      // });
    }
  },
  mounted() {
    this.toggleSearchMenu();
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
