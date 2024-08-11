<template>
    <div class="flex overflow-hidden h-[calc(100vh-112px)]">

        <!-- Sidebar -->
        <div class=" bg-white border-r border-gray-300"
            :class="{ 'w-[calc(16px+48px)]': !isMenuOpen, 'md:w-2/5 lg:w-3/12': isMenuOpen, 'w-full fixed md:relative z-50': isMenuOpen }">

            <!-- Sidebar Header -->
            <header class="border-b border-gray-300 bg-custom-blue text-white relative w-full"
                :class="{ 'p-8': !isMenuOpen, 'p-4': isMenuOpen }">

                <div class="absolute" @click="toggleSidebar"
                    :class="{ 'right-4 top-4': isMenuOpen, 'top-4 left-4': !isMenuOpen }">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor"
                        class="size-8 text-white font-bold cursor-pointer transition-transform duration-300"
                        :class="{ 'rotate-180': isMenuOpen }">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>


                </div>

                <div v-if="isMenuOpen" class="flex justify-between items-center">

                    <h1 v-if="!showSearchBar" class="text-2xl font-semibold">Messenger</h1>
                    <div v-else class="">
                        <input v-on:keyup.enter="findUser" v-model="findUserInput" type="text"
                            placeholder="Find user..."
                            class="border-b-2 border-white pl-2 text-white bg-base focus:outline-none text-xl w-3/4 placeholder:text-white">
                    </div>

                    <div class="relative flex right-8">
                        <button @click="toggleUserSearch" id="menuButton" class="focus:outline-none">
                            <svg v-if="!showSearchBar" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="size-8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>


                        </button>

                    </div>

                </div>
            </header>

            <!-- Contact List -->
            <div class="overflow-y-auto h-screen mb-9 pb-20" :class="{ 'p-2': !isMenuOpen, 'p-3': isMenuOpen }">


                <!-- search results -->
                <div v-if="searchResults.length > 0" v-for="result in searchResults" :key="result"
                    class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img :src="result.profile_picture" alt="User Avatar" class="w-12 h-12 rounded-full">
                    </div>

                    <div class="flex-1">
                        <h2 class="text-lg font-semibold">{{ result.username }}</h2>
                    </div>

                    <div class="div">
                        <button @click="initiateChat(result.user_id)"
                            class="rounded-md px-2 bg-base text-white font-extrabold hover:bg-custom-blue">+</button>
                    </div>
                </div>

                <!-- initiated chats -->
                <div v-else-if="isMenuOpen && searchResults.length === 0" v-for="user in messengerList" :key="user"
                    @click="fetchMessages(user.user_id)"
                    class="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                    <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                        <img :src="user.profile_picture" alt="User Avatar" class="w-12 h-12 rounded-full">
                    </div>
                    <!-- last message -->
                    <div class="flex-1">
                        <h2 class="text-lg font-semibold">{{ user.username }}</h2>
                        <p class="text-gray-600">Hoorayy!!</p>
                    </div>
                </div>

                <div v-else v-for="item in messengerList" :key="item" @click="fetchMessages(item.user_id)">
                    <div class="w-12 h-12 bg-gray-300 rounded-full">
                        <img :src="item.profile_picture" alt="User Avatar" class="w-12 h-12 rounded-full">
                    </div>
                </div>

            </div>
        </div>

        <!-- Main Chat Area -->
        <div v-if="chatSelected" class="flex-1">
            <!-- Chat Header -->
            <header class="bg-white p-4 text-gray-700">
                <h1 class="text-2xl font-semibold">{{ secondaryUserData.username }}</h1>
            </header>

            <!-- Chat Messages -->
            <div class="h-[95%] overflow-y-auto p-4 pb-28">

                <div v-for="(message, index) in messages" :key="index">

                    <!-- outgoing message -->
                    <div v-if="message.sender_id === user.id" class="flex justify-end mb-4">

                        <div class="flex max-w-96 bg-base text-white rounded-lg p-3 gap-3">
                            <p>{{ message.content }}</p>
                        </div>
                        <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                            <img v-bind:src="authUserData.profile_picture" alt="My Avatar" class="w-8 h-8 rounded-full">
                        </div>
                    </div>

                    <!-- Incoming Message -->
                    <div v-else class="flex mb-4">
                        <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                            <img v-bind:src="secondaryUserData.profile_picture" alt="User Avatar"
                                class="w-8 h-8 rounded-full">
                        </div>
                        <div class="flex max-w-96 bg-gray-200 rounded-lg p-3 gap-3">
                            <p class="text-gray-700">{{ message.content }}</p>
                        </div>
                    </div>


                </div>

            </div>

            <!-- Chat Input -->
            <footer class="bg-white border-t border-gray-300 p-4 fixed bottom-0"
                :class="{ 'w-[83%] sm:w-11/12 lg:w-[96%]': !isMenuOpen, 'w-3/5 lg:w-9/12': isMenuOpen }">
                <div class="flex items-center">
                    <input type="text" placeholder="Type a message..." v-model="messageInput"
                        class="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500">
                    <button @click="addMessage(chatId)"
                        class="hover:bg-custom-blue bg-base text-white px-4 py-2 rounded-md ml-2">Send</button>
                </div>
            </footer>
        </div>

        <!-- Default screen -->
        <div v-else class="flex items-center justify-center w-full">

            <span class="text-3xl font-bold">Select or find a user to chat with</span>

        </div>
    </div>
</template>

<script setup>

import { supabase } from '@/lib/supabaseClient';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import store from '@/store/store';

const user = computed(() => store.state.user)

const loggedInUser = ref('');
loggedInUser.value = user.value.id;
const authUserData = ref([]);
const secondaryUserId = ref('');
const selectedUserId = ref('');

const messageInput = ref('');
const messages = ref([]);

const messengerListFetchResults = ref([]);
const messengerList = ref([]);

const findUserInput = ref(null);
const searchResults = ref([]);

const chatId = ref(null);
const chatSelected = ref(false);
const secondaryUserData = ref({});

const isMenuOpen = ref(false);
const showMenuControl = ref(false);

const showSearchBar = ref(false);

const toggleSidebar = () => {

    isMenuOpen.value = !isMenuOpen.value;
    console.log(isMenuOpen.value);
}

// get data of authenticated user and the list of users which have already initiated a chat
const fetchAuthUserData = async () => {

    try {

        let { data: data, error } = await supabase
            .from('users')
            .select("*")
            .eq('user_id', user.value.id)
            .single()

        if (error) throw error;

        authUserData.value = data;

        console.log(authUserData.value);

        messengerListFetchResults.value = data.messenger_list;

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

// search user to initiate chat with
const findUser = async () => {

    try {

        let { data: users, error } = await supabase
            .from('users')
            .select("*")
            .ilike('username', `%${findUserInput.value}%`);

        if (error) throw error;

        searchResults.value = users;

        console.log(searchResults.value);

    } catch (err) {

        console.log(err);
    }
}

// initiate chat between two users

const initiateChat = async (userId) => {
    try {
        // Step 1: Create a new chat record
        const { data, error } = await supabase
            .from('messenger')
            .insert([
                {
                    user_one: user.value.id,
                    user_two: userId,
                    messages: []
                }
            ])
            .select();

        if (error) throw error;

        secondaryUserId.value = userId;
        chatId.value = data[0].id;


        console.log('Conversation initiated with user: ' + userId);

        // Step 2: Update `messenger_list` for loggedInUser
        await updateMessengerList(loggedInUser.value, secondaryUserId.value);

        // Step 3: Update `messenger_list` for the other user
        await updateMessengerList(secondaryUserId.value, loggedInUser.value);

    } catch (err) {
        console.error('Error initiating chat:', err);
    }
};

const updateMessengerList = async (userId, userToAdd) => {
    try {
        // Fetch the current messenger_list for the user
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('messenger_list')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        let updatedList = userData.messenger_list || [];

        console.log("Current messenger list for user " + userId + ": " + updatedList);

        // Only add the user if they are not already in the list
        if (!updatedList.includes(userToAdd)) {
            updatedList.push(userToAdd);

            console.log("Updated messenger list for user " + userId + ": " + updatedList);

            // Update the user record with the new list
            const { data: updateData, error: updateError } = await supabase
                .from('users')
                .update({ messenger_list: updatedList })
                .eq('user_id', userId);

            if (updateError) throw updateError;

            console.log(`Updated messenger_list for user: ${userId}` + " .Added: " + userToAdd);

            const { data: messengerlist, error } = await supabase
                .from('users')
                .select('messenger_list')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            console.log("New messenger list for " + userId + ": " + messengerlist);

        } else {
            console.log(`User: ${userToAdd} is already in the messenger_list for user: ${userId}`);
        }

    } catch (err) {
        console.error(`Error updating messenger_list for user: ${userId}`, err);
    }
};


// add new messages

const addMessage = async (chatId) => {

    console.log(chatId);

    let message = {
        sender_id: user.value.id,
        content: messageInput.value,
        timestamp: new Date().toISOString()
    };

    // Add the new message to the local state
    messages.value.push(message);

    console.log(messages.value);


    try {

        const { data, error } = await supabase
            .from('messenger')
            .update({
                'messages': messages.value
            })
            .eq('id', chatId);

        console.log(messageInput.value);

        if (error) throw error;

        messageInput.value = '';

    } catch (err) {

        console.log(err);

    }
}

// fetch messages between specific users

const fetchMessages = async (user2Id) => {

    chatSelected.value = true;
    isMenuOpen.value = false;

    try {

        const { data, error } = await supabase
            .from('messenger')
            .select('*')
            .or(`and(user_one.eq.${user.value.id},user_two.eq.${user2Id}),and(user_one.eq.${user2Id},user_two.eq.${user.value.id})`)
            .single();

        if (error) throw error;

        console.log(data);
        chatId.value = data.id;
        console.log(chatId.value);

        messages.value = data.messages;

        console.log(messages.value);

        console.log(loggedInUser.value);

        console.log(messages.value[1].sender_id);

        selectedUserId.value = user2Id;

        console.log(user2Id);




        await fetchSecondaryUserData(user2Id);

    } catch (err) {

        console.log(err);
    }
}

// fetch data of secondary chat user

const fetchSecondaryUserData = async (secondaryUserId) => {
    console.log("chatting with " + secondaryUserId);
    try {

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', secondaryUserId)
            .single();

        if (error) throw error;

        secondaryUserData.value = data;

        console.log(secondaryUserData.value);

    } catch (err) {
        console.log(err);
    }
}

// toggle user search bar for the messenger
const toggleUserSearch = () => {

    showSearchBar.value = !showSearchBar.value
    console.log(showSearchBar.value);

}


const setupRealTimeSubscription = (chatId) => {
    const channel = supabase
        .channel(chatId)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messenger' }, payload => {
            console.log('Change received!', payload);
            fetchMessages(selectedUserId.value);
        })
        .subscribe();

    // Save the channel if you need to manage it later (unsubscribe, etc.)
    return channel;
};



onMounted(() => {
    fetchAuthUserData();
    setupRealTimeSubscription(chatId.value);
})


</script>