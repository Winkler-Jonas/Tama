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
    websocketService.send('focus', { task: props.focusTask });
  }
};

const errorTrigger = computed(() => props.errorTrigger);

watch(errorTrigger, async (newValue, oldValue) => {
  if (oldValue && !newValue) {
    await submitTask();
  } else if (!oldValue && newValue) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
      emit('onDone')
    }, 5000);
  }
});

const handleResponse = (data) => {
  if (data === '') {
    aiResponse.value = t('components.timer.earlyLeave');
  } else {
    aiResponse.value = data;
  }
};

const handleError = (error) => {
  aiResponse.value = t('components.timer.earlyLeave');
};

async function connectWebSocket() {
  try {
    sockedConnected.value = await websocketService.createSocket('focus', '/ws/focusUP/');

    websocketService.setHandler('focus', {
      onMessage: (data) => {
        handleResponse(data)
      },
      onError: (data) => {
        handleError(data)
      },
    });
    await submitTask()
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