<template>
  <div class="footer">
    <button @click="handleClickOnAddTask">+</button>
    <div class="icon_wrapper">
      <img src="../assets/Kalender.png" alt="">
      <img src="../assets/Ziel.png" alt="">
      <img src="../assets/Settings.png" alt="">
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
      this.$emit('openAddTask', this.openAddTask);
    }
  },
}
</script>

<style scoped>
button {
  margin: 5%;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.icon_wrapper {
  background-color: #f7ede2;

}

img {
  vertical-align: middle;
  margin: 0% 5%;
}
</style>