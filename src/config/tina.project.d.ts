export declare const tina: {
    project: {
        name: string;
        author: string[];
        version: number;
        workspace: string;
    };
    tech: {
        "tina-manifest": number;
        include: string[];
    };
    config: {
        game: {
            tick: number;
        };
        net: {
            "compression-rate": number;
            "max-packets-from-client": number;
        };
    };
};
