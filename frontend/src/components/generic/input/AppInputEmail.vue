<template>
  <app-input-field
      ref="inputRef"
      :input-name="emailLabel"
      :default-value="defaultValue"
      input-type="email"
      :label-name="emailLabel"
      auto-compl="email"
      :placeholder-str="$t(placeholderStr)"
      :is-required="true"
      :error-msg="errorMessage"
      @on-blur="setEmail"
      @on-focus="resetError"
  />
</template>

<script setup>
/**
 * The component fires 3 Events:
 *
 *    - onActive    (The input has focus -> errors should be reset)
 *    - onNewInput  (New input available)
 *    - onValidated (True if email is valid else false)
 *    - onIsTaken   (True if is taken else false)
 *
 */
import AppInputField from "@/components/generic/input/AppInputField.vue";
import { useI18n } from "vue-i18n";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import websocketService from "@/services/registerWS.js";
import {isMailValid} from "@/utils/emailValidator.js";

const { t } = useI18n();

onMounted(() => {
  websocketService.connectEmailSocket();
  if (props.startFocused) {
    inputRef.value.focusInput()
  }
})

onUnmounted(() => {
  websocketService.disconnectEmailSocket()
})

const props = defineProps({
  emailLabel: {
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
    default: 'placeholder.email'
  },
  /**
   * Use checkTaken if you only want to receive updates on whether the email is taken (@onIsTaken)
   * Use validateTaken if you want to validate if it was taken (will display an error if it is)
   */
  checkTaken: {
    type: Boolean,
    required: false,
    default: true
  },
  validateTaken: {
    type: Boolean,
    required: false,
    default: true,
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: true
  },
  startFocused: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits([
    'onActive',
    'onNewInput',
    'onValidated',
    'onIsTaken'
])

const email = ref('');
const errorMessage = ref('');
const externalError = computed(() => props.externError)
const inputRef = ref(null)
const isTaken = ref(false)


watch([email, externalError], async (newValues) => {
  const [newEmail, newExternalError] = newValues;
  errorMessage.value = '';

  if (newExternalError) {
    // Priority for external errors
    errorMessage.value = newExternalError;
  } else if (!newEmail) {
    errorMessage.value = ''
  } else if (!isMailValid(newEmail)) {
    // Validate using regex pattern
    errorMessage.value = t('error.email.valid');
  } else if (props.checkTaken) {
    // Check if email is already taken
    const available = await doesEmailExistOnServer(newEmail);
    isTaken.value = available
    if (!available && props.validateTaken) {
      errorMessage.value = t('error.email.taken');
    }
  }
}, { immediate: true });

const doesEmailExistOnServer = (mailString) => {
  return websocketService.checkEmail(mailString)
};

const setEmail = async (emailData) => {
  email.value = emailData
  emit('onNewInput', emailData)
  await nextTick(() => {
    emit('onIsTaken', isTaken)
    emit('onValidated', !errorMessage.value && (props.isRequired ? email.value : true))
  })
}

const resetError = () => {
  emit('onActive')
}

const blurInput = () => inputRef.value.blurInput()

defineExpose({
  blurInput
})

</script>