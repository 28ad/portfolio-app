<template>
    <div class="flex flex-col items-center md:items-start">

        <!-- update passoword -->
        <h1 class="text-3xl font-bold">Change your password</h1>
        <div class="mt-4 w-full h-[2px] bg-black"></div>


        <!-- Password management content -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- new password -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="password">New Password:</label>
                <input v-model="password" class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12"
                    type="password" name="password" id="password">
            </div>

            <!-- confirm new password -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="confPassword">Confirm New Password:</label>
                <input v-model="confPassword" class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12"
                    type="password" name="confPassword" id="confPassword">
            </div>

        </div>
        <button @click="updateUserPassword"
            class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>

        <!-- reset password -->
        <h1 class="text-3xl pt-4 mt-10 font-bold">Reset Password</h1>
        <div class="mt-4 w-full h-[2px] bg-black"></div>

        <button @click="sendPassResetEmail" class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">RESET PASSWORD</button>

    </div>

</template>

<script setup>

import store from '@/store/store';
import { supabase } from '@/lib/supabaseClient';
import { ref, computed } from 'vue';

const userData = ref(null);

const user_email = ref(null);
const password = ref(null);
const confPassword = ref(null);


// Get user from store
const user = computed(() => store.state.user);

user_email.value = user.value.email;


// update user password
const updateUserPassword = async () => {

    try {

        // check if passwords match
        if (confPassword.value !== password.value) {
            console.log('Passwords must match !');
            return;
        }

        // update password in auth table
        let { error: authError } = await supabase.auth.updateUser({
            password: password.value
        });

        if (authError) throw authError;

        // update password in users table
        const { data, error: dbError } = await supabase
            .from('users')
            .update({
                password: password.value,
            })
            .eq('email', user.value.email)
            .select();

        if (dbError) throw dbError;

        console.log('Password updated successfully !')


    } catch (err) {

        console.log("Failed to update user password" + err);
    }

};

// trigger password reset email

const sendPassResetEmail = async () => {

    try {


        let { data, error } = await supabase.auth.resetPasswordForEmail(user_email.value);


    } catch (err) {

        console.log('Failed to send password reset email:' + err.message);
    }
};

</script>