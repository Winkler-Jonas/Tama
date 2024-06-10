<template>
  <div class="ai-input-field-container">
    <app-input-field
        :input-name="$t('components.ai.inspire')"
        :placeholder-str="$t('components.ai.ask')"
        :error-msg="AIError"
        @on-blur="setInput"
        @on-focus="resetError"
    />
    <div @click="submitQuestion">
      <i class="ri-sparkling-2-line"></i>
    </div>
  </div>

  <div v-if="response && response.len > 1">
    <div v-for="(suggestion, idx) in response" :key="`sug-${idx}`">
      {{ suggestion }}
    </div>
  </div>


</template>

<script setup>
import AppInputField from "@/components/generic/input/AppInputField.vue";
import {onMounted, onUnmounted, ref} from "vue";
import websocketService from "@/services/registerWS.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();


const question = ref('');
const response = ref(null);
const AIError = ref('')
// todo: AIError must contain server errors (already in AIError) but also if the response is empty

const setInput = (usrInput) => {
  if (!usrInput) {
    AIError.value = t('components.ai.short')
  } else if (usrInput.len > 100) {
    AIError.value = t('components.ai.long')
  } else {
    question.value = usrInput
  }
}

const resetError = () => {
  AIError.value = ''
}

const submitQuestion = () => {
  websocketService.send({ question: question.value });
};

onMounted(() => {
  websocketService.createSocket();
  websocketService.setOnMessageHandler((data) => {
    response.value = data;
  });
  websocketService.setOnErrorHandler(error => {
    console.log(t(error))
    AIError.value = t(error);
  });
});

onUnmounted(() => {
  websocketService.closeSocket();
});

</script>

<style scoped>

.ai-input-field-container {
  display: flex;
  gap: 1em
}

</style>