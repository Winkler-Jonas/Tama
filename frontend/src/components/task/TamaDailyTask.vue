<template>
  <div>
    <span :lang="$i18n.locale">{{ daily.description }}</span>
  </div>
</template>

<script setup>


</script>

<style scoped>
.item {
  flex-shrink: 0;
  margin-inline: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 10px;
  background-color: var(--tama-color-daily);
}

.item span {
  hyphens: auto;
}

</style>