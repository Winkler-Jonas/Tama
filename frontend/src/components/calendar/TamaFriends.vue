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
  <div class="tama-friends-container flex column">
    <h2 class="text-center">{{ header }}</h2>
    <app-user-add v-if="invite" />
    <template v-if="instances.length >= 1">
      <div class="tama-instances-list-container">
        <div v-for="instance in instances" :key="instance.id" class="instance-invite-friend">
          <div class="flex column">
            <span class="text-truncate">{{ invite ? instance.sender : instance.user2 }}</span>
            <hr>
            <span>{{ formatDate(instance.created_at) }}</span>
          </div>
          <div v-if="invite" class="accept-button-container">
            <i class="ri-check-line text-md accept-btn"
               style="font-weight: bold"
               :class="[{ 'bg-green': accepted === instance.id}, {'bg-blue': accepted !== instance.id}]"
               @click="handleAcceptInvite(instance)">
            </i>
          </div>
          <div v-else class="accept-button-container">
            <i class="ri-delete-bin-line text-md accept-btn"
               :class="[{ 'bg-green': accepted === instance.id}, {'bg-orange': accepted !== instance.id}]"
               @click="handleDeleteFriend(instance)">
            </i>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="!invite">
      <p class="text-gray" style="text-align: center">{{ $t('views.profile.friends.placeholder') }}</p>
    </template>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import friendService from "@/services/friendService.js";
import AppUserAdd from "@/components/generic/input/AppUserAdd.vue";

const emit = defineEmits(['on-size-change', 'on-change'])
const props = defineProps({
  header: {
    type: String
  },
  invites: {
    type: Boolean,
  }
})

const invite = computed(() => props.invites)
const instances = ref([])
const accepted = ref(-1)

watch(instances, (newValue, oldValue) => {
  emit('on-size-change', (newValue - oldValue) / 2)
})

const formatDate = dateStr => dateStr.split('T')[0].replace(/-/g, '.')

const retrieveData = async () => {
  try {
    const response = invite.value ? await friendService.getAllInvites() : await friendService.getAllFriends()
    if (response.data) {
      if (response.data.hasOwnProperty('accepted'))
        instances.value = response.data.filter(invite => !invite.accepted)
      instances.value = response.data
    }
  } catch (error) {
    // no time to handle
  }
}

const handleAcceptInvite = async (instance) => {
  console.log(instance)
  try {
    await friendService.acceptInvite(instance.id)
    accepted.value = instance.id
    setTimeout(async () => {
      accepted.value = -1
      await retrieveData()
      emit('on-change')
    }, 500)
  } catch (error) {
    // no time to handle anything
  }
}

const handleDeleteFriend = async (friend) => {
  try {
    await friendService.deleteFriend(friend.id)
    setTimeout(async () => {
      await retrieveData()
      emit('on-change')
    }, 500)
  } catch (error) {
    // no time
  }
}

onMounted(async () => {
  await retrieveData()
})

defineExpose({
  retrieveData
})

</script>

<style scoped>

.tama-friends-container {
  width: 100%;
  gap: 1em;
}

.tama-instances-list-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5em;
}

.instance-invite-friend {
  flex: 0 1 calc(50% - 1em);

  display: flex;
  justify-content: space-between;
  border: 1px solid black;
  padding: 0.5em 1em;
  border-radius: 10px;
}

.accept-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.accept-btn {
  height: 60%;
  width: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  border-radius: 50%;
  aspect-ratio: 1;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

</style>