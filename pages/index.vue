<script setup lang="ts">
import type { PlayersResponse } from '~/models/player.model';

const { find } = useStrapi();
const { data: players, pending, error } = await useAsyncData('players', () => {
    return find<PlayersResponse>('players', {
        populate: '*',
    })
});

</script>

<template>
    <h1>Hello world</h1>
    <div v-for="player in players?.data" :key="player.slug">
        {{ player.slug }}
    </div>
</template>

<style scooped></style>