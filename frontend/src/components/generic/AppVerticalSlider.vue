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
  <div ref="containerRef" :style="computedHeight">
    <div ref="slidableRef" class="slidable">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, reactive, computed} from 'vue';

const props = defineProps({
  bounceBack: {
    type: Boolean,
    required: false,
    default: true
  },
  containerHeight: {
    type: Number,
    required: false,
    default: 100
  },
  /**
   * Percentage values of the container
   */
  bounceTopThreshold: {
    type: Number,
    required: false,
    default: 10
  },
  bounceBotThreshold: {
    type: Number,
    required: false,
    default: 5
  },
  bounceTopTarget: {
    type: Number,
    required: false,
    default: 30
  },
  bounceBotTarget: {
    type: Number,
    required: false,
    default: 10
  }
})

const computedHeight = computed(() => ({height: `${props.containerHeight}%`}))

const bounceTopThresholdPC = computed(() => props.bounceTopThreshold / 100)
const bounceBotThresholdPC = computed(() => props.bounceBotThreshold / 100)
const bounceTopTargetPC = computed(() => props.bounceTopTarget / 100)
const bounceBotTargetPC = computed(() => props.bounceBotTarget / 100)

onMounted(() => {
  slidableRef.value.addEventListener('touchstart', handleTouchStart, { passive: false });
  slidableRef.value.addEventListener('touchmove', handleTouchMove, { passive: false });
  slidableRef.value.addEventListener('touchend', handleTouchEnd, { passive: false });

  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === slidableRef.value) {
        const rect = entry.target.getBoundingClientRect();
        slidable.top = rect.top;
        slidable.bottom = rect.bottom;
        slidable.height = rect.height;
      } else if (entry.target === containerRef.value) {
        const rect = entry.target.getBoundingClientRect();
        container.top = rect.top;
        container.bottom = rect.bottom;
        container.height = rect.height;
      }
    });
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  if (slidableRef.value) {
    resizeObserver.observe(slidableRef.value);
  }

  onUnmounted(() => {
    resizeObserver.disconnect();
    try {
      slidableRef.value.removeEventListener('touchstart', handleTouchStart);
      slidableRef.value.removeEventListener('touchmove', handleTouchMove);
      slidableRef.value.removeEventListener('touchend', handleTouchEnd);
    } catch (error) {
      // ignore
    }
  });
});

const containerRef = ref(null);
const slidableRef = ref(null);

const slidable = reactive({
  bottom: 0,
  top: 0,
  height: 0,
  translateY: 0
})
const container = reactive({
  bottom: 0,
  top: 0,
  height: 0
})

let lastY = 0;
let lastTime = 0;
let velocityY = 0;

let startY = 0;
let initialY = 0;
let initialTop = 0;
let sliding = false;
let animationFrameID = null;

const handleTouchStart = (event) => {
  if (!event.touches[0]) return;
  event.preventDefault()

  slidableRef.value.style.transition = 'none';
  startY = event.touches[0].clientY;
  initialY = slidable.translateY;
  initialTop = slidable.top;
  sliding = true;
};

const handleTouchMove = (event) => {
  if (!event.touches[0] || !sliding) return;
  event.preventDefault()

  const touchY = event.touches[0].clientY;
  const now = Date.now();
  const diffY = touchY - startY;  // Difference from the start position
  const timeDiff = now - lastTime;

  if (!animationFrameID) {
    animationFrameID = requestAnimationFrame(() => {
      let newTop = initialTop + diffY;
      let newBot = newTop + slidable.height;
      let newTranslateY = initialY + diffY;  // Calculated new translateY

      if (newBot >= container.bottom) {
        let overflow = newBot - container.bottom;
        newTranslateY -= overflow * 1.1;  // Apply resistance by reducing overflow
      }
      if (newTop <= container.top) {
        let underflow = container.top - newTop;
        newTranslateY += underflow * 1.1;  // Apply resistance by reducing underflow
      }

      slidable.translateY = newTranslateY;
      slidableRef.value.style.transform = `translateY(${newTranslateY}px)`;
      slidable.top = initialTop + (newTranslateY - initialY);
      slidable.bottom = slidable.top + slidable.height;

      animationFrameID = null;
    });
  }
  if (timeDiff > 0) {
    velocityY = (touchY - lastY) / timeDiff * 1000;
  }
  lastY = touchY;
  lastTime = now;
};

const handleTouchEnd = (event) => {
  if (!sliding) return;
  sliding = false;
  event.preventDefault()

  if (animationFrameID) {
    cancelAnimationFrame(animationFrameID);
    animationFrameID = null;
  }

  const momentumDistance = velocityY * 0.09;  // Smaller factor to reduce excessive movement

  const newPotentialTop = slidable.top + momentumDistance;
  const newPotentialBottom = newPotentialTop + slidable.height;

  let actualNewTranslateY = slidable.translateY + momentumDistance;  // Start with a direct application of momentum

  if (newPotentialBottom > container.bottom) {
    actualNewTranslateY -= (newPotentialBottom - container.bottom);
  } else if (newPotentialTop < container.top) {
    actualNewTranslateY += (container.top - newPotentialTop);
  }

  slidableRef.value.style.transition = 'transform 0.3s ease-out';
  slidableRef.value.style.transform = `translateY(${actualNewTranslateY}px)`;

  slidable.top = slidable.top + (actualNewTranslateY - slidable.translateY);
  slidable.bottom = slidable.top + slidable.height;

  slidable.translateY = actualNewTranslateY;

  if (props.bounceBack) {
    // timeout required to change transform setting
    setTimeout(() => {
      bounceBack();
    }, 100);
  }

  initialY = slidable.translateY;
};

const bounceBack = () => {
  slidableRef.value.style.transition = 'transform 0.4s cubic-bezier(0,.58,.67,1.62)';

  const thresholdTop = container.height * bounceTopThresholdPC.value
  const targetBounceTop = container.height * bounceTopTargetPC.value
  const thresholdBottom = container.height * bounceBotThresholdPC.value
  const targetBounceBottom = container.height * bounceBotTargetPC.value

  if (slidable.bottom >= container.bottom - thresholdBottom) {

    slidable.translateY-=targetBounceBottom;
    slidableRef.value.style.transform = `translateY(${slidable.translateY}px)`;

    slidable.top-=targetBounceBottom;
    slidable.bottom-=targetBounceBottom;
  } else if (slidable.top <= container.top + thresholdTop) {

    slidable.translateY+=targetBounceTop
    slidableRef.value.style.transform = `translateY(${slidable.translateY}px)`

    slidable.top+=targetBounceTop
    slidable.bottom-=targetBounceTop
  }
}

</script>

<style scoped>
.container {
  position: relative;
}

.slidable {
  display: inherit;
  min-height: 1px;
  max-height: 100%;
  position: relative;
  user-select: none;
  touch-action: none;
  transform: translate3d(0, 0, 0);
  will-change: transform;
  transition: transform 0.3s ease-out;
}

</style>