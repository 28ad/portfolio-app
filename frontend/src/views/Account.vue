<script setup>
import { ref, onMounted, computed } from 'vue';
import store from '@/store/store';

const loggedInUser = ref('');

// Get user from store
const user = computed(() => store.state.user);

console.log(user.value);





</script>

<template>
  <h1>My Account</h1>
  <h2 v-if="user" class="text-white "> Welcome, {{ loggedInUser }}</h2>

</template>
