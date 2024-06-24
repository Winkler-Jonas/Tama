<template>
  <app-horizontal-slider
      :amount-items="aiGeneratedItems.length"
      :current-index="currentIndex"
      @on-swipe-left="onNext"
      @on-swipe-right="onPrev"
      @on-resize="handleResize"
  >
    <template #slider-content>
      <div class="item" :style="itemStyle" v-for="(daily, index) in aiGeneratedItems" :key="index">
        <span :lang="locale">{{ daily.desc }}</span>
      </div>
    </template>
  </app-horizontal-slider>
</template>

<script setup>
import { useUserStore } from "@/stores/userStore.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import { formatDate } from "@/utils/calendarLogic.js";
import AppHorizontalSlider from "@/components/generic/AppHorizontalSlider.vue";
import {useI18n} from "vue-i18n"; useI18n()

const { locale } = useI18n()
const userStore = useUserStore()
const currentDate = ref(new Date());
const currentIndex = ref(userStore.dailySelected)
const slideContainerWidth = ref(0)

const aiGeneratedItems = computed(() => {
  const todayKey = formatDate(new Date());
  if (userStore.dailyTasks) {
    return userStore.dailyTasks[todayKey] || {};
  }
  return {}
});

const onNext = () => {
  if( currentIndex.value < aiGeneratedItems.value.length - 1) {
    currentIndex.value++
  }
}

const onPrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const itemStyle = computed(() => ({
  width: `${slideContainerWidth.value}px`,
  'min-width': `${slideContainerWidth.value}px`
}))

const handleResize = (args) => {
  slideContainerWidth.value = args[0]
}

/* Date stuff */

const updateDate = () => {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const msUntilTomorrow = tomorrow - now;

  setTimeout(async () => {
    currentDate.value = new Date();
    await userStore.getDailies();
    userStore.setDailySelected(0)
    updateDate();
  }, msUntilTomorrow);
}

onMounted(async () => {
  await userStore.getDailies();
  //updateDate();
});

onUnmounted(() => {
  clearTimeout(updateDate);
  userStore.setDailySelected(currentIndex.value)
});

</script>

<style scoped>



.item {
  flex-shrink: 0;
  margin-inline: auto;
  height: 100%;
  width: 100%;
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