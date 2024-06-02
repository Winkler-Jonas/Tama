<template>
  <form @keydown.enter.stop.prevent="handleEnter">
    <app-input-username
        :username-label="$t('views.login.inputLabel.usr')"
        :extern-error="username.error"
        :default-value="username.value"
        :check-taken="false"
        @on-active="() => username.error = ''"
        @on-validated="(valid) => username.valid = valid"
        @on-new-input="(data) => username.value = data"
    />
    <app-input-password
        :password-label="$t('views.login.inputLabel.pwd')"
        :extern-error="password.error"
        @on-active="() => password.error = ''"
        @on-validated="(valid) => password.valid = valid"
        @on-new-input="(data) => password.value = data"
    />
  </form>
  <app-button :btn-text="$t('views.login.btn')"
              class="tama-login-send"
              @on-click="handleLogin"
              ref="submitButtonRef"
  />
  <div class="tama-login-register">
    <app-horizontal-separator :horizontal-txt="$t('components.horizontalSeparator.or')" />
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n"
import { nextTick, onUpdated, reactive, ref } from "vue"
import {useUserStore} from "@/stores/userStore.js"
import AppButton from "@/components/generic/AppButton.vue"
import AppInputPassword from "@/components/generic/input/AppInputPassword.vue"
import AppInputUsername from "@/components/generic/input/AppInputUsername.vue"
import AppHorizontalSeparator from "@/components/generic/AppHorizontalSeparator.vue"


const { t } = useI18n();
const userStore = useUserStore()

onUpdated(() => {
  if(props.credentialError) {
    password.error = props.credentialError
  }
})

const props = defineProps({
  credentialError: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['onLogin'])

const submitButtonRef = ref(null)

const username = reactive({
  valid: false,
  value: userStore.username || '',
  error: ''
})

const password = reactive({
  valid: false,
  value: '',
  error: ''
})

const formValid = () => {
  if (password.valid && username.valid) {
    return true
  } else {
    const fields = [password, username];
    const errorMessages = ['error.pass.empty', 'error.user.empty'];
    fields.forEach((field, index) => {
      if (field.value === '') {
        field.error = t(errorMessages[index])
      }
    });
  }
}

const handleEnter = () => {
  submitButtonRef.value.focusButton()
  nextTick( () => {
    handleLogin()
  })
}

const handleLogin = () => {
  if (formValid()) {
    userStore.setPassword(password.value)
    userStore.setUsername(username.value)
    emit('onLogin')
  }
}

</script>

<style scoped>

.tama-login-send {
  margin-inline: auto;
}

</style>