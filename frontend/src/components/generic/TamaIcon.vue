<template>
  <svg class="tama-icon" viewBox="0 0 37 37">
    <use class="tama-icon" :xlink:href="`#${iconName}`"></use>
  </svg>
</template>

<script setup>

const props = defineProps({
  iconName: {
    type: String,
    required: true
  }
})

</script>

<style>

.tama-icon {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
}

</style>