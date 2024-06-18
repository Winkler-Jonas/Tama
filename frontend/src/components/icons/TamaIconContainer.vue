<template>
  <div class="tama-icon-wrapper">
    <div class="tama-icon-aspect-ratio"></div>
    <div class="tama-icon-content">
      <div class="tama-icon-container">
        <tama-icon :icon-name="iconName"/>
      </div>
      <p :lang="languageStore.locale">{{ iconText }}</p>
    </div>
  </div>
</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {useLanguageStore} from "@/stores/langStore.js";
const languageStore = useLanguageStore()


const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  iconText: {
    type: String,
    required: true,
  }
})

</script>

<style scoped>

.tama-icon-wrapper {
  --i-w: 30%;
  --i-mw: 150px;
  position: relative;
  width: min(var(--i-w), var(--i-mw));
}

.tama-icon-aspect-ratio {
  padding-top: 100%;
}

.tama-icon-content {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: .5em 0;

  border: 2px solid black;
  border-radius: 20%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.tama-icon-content p {
  margin-top: auto;
  hyphens: auto;
  font-size: clamp(10px, 12px, 20px);
}

.tama-icon-container {
  margin-inline: 25%;
}


</style>