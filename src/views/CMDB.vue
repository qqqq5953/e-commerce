<template>
  <div class="bg-dark">
    <div class="container py-5">
      <!-- Playing Now -->
      <div class="d-flex">
        <h2 class="h1 text-white">Playing Now</h2>
        <!-- 語言切換 -->
        <div
          class="btn-group btn-group-sm ms-auto text-right"
          role="group"
          aria-label="Basic outlined example"
        >
          <button type="button" class="btn btn-outline-light active">EN</button>
          <button type="button" class="btn btn-outline-light">CH</button>
        </div>
      </div>
      <section class="overflow-auto my-4">
        <CardVertical :results="nowPlaying"></CardVertical>
      </section>

      <!-- UpComing -->
      <div class="d-flex">
        <!-- <h2 class="h1 text-white">UpComing</h2> -->
        <!-- 語言切換 -->
        <div
          class="btn-group btn-group-sm ms-auto text-right"
          role="group"
          aria-label="Basic outlined example"
        >
          <button type="button" class="btn btn-outline-light active">EN</button>
          <button type="button" class="btn btn-outline-light">CH</button>
        </div>
      </div>
      <!-- <section class="overflow-auto my-4">
        <CardVertical :results="upComing"></CardVertical>
      </section> -->
    </div>
  </div>
</template>

<script>
import CardVertical from '../components/CardVerticalTest.vue';

export default {
  components: { CardVertical },
  inject: ['sortData'],
  data() {
    return {
      temp: '',
      basrUrl: 'https://api.themoviedb.org/3/',

      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      auth: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YmJlNjAwNWNmZGE1OTNkYzIxY2NlYjkzZWFmOWE4ZSIsInN1YiI6IjYxZjBhZGI1YzY2OWFkMDBjZWEzMDVjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n5tebMbjgJK3rlc5_VPmShHCgLujieUY_rhasZD14Hg',
      nowPlaying: [],
      upComing: [],
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
  methods: {
    async getNowPlaying() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=en-US&page=1'
      );
      this.nowPlaying = response.data.results;
      this.nowPlaying = this.sortData(this.nowPlaying, 'popularity');
      console.log('getNowPlaying', response);
    },
    async getUpcoming() {
      const response = await this.$http.get(
        'https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=zh-TW&page=1'
      );
      this.upComing = response.data.results;
      this.upComing = this.sortData(this.upComing, 'popularity');
      console.log('getUpcoming', response);
    }
  },
  created() {
    this.getNowPlaying();
    this.getUpcoming();
  }
};
</script>
