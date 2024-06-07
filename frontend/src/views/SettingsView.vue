<script setup>
import Header from '@/components/Header.vue';
</script>

<template>
  <Header :selectHeader="selectHeader"/>
  <form>
      <label>Sprache</label>
      <select>
        <option value="Deutsch">Deutsch</option>
        <option value="Englisch">Englisch</option>
      </select>
      <label>Wochenstart</label>
      <select>
        <option value="Montag">Montag</option>
        <option value="Sonntag">Sonntag</option>
      </select>
      <label>Benachrichtigungen</label>
      <select>
        <option value="An">An</option>
        <option value="Aus">Aus</option>
      </select>
      <label>Feedback</label>
      <select>
        <option value="Anonymes Feedback">Anonymes Feedback</option>
      </select>
    </form>
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'settings'
    }
  },
}
</script>

<style scoped>
label {
  display: block;
  margin: 5%;
}
</style>