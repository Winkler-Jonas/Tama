<template>
  <div class="footer">
    <button class="normaltext" @click="handleClickOnAddTask">+</button>
    <div class="icon_wrapper" >
      <img src="../assets/Kalender.png" alt="" @click="goToCalender">
      <img src="../assets/Ziel.png" alt=""  @click="goToFocus">
      <img src="../assets/Settings.png" alt="" @click="goToSettings">
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      openAddTask: true,
    }
  },
  props: ['AddTask'],
  methods: {
    handleClickOnAddTask() {
      this.$emit('openAddTask');
    },
    goToCalender() {
      this.$router.push({ name: 'Kalender'})
    },
    goToFocus() {
      this.$router.push({ name: 'Fokus'})
    },
    goToSettings() {
      this.$router.push({ name: 'Settings'})
    },
  },
}
</script>

<style scoped>
button {
  padding: 5px;
  border-radius: 50%;
  width: 45px;
  aspect-ratio: 1 / 1;
  border: none;
  color: var(--tama-color-white);
  background-color: var(--tama-color-black);
  margin-bottom: 20px;
  text-align: center;
  font-size: 35px;

}

.footer {
  height: fit-content;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.icon_wrapper {
  background-color: var(--tama-color-beige);
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 25%);

}

img {
  vertical-align: middle;
  margin: 0% 5%;
}
</style>