import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
    const tamaHeight = ref(0)
    const tamaSetHeight = (newHeight) => {
        tamaHeight.value = newHeight
    }
    const tamaGetHeight = computed(() => tamaHeight)

    return {
        tamaSetHeight,
        tamaGetHeight
    }
})