/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
<template>
  <teleport to="header">
    <div class="flex profile-user-greeting">
      <h1>{{ $t('views.profile.greet') }}</h1>
      <h1 style="text-align: center">{{ userStore.username}}</h1>
    </div>
  </teleport>
  <section id="tama-profile-view" class="flex column" :style="[`padding-bottom: ${paddingBottom * 2}rem`, `padding-top: ${$route.meta.tama}vh`]">
    <tama-friends
        ref="friendsRef"
        @on-size-change="(items) => paddingBottom += items"
        @on-change=""
        :invites="false"
        :header="$t('views.profile.friends.hdr')"
    />
    <tama-friends
        ref="invitesRef"
        @on-size-change="(items) => paddingBottom += items"
        @on-change="() => friendsRef.retrieveData()"
        :invites="true"
        :header="$t('views.profile.invites')"
    />
    <tama-settings-button button-icon="focus" :button-label="$t('views.profile.focus')" @on-click="toggleFocusSelect"/>
    <tama-settings-button icon-color="orange" button-icon="logout" :button-label="$t('views.profile.logout')" @on-click="handleLogout"/>

    <tama-focus-select :show-focus-select="showFocusSelect" @on-focus-selected="toggleFocusSelect"/>
  </section>
</template>

<script setup>
import {useUserStore} from "@/stores/userStore.js";
import TamaSettingsButton from "@/components/settings/TamaSettingsButton.vue";
import AppUserAdd from "@/components/generic/input/AppUserAdd.vue";
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";
import TamaFriends from "@/components/calendar/TamaFriends.vue";
import {ref} from "vue";
import TamaFocusSelect from "@/components/focus/TamaFocusSelect.vue";
import FadeTransition from "@/components/transitions/FadeTransition.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

const paddingBottom = ref(2)
const showFocusSelect = ref(false)

const friendsRef = ref(null)
const invitesRef = ref(null)

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const toggleFocusSelect = () => {
  showFocusSelect.value = !showFocusSelect.value
}

</script>

<style scoped>

#tama-profile-view {
  width: 90%;
  margin-inline: auto;
  gap: 1em;
}

.profile-user-greeting {
  position: fixed;
  width: 100%;
  top: 2em;
  justify-content: center;
  align-items: center;
  gap: 1em;
}
</style>