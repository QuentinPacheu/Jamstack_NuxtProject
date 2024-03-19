<script lang="ts" setup>
import type { Player } from '~/models/player.model';

const { findOne } = useStrapi4();
const route = useRoute();

const { data: player, pending } = useAsyncData('players', 
    () => findOne<{ data: Player}>(`players/${route.params.slug}`,)
);
</script>

<template>
    <div>
        {{ player }}
    </div>
</template>