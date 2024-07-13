<template>
  <div class="relative flex flex-col md:flex-row h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden">
    <!-- side menu -->
    <Sidebar @optionSelected="handleOptionSelected"/>

    <!-- content -->
    <div class="flex-1 bg-white p-4 w-screen md:overflow-y-scroll">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Profile from '@/components/Profile.vue';
import Password from '@/components/Password.vue';
import Email from '@/components/Email.vue';

const currentComponent = shallowRef('Profile');

const handleOptionSelected = (option) => {
  switch (option) {
    case 'profile':
      currentComponent.value = Profile;
      break;
    case 'password':
      currentComponent.value = Password;
      break;
    case 'email':
      currentComponent.value = Email;
      break;
  }
};

onMounted(() => {
  handleOptionSelected('profile');
});

</script>
