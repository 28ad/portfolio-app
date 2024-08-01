<script setup>

import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import store from '@/store/store'

const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.user);
const userId = user.value.id;

const projectInfo = ref([]);
const imageUrls = ref([]);
const selectedImage = ref(null);

// get id of current project route id
const currentId = route.params.projectId;

const fetchProjectInfo = async () => {

    try {

        let { data: projectData, error } = await supabase
            .from('projects')
            .select("*")
            .eq('project_uid', currentId);

        if (error) throw error;

        projectInfo.value = projectData[0];

        imageUrls.value = projectInfo.value.image_urls

        selectedImage.value = imageUrls.value;

    } catch (err) {
        console.log(err.message)
    }
}

const renderSelectedImage = (imgURL) => {

    selectedImage.value = imgURL;
}

onMounted(async () => {
    await fetchProjectInfo();
})

</script>

<template>

    <div
        class="flex flex-col items-center md:items-start md:flex-row md:justify-center w-full h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden mt-6">

        <!-- project images display -->
        <div class="w-11/12 mt-2 border flex flex-col justify-center items-center ml-8">

            <div class="">
                <img :src="selectedImage" class="max-w-96">
            </div>

            <div class="pb-4 flex flex-wrap justify-center">


                <!-- display all uploaded images -->
                <div v-for="(imgURL, index) in imageUrls" :key="index" @click="renderSelectedImage(imgURL)">
                    <img v-bind:src="imgURL" class="size-16 lg:size-24 cursor-pointer m-4">
                </div>


            </div>


        </div>

        <!-- project details -->

        <div class="w-11/12 md:ml-10 flex flex-col items-center md:items-start">

            <div class="w-full flex flex-col items-center md:items-start">
                <h1 class="text-3xl mt-10 md:mt-0">{{ projectInfo.title }}</h1>
                <div class="mt-4 w-11/12 h-[2px] bg-black"></div>
            </div>


            <!-- Project description -->

            <div class="flex flex-col w-full">
                <!-- input fields populated with authenticated user data -->
                <p class="pt-6 font-bold text-2xl" for="description">Description:</p>
                <p class=" md:w-11/12 pb-10 placeholder:text-black">{{ projectInfo.description }}</p>

            </div>

            <!-- project tags -->

            <div class="flex flex-col items-center w-full">

                <div class="flex flex-wrap w-full">

                    <div v-for="(tag, index) in projectInfo.tech_used" :key="index"
                        :style="{ backgroundColor: tag.colour }"
                        class="px-4 py-1 text-white rounded-full cursor-pointer m-1">

                        {{ tag.name }}

                    </div>

                </div>

            </div>

            <!-- Github link input -->
            <div class="flex flex-col w-full">
                <!-- input fields populated with authenticated user data -->
                <p class="pt-6 font-bold text-2xl" for="githubLink">GitHub Link:</p>

                <div class="flex flex-row w-full pt-4">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>

                    <p class="pl-2 h-10 w-full md:w-11/12 text-indigo-900">

                        <a :href="projectInfo.github_link">{{ projectInfo.github_link }}</a>
                    </p>

                </div>

            </div>

        </div>

    </div>

</template>