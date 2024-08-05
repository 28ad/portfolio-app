<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store/store';

const searchParam = ref('');

// Get user from store
const user = computed(() => store.state.user);


// Setup ref to router
const router = useRouter();
const route = useRoute();

const isMenuOpen = ref(false);

const openMenu = () => {

  isMenuOpen.value = !isMenuOpen.value;
  console.log(isMenuOpen.value);
}

const userLogout = async () => {

  let { error } = await supabase.auth.signOut();

  router.push('/');

  console.log('user logged out')

};

// redirect user to the search results page sending the input as a parameter to query supabase

const searchUserProfile = () => {

  router.push({ name: 'search', params: { param: searchParam.value } });
  searchParam.value = '';

}

// Define a computed property to check if the current route does not match `/search/results/:param`
const showSearchBar = computed(() => {
  return !route.path.startsWith('/search/results/');
});

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = false;
  }
};

// Set up event listener for window resize
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>

  <!-- nav bar layout -->
  <div class="nav-wrap bg-custom-blue flex flex-row items-center justify-between border-b-[1px] border-blue-300"
    :class="{ 'flex-col': isMenuOpen, 'md:flex-row': isMenuOpen, 'h[240px]': isMenuOpen, 'flex-row': !isMenuOpen, 'h-[80px]': !isMenuOpen }">

    <svg @click="openMenu" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
      stroke="currentColor" class="size-12 py-2.5 text-white cursor-pointer md:hidden">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>

    <!-- nav links -->
    <ul @click="isMenuOpen = false"
      class="w-full text-xl text-white flex-col justify-start items-center cursor-pointer text-center md:flex-row "
      :class="[isMenuOpen ? 'flex' : 'hidden', 'md:flex']">


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
      <RouterLink v-if="user" to="/messenger">
        <li class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Messenger</li>
      </RouterLink>
      <li v-if="user" @click="userLogout" class="py-2.5 hover:bg-base md:px-2.5 md:py-2.5">Log Out</li>
    </ul>

    <!-- nav seacrh bar -->
    <div v-if="showSearchBar && user" class="flex flex-row items-center justify-center md:justify-end p-2.5">

      <div class="flex justify-center items-end border-b border-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-8 text-white">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

      </div>

      <form @submit.prevent="">

        <input type="text" placeholder="Search ..." v-model="searchParam" v-on:keyup.enter="searchUserProfile"
          class="pl-2 placeholder:text-white text-center md:text-left placeholder:text-cente focus:outline-none md:placeholder:text-left text-xl text-white border-b border-white w-32 md:w-60 h-8 bg-custom-blue ">

      </form>

    </div>
  </div>

</template>

<style scoped></style>
