<template>
    <div class="flex flex-col items-center md:items-start">
        <h1 class="text-3xl">Update your email</h1>
        <div class="mt-4 w-11/12 h-[2px] bg-black"></div>


        <!-- Email content goes here -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- email -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="email">New Email:</label>
                <input v-model="newEmail" class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12 placeholder:text-black" type="text" name="email"
                    id="email">
            </div>

            <!-- confirm email -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="confEmail">Confirm new Email:</label>
                <input v-model="confEmail" class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-10/12 placeholder:text-black" type="text" name="confEmail"
                    id="confEmail">
            </div>

        </div>

        <button @click="" class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>

    </div>

</template>

<script setup>

import store from '@/store/store';
import { supabase } from '@/lib/supabaseClient';
import { ref, computed, onMounted } from 'vue';

const userData = ref(null);

const username = ref(null);
const user_email = ref(null);

const newEmail = ref(null);
const confEmail= ref(null);

// Get user from store
const user = computed(() => store.state.user);


// fetch user data from supabase "users" table
const fetchUserData = async () => {

    try {

        let { data: users, error } = await supabase
            .from('users')
            .select("*")
            .eq('email', user.value.email);

        if (error) throw error;

        // assign query results to local variables
        userData.value = users;
        console.log(userData.value[0]);

        username.value = userData.value[0].username;
        user_email.value = userData.value[0].email;


    } catch (err) {

        console.log("Error fetching requested user data from Supabase:" + err);
    }

};

// update user email
const updateUserEmail = async () => {

try {

    // check if emails match
    if (confEmail.value !== newEmail.value) {
        console.log('Emails must match !');
        return;
    }

    // update password in auth table
    const { error: authError } = await supabase.auth.updateUser({
        email: newEmail.value
    });

    if (authError) throw authError;

    // update email in users table
    const { data, error: dbError } = await supabase
        .from('users')
        .update({
            email: newEmail.value,
        })
        .eq('email', user_email.value)
        .select();

        if (dbError) throw dbError;

        console.log('Email updated successfully !')


} catch (err) {

    console.log("Failed to update user email" + err.message);
}

};


// call "fetchUserData" on app mount
onMounted(async () => {
    try {
        await fetchUserData();
    } catch (err) {
        console.log("Error fetching user data on mount" + err);
    }
})

</script>