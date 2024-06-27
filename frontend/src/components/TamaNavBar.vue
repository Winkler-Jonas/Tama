<template>
  <transition name="tama-nav-slide-up-down">
    <section id="Tama-nav-bar" class="main-gl-nav" v-if="showNav">
      <div v-for="key in navRoutes" :key="key"
           class="tama-nav-icon-container"
           :class="{ 'tama-nav-active-tab': isRouteActive(key.route) }"
           @click="handleNavigation(key.route)"
      >
        <tama-icon
             :icon-name="key.icon"
             class="tama-nav-icon"
        />
      </div>
    </section>
  </transition>
</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";


const route = useRoute();
const navRoutes = ref({
  calendar: {
    route: 'calendar',
    icon: 'calendar'
  },
  target: {
    route: 'profile',
    icon: 'home'
  },
  settings: {
    route: 'settings',
    icon: 'settings'
  }
})

onMounted(() => {
  showNav.value = true
})

const showNav = ref(false)

const isRouteActive = (tabValue) => {
  return tabValue === route.name
}

const handleNavigation = (route) => {
  router.push(route)
}




</script>

<style scoped>

#Tama-nav-bar {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

}

.tama-nav-icon-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1em var(--sgn-mi) var(--sgn-mbt) var(--sgn-mi);

  background-color: var(--tama-color-nav);
  box-shadow:
      rgba(0, 0, 0, 0.4) 0px -2px 4px,
      rgba(0, 0, 0, 0.3) 0px -7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px 3px 0px inset;
}

.tama-nav-icon {
  width: 60% !important;

}

.tama-nav-active-tab {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}



/* Slide up down animation */
.tama-nav-slide-up-down-enter-active,
.tama-nav-slide-up-down-leave-active {
  transition: all 0.5s ease;
}

.tama-nav-slide-up-down-leave-active {
  transform: translateY(0%);
}

.tama-nav-slide-up-down-enter-from,
.tama-nav-slide-up-down-leave-to {
  transform: translateY(100%);
}

</style>