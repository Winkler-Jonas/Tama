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
  <div class="tama-dropdown-container" :style="menuCollapsed ? 'z-index: 20;' : ''">
    <h2 v-if="menuLabel">{{ menuLabel }}</h2>
    <div class="tama-dropdown-input-field" :style="tamaInputFieldBorder" @click="handleInputClicked">
      <p>{{ selectedItem }}</p>
      <i :class="['ri-arrow-down-s-line', { 'flipped': menuCollapsed }]" class="icon"></i>
    </div>
    <transition name="height-transition" mode="out-in">
      <div v-show="menuCollapsed"
           class="tama-dropdown-items-container"
           :style="[tamaInputContainerBorder, menuCollapseStyle, menuPositionStyle]"
           key="dropdown" >
        <transition-group name="list" tag="div">
          <div v-for="(item, idx) in menuItems" :key="`${item}-${idx+1}`"
               class="tama-dropdown-item"
               :style="{ '--animation-order': idx + 1 }"
               @click.stop.prevent="handleItemClick(idx)"
          >
            <p :key="idx" class="tama-dropdown-item-txt">
              {{ item }}
            </p>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script setup>

import {computed, onMounted, onUnmounted, ref, watch} from "vue";

onMounted(() => {
  const selectIdx = (props.menuItems.length > props.defaultSelect) ? props.defaultSelect : 0
  selectedItem.value = props.menuItems[selectIdx]
  if (!props.defaultCollapsed) {
    emit('onSelect', [selectedItem.value, selectIdx])
  }
})

onUnmounted( () => {
  emit('onSelect', [selectedItem.value, clickedIdx.value])
})

const props = defineProps({
  menuLabel: {
    type: String,
    required: false,
    default: ''
  },
  defaultSelect: {
    type: Number,
    required: false,
    default: 0
  },
  menuItems: {
    type: Array,
    required: true,
    default: []
  },
  direction: {
    type: String,
    required: false,
    default: 'down',
    validator(value, props) {
      return ['up', 'down'].includes(value)
    }
  },
  defaultCollapsed: {
    type: Boolean,
    required: false,
    default: false
  },
  externalCollapse: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onSelect', 'onInputClicked'])

const collapseDirection = computed(() => props.direction)
const menuPositionStyle = computed(() => {
  const posStyle = {top: '100%', bottom: ''}
  if (collapseDirection.value === 'up') {
    posStyle.top = ''
    posStyle.bottom = 'calc(100% - var(--tama-h2-size) - 0.83em)'
  }
  return posStyle
})
const externalCollapse = computed(() => props.externalCollapse)


watch(externalCollapse, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    menuCollapsed.value = false
  }
})

const selectedItem = ref('')
const menuCollapsed = ref(props.defaultCollapsed)
const clickedIdx = ref(0)

const handleItemClick = (idx) => {
  menuCollapsed.value = false
  clickedIdx.value = idx
  selectedItem.value = props.menuItems[idx]
  emit("onSelect", [selectedItem.value, idx])
}

const handleInputClicked = () => {
  menuCollapsed.value = !menuCollapsed.value
  emit('onInputClicked')
}

const tamaInputFieldBorder = computed(() => {
  const style = {'border-radius': 'var(--br)'}
  if (menuCollapsed.value) {
    if (collapseDirection.value === 'up') {
      style["border-radius"] = '0 0 var(--br) var(--br)'
    } else if (collapseDirection.value === 'down') {
      style["border-radius"] = 'var(--br) var(--br) 0 0'
    }
  }
  return style
})

const tamaInputContainerBorder = computed(() => {
  const style = {'border-radius': ''}
  if (collapseDirection.value === 'up') {
    style["border-radius"] = 'var(--br) var(--br) 0 0'
  } else if (collapseDirection.value === 'down') {
    style["border-radius"] = '0 0 var(--br) var(--br)'
  }
  return style
})

const menuCollapseStyle = computed(() => {
  return { 'max-height': menuCollapsed.value ? `${props.menuItems.length * 4}rem` : '0', opacity: menuCollapsed.value ? '1' : '0' }
})

defineExpose({
  handleInputClicked,
})
</script>

<style scoped>

.tama-dropdown-container {
  min-width: 100%;
  width: 100%;
  --mlr: 1rem;
  --h: 3rem;
  --br: .5rem;

  position: relative;
  filter: drop-shadow(0.25rem 0.25rem 0.5rem #0005);
  perspective: 1000px;
}

.tama-dropdown-input-field {
  position: relative;

  height: var(--h);
  width: 100%;
  padding: 0 var(--mlr);

  transition: border-radius 0.5s ease;
  border-radius: .5rem;
  background: #FFF;

  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tama-dropdown-input-field p {
  flex: 1;
}

.tama-dropdown-input-field i {
  font-size: 30px;
}

.tama-dropdown-items-container {
  position: absolute;
  width: 100%;

  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;

  overflow: hidden;
  padding: 0 var(--mlr);
  border: 1px solid black;

  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
}

.tama-dropdown-item {
  height: var(--h);
  max-height: calc(var(--h) + 1rem);
  display: flex;
  align-items: center;

  position: relative;
  background: linear-gradient(#00000005, #0000), #fff;

  opacity: 0;
  transform: translate3d(0, 0, 0);
  animation: firstShow 0.5s ease-in-out forwards, show 0.15s linear forwards;
  animation-delay: calc(0.1s * var(--animation-order));
}

/* Animation */
@keyframes firstShow {
  0%, 100% {
    transform: perspective(1000px) translate3d(0, 0, 0);
  }
  50% {
    transform: perspective(1000px) translate3d(0, 0, 3em);
  }
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.tama-dropdown-item:hover, .tama-dropdown-item:focus-within {
  transform: translate3d(0, 0, 3em);
}

.tama-dropdown-input-field .icon {
  transition: transform 0.3s ease;
  display: inline-block;
}

.tama-dropdown-input-field .icon.flipped {
  transform: scaleY(-1);
}

.height-transition-enter-active, .height-transition-leave-active {
  max-height: 500px;
  opacity: 1;
}

.height-transition-enter, .height-transition-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>