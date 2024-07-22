<script setup>

import { ref, onMounted, computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';
import store from '@/store/store'

const router = useRouter();
const route = useRoute();
const user = computed(() => store.state.user);
const userId = user.value.id;

const projectInfo = ref([]);

// get id of current project route id
const currentId = route.params.projectId;

const fetchProjectInfo = async () => {

    try {

        let { data: projectData, error } = await supabase
            .from('projects')
            .select("*")
            .eq('project_uid', currentId);

        if (error) throw error;

        projectInfo.value = projectData;

        console.log(projectInfo.value);

    } catch (err) {
        console.log(err.message)
    }
}

onMounted(async () => {
await fetchProjectInfo();
})

</script>

<template>




</template>