<template>

    <div class="flex flex-col items-center md:items-start">
        <h1 class="text-3xl">Profile Information</h1>
        <div class="mt-4 w-11/12 h-[2px] bg-black"></div>


        <!-- Profile content goes here -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- username -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="username">Username:</label>
                <input v-model="newUsername" v-bind:placeholder="username"
                    class="border border-black rounded-md pl-2 h-10 w-11/12 placeholder:text-black" type="text"
                    name="username" id="username">
            </div>

            <!-- email -->
            <div class="flex flex-col items-center md:items-start w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="email">Email:</label>
                <input class="border border-gray-400 text-gray-400 rounded-md pl-2 h-10 w-11/12 cursor-not-allowed"
                    type="text" name="email" id="email" v-bind:value="user_email" disabled>
            </div>

        </div>

        <div class="flex flex-col lg:flex-row w-full">

            <!-- bio -->

            <div class="flex flex-col md:items-start items-center w-full">
                <label class="pt-10 font-bold" for="bio">Bio</label>
                <textarea v-model="newBio" v-bind:placeholder="bio"
                    class="border-[1px] border-black w-11/12 rounded-md placeholder:text-black" name="bio" id="bio"
                    cols="30" rows="10" :style="{ resize: 'none' }"></textarea>
                <button @click="updateProfileInfo"
                    class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>
            </div>

            <!-- account skills/stack/badges -->

            <div class="flex flex-col md:items-start items-center pt-10 w-11/12">
                <p class="font-bold">Skills</p>

                <div class="w-full border border-black rounded-md flex flex-col">

                    <div v-if="!editStackMode" class="flex flex-wrap items-start justify-start">
                        <div v-for="item in techStack" :key="item.id" class="px-4 py-4 cursor-pointer">
                            <img :src="item.img" class="size-24" :alt="item.name">
                            <p class="text-center">{{ item.name }}</p>
                        </div>
                    </div>

                    <div v-else class="flex flex-wrap">
                        <div v-for="tech in selectedTechStack" :key="tech.id"
                            class="p-4 cursor-pointer rounded-md"
                            :style="{ backgroundColor: tech.selected ? '#D3D3D3' : 'transparent' }"
                            @click="toggleTechSelection(tech)">
                            <img :src="tech.img" class="size-16" :alt="tech.name">
                            <p class="text-center">{{ tech.name }}</p>
                        </div>
                    </div>
                </div>

                <button @click="editStackMode ? saveTechStack() : enterEditMode()"
                    class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">
                    {{ editStackMode ? 'SAVE' : 'EDIT' }}
                </button>
            </div>

        </div>

        <h1>social links</h1>


        <!-- soical links -->
    </div>

</template>

<script setup>

import store from '@/store/store';
import { supabase } from '@/lib/supabaseClient';
import { ref, computed, onMounted } from 'vue';
import techListData from '../data/technologies.json';

const userData = ref(null);

const username = ref(null);
const user_email = ref(null);
const password = ref(null);
const bio = ref(null);
const socialLinks = ref(null);
const techStack = ref(null);
const techList = techListData;
const selectedTechStack = ref(null);

const editStackMode = ref(false)
const editLinksMode = ref(false)


const newUsername = ref(null);
const newBio = ref(null);

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
        password.value = userData.value[0].password;
        bio.value = userData.value[0].bio;
        socialLinks.value = userData.value[0].social_links;
        techStack.value = userData.value[0].tech_stack;

        // Compare with user's tech stack to determine selected technologies
        selectedTechStack.value = techList.map(tech => ({
            ...tech,
            selected: techStack.value.some(userTech => userTech.id === tech.id)
        }));


    } catch (err) {

        console.log("Error fetching requested user data from Supabase:" + err);
    }

};

const enterEditMode = () => {
    editStackMode.value = true;
};

const toggleTechSelection = (tech) => {
    tech.selected = !tech.selected;
};

const saveTechStack = async () => {
    // Save the updated tech stack to the database
    const { data, error } = await supabase
        .from('users')
        .update({ tech_stack: selectedTechStack.value.filter(tech => tech.selected) })
        .eq('email', user_email.value);

    if (error) {
        console.error('Error saving tech stack:', error);
        return;
    }

    editStackMode.value = false;
    fetchUserData();

};

// update user profile
const updateProfileInfo = async () => {
    try {

        const { data, error } = await supabase
            .from('users')
            .update({
                username: newUsername.value,
                bio: newBio.value
            })
            .eq('email', user.value.email)
            .select();

        if (error) throw error;

        // Log the data returned from the update query
        console.log('Update successful:', data);
    } catch (err) {
        console.log('Supabase failed to update the user data:', err);
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