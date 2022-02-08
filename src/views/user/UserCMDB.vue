<template>
  <Loading :active="isLoading"></Loading>
  <div class="bg-dark">
    <div class="container py-5">
      <!-- Playing Now -->
      <h2 class="h1 d-inline-block">
        <a
          href="#"
          @click.prevent="moreResultsOfCMDB('nowplaying')"
          class="text-white text-decoration-none d-block"
        >
          Now Playing
          <i class="bi bi-chevron-right"></i>
        </a>
      </h2>
      <section class="overflow-auto mt-3 mb-5 card-scrollbar">
        <CardVertical :results="nowPlaying" :language="language"></CardVertical>
      </section>

      <!-- UpComing -->
      <h2 class="h1 d-inline-block">
        <a
          href="#"
          @click.prevent="moreResultsOfCMDB('upcoming')"
          class="text-white text-decoration-none d-block"
        >
          Upcoming
          <i class="bi bi-chevron-right"></i>
        </a>
      </h2>
      <section class="overflow-auto mt-3 mb-5 card-scrollbar">
        <CardVertical :results="upComing" :language="language"></CardVertical>
      </section>
    </div>
  </div>
</template>

<script>
import CardVertical from '@/components/CardVerticalTest.vue';

export default {
  components: { CardVertical },
  inject: ['sortData', 'emitter'],
  data() {
    return {
      basrUrl: 'https://api.themoviedb.org/3/',
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      products: [],
      nowPlaying: [],
      upComing: [],
      language: 'en-US',
      region: 'US',
      isLoading: false
    };
  },
  methods: {
    moreResultsOfCMDB(genre) {
      this.$router.push({ name: 'UserProducts', params: { genre } });
    },
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

      // 將 nowPlaying 分離出來
      this.getNowPlaying();

      // 將 upComing 分離出來
      this.getUpcoming();

      this.isLoading = false;
    },
    getNowPlaying() {
      this.nowPlaying = this.products.filter((item) => {
        const genre = item.category.split('|')[1];
        return genre === 'nowplaying';
      });
    },
    getUpcoming() {
      this.upComing = this.products.filter((item) => {
        const genre = item.category.split('|')[1];
        return genre === 'upcoming';
      });
    }
  },
  created() {
    this.getProducts();
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

    &:hover {
      background-color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
