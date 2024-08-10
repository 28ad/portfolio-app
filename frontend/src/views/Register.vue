<script setup>

// import statements
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import techListData from '../data/technologies.json';

const user_email = ref('');
const username = ref('');
const password = ref('');
const confPassword = ref('');
const regUserUID = ref('');

const statusMsg = ref('');
const accepted = ref(false);
const regStage = ref(1);

const techList = techListData;
const selectedTech = ref([]);
const searchResults = ref([]);
const searchTerm = ref('');

// validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// sign up user with supabase auth
const authReg = async () => {
  try {
    let { data, error } = await supabase.auth.signUp({
      email: user_email.value,
      password: password.value
    });

    if (error) {
      console.error('Supabase sign-up error:', error);
      statusMsg.value = 'Error signing up: ' + error.message;
    } else {
      console.log('Sign-up successful:', data);
      regUserUID.value = data.user.id;
      alert('Sign-up successful!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    statusMsg.value = 'Unexpected error occurred. Please try again later.';
  }
};

// Add user to users table
const addUser = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_id: regUserUID.value,
          username: username.value,
          email: user_email.value,
          password: password.value, // Consider hashing the password before storing it
          tech_stack: selectedTech.value
        }
      ])
      .select();

    console.log('User added to the database successfully:', data);

    if (error) throw error;

  } catch (error) {
    console.error('Error adding user to the database:', error);
    statusMsg.value = 'Error adding user to the database: ' + error.message;
  }
};

// check if email already exists
const checkEmailAvailability = async () => {
  try {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', user_email.value);

    if (error) throw error;

    return users.length === 0; // true if email is available
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

    if (error) throw error;

    return users.length === 0; // true if username is available
  } catch (error) {
    console.error('Error checking username availability:', error);
    statusMsg.value = 'Error checking username availability. Please try again.';
    return false;
  }
};

// Toggle tech selection
const toggleTechSelection = (tech) => {
  console.log(selectedTech.value);

  const index = selectedTech.value.findIndex(item => item.id === tech.id);
  if (index === -1) {
    selectedTech.value.push(tech);
  } else {
    selectedTech.value.splice(index, 1);
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

      if (password.value.length < 6) {
        statusMsg.value = 'Password must be a minimum of 6 characters long.';
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

      console.log('Next form stage');

      // go to next stage
      regStage.value++;
      break;

    case 2:
      // Reset status message
      statusMsg.value = '';

      if (!username.value) {
        statusMsg.value = 'Field cannot be empty!';
        return;
      }

      const isUsernameAvailable = await checkUsernameAvailability();
      if (!isUsernameAvailable) {
        statusMsg.value = 'Username already exists, please choose a different one!';
        return;
      } else {
        console.log(username.value);
      }

      console.log('Next form stage');

      // go to next stage
      regStage.value++;
      break;

    case 3:
      await registerUser();
      break;

    default:
      break;
  }
}

const searchTech = () => {

  searchResults.value = techList.filter((item) => {

    console.log(item);

    return item.name.toLowerCase().includes(searchTerm.value.toLowerCase());
  })

  console.log(searchResults.value);
}

// wait for auth data to generate -> save account to users table
const registerUser = async () => {
  await authReg();
  await addUser();
}

</script>


<template>


  <!-- form container -->
  <div class="flex flex-col justify-center items-center py-10">

    <!-- status/error message -->

    <div v-if="statusMsg" class=" bg-red-500 font-bold px-20 md:w-2/4 lg:w-4/12 shadow-md rounded-md mb-10">
      <p class="py-4 text-white"> {{ statusMsg }}</p>
    </div>

    <form form @submit.prevent="" class=" h-1/5 bg-white md:w-2/4 lg:w-4/12 shadow-md rounded-xl">


      <!-- form header -->
      <div class="bg-base w-full h-20 border border-custom-blue rounded-t-md flex justify-center items-center">
        <h1 class="text-2xl text-white font-bold">CREATE AN ACCOUNT</h1>
      </div>


      <!-- form body - stage 1 -->
      <div v-if="regStage === 1" class="border rounded-b-md flex flex-col items-center p-6">

        <div class="flex flex-col w-11/12 py-2">
          <label class="font-bold flex justify-start" for="email">Email:<span class="text-red-500">*</span></label>
          <input v-model="user_email"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="text"
            name="email" id="email" placeholder="Email Address">
        </div>

        <div class="flex flex-col w-11/12 py-2">
          <label class="font-bold flex justify-start" for="password">Passowrd:<span
              class="text-red-500">*</span></label>
          <input v-model="password"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="password"
            name="password" id="password" placeholder="Password">
        </div>

        <div class="flex flex-col w-11/12 py-2">
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

        <div class="mt-4 py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
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
      <div v-if="regStage === 2" class="border rounded-b-md flex flex-col items-center p-16 ">

        <div class="flex flex-col w-11/12 py-2">
          <label class="font-bold flex justify-start" for="username">Username:<span
              class="text-red-500">*</span></label>
          <input v-model="username"
            class="border border-gray-600 rounded-md text-black placeholder:text-black w-full h-10 pl-2" type="text"
            name="username" id="username" placeholder="Username">
        </div>

        <!-- form button -->

        <div class="mt-4 py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue">
          <button @click="handleFormStage">CONTINUE</button>
        </div>


      </div>

      <!-- form body - stage 3 -->
      <div v-if="regStage === 3"
        class="border rounded-b-md flex flex-col items-center py-6">

        <div class="flex flex-col items-center">
          <h1 class="text-xl font-bold w-3/4 text-center">Select technologies you are familiar with:</h1>
        </div>

        <input 
        v-on:keyup.enter="searchTech"
        v-model="searchTerm"
        class="pl-2 border border-gray-400 w-11/12 rounded-md py-2 mt-4"
        type="text" name="" id="" placeholder="Search...">

        <div v-if="searchResults.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

          <!-- each icons goes here -->
          <div v-for="item in searchResults" :key="item.id" @click="toggleTechSelection(item)" class="hover:bg-gray-200 flex flex-col items-center"
            :class="{ 'bg-gray-200': selectedTech.includes(item), 'cursor-pointer': true, 'p-4': true, 'rounded-md': true, 'text-center': true }">
            <img v-bind:src="item.img" class="w-24">
            <p class="text-center font-bold">{{ item.name }}</p>
          </div>
        </div>

        <div v-else class="flex justify-center my-4">

          <p class="text-xl text-center w-9/12">Type the name of any language you are familiar with</p>

        </div>

        <!-- form button -->

        <div class="mt-4 py-2 px-10 bg-base font-bold text-white text-xl hover:bg-custom-blue cursor-pointer">
          <button @click="registerUser">REGISTER</button>
        </div>


      </div>


    </form>

  </div>

</template>
