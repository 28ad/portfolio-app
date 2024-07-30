<script setup>

import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userIdParam = route.params.userId;

const userData = ref([]);
const userId = ref('');
const userProfilePicture = ref(null);

const fetchUserProfileData = async () => {

    try {

        let { data: users, error } = await supabase
            .from('users')
            .select("*")
            .eq('username', userIdParam);

        if (error) throw error;

        userData.value = users[0];
        userId.value = userData.value.user_id;

        userProfilePicture.value = userData.value.profile_picture;

        console.log(userProfilePicture.value);
        console.log(userData.value);

    } catch (err) {
        console.log(err)
    }
}

const userProjects = ref([]);

// retrieve and load all authenticated user's projects
const fetchUserProjects = async () => {

    try {

        let { data: projects, error } = await supabase
            .from('projects')
            .select("*")
            .eq('created_by', userId.value);

        if (error) throw error;

        for (const item of projects) {
            userProjects.value.push(item)
        }

        console.log(userProjects.value);


    } catch (err) {

        console.log(err.message);

    }
}

onMounted(async () => {
    await fetchUserProfileData();
    fetchUserProjects();
})

</script>

<template>

    <div class="flex flex-col items-center">

        <div class="flex flex-col items-center mt-2">

            <!-- user profile picture -->

            <div class="">

                <img :src="userProfilePicture" class="w-48 h-48 rounded-full border-4 border-black">

            </div>

            <!-- username and email -->

            <div class="pt-4 flex flex-col items-center">

                <!-- username -->
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#003285" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="none" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>

                    <p class="px-2 font-bold text-2xl">
                        {{ userData.username }}</p>
                </div>

                <!-- email -->
                <div class="flex items-center py-2">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="#003285" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="white" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>

                    <p class="px-2 font-bold text-2xl">{{ userData.email }}</p>

                </div>

                <!-- buttons -->

                <div class="w-full flex justify-between py-2">

                    <!-- message button -->
                    <div>
                        <button class="px-8 py-2 bg-custom-blue text-white font-bold hover:bg-base">MESSAGE</button>
                    </div>

                    <!-- list user button -->

                    <div>
                        <button class="px-6 py-2 bg-custom-blue text-white font-bold hover:bg-base">ADD TO LIST</button>
                    </div>

                </div>

            </div>

        </div>

        <!-- user project section -->
        <div class="w-full flex flex-col items-center md:items-start px-4">
            <h1 class="text-3xl mt-10 md:mt-0 font-bold">Projects:</h1>
            <div class="mt-4 w-full h-[2px] bg-black"></div>
        </div>

        <!-- projects grid  -->
        <div class="flex justify-center items-center mt-4 pb-10 w-full px-4">

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-y-10 gap-x-6">

                <!-- individual project card -->
                <router-link :to="{ name: 'view-project', params: { projectId: pjct.project_uid } }"
                    v-for="(pjct, index) in userProjects" :key="index"
                    class="border transition-transform transform scale-100 hover:scale-105 duration-500 ease-in-out w-full flex flex-col justify-between cursor-pointer shadow-xl rounded-xl pt-4">

                    <!-- image and title -->
                    <div class="flex flex-col items-center">

                        <img :src="pjct.image_urls[0]" class="max-w-64">

                    </div>

                    <!-- tags -->
                    <div class="w-full flex flex-col items-center py-4">

                        <span class="font-bold text-2xl pt-4">{{ pjct.title }}</span>

                        <div class="flex flex-wrap">

                            <div v-for="(tag, index) in pjct.tech_used" :key="index"
                                :style="{ backgroundColor: tag.colour }"
                                class="px-4 py-1 text-white rounded-full cursor-pointer m-1">

                                {{ tag.name }}

                            </div>

                        </div>

                    </div>

                </router-link>


            </div>


        </div>

    </div>

</template>