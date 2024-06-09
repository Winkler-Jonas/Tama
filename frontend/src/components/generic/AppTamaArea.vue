<template>
  <div id="tama-area-container" ref="tamaContainer" :style="tamaCurrentHeight">
    <div id="tama-area-round-shadow">
      <div id="tama-area-round-content">
      </div>
    </div>
    <h1>{{ tamaAreaText }}</h1>
    <div class="tama-area-pet-container">
      <img :src="tamaPet" alt="TamaPet">
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from "@/stores/uiStore.js"
import { computed, ref, watch } from "vue";

const tamaContainer = ref(null)
const { tamaSetHeight, tamaGetHeight } = useUIStore()

const props = defineProps({
  tamaAreaText: {
    type: String,
    required: false,
    default: ''
  },
  tamaAreaHeight: {
    type: Number,
    required: false,
  },
  tamaPet: {
    type: String,
    required: false,
    default: new URL('@/assets/pet.png', import.meta.url).href
  }
})

const tamaCurrentHeight = computed(() => ({height: `${tamaGetHeight.value}vh`}))

watch(() => props.tamaAreaHeight, (newHeight) => {
  tamaSetHeight(newHeight);
}, {immediate: true});

</script>

<style scoped>

#tama-area-container {
  width: 100%;

  background-color: transparent;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  transition: height 0.5s ease;
}

#tama-area-round-shadow {
  width: 200%;
  height: 200%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -78%);
  -webkit-box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 50%;
  overflow: visible;
  background-color: transparent;
}

#tama-area-round-content {
  width: 100%;
  height: 100%;
  background-color: #83B6C7;
  clip-path: ellipse(50% 50% at 50% 50%);
}


h1 {
  z-index: 1;
  font-size: clamp(2vh, 30px, 3vh);
  margin-inline: 20%;
  padding-top: clamp(3vh, 3rem, 5vh);
  text-align: center;
}

.tama-area-pet-container {
  flex: 1;
  margin: auto 0;
  z-index: 1;
  max-height: 35%;
  width: auto;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-area-pet-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

</style>