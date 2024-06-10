<template>
  <section id="tama-profile-view">
    <div>
      <h1>User Profile</h1>
      <div v-if="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="deleteAccount">Delete Account</button>
      </div>
      <p v-else>Loading...</p>
    </div>
    <div>
      <input v-model="question" placeholder="Ask a question...">
      <button @click="submitQuestion">Ask AI</button>
      <div v-if="response && response.len > 1">
        <p v-for="(suggestion, idx) in response" :key="`sug-${idx}`">
          {{ suggestion }}
        </p>
      </div>
      <div v-else-if="response && response.len < 1">
        <p>KI Fehler</p>
      </div>
      <div v-else-if="AIError">
        <p>{{ AIError }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import websocketService from "@/services/registerWS.js";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const router = useRouter()

const deleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await authStore.deleteUser()
      router.push('/register')
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
  }
}

const question = ref('');
const response = ref(null);
const AIError = ref('')

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
