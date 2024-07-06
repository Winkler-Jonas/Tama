<template>
  <section id="tama-calendar-view" :style="`padding-top: ${$route.meta.tama}vh`">

  </section>
  <tama-calendar />
</template>

<script setup>

import TamaCalendar from "@/components/calendar/TamaCalendar.vue";
</script>

<style scoped>

#tama-calendar-view {

}

</style>