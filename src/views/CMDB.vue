<template>
  <div class="bg-dark">
    <div class="container py-5">
      <!-- Playing Now -->
      <div class="d-flex align-items-center">
        <h2 class="h1 text-white mb-0">Now Playing</h2>
        <!-- 語言切換 -->
        <div
          class="btn-group btn-group-sm ms-auto text-right"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            class="btn btn-outline-light"
            :class="{ active: language === 'en-US' }"
            @click="switchLanguage('en-US', 'now playing')"
          >
            EN
          </button>
          <button
            type="button"
            class="btn btn-outline-light"
            :class="{ active: language === 'zh-TW' }"
            @click="switchLanguage('zh-TW', 'now playing')"
          >
            CH
          </button>
        </div>
      </div>
      <section class="overflow-auto mt-3 mb-5 card-scrollbar">
        <CardVertical :results="nowPlaying" :language="language"></CardVertical>
      </section>

      <!-- UpComing -->
      <div class="d-flex align-items-center">
        <h2 class="h1 text-white mb-0">UpComing</h2>
        <!-- 語言切換 -->
        <div
          class="btn-group btn-group-sm ms-auto text-right"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            class="btn btn-outline-light active"
            @click="switchLanguage('en-US', 'upcoming')"
          >
            EN
          </button>
          <button
            type="button"
            class="btn btn-outline-light"
            @click="switchLanguage('zh-TW', 'upcoming')"
          >
            CH
          </button>
        </div>
      </div>
      <section class="overflow-auto mt-3 mb-5 card-scrollbar">
        <CardVertical :results="upComing" :language="language"></CardVertical>
      </section>
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
      language: 'en-US',
      pagination: {
        current_page: '',
        total_pages: '',
        has_pre: false,
        has_next: true
      }
    };
  },
  // watch: {
  //   language() {
  //     this.getNowPlaying();
  //   }
  // },
  methods: {
    switchLanguage(language, movieTpe) {
      this.language = language;
      if (movieTpe === 'now playing') this.getNowPlaying();
      if (movieTpe === 'upcoming') this.getUpcoming();
    },
    async getNowPlaying() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=1`
      );
      this.nowPlaying = response.data.results;
      this.nowPlaying = this.sortData(this.nowPlaying, 'popularity');
      console.log('getNowPlaying', response);
    },
    async getUpcoming() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=1`
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

<style lang="scss" scoped>
.card-scrollbar {
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(85, 89, 92, 1);
    border-radius: 100vw;
    margin-inline: 10vw;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(26, 26, 26, 1);
    border-radius: 100vw;
    border: 2px solid rgba(85, 89, 92, 1);
  }
}
</style>
