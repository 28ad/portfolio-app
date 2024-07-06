<template>

  <!-- form container -->
  <div class="flex flex-col justify-center items-center py-10">

    <!-- status/error message -->

    <div v-if="statusMsg" class="w-2/3 bg-red-500 font-bold md:w-1/3 shadow-xl rounded-md">
      <p class="py-4 pl-2 text-white"> {{ statusMsg }}</p>
    </div>

    <form form @submit.prevent="userLogin" class="w-2/3 h-1/5 bg-white md:w-2/4 lg:w-1/3 shadow-xl rounded-xl mt-10">


      <!-- form header -->
      <div class="bg-base w-full h-20 border border-custom-blue rounded-t-md flex justify-center items-center">
        <h1 class="text-2xl text-white font-bold">Reset Password</h1>
      </div>


      <!-- form body -->
      <div class="border border-custom-blue rounded-b-md w-full flex flex-col items-center py-4 ">

        <div class="flex flex-col w-9/12 py-2">
          <label class="font-bold flex justify-start" for="newPassword">New Password:</label>
          <input v-model="newPassword"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="newPassword" id="newPassword" placeholder="Min. 6 characters">
        </div>

        <div class="flex flex-col w-9/12  py-2">
          <label class="font-bold flex justify-start" for="confNewPass">Passowrd:</label>
          <input v-model="confirmPassword"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="confNewPass" id="confNewPass" placeholder="Min. 6 characters ">
        </div>

        <!-- form button -->

        <div class="py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
          <button @click="resetPassword">RESET</button>
        </div>

      </div>

    </form>

  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

const newPassword = ref('');
const confirmPassword = ref('');
const statusMsg = ref('');

const router = useRouter();
const route = useRoute();

// reset and update password of auth user
const resetPassword = async () => {
  try {
    const accessToken = route.query.access_token;

    if (!accessToken) {
      console.error('No access token found in URL.');
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      statusMsg.value = 'Passwords do not match.'
      return;
    }

    // Update the password using the access token
    const { error } = await supabase.auth.updateUser({ password: newPassword.value }, { accessToken });

    if (error) {
      statusMsg.value = 'Error updating password:' + error;
      return;
    }

    console.log('Password updated successfully!');
    router.push('/login');
  } catch (err) {
    statusMsg.value = 'Failed to reset password:'+ err;
  }
};
</script>