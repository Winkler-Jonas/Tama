<template>
  <div class="tama-tooltip"
       :style="`background: border-box ${bgColor};`"
  >
    <slot name="content"></slot>
  </div>
</template>

<script setup>

const props = defineProps({
  bgColor: {
    type: String,
    required: false,
    default: 'linear-gradient(-30deg,#D95B43,#ECD078)'
  }
})

</script>

<style scoped>


.tama-tooltip {
  position: absolute;
  top: 100%;
  color: #fff;
  font-size: var(--ctx-ft-sz);
  max-width: max-content;
  text-align: center;
  right: calc(var(--h-p-rl) * -1);
}
.tama-tooltip {
  --s: 1em; /* triangle size */
  --r: 1em; /* the radius */

  padding: 1em;
  border: var(--s) solid #0000;
  border-radius: calc(var(--r) + var(--s));
  border-top-right-radius: 0;
  mask:
      radial-gradient(100% 100% at 0 0,#0000 99%,#000 102%)
      calc(100% - var(--s)) 0/var(--s) var(--s) no-repeat border-box,
      linear-gradient(#000 0 0) padding-box;
}
</style>