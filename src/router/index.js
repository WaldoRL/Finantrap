import { createRouter, createWebHistory } from 'vue-router';
import AddTransactionsView from '@/views/AddTransactionsView.vue';
import AuthView from '@/views/AuthView.vue';
import DashboardView from '@/views/DashboardView.vue';
import { Auth } from '@/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const requireAuth = (to, from, next) => {
  const unsubscribe = onAuthStateChanged(Auth, user => {
    unsubscribe();
    if (user) {
      next();
    } else {
      next('/Auth');
    }
  });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/Auth' // Redirigir a /Auth cuando se accede a la raíz
    },
    {
      path: '/Auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/Transactions',
      name: 'transactions',
      component: AddTransactionsView,
      beforeEnter: requireAuth
    },
    {
      path: '/Dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: requireAuth
    },
  ]
});

export default router;
