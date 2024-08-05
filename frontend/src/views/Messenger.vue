<template>
    <div class="flex overflow-hidden h-[calc(100vh-112px)]">

        <!-- Sidebar -->
        <div class="w-1/4 bg-white border-r border-gray-300">

            <!-- Sidebar Header -->
            <header class="p-4 border-b border-gray-300 flex justify-between items-center bg-base text-white">
                <h1 v-if="!showSearchBar" class="text-2xl font-semibold">Messenger</h1>
                <div v-else class="border-b-2 border-white">
                    <input type="text" placeholder="Find user..."
                        class="pl-2 text-white bg-base focus:outline-none text-xl w-3/4">
                </div>
                <div class="relative flex">
                    <button @click="toggleUserSearch" id="menuButton" class="focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-8">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                    </button>

                </div>
            </header>

            <!-- Contact List -->
            <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">

                <!-- individual user -->
                <div v-for="user in messengerList" :key="user" class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img :src="user.profile_picture" alt="User Avatar"
                            class="w-12 h-12 rounded-full">
                    </div>
                    <!-- last message -->
                    <div class="flex-1">
                        <h2 class="text-lg font-semibold">{{ user.username }}</h2>
                        <p class="text-gray-600">Hoorayy!!</p>
                    </div>
                </div>

            </div>
        </div>

        <!-- Main Chat Area -->
        <div class="flex-1">
            <!-- Chat Header -->
            <header class="bg-white p-4 text-gray-700">
                <h1 class="text-2xl font-semibold">Alice</h1>
            </header>

            <!-- Chat Messages -->
            <div class="h-screen overflow-y-auto p-4 pb-36">

                <!-- Incoming Message -->
                <div class="flex mb-4 cursor-pointer">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                        <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
                            class="w-8 h-8 rounded-full">
                    </div>
                    <div class="flex max-w-96 bg-gray-200 rounded-lg p-3 gap-3">
                        <p class="text-gray-700">Hey Bob, how's it going?</p>
                    </div>
                </div>

                <!-- Outgoing Message -->
                <div class="flex justify-end mb-4 cursor-pointer">
                    <div class="flex max-w-96 bg-base text-white rounded-lg p-3 gap-3">
                        <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
                    </div>
                    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                        <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
                            class="w-8 h-8 rounded-full">
                    </div>
                </div>

            </div>

            <!-- Chat Input -->
            <footer class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
                <div class="flex items-center">
                    <input type="text" placeholder="Type a message..." v-model="messageInput"
                        class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500">
                    <button class="hover:bg-custom-blue bg-base text-white px-4 py-2 rounded-md ml-2">Send</button>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup>

import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, computed } from 'vue';
import store from '@/store/store';

const user = computed(() => store.state.user)

const messageInput = ref('');
const messages = ref([]);
const messengerListFetchResults = ref([]);
const messengerList = ref([]);

const sender = ref(null);
const receiver = ref(null);

const showSearchBar = ref(false);

console.log(user.value);

// get the list of users which have already initiated a chat
const fetchMessengerList = async () => {

    try {

        let { data: msgList, error } = await supabase
            .from('users')
            .select("messenger_list")
            .eq('user_id', user.value.id)

        if (error) throw error;

        messengerListFetchResults.value = msgList[0].messenger_list;

        for (const listUser of messengerListFetchResults.value) {

            console.log(listUser);

            let { data: user, error } = await supabase
                .from('users')
                .select("*")
                .eq('user_id', listUser).single();

                if (error) throw error;

            messengerList.value.push(user);

            console.log(messengerList.value);
        }


    } catch (err) {

        console.log(err);

    }
}

// fetch messages between specific users

// toggle user search bar for the messenger
const toggleUserSearch = () => {

    showSearchBar.value = !showSearchBar.value
    console.log(showSearchBar.value);

}

onMounted(() => {
    fetchMessengerList();
})
</script>