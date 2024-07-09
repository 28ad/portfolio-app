<template>
    <div class="bg-base w-full md:w-64 flex flex-col items-center md:border-r-[1px] border-blue-300">
        <!-- profile info -->
        <div class="w-full flex flex-col items-center h-2/8 ">
            <div class="w-32 h-32 mt-4 bg-custom-blue"></div>
            <h1 class="text-white mt-4">{{ loggedInUser }}</h1>
            <h1 class="text-white">Username</h1>
        </div>

        <div class="w-5/6 h-[1px] mt-4 mb-4 bg-blue-300"></div>

        <!-- menu -->
        <div class="w-full flex flex-col items-center h-full pb-4">
            <!-- Profile menu option container-->
            <div @click="selectOption('profile')"
                class="flex flex-row pl-4 justify-center md:justify-start items-center hover:bg-custom-blue cursor-pointer w-full py-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span class="text-white text-center pl-2">Profile</span>
            </div>

            <!-- Password menu option container-->
            <div @click="selectOption('password')"
                class="flex flex-row pl-4 justify-center md:justify-start items-center hover:bg-custom-blue cursor-pointer w-full py-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span class="text-white text-center pl-2">Password</span>
            </div>

            <!-- Email update menu option container-->
            <div @click="selectOption('email')"
                class="flex flex-row pl-4 justify-center md:justify-start items-center hover:bg-custom-blue cursor-pointer w-full py-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6 text-white">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span class="text-white text-center pl-2">Email</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import store from '@/store/store';

const loggedInUser = ref('');

// Get user from store
const user = computed(() => store.state.user);

loggedInUser.value = user.value.email;

// Define the emit function
const emit = defineEmits(['optionSelected']);

const selectOption = (option) => {
    // Emit the selected option to the parent component
    emit('optionSelected', option);
};
</script>