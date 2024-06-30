<script setup>

import { supabase } from '@/lib/supabaseClient';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store/store';

// Get user from store
const user = computed(() => store.state.user);

const navHeight = computed(() => ({
  'h-78': !user,  // Height when user is not logged in
  'h-34': user,   // Height when user is logged in
}));

// Setup ref to router
const router = useRouter();

const userLogout = async () => {

  let { error } = await supabase.auth.signOut();

  console.log('user logged out')

};

</script>

<template>

  <!-- nav bar layout -->
  <div :class="navHeight" class="nav-wrap w-screen bg-custom-blue flex items-center justify-center md:h-20">
    <ul class="w-full text-xl text-white flex flex-col justify-center cursor-pointer text-center md:flex-row ">
      <RouterLink v-if="!user" to="/">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Home</li>
      </RouterLink>
      <RouterLink v-if="user" to="/dashboard">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Dashboard</li>
      </RouterLink>
      <RouterLink v-if="!user" to="/register">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Register</li>
      </RouterLink>
      <RouterLink v-if="!user" to="/login">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Login</li>
      </RouterLink>
      <RouterLink v-if="user" to="/account">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">My Account</li>
      </RouterLink>
      <li v-if="user" @click="userLogout" class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Log Out</li>
    </ul>
  </div>

</template>

<style scoped></style>
