<template>
  <div class="tama-context-menu-container" >
    <div class="tama-context-menu"
         @keydown.enter="toggleMenu()"
         @click.once.stop="toggleMenu()"
        :key="clickInstance"
    >
      <i
         class="ri-more-2-fill tama-context-menu-icon"
         :class="{'tama-context-menu-icon-active': isVisible}"
         :tabindex="0"
         ref="menuBurgerIcon"
      >
      </i>
      <Transition name="slide-fade">
        <app-tool-tip v-if="isVisible" bg-color="white"
                      @focusout="handleFocusOut"
                      v-click-outside="toggleMenu">
          <template #content>
            <div class="tama-context-menu-items" >
              <app-context-menu-button v-for="(item, index) in menuItems" :key="index"
                      class="tama-context-menu-btn"
                      @click="handleUserAction(item[Object.keys(item)[0]])"
                      @keydown.enter.prevent="handleUserAction(item[Object.keys(item)[0]])"
                      :btn-text="Object.keys(item)[0]"
                      :tabindex="0"
                      ref="menuItemRefs"
              >
              </app-context-menu-button>
            </div>
          </template>
        </app-tool-tip>
      </Transition>
    </div>
  </div>
</template>

<script setup>

import {nextTick, onMounted, onUpdated, ref} from "vue";
import AppToolTip from "@/components/generic/AppToolTip.vue";
import AppContextMenuButton from "@/components/generic/AppContextMenuButton.vue";

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
    default: []
  },
})

const isVisible = ref(false)
const menuBurgerIcon = ref(null)
const clickInstance = ref(0)
const menuItemRefs = ref([])

const handleUserAction = (callable) => {
  toggleMenu()
  callable();
};

const handleFocusOut = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    nextTick(() => {
      toggleMenu()
    })
  }
};

const toggleMenu = () => {
  isVisible.value = !isVisible.value
  clickInstance.value++

  if (isVisible.value === true) {
    nextTick(() => {
      menuItemRefs.value[0].focusItem()
    })
  }
};

</script>

<style scoped>

.tama-context-menu-container {
  padding: 10px;
}

.tama-context-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
}

.tama-context-menu-icon {
  color: #777777;
}

.tama-context-menu-icon-active {
  outline: none;
  color: #FFA976;
}

.tama-context-menu-icon:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #FFA976;
}

.tama-context-menu-items {
  display: flex;
  flex-direction: column;

}


.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

</style>