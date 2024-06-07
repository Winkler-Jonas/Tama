import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ActivationView from '@/views/ActivationView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/auth'
import ProfileView from "@/views/ProfileView.vue";
import ResendActivationView from "@/views/ResendActivationView.vue";
import OpeningView from '@/views/OpeningView.vue'
import AboutView from '@/views/AboutView.vue'
import SelectFokusView from '@/views/SelectFokusView.vue'
import KalenderView from '@/views/KalenderView.vue'
import ChangeFokusView from '@/views/ChangeFokusView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {requiresAuth: true}
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/activate/:uidb64/:token',
    name: 'activate',
    component: ActivationView
  },
  {
    path: '/resend-activation',
    name: 'resendActivation',
    component: ResendActivationView },

  {
    path: '/404Error',
    name: 'NotFound',
    component: NotFoundView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404Error'
  },
  {
    path: '/opening',
    name: 'Opening',
    component: OpeningView,
  },
  {
    path: '/select-focus',
    name: 'SelectFokus',
    component: SelectFokusView,
  },
  {
    path: '/calender',
    name: 'Kalender',
    component: KalenderView,
  },
  {
    path: '/focus',
    name: 'Fokus',
    component: ChangeFokusView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.token) {
    next('/login')
  } else if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserProfile()
      next()
    } catch (error) {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
