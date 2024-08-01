<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import { uid } from 'uid';
import rawTechListData from '../data/technologies.json';

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

const displayTagSelection = ref(false);

// Make techListData reactive
const techListData = reactive(rawTechListData.map(tech => ({ ...tech, selected: false })));

const selectedTags = ref([]);

const statusMsg = ref('');


// display the tag selection option
const toggleTags = () => {

    displayTagSelection.value = !displayTagSelection.value;
}

// hande selected tags and change backgrond to representative colour
const toggleTechSelection = (tech) => {

    tech.selected = !tech.selected;
    // Update the selected tags array
    if (tech.selected) {
        selectedTags.value.push(tech);
        console.log("tag selected " + tech.name + " " + tech.selected);
    } else {
        selectedTags.value = selectedTags.value.filter(t => t.id !== tech.id);
        console.log("tag removed" + tech.name);
    }

    console.log(techListData);
    console.log(selectedTags.value);
};


// add uploaded images from the event object into an array and create temp URL
const handleUploadedImages = async (event) => {

    images.value = Array.from(event.target.files);

    localImageUrls.value = images.value.map((file) => URL.createObjectURL(file));

    if (localImageUrls.value.length > 0) {

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


    // validate project details inputs
    if (title.value === "" || description.value === "" || githubLink.value === "") {
        statusMsg.value = "You must complete all fields in order to upload your project!"
        return;
    }

    statusMsg.value = '';

    if (images.value.length === 0) {
        statusMsg.value = "You must add at least one image to your project!"
        return;
    }

    statusMsg.value = '';

    if (selectedTags.value.length === 0) {
        statusMsg.value = "You must add at least one tag to your project!"
        return;
    }

    statusMsg.value = '';

    // generate unique project_id for each project + use as storage folder identifier
    const projectUID = uid();

    try {

        // store each image submited by the user
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

    // redirect user to "My Projects" page if creation was successful
    router.push("/projects");
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
            tech_used: selectedTags.value,
            github_link: githubLink.value,
            image_urls: fileUrls.value,
        });

    if (error) {
        console.error('Error saving file URLs:', error);
        return;
    }

};
</script>


<template>

    <div
        class="flex flex-col items-center md:items-start md:flex-row md:justify-center w-full h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden mt-6">

        <!-- project images display -->
        <div class="w-11/12 mt-2 border flex flex-col justify-center items-center ml-8">

            <div class="">
                <img :src="selectedImage" class="max-w-96 min-w-96">
            </div>

            <div v-if="localImageUrls.length > 0" class="pb-4 flex flex-wrap justify-center">


                <!-- display all uploaded images -->
                <div v-for="(imgURL, index) in localImageUrls" :key="index" @click="renderSelectedImage(imgURL)">
                    <img v-bind:src="imgURL" class="size-16 lg:size-24 cursor-pointer m-4">
                </div>


            </div>

            <div v-else class="">
                <img src="..\assets\images\default-image.jpg">

                </img>
            </div>

            <!-- project tags -->

            <div class="flex flex-col items-center w-full pb-4">

                <button v-if="!displayTagSelection" @click="toggleTags"
                    class="bg-base px-4 py-1 mb-4 text-white rounded-full hover:bg-custom-blue mt-4">+ ADD TAGS</button>

                <div v-else class="flex flex-wrap w-full mt-4">

                    <div v-for="(tag, index) in techListData" :key="index"
                        :style="{ backgroundColor: tag.selected ? tag.colour : 'grey' }"
                        class="px-4 py-1 text-white rounded-full cursor-pointer m-1" @click="toggleTechSelection(tag)">

                        {{ tag.name }}

                    </div>

                </div>

            </div>


        </div>

        <!-- project details form -->

        <div class="w-11/12 md:ml-10 flex flex-col items-center md:items-start">

            <div class="w-full flex flex-col items-center md:items-start">
                <h1 class="text-3xl mt-10 md:mt-0">Create new project:</h1>
                <div class="mt-4 w-11/12 h-[2px] bg-black"></div>
            </div>

            <!-- status/error message -->

            <div v-if="statusMsg" class="mt-4 md:w-11/12 bg-red-500 font-bold shadow-xl rounded-md">
                <p class="py-4 pl-2 text-white"> {{ statusMsg }}</p>
            </div>

            <!-- Title input -->
            <div class="flex flex-col w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="title">Title:<span class="text-red-500">*</span></label>
                <input v-model="title"
                    class="border border-black rounded-md h-10 md:w-11/12 placeholder:text-black pl-2" type="text"
                    name="title" id="title">
            </div>

            <!-- Project description input -->
            <div class="flex flex-col w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="description">Description:<span class="text-red-500">*</span></label>
                <textarea v-model="description"
                    class="border-[1px] border-black md:w-11/12 h-52 rounded-md placeholder:text-black pl-2"
                    name="description" id="description" cols="10" rows="5" :style="{ resize: 'none' }"></textarea>
            </div>

            <!-- Github link input -->
            <div class="flex flex-col w-full">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-6 font-bold" for="githubLink">GitHub Link:</label>
                <input v-model="githubLink"
                    class="border border-black rounded-md h-10 w-full md:w-11/12 placeholder:text-black pl-2"
                    type="text" name="githubLink" id="githubLink">
            </div>

            <!-- buttons container -->
            <div class="flex flex-col items-center md:items-start w-full">

                <!-- image upload input -->
                <div class="flex flex-col pt-4">
                    <label
                        class="font-bold py-2 w-56 bg-base text-white text-center cursor-pointer hover:bg-custom-blue"
                        for="images">UPLOAD PICTURES</label>
                    <input @change="handleUploadedImages" class="hidden" type="file" id="images" multiple />
                </div>

                <!-- create button -->
                <button @click="uploadFiles"
                    class="py-2 mt-4 w-56 bg-base text-white font-bold hover:bg-custom-blue">CREATE
                    PROJECT</button>

            </div>

        </div>

    </div>




</template>