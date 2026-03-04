import { formatTitle } from "@/shared/utils/formatUrl";

export function urlGameDetail({
    name,
    game_id
}: {
    name: string,
    game_id: string
}): string {
    const res: string = `/game/${formatTitle(name)}/${game_id}`
    return res;
}
