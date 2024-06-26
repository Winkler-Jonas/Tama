import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ActivationView from '@/views/ActivationView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/auth'
import ProfileView from "@/views/ProfileView.vue";
import ResendActivationView from "@/views/ResendActivationView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import {useUserStore} from '@/stores/userStore'
import FocusView from "@/views/FocusView.vue";
import CalendarView from "@/views/CalendarView.vue";
import SettingsView from "@/views/SettingsView.vue";


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeView,
    meta: { nav: false }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {requiresAuth: true, nav: true, tama: 30}
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: RegisterView,
    meta: { nav: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { nav: false }
  },
  {
    path: '/activate/:uidb64/:token',
    name: 'activate',
    component: ActivationView,
    meta: { nav: false }
  },
  {
    path: '/focus/:taskID',
    name: 'focus',
    component: FocusView,
    props: true,
    meta: { requiresAuth: true, nav: false }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: { requiresAuth: true, nav: true, tama: 40 }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true, nav: true, tama: 30 }
  },
  {
    path: '/resend-activation',
    name: 'resendActivation',
    component: ResendActivationView,
    meta: {nav: false},
  },
  {
    path: '/404Error',
    name: 'NotFound',
    component: NotFoundView,
    meta: {nav: false},
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404Error'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isRootPath = to.path === '/';

  if (isRootPath) {
    if (!userStore.welcomeDone) {
      return next('/welcome');
    }
    if (!authStore.token) {
      return next('/login');
    }
    if (!authStore.user) {
      try {
        await authStore.fetchUserProfile();
        return next('/profile');
      } catch (error) {
        return next('/login');
      }
    }
    return next('/profile');
  }

  if (requiresAuth) {
    if (!authStore.token) {
      return next('/login');
    }
    if (!authStore.user) {
      try {
        await authStore.fetchUserProfile();
        next();
        return;
      } catch (error) {
        return next('/login');
      }
    }
  }
  next();
});

export default router
