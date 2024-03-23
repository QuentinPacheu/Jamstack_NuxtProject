import type { Competition } from "~/models/competition.model";
import type { Image, Meta } from "~/models/strapi.model";

export interface Player {
    id: number
    firs_tname: string
    last_name: string
    image: Image
    ranking: number
    competition: Array<Competition>
}

export interface PlayerResponse {
    data: Player[]
    meta: Meta
}

export interface PlayersResponse {
    data: Player
}