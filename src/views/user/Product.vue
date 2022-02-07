<template>
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
      <main class="row text-white mt-4">
        <section class="col-9">
          <div class="row">
            <!-- poster -->
            <div class="col-4">
              <div class="rounded-3 h-100">
                <img
                  v-if="posterUrl"
                  class="img-fluid rounded-3 h-100"
                  style="object-fit: cover"
                  :src="baseImageUrl + posterUrl"
                  :alt="title"
                />
              </div>
            </div>

            <section class="col-8 d-flex flex-column">
              <h2 class="h1 text-white mb-2">{{ title }}</h2>
              <h3 class="h6 text-white mb-1">
                Original title:
                <span class="fw-normal">{{ originalTitle }}</span>
              </h3>
              <div>
                <span class="fs-6 me-2">{{ releaseDate.split('-')[0] }}</span> |
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
              <div class="ms-auto mt-auto mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span>Subscribe:</span>
                  <span class="h3 text-danger ms-3">NT$330</span>
                </div>
                <!-- month -->
                <div class="d-flex align-items-center">
                  <label for="subscribeMonth" class="form-label mb-0"
                    >Subscribe Month:</label
                  >
                  <input
                    type="number"
                    class="form-control ms-auto w-25 form-control-sm"
                    id="subscribeMonth"
                    min="1"
                    v-model.trim="subscribeMonth"
                    aria-describedby="subscribeMonth"
                  />
                </div>
                <div id="subscribeMonthNote" class="form-text">
                  Get coupon for subscription of 12-month
                  <i class="bi bi-arrow-up"></i>
                </div>
                <!-- Coupib -->
                <!-- <div
                  class="d-flex align-items-center mt-2"
                  v-if="subscribeMonth >= 12"
                >
                  <span>Coupon:</span>
                  <span class="badge bg-primary fs-4 ms-auto">CMDB_TEN</span>
                </div> -->
              </div>
              <!-- PURCHASE or subscribe -->
              <div class="btn-group" role="group">
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

        <aside class="col-3">
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
                class="d-flex justify-content-between text-white w-100 p-3 text-decoration-none fs-6"
                :class="{ disabled: !item.content.length }"
              >
                {{ item.type.toUpperCase() }} ({{ item.content.length }})
                <i class="bi bi-chevron-compact-right"></i>
              </a>
            </li>
          </ul>
        </aside>

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
      },
      subscribeMonth: 1
    };
  },
  methods: {
    async getProductDetails() {
      // this.isLoading = true;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.productID}`;
      const response = await this.$http
        .get(api)
        .catch((err) => console.log(err));
      console.log('getProductDetails', response);

      this.id = response.data.product.content.split('|')[0];
      this.genre = response.data.product.category.split('|')[0];

      await this.getData();
      // this.isLoading = false;
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
    async getData() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/${this.genre}/${this.id}?api_key=${this.key}&language=${this.language}&append_to_response=videos,images`
      );
      console.log('getData', response);

      if (this.genre === 'movie') this.getMovieDetail(response);
      if (this.genre === 'tv') this.getTVDetail(response);
      if (this.genre === 'person') {
        this.getPersonDetail(response);
        return;
      }

      this.popularity = response.data.popularity;
      this.voteAverage = response.data.vote_average;
      this.posterUrl = response.data.poster_path;
      this.genres = response.data.genres;
      this.overview = response.data.overview;

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

      console.log('trailers', this.trailers);
      console.log('teasers', this.teasers);
      console.log('videoType', this.videoType);

      // console.log('getData', response.data);
      // console.log(
      //   'videoType',
      //   this.title,
      //   this.videoType.trailers.content[0].key
      // );

      // console.log('teaser', teaser);
      // console.log('trailer', trailer);
      // console.log('featurette', featurette);

      // this.getYoutube();
      // this.getVideo();
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

  li:hover {
    background-color: rgba(81, 84, 87, 0.4);
  }
}
</style>
