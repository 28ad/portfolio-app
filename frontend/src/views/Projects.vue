<template>

    <div class="w-screen flex flex-col items-center h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] overflow-x-hidden">
        <div class="flex flex-col items-center md:items-start p-4 w-full">

            <!-- view title  -->
            <h1 class="text-3xl font-bold">My Projects</h1>
            <div class="mt-4 w-full h-[2px] bg-black"></div>


            <!-- project section controls -->
            <div class="flex justify-center items-center mt-4">
                <!-- create project button -->
                <button @click="router.push('/projects/create-project')"
                    class="font-bold text-3xl py-1 px-4 bg-base hover:bg-custom-blue cursor-pointer text-white">+</button>

                <!-- search project -->
                <input class="border border-black py-2 placeholder:pl-2 ml-4" type="text" name="searchProject"
                    id="searchProject" placeholder="Search...">
                <button class="font-bold text-3xl py-2 px-2 bg-base hover:bg-custom-blue cursor-pointer text-white">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                </button>

                <!-- filters -->

                <!-- sort -->
                <select class="border border-black py-2 ml-4 text-xl cursor-pointer" name="sortProjects" id="sortProjects">
                    <option class="text-xl" value="az-ascending">⬆ A-Z</option>
                    <option class="text-xl" value="az-descending">⬇ Z-A</option>
                    <option class="text-xl" value="date-ascending">⬆ Date</option>
                    <option class="text-xl" value="date-descending">⬇ Date</option>
                </select>

            </div>

            <!-- projects grid  -->
            <div class="flex justify-center items-center mt-4 w-full">

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-y-10 gap-x-6">

                    <!-- individual project card -->
                    <router-link :to="{name: 'view-project', params: {projectId: pjct.project_uid } }" v-for="(pjct, index) in userProjects" :key="index"
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

    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import store from '@/store/store'

const user = computed(() => store.state.user);

const router = useRouter();

const userProjects = ref([]);

// retrieve and load all authenticated user's projects
const fetchUserProjects = async () => {

    try {

        let { data: projects, error } = await supabase
            .from('projects')
            .select("*")
            .eq('created_by', user.value.id);

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
    await fetchUserProjects();
})

</script>
