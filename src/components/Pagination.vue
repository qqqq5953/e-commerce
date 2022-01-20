<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page === 1 }">
        <a
          class="page-link"
          href="#"
          @click.prevent="onPreviousPage(pages.current_page)"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!-- 數字 -->
      <li
        class="page-item"
        :class="{ active: page === pages.current_page }"
        v-for="page in pages.total_pages"
        :key="page"
      >
        <a class="page-link" href="#" @click.prevent="onChangePage(page)">{{
          page
        }}</a>
      </li>
      <!-- 下一頁 -->
      <li
        class="page-item"
        :class="{ disabled: pages.current_page >= pages.total_pages }"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="onNextPage(pages.current_page)"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pages: {
      type: Object
    }
  },
  methods: {
    onChangePage(page) {
      this.$emit('change-page', page);
    },
    onPreviousPage(page) {
      this.$emit('previous-page', page - 1);
    },
    onNextPage(page) {
      this.$emit('next-page', page + 1);
    }
  }
};
</script>
