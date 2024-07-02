import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import store from './store';

import App from './App.vue';
import router from './router';

import ui from './ui-factory';

const app = createApp(App);
ui.register(app).use(createPinia()).use(router).use(store).mount('#app');
