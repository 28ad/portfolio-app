<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRoute } from 'vue-router';

const route = useRoute();
const searchParam = route.params.param;

const searchResults = ref([]);
const searchKey = ref('');
const matchingResults = ref(false);
const lastQuery = ref('');

const dbSearchQuery = async () => {
    try {
        let { data: users, error } = await supabase
            .from('users')
            .select("*")
            .ilike('username', `%${searchParam}%`);

        if (error) throw error;

        searchResults.value = users;
        searchKey.value = searchParam;
        lastQuery.value = searchKey.value;

        matchingResults.value = users.length > 0;

        console.log(searchResults.value);
    } catch (err) {
        console.log(err);
        matchingResults.value = false;
    }
}

const localDbSearchQuery = async () => {
    try {
        let { data: users, error } = await supabase
            .from('users')
            .select("*")
            .ilike('username', `%${searchKey.value}%`);

        if (error) throw error;

        searchResults.value = users;
        lastQuery.value = searchKey.value;

        matchingResults.value = users.length > 0;

        console.log(searchResults.value);
    } catch (err) {
        console.log(err);
        matchingResults.value = false;
    }
}

onMounted(() => {
    dbSearchQuery();
})
</script>

<template>
    <div class="flex flex-col justify-center items-center overflow-x-hidden bg-gray-300">
        <!-- header -->
        <div class="w-11/12 flex flex-col items-start justify-center">
            <h1 class="text-3xl mt-10 font-bold">Results for:
                <span class="text-custom-blue italic font-normal">{{ lastQuery }}</span>
            </h1>
            <div class="mt-4 w-full h-[2px] bg-black"></div>
        </div>

        <!-- search bar -->
        <div class="w-full flex justify-center pt-10">

            <div class="flex justify-center items-end border-b-2 border-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>

            </div>

            <input type="text" v-model="searchKey" @keyup.enter="localDbSearchQuery" placeholder="Search user"
                class="outline-none l-2 placeholder:text-grey text-center placeholder:text-center md:text-left md:placeholder:text-left text-xl w-11/12 md:w-5/12 text-black border-b-2 border-black h-14">
        </div>

        <!-- results -->
        <div v-if="matchingResults" class="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 justify-center mt-10 pb-10">
            <div v-for="(result, index) in searchResults" :key="index" class="w-full flex flex-col items-center">
                <div class="w-32 h-32 mt-4 bg-custom-blue rounded-full"></div>
                <p class="font-bold text-xl py-2">{{ result.username }}</p>
                <button class="py-2 mt-2 w-36 bg-base text-white font-bold hover:bg-custom-blue">VIEW PROFILE</button>
            </div>

            <div class="w-full flex flex-col items-center">
                <div class="w-32 h-32 mt-4 bg-custom-blue rounded-full"></div>
                <p class="font-bold text-xl py-2">Test</p>
                <button class="py-2 mt-2 w-36 bg-base text-white font-bold hover:bg-custom-blue">VIEW PROFILE</button>
            </div>

            <div class="w-full flex flex-col items-center">
                <div class="w-32 h-32 mt-4 bg-custom-blue rounded-full"></div>
                <p class="font-bold text-xl py-2">Test</p>
                <button class="py-2 mt-2 w-36 bg-base text-white font-bold hover:bg-custom-blue">VIEW PROFILE</button>
            </div>

            <div class="w-full flex flex-col items-center">
                <div class="w-32 h-32 mt-4 bg-custom-blue rounded-full"></div>
                <p class="font-bold text-xl py-2">Test</p>
                <button class="py-2 mt-2 w-36 bg-base text-white font-bold hover:bg-custom-blue">VIEW PROFILE</button>
            </div>

            
        </div>

        <!-- if no matching profiles were found -->
        <div v-else class="pt-36">
            <p class="text-3xl">No results matching the term:
                <span class="text-custom-blue italic font-bold underline">{{ lastQuery }}</span>
            </p>
        </div>
    </div>
</template>
