<template>
  <app-horizontal-slider
      :amount-items="dailies.length"
      :current-index="carouselIndex"
      @on-swipe-left="onNext"
      @on-swipe-right="onPrev"
      @on-resize="handleResize"
  >
    <template #slider-content>
      <div v-for="(task, index) in dailies" :key="`task-carousel-${index}`"
           @click="emit('on-daily-clicked', task)"
           :style="itemStyle"
           class="carousel-item"
      >
        <span :lang="$i18n.locale">{{ task.desc }}</span>
      </div>
    </template>
  </app-horizontal-slider>
</template>

<script setup>
import AppHorizontalSlider from "@/components/generic/AppHorizontalSlider.vue";
import {computed, onUnmounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";

const userStore = useUserStore()

const slideContainerWidth = ref(0)
const handleResize = (args) => {
  slideContainerWidth.value = args[0]
}
const itemStyle = computed(() => ({
  width: `${slideContainerWidth.value}px`,
  'min-width': `${slideContainerWidth.value}px`
}))

const emit = defineEmits(['on-daily-clicked'])
const props = defineProps({
  todayDailies: {
    type: Array,
    required: false,
    default: []
  }
})

const dailies = computed(() => props.todayDailies)
const carouselIndex = ref(userStore.dailySelected)


const onNext = () => {
  if(carouselIndex.value < dailies.value.length - 1) {
    carouselIndex.value++
  }
}

const onPrev = () => {
  if (carouselIndex.value > 0) {
    carouselIndex.value--
  }
}

onUnmounted(() => {
  userStore.setDailySelected(carouselIndex)
})
</script>

<style scoped>
.carousel-item {
  flex-shrink: 0;
  margin-inline: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  border-radius: 10px;
  background-color: var(--tama-color-orange);
}

.carousel-item span {
  hyphens: auto;
}
</style>