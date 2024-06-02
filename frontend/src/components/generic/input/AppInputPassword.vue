<template>
  <app-input-field
      :input-name="passwordLabel"
      input-type="password"
      :label-name="passwordLabel"
      auto-compl="new-password"
      :placeholder-str="$t(placeholderStr)"
      :is-required="true"
      :error-msg="errorMessage"
      @on-blur="setPassword"
      @on-focus="resetError"
  />
</template>

<script setup>
/**
 * The component fires 3 Events:
 *
 *    - onActive    (The input has focus -> errors should be reset)
 *    - onNewInput  (New input available)
 *    - onValidated (True if password is valid else false)
 *
 */
import AppInputField from "@/components/generic/input/AppInputField.vue";
import {computed, nextTick, ref, watch} from "vue";
import {validatePassword} from "@/utils/pwdValidator.js";
import {useI18n} from "vue-i18n";

const { t } = useI18n();


const props = defineProps({
  passwordLabel: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: false,
    default: ''
  },
  externError: {
    type: String,
    required: false,
    default: ''
  },
  secondPassword: {
    type: String,
    required: false,
    default: ''
  },
  placeholderStr: {
    type: String,
    required: false,
    default: 'placeholder.pass'
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

const password = ref('');
const errorMessage = ref('')
const externalError = computed(() => props.externError)

watch([password, externalError], (newValues) => {
  const [newPassword, newExternalError] = newValues;
  errorMessage.value = ''

  if (newExternalError) {
    errorMessage.value = newExternalError;
  } else if (!newPassword) {
    errorMessage.value = '';
  } else {
    const response = validatePassword(newPassword, props.userName, props.secondPassword);
    errorMessage.value = response ? t(response, { min: 8 }) : '';
  }
}, { immediate: true });

const setPassword = (pwdData) => {
  password.value = pwdData || ''
  emit('onNewInput', pwdData)
  nextTick( () => {
    const hasError = !!errorMessage.value;
    const isValidPassword = props.isRequired ? !!password.value : true;
    emit('onValidated', !hasError && isValidPassword)
  })
}

const resetError = () => {
  emit('onActive')
}
</script>