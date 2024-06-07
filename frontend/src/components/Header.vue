<template>
  <div class="headerWrapper">
    <div class="image-container">
      <h2 v-if="showHeadline"> {{ headline }}</h2>
      <img src="../assets/tama.png" alt="tama" v-if="showTama">
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
    }
  },
  mounted() {
    switch (this.selectHeader) {
      case 'opening':
        this.showTama = true;
        this.showHeadline = true;
        this.headline = 'Schön, dass du da bist!';
        break;
      case 'fokus':
        this.showTama = false;
        this.showHeadline = true;
        this.headline = 'Was ist dein Fokus?';
        break;
    
      default:
        this.showHeadline = false;
        this.headline = null;
        this.showTama = true;
        break;
    }
  }

}
</script>

<style scoped>
.image-container h2 {
  width: 50%;
  margin: 0 auto;
}

.headerWrapper {
  clip-path: ellipse(100% 100% at 50% 0%);
  background-color: #83b6c7;
  text-align: center;
  min-width: 150px;
}

.image-container img {
  width: 50%;
  max-width: 400px;
  min-width: 150px;
}
</style>