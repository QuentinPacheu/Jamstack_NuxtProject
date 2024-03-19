import type { Player } from '~/models/player.model'

export interface Competition {
    id: number
    name: string
    players: Player[]
}