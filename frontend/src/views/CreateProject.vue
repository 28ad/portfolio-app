<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

const router = useRouter();

const images = ref([]);

const title = ref('');
const description = ref('');
const githubLink = ref('');

const handleUploadedImages = (event)  => {

    images.value = Array.from(event.target.files);
    console.log(images)

}

</script>

<template>

    <div class="flex flex-col items-center md:flex-row md:justify-center w-full h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden">



        <div class="w-[1000px] h-full border border-black flex flex-row justify-center items-center">

            <img src="..\assets\frameworks\vuejs.svg" class=" w-64 h-64">

            </img>


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
                <label class="pt-10 font-bold" for="title">Title:</label>
                <input v-model="title" class="border border-black rounded-md h-10 w-11/12 xl:w-2/4 placeholder:text-black"
                    type="text" name="title" id="title">
            </div>

            <!-- Project description input -->
            <div class="flex flex-col">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="description">Description:</label>
                <input v-model="description" class="border border-black rounded-md h-10 w-11/12 xl:w-2/4 placeholder:text-black"
                    type="text" name="description" id="description">
            </div>

            <!-- Github link input -->
            <div class="flex flex-col">
                <!-- input fields populated with authenticated user data -->
                <label class="pt-10 font-bold" for="githubLink">GitHub Link:</label>
                <input v-model="githubLink" class="border border-black rounded-md h-10 w-11/12 xl:w-2/4 placeholder:text-black"
                    type="text" name="githubLink" id="githubLink">
            </div>

            <!-- image upload input -->
            <div class="flex flex-col">
                <p class="pt-10 font-bold">Project Images:</p>
                <label class="font-bold p-2 w-32 bg-base text-white text-center cursor-pointer hover:bg-custom-blue" for="images">UPLOAD</label>
                <input @change="handleUploadedImages" class="hidden" type="file" id="images" multiple />
                <div v-if="images.length > 0">
                    <p v-for="(img, index) in images" :key="index">
                        {{ img.name }}
                    </p>
                </div>
            </div>

        </div>


    </div>




</template>