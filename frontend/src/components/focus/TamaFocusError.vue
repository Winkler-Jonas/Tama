<template>
  <tama-slide-up :is-visible="showError" :slide-height="20">
    <template #slide-up-content>
      <h2 class="tama-focus-error-style" v-text-animation="{ text: aiResponse, speed: 50 }"></h2>
    </template>
  </tama-slide-up>
</template>

<script setup>
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import websocketService from "@/services/registerWS.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  errorTrigger: {
    type: Boolean,
    required: true
  },
  focusTask: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['onDone']);
const sockedConnected = ref(false);
const aiResponse = ref('');
const showError = ref(false);

const submitTask = async () => {
  if (sockedConnected.value) {
    await websocketService.send({ task: props.focusTask });
  } else {
    console.error('WebSocket is not connected. Cannot send task.');
  }
};

const errorTrigger = computed(() => props.errorTrigger);

watch(errorTrigger, async (newValue) => {
  if (newValue) {
    await submitTask();
  }
});

const handleResponse = (data) => {
  showError.value = true;
  setTimeout(() => {
    showError.value = false;
    aiResponse.value = ''
    emit('onDone')
  }, 5000);
  if (data.every(item => item.trim() === '')) {
    aiResponse.value = t('components.timer.earlyLeave');
  } else {
    aiResponse.value = data[0];
  }
};

const handleError = (error) => {
  aiResponse.value = t('components.timer.earlyLeave');
};

async function connectWebSocket() {
  try {
    const status = await websocketService.createSocket('/ws/focusUP/');
    if (status === "open") {
      sockedConnected.value = true;
      websocketService.setOnMessageHandler(handleResponse);
      websocketService.setOnErrorHandler(handleError);
    }
  } catch (error) {
    sockedConnected.value = false;
  }
}

watch(sockedConnected, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    connectWebSocket();
  }
});

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  websocketService.closeSocket();
});
</script>


<style scoped>

.tama-focus-error-style {
  text-align: center;
  padding: 1em;
}

</style>