<template>
  <div class="tama-settings-dropdown-wrapper">
    <div class="tama-settings-dropdown-header" :style="headerBorderStyle" @click="toggleDropdown">
      <div class="tama-settings-dropdown-icon-container">
        <tama-icon :icon-name="dropdownIcon" />
      </div>
      <div class="tama-settings-dropdown-text-container">
        <p>{{ currentDropdownLabel }}</p>
        <transition name="fade">
          <p v-show="showSelected" class="header-selected-item">{{ currentSelectedItem }}</p>
        </transition>
      </div>
      <i :class="['ri-arrow-down-s-line', { 'flipped': showDropdown }]" class="tama-settings-dropdown-icon-arrow"></i>
    </div>
    <transition name="height-transition" mode="out-in">
      <div v-show="showDropdown"
           class="tama-settings-dropdown-items-container"
           :style="[menuPositionStyle, menuCollapseStyle, menuBorderStyle]">
        <transition-group name="list" tag="div">
          <div v-for="(dropdownItem, idx) in currentDropdownItems" :key="`dropdownItem-${idx}`"
               class="dropdown-item"
               :style="{ '--animation-order': idx + 1 }"
               @click="handleItemClicked(dropdownItem)"
          >
            <p :key="idx">{{ dropdownItem.value }}</p>
          </div>
        </transition-group>
      </div>
    </transition>

  </div>
</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  dropdownLabel: {
    type: String,
    required: true
  },
  dropdownIcon: {
    type: String,
    required: true
  },
  dropdownItems: {
    type: Array,
    required: true
  },
  dropdownDefault: {
    type: Number,
    required: false,
    default: 0
  },
  collapseDirection: {
    type: String,
    required: false,
    default: 'up',
    validator(value, props) {
      return ['up', 'down'].includes(value)
    }
  },
  externalCollapse: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
    'onSelect',
    'onInputClicked'
])

const showSelected = ref(true)
const showDropdown = ref(false)
const dropdownSelected = computed(() => props.dropdownDefault)
const currentDropdownItems = computed(() => props.dropdownItems)
const currentSelectedItem = computed(() => currentDropdownItems.value[dropdownSelected.value].value)
const externalCollapse = computed(() => props.externalCollapse)

const currentDropdownLabel = computed(() => props.dropdownLabel)
const collapseDirection = computed(() => props.collapseDirection)

watch(externalCollapse, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    showDropdown.value = false
  }
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  emit('onInputClicked')
}

const handleItemClicked = (dropDownItem) => {
  showDropdown.value = false

  if (dropDownItem.value !== currentSelectedItem.value) {
    dropDownItem.callback()
  }
}

watch(currentSelectedItem, (newValue, oldValue) => {
  showSelected.value = false
  setTimeout(() => {
    showSelected.value = true
  },300)
})


const headerBorderStyle = computed(() => {
  const style = {'border-radius': 'var(--br)'}
  if (showDropdown.value) {
    if (collapseDirection.value === 'up') {
      style["border-radius"] = '0 0 var(--br) var(--br)'
    } else if (collapseDirection.value === 'down') {
      style["border-radius"] = 'var(--br) var(--br) 0 0'
    }
  }
  return style
})

const menuPositionStyle = computed(() => {
  const posStyle = {top: '100%', bottom: ''}
  if (collapseDirection.value === 'up') {
    posStyle.top = ''
    posStyle.bottom = '100%'
  }
  return posStyle
})

const menuBorderStyle = computed(() => {
  const style = {'border-radius': ''}
  if (collapseDirection.value === 'up') {
    style["border-radius"] = 'var(--br) var(--br) 0 0'
  } else if (collapseDirection.value === 'down') {
    style["border-radius"] = '0 0 var(--br) var(--br)'
  }
  return style
})

const menuCollapseStyle = computed(() => {
  return { 'max-height': showDropdown.value ? `${props.dropdownItems.length * 4}rem` : '0', opacity: showDropdown.value ? '1' : '0' }
})
</script>

<style scoped>

.tama-settings-dropdown-wrapper {
  --mlr: 1rem;
  --h: 3rem;
  --br: .5rem;

  position: relative;
}

.tama-settings-dropdown-header {
  width: 100%;
  height: auto;

  transition: border-radius .5s ease;
  border: 1px solid black;
  border-radius: 10px;
  padding-right: 1em;

  display: flex;
  align-items: center;
}

.header-selected-item {
  font-weight: bold;
}

.tama-settings-dropdown-text-container {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1em 0;
}

.tama-settings-dropdown-icon-container {
  width: 20%;
  max-width: 200px;
  padding: 1em;
}

.tama-settings-dropdown-items-container {
  position: absolute;
  z-index: 10;
  width: 100%;

  overflow: hidden;
  background: white;
  padding: 0 var(--mlr);
  border: 1px solid black;
  transform-style: preserve-3d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.dropdown-item {
  padding: 1em 0 1em 15%;

  opacity: 0;
  background: linear-gradient(#00000005, #0000), #fff;
  transform: translate3d(0, 0, 0);
  animation: firstShow 0.5s ease-in-out forwards, show 0.15s linear forwards;
  animation-delay: calc(0.1s * var(--animation-order));
}



.tama-settings-dropdown-icon-arrow {
  margin-left: auto;
  font-size: 2rem;

  transition: transform 0.3s ease;
  display: inline-block;
}

.tama-settings-dropdown-icon-arrow.flipped {
  transform: scaleY(-1);
}



/* Animations */

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

.height-transition-enter-active, .height-transition-leave-active {
  max-height: 500px;
  opacity: 1;
}

.height-transition-enter, .height-transition-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>