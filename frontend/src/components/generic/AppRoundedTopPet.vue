<template>
  <section class="tama-rounded-top-container" :style="`height:${contentHeight}%`">
    <div class="tama-rounded-top-container-content">
      <p class="tama-rounded-top-container-header">{{ headerTxt }}</p>
      <div class="image-container">
        <img class="cropped-image" src="@/assets/pet.png" alt="pet-img">
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  headerTxt: {
    type: String,
    required: false,
  },
  contentHeight: {
    type: Number,
    required: false,
    default: 50,
  },
});
</script>

<style scoped>

.tama-rounded-top-container {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
}

.tama-rounded-top-container::before {
  border-radius: 100%;
  position: absolute;
  background: rgba(131, 182, 199, 1);
  right: -200px;
  left: -200px;
  top: -200px;
  content: '';
  bottom: 10px;
  -webkit-box-shadow: 0px 10px 4px -6px rgba(119,119,119,0.6);
  box-shadow: 0px 10px 4px -6px rgba(119,119,119,0.6);
}

.tama-rounded-top-container-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tama-rounded-top-container-content p {
  font-size: var(--greet-f-sz);
  font-weight: bolder;
  max-width: var(--greet-sz);
}

.tama-rounded-top-container-header {
  padding-top: 2rem;
}

.image-container {
  max-width: 150px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.cropped-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
