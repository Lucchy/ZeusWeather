// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  // Ajoutez d'autres routes ici au besoin
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;