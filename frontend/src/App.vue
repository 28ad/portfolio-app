<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from 'vue-router'
import { supabase } from "./lib/supabaseClient";
import Navigation from './components/Navigation.vue';
import store from './store/store';

const isAppReady = ref(null);

// Check to see if user is already logged in
const user = supabase.auth.getUser();

// If user does not exist, need to make app ready
if (!user) {
  isAppReady.value = true;
}

// Runs when there is a auth state change
// if user is logged in, this will fire
supabase.auth.onAuthStateChange((_, session) => {
  store.methods.setUser(session);
  isAppReady.value = true;
});

</script>

<template>
  <div v-if="isAppReady">
    <!-- import routerview and navigation bar to display across all views -->
    <Navigation />
    <RouterView />
  </div>
</template>

<style scoped></style>
