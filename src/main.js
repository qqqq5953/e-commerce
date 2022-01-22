import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import Loading from 'vue3-loading-overlay';
import { currency, date } from '@/methods/filters';

import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// bootstrap js載入
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);
app.config.globalProperties.$filters = { currency, date };
app.component('Loading', Loading);
app.use(VueAxios, axios);
app.use(router);
app.mount('#app');
