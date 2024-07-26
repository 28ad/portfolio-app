<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store/store';

const searchParam = ref ('');

// Get user from store
const user = computed(() => store.state.user);


// Setup ref to router
const router = useRouter();
const route = useRoute();

const userLogout = async () => {

  let { error } = await supabase.auth.signOut();

  console.log('user logged out')

};

// redirect user to the search results page sending the input as a parameter to query supabase

const searchUserProfile = () => {

  router.push({name: 'search', params: { param: searchParam.value}});

}

// Define a computed property to check if the current route does not match `/search/results/:param`
const showSearchBar = computed(() => {
  return !route.path.startsWith('/search/results/');
});

</script>

<template>

  <!-- nav bar layout -->
  <div
    class="nav-wrap w-screen bg-custom-blue flex flex-col md:flex-row items-center justify-center h-60 md:h-20 border-b-[1px] border-blue-300">

    <!-- nav links -->
    <ul class="w-full text-xl text-white flex flex-col justify-start cursor-pointer text-center md:flex-row ">
      <RouterLink v-if="!user" to="/">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Home</li>
      </RouterLink>
      <RouterLink v-if="user" to="/projects">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">My Projects</li>
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

    <!-- nav seacrh bar -->
    <div v-if="showSearchBar" class="flex flex-row items-center w-full justify-center md:justify-end p-2.5">

      <form @submit.prevent="">

        <input type="text" placeholder="Search ..." v-model="searchParam" v-on:keyup.enter="searchUserProfile"
        class="pl-2 placeholder:text-white placeholder:text-center md:placeholder:text-left text-xl text-white border-b border-white w-32 md:w-60 h-8 bg-custom-blue ">

      </form>

    </div>
  </div>

</template>

<style scoped></style>
