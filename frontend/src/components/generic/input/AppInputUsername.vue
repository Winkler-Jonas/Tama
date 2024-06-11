<template>
  <app-input-field
      :input-name="usernameLabel"
      :default-value="defaultValue"
      input-type="text"
      :label-name="usernameLabel"
      auto-compl="username"
      :placeholder-str="$t(placeholderStr)"
      :is-required="true"
      :error-msg="errorMessage"
      @on-blur="setUsername"
      @on-focus="resetError"
  />
</template>

<script setup>
/**
 * The component fires 3 Events:
 *
 *    - onActive    (The input has focus -> errors should be reset)
 *    - onNewInput  (New input available)
 *    - onValidated (True if username is valid else false)
 *
 */
import AppInputField from "@/components/generic/input/AppInputField.vue";
import { useI18n } from "vue-i18n";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import websocketService from "@/services/registerWS.js";

const { t } = useI18n();

onMounted(() => {
  websocketService.connectUsernameSocket();
})

onUnmounted(() => {
  websocketService.disconnectUsernameSocket()
})

const props = defineProps({
  usernameLabel: {
    type: String,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
    default: ''
  },
  externError: {
    type: String,
    required: false,
    default: ''
  },
  placeholderStr: {
    type: String,
    required: false,
    default: 'placeholder.user'
  },
  checkTaken: {
    type: Boolean,
    required: false,
    default: true
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits([
  'onActive',
  'onNewInput',
  'onValidated'
])

const username = ref('');
const errorMessage = ref('');
const externalError = computed(() => props.externError)

watch([username, externalError], async (newValues) => {
  const [newUsername, newExternalError] = newValues;
  errorMessage.value = '';

  if (newExternalError) {
    // Priority for external errors
    errorMessage.value = newExternalError;
  } else if (!newUsername && props.isRequired) {
    errorMessage.value = ''
  } else if (newUsername.length < 3) {
    // Validate using regex pattern
    errorMessage.value = t('error.user.short');
  } else if (props.checkTaken) {
    // Check if username is already taken
    const available = await doesUserExistOnServer(newUsername);
    if (!available) {
      errorMessage.value = t('error.user.taken');
    }
  }
}, { immediate: true });

const doesUserExistOnServer = (username) => {
  return websocketService.checkUsername(username);
};

const setUsername = async (usernameData) => {
  username.value = usernameData
  emit('onNewInput', usernameData)
  await nextTick(() => {
    emit('onValidated', !errorMessage.value && (props.isRequired ? username.value : true))  })
}

const resetError = () => {
  emit('onActive')
}

</script>

