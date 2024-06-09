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
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {requiresAuth: true}
  },
  {
    path: '/sign-up',
    name: 'signUp',
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
    path: '/:catchAll(.*)',
    redirect: '/404Error'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const userStore = useUserStore()

  if (requiresAuth && !authStore.token) {
    next('/login');
  } else if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUserProfile();
      if (!userStore.welcomeDone && to.path !== '/welcome') {
        next('/welcome');  // Redirect to welcome if the welcome process isn't done
      } else {
        next();
      }
    } catch (error) {
      next('/login');
    }
  } else {
    if (!userStore.welcomeDone && to.path !== '/welcome') {
      next('/welcome');  // Additional check when user is not navigating through auth required paths
    } else {
      next();
    }
  }
})

export default router
