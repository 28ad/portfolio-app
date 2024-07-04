<template>
    <div class="flex flex-col items-center md:items-start">

        <!-- update passoword -->
        <h1 class="text-3xl">Change your password</h1>
        <div class="mt-4 w-11/12 h-[2px] bg-black"></div>


        <!-- Password management content -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- new password -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="password">New Password:</label>
                <input class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12" type="text" name="password" id="password">
            </div>

            <!-- confirm new password -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="confPassword">Confirm New Password:</label>
                <input class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12" type="text" name="confPassword" id="confPassword">
            </div>

        </div>
        <button class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>

        <!-- reset password -->
        <h1 class="text-3xl pt-4">Reset Password</h1>
        <div class="mt-4 w-11/12 h-[2px] bg-black"></div>

        <button class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">RESET PASSWORD</button>

    </div>

</template>

<script setup>

import store from '@/store/store';
import { supabase } from '@/lib/supabaseClient';
import { ref, computed} from 'vue';

const userData = ref(null);

const user_email = ref(null);
const password = ref(null);


// Get user from store
const user = computed(() => store.state.user);


// update user password
const updateUserPassword = async () => {

    try {

       
        
    } catch (err) {
        
        console.log("" + err);
    }

}


</script>