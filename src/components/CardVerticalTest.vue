<template>
  <ul class="row flex-nowrap list-unstyled" style="width: 90%">
    <li class="col-4 movie-poster" v-for="item in results" :key="item.id">
      <a href="#" class="text-decoration-none">
        <div class="mb-3 position-relative" style="height: 440px">
          <img
            v-if="item.poster_path"
            :src="baseImageUrl + item.poster_path"
            class="img-fluid d-block h-100 w-100"
            :alt="item.title"
            style="object-fit: cover; object-position: center top"
          />
          <div
            class="movie-intro position-absolute top-0 bottom-0 left-0 right-0 w-100 h-100"
            style="background: rgba(0, 0, 0, 0.7)"
          >
            <div
              class="d-flex flex-column text-white position-absolute bottom-0 m-auto p-4"
              style="top: 150px"
            >
              <h3 class="text-white text-center">
                {{ item.title }}
              </h3>

              <p class="mt-auto">{{ item.overview }}</p>
              <small class="d-block fs-6 text-end">{{
                item.release_date
              }}</small>
            </div>
            <!-- <div class="d-flex flex-column h-50 text-white movie-intro">
              <h3 class="text-white text-center flex-grow-1">
                {{ item.title }}
              </h3>

              <p class="">{{ item.overview }}</p>
            </div>
            <small class="d-block fs-6 text-end mt-auto">{{
              item.release_date
            }}</small> -->
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    results: {
      type: Array
    }
  },
  data() {
    return {
      baseImageUrl: 'https://image.tmdb.org/t/p/w300'
    };
  }
};
</script>

<style lang="scss" scoped>
.movie-intro {
  opacity: 0;
  transition: opacity 0.5s;
  p {
    display: -webkit-box;
    // max-width: 90%;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    // line-height: 1.4;
  }
}

.movie-poster:hover {
  .movie-intro {
    border: 2px solid white;
    opacity: 1;
    width: 100%;
  }
}
</style>
