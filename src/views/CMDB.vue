<template>
  <div class="bg-dark">
    <div class="container py-5">
      <div class="row">
        <!-- <div class="col">
          <h3 class="text-white">upComing 全 ({{ upComing.length }})</h3>
          <div class="text-white" v-for="item in upComing" :key="item.id">
            {{ item.title }} |
            <span class="bg-info">{{ item.popularity }}</span> |
            {{ item.release_date }}
          </div>
        </div>
        <div class="col">
          <h3 class="text-white">upComing 一半 ({{ upComing1.length }})</h3>
          <div class="text-white" v-for="item in upComing1" :key="item.id">
            {{ item.title }} |
            <span class="bg-info">{{ item.popularity }}</span> |
            {{ item.release_date }}
          </div>
        </div>
        <div class="col">
          <h3 class="text-white">Top 20 ({{ difference.length }})</h3>
          <div class="text-white" v-for="item in top20upComing" :key="item.id">
            {{ item.title }} |
            <span class="bg-info">{{ item.popularity }}</span> |
            {{ item.release_date }}
          </div>
        </div>
        <div class="col">
          <h3 class="text-white">difference ({{ difference.length }})</h3>
          <div class="text-white" v-for="item in difference" :key="item.id">
            {{ item.title || item.name }} | {{ item.popularity }}
          </div>
        </div> -->
      </div>

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
            class="btn btn-outline-light"
            :class="{ active: language === 'en-US' }"
            @click="switchLanguage('en-US', 'upcoming')"
          >
            EN
          </button>
          <button
            type="button"
            class="btn btn-outline-light"
            :class="{ active: language === 'zh-TW' }"
            @click="switchLanguage('zh-TW', 'upcoming')"
          >
            CH
          </button>
        </div>
      </div>
      <section class="overflow-auto mt-3 mb-5 card-scrollbar position-relative">
        <Loading
          :active="isLoading"
          :is-full-page="false"
          :background-color="'rgba(255, 255, 255, 0.1)'"
        ></Loading>
        <CardVertical
          :results="top20upComing"
          :language="language"
        ></CardVertical>
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
      top20upComing: [],
      // difference: [],
      // upComing1: [],
      totalResult: '',
      language: 'en-US',
      isLoading: false,
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
    switchLanguage(language, movieType) {
      this.language = language;
      if (movieType === 'now playing') this.getNowPlaying();
      if (movieType === 'upcoming') this.getUpcoming();
    },
    async getNowPlaying() {
      const response = await this.$http.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=1`
      );
      this.nowPlaying = response.data.results;
      this.nowPlaying = this.sortData(this.nowPlaying, 'popularity');
      console.log('getNowPlaying', response);
    },
    async getAllData(totalPages) {
      const temp = [];
      for (let page = 1; page <= totalPages / 2; page++) {
        const response = await this.$http.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=${page}`
        );

        response.data.results.forEach((item) => {
          temp.push(item);
        });
      }
      // console.log('temp', temp);

      return temp;
    },
    async getAllData1(totalPages) {
      const temp1 = [];
      for (let page = 1; page <= totalPages / 2; page++) {
        const response = await this.$http.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=${page}`
        );

        response.data.results.forEach((item) => {
          temp1.push(item);
        });
      }
      // console.log('temp1', temp1);

      // this.difference = temp.filter((x) => !this.temp1.includes(x));
      return temp1;
    },
    async getUpcoming() {
      this.isLoading = true;

      const response = await this.$http.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=7bbe6005cfda593dc21cceb93eaf9a8e&language=${this.language}&page=1`
      );
      console.log('getUpcoming', response);

      // 獲得所有資料
      const totalPages = response.data.total_pages;
      const allData = await this.getAllData(totalPages);
      // const allData1 = await this.getAllData1(totalPages);

      // 獲得今天日期
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const todayDate = yyyy + '-' + mm + '-' + dd;

      // 測試用
      // this.upComing1 = allData.filter((item) => {
      //   return new Date(item.release_date) >= new Date(todayDate);
      // });
      // this.upComing1 = allData1.filter((item) => {
      //   return new Date(item.release_date) >= new Date(todayDate);
      // });

      // this.difference = this.upComing1.filter(
      //   (x) => !this.upComing.includes(x)
      // );

      // 篩選出今天日期以後的電影
      const filterDate = allData.filter((item) => {
        return new Date(item.release_date) >= new Date(todayDate);
      });

      // 依照熱門度排序
      this.upComing = this.sortData(filterDate, 'popularity');

      // 取前 20
      this.top20upComing = this.upComing.slice(0, 20);

      this.isLoading = false;

      // console.log('temporary', temporary);
      // console.log('this.top20upComing', this.top20upComing);
      // console.log('this.upComing', this.upComing);
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
