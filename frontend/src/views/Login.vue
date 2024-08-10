<template>

  <!-- form container -->
  <div class="flex flex-col justify-center items-center py-10">

    <!-- status/error message -->

    <div v-if="statusMsg" class=" bg-red-500 font-bold px-10 md:w-2/4 lg:w-1/3 shadow-md rounded-md">
      <p class="py-4  text-white"> {{ statusMsg }}</p>
    </div>

    <form form @submit.prevent="userLogin" class=" h-3/6 bg-white md:w-2/4 lg:w-1/3 shadow-md rounded-xl mt-10">


      <!-- form header -->
      <div class="bg-base w-full h-20 border border-custom-blue rounded-t-md flex justify-center items-center">
        <h1 class="text-2xl text-white font-bold">LOG IN</h1>
      </div>


      <!-- form body -->
      <div class="border rounded-b-md w-full flex flex-col items-center p-10">

        <div class="flex flex-col w-11/12 py-2">
          <label class="font-bold flex justify-start" for="email">Email:</label>
          <input v-model="user_email"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="text"
            name="email" id="email" placeholder="Email Address">
        </div>

        <div class="flex flex-col w-11/12  py-2">
          <label class="font-bold flex justify-start" for="password">Passowrd:</label>
          <input v-model="password"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="password" id="password" placeholder="Password">
        </div>

        <!-- form button -->

        <div class="py-2 mt-4 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
          <button>LOG IN</button>
        </div>

        <!-- redirect to login/register -->

        <p class="py-2 font-bold">
          <RouterLink to="/register">
            Don't have an account? Register <span class="text-base underline">here !</span>
          </RouterLink>
        </p>

      </div>

    </form>

  </div>
</template>

<script setup>


import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';




// use router functions
const router = useRouter();

// set up reactive variables

const user_email = ref('');
const password = ref('');

const statusMsg = ref('');

const userLogin = async () => {

  try {

    let { data, error } = await supabase.auth.signInWithPassword({
      email: user_email.value,
      password: password.value
    })

    if (error) throw error;

    console.log("User logged in: " + data.user.email);

    router.push('/account');

  } catch (error) {
    console.log(error);
    statusMsg.value = error;
  }

}


</script>