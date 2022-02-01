<template>
  <div class="container py-5">
    <h2>Displaying {{ totalResult }} results for: {{ titlePassIn }}</h2>

    <Pagination
      :pages="pagination"
      @change-page="getData"
      @previous-page="getData"
      @next-page="getData"
    ></Pagination>

    <ul class="row list-unstyled">
      <li class="col-8 mb-4" v-for="item in results" :key="item.id">
        <a
          href="#"
          class="text-decoration-none"
          @click.prevent="getCardDetail(item.id)"
        >
          <div class="card mb-3 border-dark">
            <div class="row g-0">
              <div class="col-2">
                <div class="h-100">
                  <img
                    v-if="item.poster_path"
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
                      >popularity: {{ item.popularity }}</small
                    >
                  </div>

                  <div class="card-text">
                    <small class="text-dark">{{ item.release_date }}</small>
                    <div class="mt-3">
                      <p>{{ item.overview }}</p>
                      <div class="text-end me-2">
                        <span> &#171; see more &#187;</span>
                      </div>
                    </div>
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
  props: {
    keywords: {
      type: String
    },
    genre: {
      type: String
    },
    language: {
      type: String
    }
  },
  data() {
    return {
      temp: '',
      basrUrl: 'https://api.themoviedb.org/3/',
      baseImageUrl: 'https://image.tmdb.org/t/p/w200',
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      auth: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmJlNjAwNWNmZGE1OTNkYzIxY2NlYjkzZWFmOWE4ZSIsInN1YiI6IjYxZjBhZGI1YzY2OWFkMDBjZWEzMDVjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n5tebMbjgJK3rlc5_VPmShHCgLujieUY_rhasZD14Hg',
      results: [],
      totalResult: '',
      titlePassIn: '',
      genrePassIn: '',
      languagePassIn: '',
      pagination: {
        current_page: '',
        total_pages: '',
        has_pre: false,
        has_next: true
      }
    };
  },
  watch: {
    // keywords() {
    //   console.log('keywords', this.keywords);
    //   this.titlePassIn = this.keywords;
    //   this.getData();
    // }
    // '$route.params.id': {
    //   handler: function (id) {
    //     this.titlePassIn = id;
    //     // this.getData();
    //   },
    //   deep: true,
    //   immediate: true
    // }
    // '$route.query.title': {
    //   handler: function (title) {
    //     this.titlePassIn = title;
    //     this.getData();
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    getCardDetail(id) {
      this.$router.push({
        name: 'Movie',
        query: {
          language: this.languagePassIn,
          id: id,
          genre: this.genrePassIn
        }
      });
    },
    sortResultByDate() {
      const test = this.results.sort(function (a, b) {
        return new Date(b.release_date) - new Date(a.release_date);
      });
      console.log('test', test);
    },
    async getData(page = 1) {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/search/${this.genrePassIn}?api_key=${this.key}&query=${this.titlePassIn}&page=${page}`
      );
      this.results = response.data.results;
      this.totalResult = response.data.total_results;

      // pagination
      this.pagination.total_pages = response.data.total_pages;
      this.pagination.current_page = response.data.page;
      if (page > 1 && page < this.pagination.total_pages) {
        this.pagination.has_pre = true;
      }
      if (page === this.pagination.total_pages) {
        this.pagination.has_pre = true;
        this.pagination.has_next = false;
      }
      console.log('getData', response);
    },
    async discoverMovie() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${this.key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1&with_cast=3223&with_crew=3223&with_people=3223&with_keywords=${this.titlePassIn}&with_watch_monetization_types=flatrate`
      );
      console.log('discoverMovie', response);
    }
  },
  created() {
    this.titlePassIn = this.keywords;
    this.genrePassIn = this.genre.toLowerCase();
    this.languagePassIn = this.language;
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
