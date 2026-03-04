export interface CategoryApi {
    category_id: string,
    name: string,
    cover_image: string,
    is_favorite: boolean,
    sub_genres: Array<string>,
}
