import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

const app = createApp(App);
app.component('Loading', Loading);
app.use(VueAxios, axios);
app.use(router);
app.mount('#app');
