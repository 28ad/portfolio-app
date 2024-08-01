<template>

    <div class="flex flex-col items-center md:items-start overflow-x-hidden">
        <h1 class="text-3xl font-bold">Profile Information</h1>
        <div class="mt-4 w-[96%] h-[2px] bg-black"></div>


        <!-- Profile content goes here -->
        <div class="flex flex-col md:flex-row items-start w-full">

            <!-- username -->
            <div class="flex flex-col items-center md:items-start w-full md:w-11/12">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="username">Username:</label>
                <input v-model="username" 
                    class="border shadow-sm rounded-md pl-2 h-10 w-11/12 placeholder:text-black" type="text"
                    name="username" id="username">
            </div>

            <!-- email -->
            <div class="flex flex-col items-center md:items-start w-full ">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="email">Email:</label>
                <input class="border shadow-sm text-gray-400 rounded-md pl-2 h-10 w-11/12 cursor-not-allowed"
                    type="text" name="email" id="email" v-bind:value="user_email" disabled>
            </div>

        </div>

        <!-- bio and skills container -->

        <div class="flex flex-col xl:flex-row w-[96%]">

            <!-- bio -->

            <div class="flex flex-col md:items-start items-center w-full md:w-[108%] xl:w-full h-[395px]">
                <label class="pt-10 font-bold" for="bio">Bio</label>
                <textarea v-model="bio" 
                    class="border shadow-md w-11/12 rounded-md placeholder:text-black lg:pb-[235px]" name="bio"
                    id="bio" cols="30" rows="10" :style="{ resize: 'none' }"></textarea>

                <button @click="updateProfileInfo"
                    class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>
            </div>

            <!-- account skills/stack/badges -->

            <div class="flex flex-col md:items-start items-center pt-10 w-full">
                <p class="font-bold">Skills</p>

                <div class="w-full border shadow-md rounded-md flex flex-col pb-4">

                    <div v-if="!editStackMode" class="grid grid-cols-4 items-center justify-center gap-4">
                        <div v-for="item in techStack" :key="item.id" class="px-4 py-4 cursor-pointer flex flex-col items-center">
                            <img :src="item.img" class="size-16" :alt="item.name">
                            <p class="text-center font-bold">{{ item.name }}</p>
                        </div>
                    </div>

                    <div v-else class="flex flex-wrap gap-4 ml-2 overflow-y-scroll h-[240px]">
                        <div v-for="tech in selectedTechStack" :key="tech.id" class="p-4 cursor-pointer rounded-md"
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

        <!-- soical links -->
        <h1 class="text-3xl mt-10 font-bold">Social Links:</h1>
        <div class="mt-4 w-full h-[2px] bg-black"></div>

        <!-- github link -->
        <div class="flex flex-col items-center md:items-start w-full lg:w-2/4">
            <!-- input fields populated with authenticated user data -->
            <label class="pt-10 font-bold" for="githubLink">GitHub:</label>
            <input v-model="githubLink" class="border shadow-sm rounded-md pl-2 h-10 w-11/12 placeholder:text-black"
                type="text" name="githubLink" id="githubLink">
        </div>

        <!-- twitter link -->
        <div class="flex flex-col items-center md:items-start w-full lg:w-2/4">
            <!-- input fields populated with authenticated user data -->
            <label class="pt-10 font-bold" for="twitterLink">Twitter:</label>
            <input v-model="twitterLink" class="border shadow-sm rounded-md pl-2 h-10 w-11/12 placeholder:text-black"
                type="text" name="twitterLink" id="twitterLink">
        </div>

        <!-- instagram link -->
        <div class="flex flex-col items-center md:items-start w-full lg:w-2/4">
            <!-- input fields populated with authenticated user data -->
            <label class="pt-10 font-bold" for="instaLink">Instagram:</label>
            <input v-model="instaLink" class="border shadow-sm rounded-md pl-2 h-10 w-11/12 placeholder:text-black"
                type="text" name="instaLink" id="instaLink">
        </div>

        <button @click="updateProfileInfo"
            class="px-8 py-2 mt-4 bg-base text-white font-bold hover:bg-custom-blue">UPDATE</button>


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
const techStack = ref(null);
const techList = techListData;
const selectedTechStack = ref(null);

const socialLinks = ref(null);
const githubLink = ref(null);
const twitterLink = ref(null);
const instaLink = ref(null);

const editStackMode = ref(false)

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
        githubLink.value = userData.value[0].social_links.github
        twitterLink.value = userData.value[0].social_links.twitter
        instaLink.value = userData.value[0].social_links.instagram
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

        // Create the new JSON object with the updated social links
        const newLinksObj = {
            github: githubLink.value,
            twitter: twitterLink.value,
            instagram: instaLink.value
        };

        const { data, error } = await supabase
            .from('users')
            .update({
                username: username.value,
                bio: bio.value,
                social_links: newLinksObj 
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