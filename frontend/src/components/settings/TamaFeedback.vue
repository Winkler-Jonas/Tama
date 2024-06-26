<template>
  <template v-if="user.is_admin">
    <div class="feedback-admin-view">
      <div @click="handleExitClicked" class="feedback-admin-close">
        <i class="ri-close-line tama-feedback-close"></i>
      </div>
      <div class="feedback-message-container">
        <feedback-message
            v-for="(feedback, idx) in feedbackList" :key="idx"
            :feedback-time-stamp="feedback.created_at"
            :feedback-message="feedback.comment"
            @on-delete="deleteFeedback(feedback.id)"
        />
      </div>
      <app-button class="feedback-reload-button" btn-text="Reload" @on-click="loadFeedback" />
    </div>
  </template>
  <template v-else>
    <transition name="fade">
      <div v-if="!showThankYou" class="tama-feedback">
        <h2>{{ $t('views.settings.feedback.subLabel') }}</h2>
        <div class="tama-feedback-text">
      <textarea v-model.trim="userMessage"
                :placeholder="$t('views.settings.feedback.placeholder')">
      </textarea>
        </div>
        <div class="tama-feedback-buttons">
          <i @click="handleExitClicked" class="ri-close-line tama-feedback-close"></i>
          <i @click="handleSubmitClicked" class="ri-mail-send-line tama-feedback-send"></i>
        </div>
      </div>
      <div v-else class="tama-feedback-thank-you">
        <h2 v-text-animation="{text: $t('views.settings.feedback.thankYou'), speed: 50}"></h2>
      </div>
    </transition>
  </template>
</template>

<script setup>
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth.js";
import feedbackService from '@/services/feedbackService';
import AppButton from "@/components/generic/AppButton.vue";
import FeedbackMessage from "@/components/settings/FeedbackMessage.vue";

const { user } = useAuthStore();

const emit = defineEmits(['onClose'])
const userMessage = ref('')
const showThankYou = ref(false)
const feedbackList = ref([]);

const handleExitClicked = () => {
  emit('onClose', 'feedback')
}

const handleSubmitClicked = async () => {
  if (userMessage.value) {
    await addFeedback(userMessage.value)
    setTimeout(() => {
      emit('onClose')
    }, 3000)
    showThankYou.value = true
  }
}


const loadFeedback = async () => {
  try {
    const response = await feedbackService.getAllFeedback();
    feedbackList.value = response.data;
  } catch (error) {
    console.error('Error loading feedback:', error);
  }
};

const addFeedback = async (usrFeedback) => {
  try {
    const data = { comment: usrFeedback };
    await feedbackService.createFeedback(data);
  } catch (error) {
    // todo need to handle this
    console.error('Error submitting feedback:', error);
  }
};

const deleteFeedback = async (id) => {
  try {
    await feedbackService.deleteFeedback(id);
    feedbackList.value = feedbackList.value.filter(item => item.id !== id);
  } catch (error) {
    console.error('Error deleting feedback:', error);
  }
};

</script>

<style scoped>


.feedback-admin-view {
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 2fr min-content;
}

.feedback-admin-close {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  margin: 1em 0 0 1em;

  position: relative;
  z-index: 2;
}

.feedback-message-container {
  grid-column: 1 / 2;
  grid-row: 1 / 4;

  width: 100%;
  padding: 5rem var(--sgn-mi);

  overflow-y: auto;
}

.feedback-reload-button {
  grid-column: 1 / 2;
  grid-row: 3 / 4;

  justify-self: center;
  position: relative;
  bottom: 1em;
  margin-bottom: 1em;
}

.tama-feedback {
  height: 100%;
  padding: 1em var(--sgn-mi);

  display: flex;
  flex-direction: column;
  gap: 1em;
}

textarea {
  all: unset;
  width: 100%;
  height: 100%;
  resize: none;
}

textarea::placeholder {
  color: var(--tama-color-gray)
}

.tama-feedback-text {
  border: 1px solid black;
  border-radius: 10px;
  height: 50%;
  max-height: 50%;
}

.tama-feedback-buttons {
  margin-top: auto;

  display: flex;
  justify-content: space-between;
}

.tama-feedback-close,
.tama-feedback-send {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size));
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-feedback-close {
  background-color: var(--tama-color-orange);
}

.tama-feedback-send {
  background-color: var(--tama-color-green);
  font-weight: normal;
}

.tama-feedback-thank-you {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: center;
  padding: 0 var(--sgn-mi)
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>