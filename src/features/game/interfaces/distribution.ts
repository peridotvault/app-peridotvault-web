export type GameDistribution =
    | { web: WebDistribution }
    | { native: NativeDistribution };


interface WebDistribution {
    url: string,
    memory: number,
    graphics: string,
    additionalNotes: string,
    storage: number,
    processor: string,
}

interface NativeDistribution {
    os: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    processor: string;
}