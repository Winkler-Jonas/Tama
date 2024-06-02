<template>
  <div v-delay="{
                  seconds: .4,
                  onUpdate: handleActive,
                  onComplete: handleNotActive
          }"
       class="tama-app-back-btn"
      :class=""
  >
    <i class="ri-arrow-left-line"></i>
  </div>
</template>

<script setup>

import {computed, reactive} from "vue";

const props = defineProps({
  isClickable: {
    type: Boolean,
    required: true,
  }
})

const isClickable = computed(() => props.isClickable)


const iconColor = reactive({
  color: '#FFA976'
})

const handleActive = () => {

}



const handleNotActive = () => {

}

</script>

<style scoped>

</style>