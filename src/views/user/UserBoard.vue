<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link active" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'UserBoard' }"
              >UserBoard</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'UserProducts' }"
              >ProductList</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid position-relative">
    <router-view />
  </div>
  <ToastMessage></ToastMessage>
</template>

<script>
import emitter from '@/methods/emitter';
import ToastMessage from '@/components/ToastMessage.vue';

export default {
  components: {
    ToastMessage
  },
  provide() {
    return {
      emitter
    };
  }
};
</script>
