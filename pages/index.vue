<script setup lang="ts">
import type { StylesResponse } from "~/models/competition.model";

const { find } = useStrapi();
const filtertext= ref('');


const { data: competitions, pending, error } = await useAsyncData('competitions', async () => {
    return await find<StylesResponse>('competitions', {
        populate: '*',
    }).then(res => res.data);
});

const page = ref(1);
const pageSize = ref(2);
const filters = ref<String[]>([]);
const { data: players, pending: pplayer, error: eplayer, refresh } = useAsyncData('players', () => find<{
        data: Track[],
        meta: Meta
    }>('players', {
        populate: '*',
        pagination: { 
            page: page.value, 
            pageSize: pageSize.value 
        },
        filters: {
            competitions: {
                name: {
                    $in: filters.value
                }
            }
        }
    }), {
        watch: [page, filters],
    }
)

const addFilter = (filter: string) => {

    if (!filters.value.includes(filter)) {
        filters.value.push(filter)
    } else {
        filters.value = filters.value.filter((f) => f !== filter)
    }

    refresh()
}


const filteredPlayers = computed(() => {
    
    let playersFiltered = players.value.data;

    if (filtertext.value) {
        const lowerSearchQuery = filtertext.value.toLowerCase();
        playersFiltered = playersFiltered.filter((player) => {
            return (
                player.first_name.toLowerCase().includes(lowerSearchQuery) ||
                player.last_name.toLowerCase().includes(lowerSearchQuery)
            );
        });
    }

    if (filters.value.length) {
        playersFiltered = playersFiltered.filter((player) => {
            return player?.competitions?.some((competition) => filters.value.includes(competition.name));
        });
    }

    return playersFiltered;
});
</script>

<template>
    <div>
        <button v-for="competition in competitions" :key="competition.slug"
            @click="addFilter(competition.name)">
            {{ competition.name }}
        </button>
        <input type="text" v-model="filtertext">

        <div v-for="player in filteredPlayers">
            {{ player.first_name }}
            {{ player.last_name }}
            <img :src="player.image.url" alt="">
            <a :href="'/players/' + player.slug">Go to Player</a>
        </div>

        <UPagination
            v-if="players?.meta"
            v-model="page"
            :page-count="players?.meta.pagination.pageCount"
            :total="players?.meta.pagination.total"
        />
    </div>
</template>

<style scooped></style>