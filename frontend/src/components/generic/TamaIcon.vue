<template>
  <svg class="tama-icon" :style="`background-color: ${backGroundColor};`" viewBox="0 0 37 37">
    <use class="tama-icon" :xlink:href="`#icon-${iconName}`"></use>
  </svg>
</template>

<script setup>

const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  backGroundColor: {
    type: String,
    required: false,
    default: 'none'
  }
})

</script>

<style>

.tama-icon {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
}

</style>