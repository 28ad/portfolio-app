<script setup>
import { ref, onMounted, computed } from 'vue';
import store from '@/store/store';

const loggedInUser = ref('');

// Get user from store
const user = computed(() => store.state.user);

console.log(user.value);


loggedInUser.value = user.value.email;


</script>

<template>

      <!-- main grid -->


        <!-- profile menu + info -->



        <!-- account body -->




</template>
