import type { Competition } from '~/models/Competition.model';
import type { Image, Meta } from '~/models/Strapi.model';

export interface Player {
    id: number
    first_name: string
    last_name: string
    slug: string
    imageUrl: Image
    ranking: number
    competition: Array<Competition>
}

export interface PlayersResponse {
    data: Player[]
    meta: Meta
}

export interface PlayerResponse {
    data: Player
}