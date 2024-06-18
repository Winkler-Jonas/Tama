<script setup>
import Header from '@/components/Header.vue';
</script>

<template>
  <Header :selectHeader="selectHeader" />
  <form>
    <div class="optionsWrapper">
      <label class="normaltext">Sprache</label>
      <select class="normaltext">
        <option value="Deutsch">Deutsch</option>
        <option value="Englisch">Englisch</option>
      </select>
    </div>
    <div class="optionsWrapper">
      <label class="normaltext">Wochenstart</label>
      <select class="normaltext">
        <option value="Montag">Montag</option>
        <option value="Sonntag">Sonntag</option>
      </select>
    </div>
    <div class="optionsWrapper">
      <label class="normaltext">Benachrichtigungen</label>
      <select class="normaltext">
        <option value="An">An</option>
        <option value="Aus">Aus</option>
      </select>
    </div>
    <div class="optionsWrapper">
      <label class="normaltext">Feedback</label>
      <select class="normaltext">
        <option value="Anonymes Feedback">Anonymes Feedback</option>
      </select>
    </div>

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
form {
  display: flex;
  flex-direction: column;
}

.optionsWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  border: 1px solid var(--tama-color-black);
  border-radius: 20px;
  margin: 10px auto ;
  max-width: 250px;
}

label {
  margin-top: 20px;
  text-align: left;
  width: 80%;
  padding-left: 5px;
}

select {
  width: 80%;
  border: none;
  outline: none;
  padding: 0;
}
</style>