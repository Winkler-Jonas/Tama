<template>
  <div class="header-wrapper">
    <div class="headline-container">
      <img  id="back-arrow" v-if="showBackArrow" src="../assets/arrow.png" alt="" @click="goToHome">
      <h1 class="headline" v-if="showHeadline"> {{ headline }}</h1>
    </div>
    <div class="image-container">
      <img id="tama" src="../assets/animation/tama_idle.gif" alt="tama" v-if="showTama">
    </div>
  </div>
</template>

<script>
export default {
  props: ['selectHeader'],
  data() {
    return {
      showTama: true,
      showHeadline: false,
      headline: null,
      showBackArrow: false,
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: 'home'})
    }
  },
  mounted() {
    switch (this.selectHeader) {
      case 'opening':
        this.showTama = true;
        this.showBackArrow = false;
        this.showHeadline = true;
        this.headline = 'Schön, dass du da bist!';
        break;
      case 'fokus':
        this.showTama = false;
        this.showBackArrow = false;
        this.showHeadline = true;
        this.headline = 'Was ist dein Fokus?';
        break;
      case 'calender':
        this.showTama = false;
        this.showBackArrow = true;
        this.showHeadline = true;
        this.headline = 'Kalender';
        break;
      case 'changeFokus':
        this.showTama = false;
        this.showBackArrow = true;
        this.showHeadline = true;
        this.headline = 'Fokus';
        break;
      case 'settings':
        this.showTama = false;
        this.showBackArrow = true;
        this.showHeadline = true;
        this.headline = 'Einstellungen';
        break;

      default:
        this.showBackArrow = false;
        this.showHeadline = false;
        this.headline = null;
        this.showTama = true;
        break;
    }
  }

}
</script>

<style scoped>
#headline {
  width: 80%;
  margin: 0 auto;
}

.header-wrapper {
  position: sticky;
  top: 0;
  clip-path: ellipse(100% 100% at 50% 0%);
  background-color: var(--tama-color-blue);
  text-align: center;
  min-width: 150px;
}

#tama {
  width: 100%;
  max-width: 400px;
  min-width: 150px;
}

.headline-container {
  display: flex;
}
#back-arrow {
  width: 20%;
  max-width: 100px;
  min-width: 50px;
}
.image-container {
  overflow: hidden;
  max-height: 220px ;
}

</style>