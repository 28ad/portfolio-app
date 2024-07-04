<template>
    <div class="flex flex-col items-center md:items-start">
        <h1 class="text-3xl">Update your email</h1>
        <div class="mt-4 w-11/12 h-[2px] bg-black"></div>


        <!-- Email content goes here -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- email -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="email">Email:</label>
                <input class="border border-black rounded-md pl-2 h-10 w-11/12 md:w-4/12" type="text" name="email" id="email" v-bind:value="user_email">
            </div>

        </div>

        <button class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>

    </div>

</template>

<script setup>

import store from '@/store/store';
import { supabase } from '@/lib/supabaseClient';
import { ref, computed, onMounted } from 'vue';

const userData = ref(null);

const username = ref(null);
const user_email = ref(null);

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

}

// call "fetchUserData" on app mount
onMounted(async () => {
    try {
        await fetchUserData();
    } catch (err) {
        console.log("Error fetching user data on mount" + err);
    }
})

</script>