<script setup lang="ts">
import type { StylesResponse } from "~/models/competition.model";
import type { Player } from "~/models/player.model";

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
        data: Player[],
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
        <button style="background-color: #22C55E; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;" v-for="competition in competitions" :key="competition.slug"
            @click="addFilter(competition.name)">
            {{ competition.name }}
        </button>
        <input style="height: 30px; padding: 0 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; box-sizing: border-box;" type="text" v-model="filtertext">

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