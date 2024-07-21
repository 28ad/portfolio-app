<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { uid } from 'uid';

import store from '@/store/store'

const router = useRouter();
const user = computed(() => store.state.user);
const userId = user.value.id;

const images = ref([]);
const fileUrls = ref([]);
const localImageUrls = ref([]);
const selectedImage = ref(null);

const title = ref('');
const description = ref('');
const githubLink = ref('');

// add uploaded images from the event object into an array and create temp URL
const handleUploadedImages = async (event) => {

    images.value = Array.from(event.target.files);
    localImageUrls.value = images.value.map((file) => URL.createObjectURL(file));

    if(localImageUrls.value.length > 0) {

        selectedImage.value = localImageUrls.value[0];

        console.log("works");

    } 

    console.log(images.value);
}

const renderSelectedImage = (imgURL) => {
    selectedImage.value = imgURL;
}


// Upload files to Supabase storage
const uploadFiles = async () => {

    const projectUID = uid();

    try {
        for (const file of images.value) {
            const { data, error } = await supabase
                .storage
                .from('project-images')
                .upload(`${projectUID}/${file.name}`, file);

            if (error) {
                console.error('Error uploading file:', error);
                continue;
            }

            // retrieve public url link for each image and push into array

            const { data: publicURLData, error: publicURLError } = supabase
                .storage
                .from('project-images')
                .getPublicUrl(`${projectUID}/${file.name}`);

            if (publicURLError) {
                console.error('Error getting public URL:', publicURLError);
                continue;
            }

            fileUrls.value.push(publicURLData.publicUrl);

        }

        // Save file URLs in Supabase database
        await saveProject(userId, fileUrls, projectUID);

    } catch (err) {
        console.error('Error uploading files:', err);
    }
};


// Save file URLs to Supabase database
const saveProject = async (userId, fileUrls, projectUID) => {
    const { data, error } = await supabase
        .from('projects')
        .insert({
            created_by: userId,
            project_uid: projectUID,
            title: title.value,
            description: description.value,
            github_link: githubLink.value,
            image_urls: fileUrls.value,
        });

    if (error) {
        console.error('Error saving file URLs:', error);
        return;
    }

    console.log(fileUrls);

    console.log('File URLs saved successfully');
};
</script>


<template>

    <div
        class="flex flex-col items-center md:flex-row md:justify-center w-full h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden">

        <!-- project images display -->
        <div class="w-11/12 h-full border flex flex-col justify-center items-center pb-10">

            <div class="">
                <img :src="selectedImage" class="max-w-96">
            </div>

            <div v-if="localImageUrls.length > 0" class="pb-4 flex flex-wrap justify-center">


                <!-- display all uploaded images -->
                <div v-for="(imgURL, index) in localImageUrls" :key="index" @click="renderSelectedImage(imgURL)">
                    <img v-bind:src="imgURL" class="size-16 lg:size-24 cursor-pointer m-4">
                </div>
            </div>

            <div v-else>
                <img src="..\assets\images\default-image.jpg" class="">

                </img>
            </div>


        </div>

        <!-- project details form -->

        <div class="w-full ml-10 flex flex-col">

            <div class="w-full flex flex-col">
                <h1 class="text-3xl mt-10">Create new project:</h1>
                <div class="mt-4 w-11/12 h-[2px] bg-black"></div>
            </div>


            <!-- Title input -->
            <div class="flex flex-col">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="title">Title:</label>
                <input v-model="title"
                    class="border border-black rounded-md h-10 w-11/12 placeholder:text-black" type="text"
                    name="title" id="title">
            </div>

            <!-- Project description input -->
            <div class="flex flex-col">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="description">Description:</label>
                <textarea v-model="description"
                    class="border-[1px] border-black w-11/12 rounded-md placeholder:text-black"
                    name="description" id="description" cols="10" rows="5" :style="{ resize: 'none' }"></textarea>
            </div>

            <!-- Github link input -->
            <div class="flex flex-col">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="githubLink">GitHub Link:</label>
                <input v-model="githubLink"
                    class="border border-black rounded-md h-10 w-11/12 placeholder:text-black" type="text"
                    name="githubLink" id="githubLink">
            </div>

            <!-- image upload input -->
            <div class="flex flex-col pt-4">
                <p class="font-bold">Project Images:</p>
                <label class="font-bold p-2 w-32 bg-base text-white text-center cursor-pointer hover:bg-custom-blue"
                    for="images">UPLOAD</label>
                <input @change="handleUploadedImages" class="hidden" type="file" id="images" multiple />
            </div>

            <!-- create button -->
            <button @click="uploadFiles"
                class="px-8 py-2 mt-4 w-56 bg-base text-white font-bold hover:bg-custom-blue">CREATE
                PROJECT</button>

        </div>


    </div>




</template>