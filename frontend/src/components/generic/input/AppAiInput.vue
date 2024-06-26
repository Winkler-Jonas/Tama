<template>
  <div class="tama-ai-input-container">
    <div class="tama-ai-input-header">
      <label v-if="labelName">
        <span class="tama-ai-header-label">{{ labelName }}</span>
      </label>
      <div v-if="aiOption" class="tama-ai-input-ai-option">
        <p>{{ $t('components.aiInput.label') }}</p>
        <app-round-tick-box @on-click="handleRadioButton"/>
      </div>
    </div>
    <div v-if="!aiGeneratedItems || aiGeneratedItems.length === 0"
         class="ai-input-field-container"
         :class="{'ai-input-field-error': aiError}"
         @focusin="aiError = false"
         @keydown.enter.stop.prevent="handleGenerateAI"
    >
      <input
          v-model="userInput"
          type="text"
          autocomplete="off"
          class="reset-input"
      />
      <transition name="icon-fade" appear>
        <i v-if="aiInputEnabled"
           @click="handleGenerateAI"
           :class="[{'ri-sparkling-2-line ai-icon-layout': aiInputEnabled},
                  {'ai-icon-animated': aiInputEnabled && aiGenerating}]">

        </i>
      </transition>
    </div>
    <div v-else>
      <app-dropdown :menu-items="aiGeneratedItems || []"
                    direction="down"
                    :default-collapsed="true"
                    @on-select="(value) => handleUserSelectedItem(value)"
      />
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import websocketService from "@/services/registerWS.js";
import AppRoundTickBox from "@/components/generic/input/AppRoundTickBox.vue";
import AppDropdown from "@/components/generic/input/AppDropdown.vue";

const props = defineProps({
  labelName: {
    type: String,
    required: false,
    default: ''
  },
  aiOption: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits(['onInput'])

const userInput = ref('')
const aiInputEnabled = ref(!props.aiOption)
const aiGenerating = ref(false)
const aiError = ref(false)
const aiGeneratedItems = ref([])
const sockedConnected = ref(false);

watch(userInput, (newValue, oldValue) => {
  emit('onInput', newValue)
})

const handleRadioButton = () => {
  aiInputEnabled.value = !aiInputEnabled.value
  aiGenerating.value = false
  aiGeneratedItems.value = null
}

const handleGenerateAI = () => {
  aiGenerating.value = true

  if (!userInput.value || userInput.value.length > 100) {
    aiError.value = true
    aiGenerating.value = false
    return
  }
  submitQuestion()
}

const handleUserSelectedItem = (userSelect) => {
  userInput.value = userSelect
  aiGeneratedItems.value = null
}

const submitQuestion = () => {
  websocketService.send('ask',{ question: userInput.value });
};

async function connectWebSocket() {
  try {
    sockedConnected.value = false
    sockedConnected.value = await websocketService.createSocket('ask', '/ws/askAI/')

    // Setting message and error handlers
    websocketService.setHandler('ask', {
      onMessage: (data) => {
        const dataArray = Object.values(data)
        if (dataArray.every(item => item.trim() === '')) {
          aiError.value = true
        } else {
          aiGeneratedItems.value = dataArray;
        }
        aiGenerating.value = false
      },
      onError: (data) => {
        aiError.value = true;
        aiGenerating.value = false
      },
    });
  } catch (error) {
    sockedConnected.value = false;
    console.error('Failed to connect:', error);
  }
}

watch(sockedConnected, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    connectWebSocket();
  }
});

onMounted(() => {
  connectWebSocket()
});

onUnmounted(() => {
  websocketService.closeSocket('ask');
});

</script>

<style scoped>

.tama-ai-input-container {
  position: relative;
}

.tama-ai-input-header {
  width: 100%;
  display: flex;
  gap: 1em;
  padding: 1em 1em 0.5em 0;
}

.tama-ai-header-label {
  font-size: var(--tama-h2-size);
  font-weight: bolder;
  filter: drop-shadow(0.25rem 0.25rem 0.5rem #0005);
}

.tama-ai-input-ai-option {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1em;
}

.ai-input-field-container {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 1rem;

  border: 1px solid black;
  border-radius: .5rem;
  height: 3rem;

  background-color: white;
  transition: box-shadow 0.3s ease;
}

.ai-input-field-error {
  box-shadow: inset 0 0 10px 5px #f11c00;
}

.ai-icon-layout {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-icon-animated {
  animation: pulse 1s infinite alternate, colorShift 2s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);  /* Start with the original size */
  }
  100% {
    transform: scale(1.6);  /* End with a slightly larger size */
  }
}

@keyframes colorShift {
  0% {
    color: #FFA976;  /* Start color */
  }
  100% {
    color: #83B6C7;  /* End color */
  }
}


.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.5s ease;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}
</style>