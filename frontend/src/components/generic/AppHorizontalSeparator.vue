<template>
  <div class="tama-horizontal-separator">
    <div class="tama-horizontal-left"></div>
    <p v-if="horizontalTxt" class="tama-horizontal-txt">
      {{ horizontalTxt }}
    </p>
    <div class="tama-horizontal-right"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  horizontalTxt: {
    type: String,
    required: false
  }
})

</script>

<style scoped>

.tama-horizontal-separator {
  height: fit-content;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
}

.tama-horizontal-left,
.tama-horizontal-right {
  flex: 1;
  height: 2px;
  background-color: #777777;
}

.tama-horizontal-txt {
  margin-inline: 1rem;
}

</style>