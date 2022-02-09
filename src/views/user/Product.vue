<template>
  <Loading :active="isLoading"></Loading>
  <div class="bg-dark">
    <div class="container py-5">
      <header class="text-white d-none">
        <section class="row">
          <div class="col-8">
            <h2 class="h1 text-white mb-3">{{ title }}</h2>
            <h3 class="h6 text-white">Original title: {{ originalTitle }}</h3>
            <span class="fs-6 me-2">{{ releaseDate.split('-')[0] }}</span> |
            <span class="fs-6 ms-2"
              >{{ runTime.hour }}h {{ runTime.minute }}m</span
            >
          </div>
          <div class="col-4 d-flex align-items-end">
            <div class="ms-auto">
              <h4 class="h6 text-white text-end">popularity</h4>
              <div class="d-block text-end">
                <i class="fs-4 bi bi-star-fill text-warning me-2"></i>
                <span class="fs-3">{{ popularity }}</span>
              </div>
            </div>
            <div class="ms-4">
              <h4 class="h6 text-white text-end">Vote Average</h4>
              <div class="d-block text-end">
                <i class="fs-4 bi bi-people-fill text-info me-2"></i>
                <span class="fs-3">{{ voteAverage }}</span>
              </div>
            </div>
          </div>
        </section>
      </header>
      <main class="text-white mt-4">
        <div class="row">
          <section class="col-9">
            <div class="row h-100 w-100">
              <!-- poster -->
              <div class="col-5">
                <div class="rounded-3 h-100 w-100">
                  <img
                    v-if="posterUrl"
                    class="img-fluid rounded-3 h-100 w-100"
                    style="object-fit: cover"
                    :src="baseImageUrl + posterUrl"
                    :alt="title"
                  />
                </div>
              </div>

              <section class="col-7 d-flex flex-column">
                <h2 class="h1 text-white mb-2">{{ title }}</h2>
                <h3 class="h6 text-white mb-1">
                  Original title:
                  <span class="fw-normal">{{ originalTitle }}</span>
                </h3>
                <div>
                  <span class="fs-6 me-2">{{ releaseDate.split('-')[0] }}</span>
                  |
                  <span class="fs-6 ms-2"
                    >{{ runTime.hour }}H {{ runTime.minute }}M</span
                  >
                </div>

                <!-- overview -->
                <p class="mt-3 fs-6">{{ overview }}</p>
                <!-- badge -->
                <div class="d-flex pb-3">
                  <span
                    class="badge rounded-pill border-secondary me-2"
                    v-for="item in genres"
                    :key="item"
                    >{{ item.name }}</span
                  >
                </div>
                <!-- price -->
                <div
                  class="d-flex justify-content-between align-items-center ms-auto mt-auto mb-3"
                  v-if="nowOrUpcoming === 'nowplaying'"
                >
                  <span>Subscribe:</span>
                  <span class="h3 text-danger ms-3">NT$330</span>
                </div>
                <!-- PURCHASE or subscribe -->
                <div
                  class="btn-group"
                  :class="{ 'mt-auto': nowOrUpcoming === 'upcoming' }"
                  role="group"
                >
                  <button
                    type="button"
                    class="btn btn-outline-light text-center fw-light"
                  >
                    <i class="bi bi-plus-lg me-2"></i>
                    Watchlist
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-light text-center text-warning"
                    :disabled="status.loadingItemsID === productID"
                    @click="addProductToCart"
                    v-if="nowOrUpcoming === 'nowplaying'"
                  >
                    <span
                      class="spinner-border spinner-grow-sm"
                      v-if="status.loadingItemsID === productID"
                    ></span>
                    <i class="bi bi-arrow-right-circle"></i>
                    SUBSCRIBE
                  </button>
                </div>
              </section>
            </div>
          </section>

          <aside
            class="col-3 rounded-3 p-3"
            style="
              background: rgba(179, 167, 167, 0.15);
              border-radius: 16px;
              box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(9px);
              -webkit-backdrop-filter: blur(5.9px);
            "
          >
            <div class="row mb-3">
              <!-- popularity -->
              <div class="col d-flex flex-column">
                <h4 class="h6 text-white text-end">popularity</h4>
                <div class="text-end mt-auto">
                  <i class="bi bi-star-fill text-warning me-2"></i>
                  <span>{{ popularity }}</span>
                </div>
              </div>
              <!-- vote -->
              <div class="col d-flex flex-column">
                <h4 class="h6 text-white text-end">Vote Average</h4>
                <div class="text-end mt-auto">
                  <i class="bi bi-people-fill text-info me-2"></i>
                  <span>{{ voteAverage }}</span>
                </div>
              </div>
            </div>
            <ul
              class="d-flex flex-column justify-content-between list-unstyled more-video-list"
            >
              <li
                class="rounded-3 mb-2"
                v-for="item in Object.values(videoType)"
                :key="item"
              >
                <a
                  href="#"
                  class="btn d-flex justify-content-between text-white w-100 p-3 text-decoration-none fs-6"
                  :class="{ disabled: !item.content.length }"
                >
                  {{ item.type.toUpperCase() }} ({{ item.content.length }})
                  <i class="bi bi-chevron-compact-right"></i>
                </a>
              </li>
            </ul>
          </aside>
        </div>

        <section class="row mt-5">
          <!-- video -->
          <div class="col-9">
            <iframe
              type="text/html"
              allowfullscreen
              width="100%"
              height="500px"
              v-if="trailers.length"
              :src="
                baseYoutubeUrl + trailers[0].key ||
                baseYoutubeUrl + teaser[0].key
              "
            >
            </iframe>
          </div>
          <div class="col-3">
            <!-- <ul
              class="h-100 d-flex flex-column justify-content-evenly list-unstyled border more-video-list"
            >
              <li
                class="flex-grow-1"
                v-for="item in Object.values(videoType)"
                :key="item"
              >
                <a
                  href="#"
                  class="d-block px-2 text-white w-100 h-100 d-flex justify-content-between align-items-center text-decoration-none"
                >
                  {{ item.name.toUpperCase() }}
                  <i class="bi bi-chevron-compact-right"></i>
                </a>
              </li>
            </ul> -->
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productID: {
      type: String
    }
  },
  data() {
    return {
      temp: null,
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      baseImageUrl: 'https://image.tmdb.org/t/p/w300',
      baseYoutubeUrl: 'https://www.youtube.com/embed/',
      isLoading: false,
      // Movie
      title: '',
      originalTitle: '',
      imdbID: '',
      runTime: {
        hour: '',
        minute: ''
      },
      trailers: [],
      teasers: [],
      // TV
      seasons: [],
      createdBy: [],
      // person
      biography: '',
      birthday: '',
      personName: '',
      profileImgage: '',
      // 共用
      releaseDate: '',
      popularity: '',
      voteAverage: '',
      posterUrl: '',
      genres: [],
      overview: '',
      id: '',
      genre: '',
      nowOrUpcoming: '',
      language: 'en-US',
      videoType: {
        behindTheScenes: { type: 'Behind the Scenes', content: [] },
        clips: { type: 'Clips', content: [] },
        teasers: { type: 'Teasers', content: [] },
        trailers: { type: 'Trailers', content: [] },
        featurettes: { type: 'Featurettes', content: [] },
        others: { type: 'Others', content: [] }
      },
      // add to Cartstatus: {
      status: {
        loadingItemsID: ''
      }
    };
  },
  methods: {
    async getProductDetails() {
      this.isLoading = true;

      // api
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.productID}`;
      const response = await this.$http
        .get(api)
        .catch((err) => console.log(err));
      console.log('getProductDetails', response);

      // 產品在 TMDB api 中 的id
      this.id = response.data.product.content.split('|')[0];

      // 產品屬於 movie 或 tv 類別
      this.genre = response.data.product.category.split('|')[0];
      this.nowOrUpcoming = response.data.product.category.split('|')[1];

      // 再透過 TMDB api 獲得更多產品資料
      await this.getData();

      this.isLoading = false;
    },
    async getData() {
      // TMDB api
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/${this.genre}/${this.id}?api_key=${this.key}&language=${this.language}&append_to_response=videos,images`
      );
      console.log('getData', response);

      if (this.genre === 'movie') this.getMovieDetail(response);
      if (this.genre === 'tv') this.getTVDetail(response);

      this.posterUrl = response.data.poster_path;
      this.genres = response.data.genres;
      this.overview = response.data.overview;

      this.popularity = response.data.popularity;
      this.voteAverage = response.data.vote_average;
      // video 分類
      this.arrangeVideoType(response.data.videos.results);

      // 預設呈現 trailers (因為 videoType.trailers.content[0].key 抓不到值)
      this.trailers = response.data.videos.results.filter((item) => {
        return item.type === 'Trailer';
      });

      // 如果沒有 trailers 就呈現 teasers
      this.teasers = response.data.videos.results.filter((item) => {
        return item.type === 'Teaser';
      });
    },
    getMovieDetail(response) {
      this.title = response.data.title;
      this.originalTitle = response.data.original_title;
      this.releaseDate = response.data.release_date;

      this.runTime.hour = Math.floor(response.data.runtime / 60);
      this.runTime.minute = response.data.runtime % 60;
      // this.arrangeVideoType(response.data.videos.results);
      this.trailers = response.data.videos.results.filter((item) => {
        return item.type === 'Trailer';
      });
    },
    getTVDetail(response) {
      this.title = response.data.name;
      this.originalTitle = response.data.original_name;
      this.releaseDate = response.data.first_air_date;
      this.seasons = response.data.seasons;
      this.createdBy = response.data.created_by;
      this.runTime.hour = Math.floor(response.data.episode_run_time / 60);
      this.runTime.minute = response.data.episode_run_time % 60;
    },
    arrangeVideoType(types) {
      types.forEach((item) => {
        if (item.type === 'Clip') {
          this.videoType.clips.content.push(item);
        } else if (item.type === 'Teaser') {
          this.videoType.teasers.content.push(item);
        } else if (item.type === 'Trailer') {
          this.videoType.trailers.content.push(item);
        } else if (item.type === 'Featurette') {
          this.videoType.featurettes.content.push(item);
        } else if (item.type === 'Behind the Scenes') {
          this.videoType.behindTheScenes.content.push(item);
        } else {
          this.videoType.others.content.push(item);
        }
      });
    },
    async addProductToCart() {
      try {
        this.status.loadingItemsID = this.productID;
        const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
        const response = await this.$http.post(api, {
          data: { product_id: this.productID, qty: 1 }
        });
        this.status.loadingItemsID = {};
        console.log('addProductToCart', response.data);
      } catch (err) {
        console.log(err);
      }
    }
  },

  created() {
    this.getProductDetails();
  }
};
</script>

<style lang="scss" scoped>
.more-video-list {
  li {
    background-color: rgba(26, 26, 26, 0.4);
  }

  li a:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
