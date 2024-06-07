<script setup>
import Header from '@/components/Header.vue';
import Kalender from '@/components/Kalender.vue';
import Daily from '@/components/Task/Daily.vue';
import Aufgabe from '@/components/Task/Aufgabe.vue';
</script>

<template>
  <Header :selectHeader="selectHeader" />
  <Kalender />
  <h1>Aufgaben heute</h1>
  <Aufgabe />
  <div class="color-box">
    <Daily />
    <div class="datum-box">
      <p id="datum">Datum</p>
      <p id="Uhrzeit">Uhrzeit</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'calender'
    }
  },
}
</script>

<style scoped>
.color-box {

  background-color: #4CAF50;
  /* Grüne Farbe */
  border: 2px solid #000;
  /* Schwarzer Rand */
  border-radius: 10px;
  /* Abgerundete Ecken */
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
  /* Schatteneffekt */
}

.datum-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0px;
}
</style>