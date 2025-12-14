
export type GamePriview =
    | { kind: 'image'; src: string }
    | { kind: 'video'; src: string };