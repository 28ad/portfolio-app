<script setup>

// import statements
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

const user_email = ref('');
const username = ref('');
const password = ref('');
const confPassword = ref('');

const statusMsg = ref('');
const accepted = ref(false);

// validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};



// validate registration form
const handleSubmit = async () => {
  // Reset status message
  statusMsg.value = '';

  if (!user_email.value || !password.value || !confPassword.value) {
    statusMsg.value = 'All fields are required.';
    return;
  }

  if (!validateEmail(user_email.value)) {
    statusMsg.value = 'Invalid email format.';
    return;
  }

  if (password.value !== confPassword.value) {
    statusMsg.value = 'Passwords do not match.';
    return;
  }

  if (!accepted.value) {
    statusMsg.value = 'You must accept the terms and conditions.';
    return;
  }

  console.log('Form submitted successfully!');

  try {
    let { data, error } = await supabase.auth.signUp({
      email: user_email.value,
      password: password.value
    });

    console.group(user_email.value + password.value);

    if (error) {
      console.error('Supabase sign-up error:', error);
      statusMsg.value = 'Error signing up: ' + error.message;
    } else {
      console.log('Sign-up successful:', data);
      alert('Sign-up successful!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    statusMsg.value = 'Unexpected error occurred. Please try again later.';
  }
};
</script>

<template>


    <!-- form container -->
    <div class="flex flex-col justify-center items-center py-10">

        <!-- status/error message -->

        <div v-if="statusMsg" class="w-2/3 bg-red-500 font-bold md:w-1/3 shadow-xl rounded-md">
            <p class="py-4 pl-2 text-white"> {{ statusMsg }}</p>
        </div>

        <form form @submit.prevent="handleSubmit" class="w-2/3 h-1/5 bg-white md:w-2/4 lg:w-1/3 shadow-xl rounded-xl mt-10">


            <!-- form header -->
            <div class="bg-base w-full h-20 border border-custom-blue rounded-t-md flex justify-center items-center">
                <h1 class="text-2xl text-white font-bold">CREATE AN ACCOUNT</h1>
            </div>


            <!-- form body -->
            <div class="border border-custom-blue rounded-b-md w-full flex flex-col items-center py-4 ">

                <div class="flex flex-col w-9/12 py-2">
                    <label class="font-bold flex justify-start" for="email">Email:</label>
                    <input v-model="user_email" class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2"
                        type="text" name="email" id="email" placeholder="Email Address">
                </div>

                <div class="flex flex-col w-9/12  py-2">
                    <label class="font-bold flex justify-start" for="password">Passowrd:</label>
                    <input v-model="password" class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2"
                        type="password" name="password" id="password" placeholder="Password">
                </div>

                <div class="flex flex-col w-9/12 py-2">
                    <label class="font-bold flex justify-start" for="confPass">Confirm Password:</label>
                    <input v-model="confPassword" class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2"
                        type="password" name="confPass" id="confPass" placeholder="Confrim Password">
                </div>

                <!-- form button -->

                <div class="py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
                    <button>SIGN UP</button>
                </div>

                <!-- T&C radio box -->

                <div class="py-2">
                    <input class="cursor-pointer" type="checkbox" id="terms" v-model="accepted">
                    <label for="terms">I agree to the <a class="text-base underline" href="/terms" target="_blank">terms and conditions</a></label>
                </div>

            </div>

        </form>

    </div>

</template>
