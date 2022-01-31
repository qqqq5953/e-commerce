<template>
  <div class="container py-5">
    <h2>Displaying {{ totalResult }} results for: {{ title }}</h2>

    <Pagination
      :pages="pagination"
      @change-page="getData"
      @previous-page="getData"
      @next-page="getData"
    ></Pagination>

    <div class="row">
      <div class="col-8 mb-4" v-for="item in results" :key="item.id">
        <div class="card mb-3 border-dark">
          <div class="row g-0">
            <div class="col-2">
              <div class="h-100">
                <img
                  :src="baseImageUrl + item.poster_path"
                  class="card-img-top img-fluid d-block h-100"
                  :alt="item.title"
                />
              </div>
            </div>
            <div class="col-10">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <h3 class="card-title mb-1">{{ item.title }}</h3>
                  <small class="ms-auto text-dark flex-shrink-0"
                    >vote_average：{{ item.vote_average }}</small
                  >
                </div>

                <div class="card-text">
                  <small class="text-dark">{{ item.release_date }}</small>
                  <div class="mt-3">
                    <p>{{ item.overview }}</p>
                    <div class="text-end me-2">
                      <a href="#">see more</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
export default {
  components: {
    Pagination
  },
  // props: {
  //   keywords: {
  //     type: String
  //   },
  //   genre: {
  //     type: String
  //   }
  // },
  data() {
    return {
      temp: '',
      basrUrl: 'https://api.themoviedb.org/3/',
      baseImageUrl: 'https://image.tmdb.org/t/p/w200',
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      auth: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmJlNjAwNWNmZGE1OTNkYzIxY2NlYjkzZWFmOWE4ZSIsInN1YiI6IjYxZjBhZGI1YzY2OWFkMDBjZWEzMDVjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n5tebMbjgJK3rlc5_VPmShHCgLujieUY_rhasZD14Hg',
      results: [],
      totalResult: '',
      title: '',
      selectedGenre: '',
      pagination: {}
    };
  },
  watch: {
    // keywords() {
    //   console.log('keywords', this.keywords);
    //   this.title = this.keywords;
    //   this.getData();
    // }
    // '$route.params.id': {
    //   handler: function (id) {
    //     this.title = id;
    //     // this.getData();
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // '$route.query.title': {
    //   handler: function (title) {
    //     this.title = title;
    //     this.getData();
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    sortResultByDate() {
      const test = this.results.sort(function (a, b) {
        return new Date(b.release_date) - new Date(a.release_date);
      });
      console.log('test', test);
    },
    async getData() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/search/${this.selectedGenre}?api_key=${this.key}&query=${this.title}&page=1`
      );
      this.results = response.data.results;
      this.totalResult = response.data.total_results;
      console.log('getData', response);
    },
    async discoverMovie() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/discover/movie?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate'
      );
      console.log('discoverMovie', response);
    },
    async getPerson() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/search/person?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&query=Robert%20John%20Downey&page=1&include_adult=false'
      );
      console.log('getPerson', response);
    },
    async getMulti() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/search/multi?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&query=iron&page=1&include_adult=false'
      );
      console.log('getMulti', response);
    },
    async getGenres() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US'
      );
      console.log('getGenres', response);
    },
    async getKeywords() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/1726/keywords?api_key=7bbe6005cfda593dc21cceb93eaf9a8e'
      );
      console.log('getKeywords', response);
    },
    async getCollections() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/search/collection?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&query=fast&page=1'
      );
      console.log('getCollections', response);
    },
    async getVideo() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/1726/videos?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US'
      );
      console.log('getVideo', response);
    },
    async getRecommenations() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/1726/recommendations?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&page=1'
      );
      console.log('getRecommenations', response);
    },
    async getNowPlaying() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&page=1&region=TW'
      );
      console.log('getNowPlaying', response);
    },
    async getUpcoming() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&page=1&region=TW'
      );
      console.log('getUpcoming', response);
    }
  },
  created() {
    this.title = this.$route.query.title;
    this.selectedGenre = this.$route.query.genre;
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
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
