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
const regStage = ref(1);

// validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};



// authenticate + register new user
const handleSubmit = async () => {

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

// check if email already exists
const checkEmailAvailability = async () => {
  try {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user_email.value);

    console.log(user_email.value);
    console.log(users);

    if (error) throw error;

    if (users.length > 0) {
      return false; // Email already exists
    } else {

      return true; // Email is available
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    statusMsg.value = 'Error checking email availability. Please try again.';
    return false;
  }
};

// check username availability
const checkUsernameAvailability = async () => {
  try {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.value);

    console.log(user_email.value);
    console.log(users);

    if (error) throw error;

    if (users.length > 0) {
      return false; // Email already exists
    } else {

      return true; // Email is available
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    statusMsg.value = 'Error checking email availability. Please try again.';
    return false;
  }
};

// handle reg form stage
async function handleFormStage() {

  console.log(regStage.value);

  // switch case in order to go through each stage of the registration: email/pass -> username -> tech stack
  switch (regStage.value) {
    case 1:
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

      const isEmailAvailable = await checkEmailAvailability();
      if (!isEmailAvailable) {
        statusMsg.value = 'Email already registered!';
        return;
      } else {
        console.log(user_email.value);
      }

      console.log('check');

      console.log('Form submitted successfully!');

      // go to next stage
      regStage.value++;

      break;
    case 2:
      // Reset status message
      statusMsg.value = '';

      if (!username.value) {
        statusMsg.value = "Field cannot be empty !";
        break;

      }

      const isUsernameAvailable = await checkUsernameAvailability();
      if (!isUsernameAvailable) {
        statusMsg.value = 'Username already exists, please choose a different one!';
        return;
      } else {
        console.log(username.value);
      }

      // go to next stage
      regStage.value++;
    case 3:

      break;

    default:
      break;
  }

}
</script>

<template>


  <!-- form container -->
  <div class="flex flex-col justify-center items-center py-10">

    <!-- status/error message -->

    <div v-if="statusMsg" class="w-2/3 bg-red-500 font-bold md:w-1/3 shadow-xl rounded-md">
      <p class="py-4 pl-2 text-white"> {{ statusMsg }}</p>
    </div>

    <form form @submit.prevent="" class="w-2/3 h-1/5 bg-white md:w-2/4 lg:w-1/3 shadow-xl rounded-xl mt-10">


      <!-- form header -->
      <div class="bg-base w-full h-20 border border-custom-blue rounded-t-md flex justify-center items-center">
        <h1 class="text-2xl text-white font-bold">CREATE AN ACCOUNT</h1>
      </div>


      <!-- form body - stage 1 -->
      <div v-if="regStage === 1" class="border border-custom-blue rounded-b-md w-full flex flex-col items-center py-4 ">

        <div class="flex flex-col w-9/12 py-2">
          <label class="font-bold flex justify-start" for="email">Email:<span class="text-red-500">*</span></label>
          <input v-model="user_email"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="text"
            name="email" id="email" placeholder="Email Address">
        </div>

        <div class="flex flex-col w-9/12  py-2">
          <label class="font-bold flex justify-start" for="password">Passowrd:<span
              class="text-red-500">*</span></label>
          <input v-model="password"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="password" id="password" placeholder="Password">
        </div>

        <div class="flex flex-col w-9/12 py-2">
          <label class="font-bold flex justify-start" for="confPass">Confirm Password:<span
              class="text-red-500">*</span></label>
          <input v-model="confPassword"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="confPass" id="confPass" placeholder="Confrim Password">
        </div>

        <!-- T&C radio box -->

        <div class="py-2">
          <input class="cursor-pointer" type="checkbox" id="terms" v-model="accepted">
          <label for="terms">I agree to the <a class="text-base underline" href="/terms" target="_blank">terms and
              conditions</a></label>
        </div>

        <!-- form button -->

        <div class="py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
          <button @click="handleFormStage">REGISTER</button>
        </div>

        <!-- redirect to login/register -->

        <p class="py-2">
          <RouterLink to="/login">
            Already have an account ? Sign in <span class="text-base underline">here !</span>
          </RouterLink>
        </p>

      </div>

      <!-- form body - stage 2 -->
      <div v-if="regStage === 2" class="border border-custom-blue rounded-b-md w-full flex flex-col items-center py-4 ">

        <div class="flex flex-col w-9/12 py-2">
          <label class="font-bold flex justify-start" for="username">Username:<span
              class="text-red-500">*</span></label>
          <input v-model="username"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="text"
            name="username" id="username" placeholder="Username">
        </div>

        <!-- form button -->

        <div class="py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
          <button @click="handleFormStage">CONTINUE</button>
        </div>


      </div>


    </form>

  </div>

</template>
