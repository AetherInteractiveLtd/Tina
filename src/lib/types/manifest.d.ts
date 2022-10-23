export interface Manifest {
    name: string,
    version: string,
    description: string,
    config: {
        net: {
            compression: boolean
        },
        supported_languages: string[],
        max_fps: number,
        max_players: number
    },

    tina: "dev"|"stable"|string,
}
