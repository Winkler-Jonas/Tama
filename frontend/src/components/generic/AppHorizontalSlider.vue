/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
<template>
  <div class="swipe-container" :class="{'disable-gradient': !showGradient}"
       @touchstart.passive="handleTouchStart"
       @touchmove.passive="handleTouchMove"
       @touchend.passive="handleTouchEnd"
       ref="containerRef"
  >
    <div class="wrapper" :style="wrapperStyle" ref="wrapperRef">
      <slot name="slider-content"></slot>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';

const props = defineProps({
  currentIndex: {
    type: Number,
    required: true
  },
  amountItems: {
    type: Number,
    required: true
  },
  isCircular: {
    type: Boolean,
    required: false,
    default: false
  },
  showGradient: {
    type: Boolean,
    required: false,
    default: true
  }
})

const amountItems = computed(() => props.amountItems)
const currentIndex = computed(() => props.currentIndex)
const emit = defineEmits(['onSwipeLeft', 'onSwipeRight', 'onResize', 'onLocked'])
const wrapperRef = ref(null)
const startPosition = ref(0)
const currentTranslate = ref(0)

const containerRef = ref(null)
const containerWidth = ref(0)

const wrapperStyle = computed(() => ({width: `${amountItems.value * 100}%`}))


watch(currentIndex, (newValue, oldValue) => {
  currentTranslate.value = -newValue * containerWidth.value;
  if (props.isCircular && oldValue === 2 || oldValue === 0) {
      wrapperRef.value.style.transition = 'none';
      wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`
  } else {
    wrapperRef.value.style.transition = 'transform 0.5s ease';
    wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`;

    wrapperRef.value.addEventListener('transitionend', handleTransitionEnd)
  }
})

const handleTransitionEnd = (event) => {
  if (event && event.propertyName === 'transform') {
    emit('onLocked')
    wrapperRef.value.removeEventListener('transitionend', handleTransitionEnd)
  }
}

const handleTouchStart = (event) => {
  startPosition.value = event.touches[0].clientX;
  currentTranslate.value = -currentIndex.value * containerWidth.value;
  wrapperRef.value.style.transition = 'none';
};

const handleTouchMove = (event) => {
  const diffX = event.touches[0].clientX - startPosition.value;
  currentTranslate.value = (-currentIndex.value * containerWidth.value) + diffX;
  wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`;
};

const handleTouchEnd = () => {
  const moveDistance = currentTranslate.value + (currentIndex.value * containerWidth.value);
  const threshold = containerWidth.value / 3;

  if (-moveDistance > threshold && currentIndex.value < amountItems.value - 1) {
    emit('onSwipeLeft')
  } else if (moveDistance > threshold && currentIndex.value > 0) {
    emit('onSwipeRight')
  } else {
    currentTranslate.value = -currentIndex.value * containerWidth.value;
    wrapperRef.value.style.transition = 'transform 0.5s ease';
    wrapperRef.value.style.transform = `translateX(${currentTranslate.value}px)`;
  }
};

watchEffect(() => {
  emit('onResize', [containerWidth.value - 25])
})

const handleResize = (event) => {
  containerWidth.value = containerRef.value.offsetWidth
}

onMounted(() => {
  containerWidth.value = containerRef.value.offsetWidth
  wrapperRef.value.style.transform = `translateX(-${currentIndex.value * containerWidth.value}px)`
  window.addEventListener('resize', handleResize)
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

</script>

<style scoped>

.swipe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: max-content;
}

.swipe-container.disable-gradient::before,
.swipe-container.disable-gradient::after {
  content: none;
}

.swipe-container:before,
.swipe-container:after {
  content: '';
  position: absolute;

  top: 0;
  bottom: 0;
  width: 11px;
  z-index: 2;
}

.swipe-container::before {
  left: -1px;
  background: linear-gradient(to right, white, transparent);
}

.swipe-container::after {
  right: -1px;
  background: linear-gradient(to left, white, transparent);
}


.wrapper {
  display: flex;
  gap: 10px;
}

</style>