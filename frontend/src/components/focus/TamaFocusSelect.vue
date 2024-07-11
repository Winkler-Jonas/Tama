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
  <tama-slide-up :is-visible="showComponent" :slide-height="100 - $route.meta.tama">
    <template #slide-up-content>
      <div class="tama-focus-section">
        <div class="tama-focus-section-header">
          <h2 class="text-center">{{ userStore.welcomeDone ? $t('components.category.header') : $t('components.category.headerFirst') }}</h2>
          <p class="text-sm text-center">{{ userStore.welcomeDone ? $t('components.category.subHeader'): $t('components.category.subHeaderFirst') }}</p>
        </div>
        <div class="tama-focus-select-icon-wrapper">
          <tama-focus-icon
              v-for="(value, key) in categories" :key="key"
              :category-key="key"
              :category-value="value"
              :is-active="selectedFocus === key"
              @on-focus-select="selectedFocus = key"
          />
        </div>
        <app-button class="app-button-focus-select" :btn-text="$t('components.category.done')" @on-click="handleFocusChange" />
      </div>
    </template>
  </tama-slide-up>
</template>

<script setup>
import {useI18n} from "vue-i18n"
import {computed, ref} from "vue"
import TamaFocusIcon from "@/components/focus/TamaFocusIcon.vue"
import TamaSlideUp from "@/components/TamaSlideUp.vue"
import {useUserStore} from "@/stores/userStore.js"
import AppButton from "@/components/generic/AppButton.vue";

const userStore = useUserStore()
const { tm } = useI18n()
const contentData = computed(() => tm(''))
const selectedFocus = ref(userStore.userFocus)

const categories = computed(() => Object.fromEntries(Object.entries(contentData.value.components.category || {}).filter(([key, value]) => !key.toLowerCase().includes('header') && key !== 'done')))

const emit = defineEmits(['on-focus-selected'])
const props = defineProps({
  showFocusSelect: {
    type: Boolean,
    default: false
  }
})

const showFocusSelect = computed(() => props.showFocusSelect)
const showComponent = computed(() => showFocusSelect.value)

const handleFocusChange = () => {
  if (selectedFocus.value) {
    userStore.setWelcomeDone(true)
    try{
      userStore.setUserFocus(selectedFocus.value)
      emit('on-focus-selected')
    }catch (error) {
      // no time
    }
  }

}

</script>

<style scoped>

.tama-focus-section {
  width: 100%;
  padding-inline: var(--sgn-mi);
  padding-bottom: var(--sgn-mbt);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.tama-focus-section-header {
  padding: 1em 0 0 0;
}

.tama-focus-section-header p {
  padding-top: 1em;
}

.tama-focus-select-icon-wrapper {
  flex: 1;
  position: relative;
  max-height: 50vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(150px, 1fr));
  justify-items: center;
  gap: 2em;
}

.tama-focus-select-icon-wrapper:before,
.tama-focus-select-icon-wrapper:after {
  content: '';
  position: sticky;
  width: 100%;
  grid-column: 1 / -1;
  height: 1em;
  z-index: 500;
}


.tama-focus-select-icon-wrapper:after {
  bottom: -2px;
  background: linear-gradient(to top, white, transparent);
}

.tama-focus-select-icon-wrapper:before {
  top: -2px;
  background: linear-gradient(to bottom, white, transparent);
}

.app-button-focus-select {
  padding-inline: 4rem;
}

</style>