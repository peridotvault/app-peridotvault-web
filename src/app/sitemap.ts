import { getPublishedGames } from '@/features/game/services/game.service';
import { formatTitle } from '@/shared/utils/formatUrl';
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://web.peridotvault.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const hasDatabase = !!process.env.DATABASE_URL

    if (hasDatabase) {
        try {
            const allGames = await getPublishedGames({ page: 1 });
            return [
                {
                    url: SITE_URL,
                    lastModified: new Date(),
                },
                {
                    url: `${SITE_URL}/game`,
                    lastModified: new Date(),
                },
                ...allGames.data.data.map((item) => ({
                    url: `${SITE_URL}/game/${formatTitle(item.name)}/${item.game_id}`,
                    //   lastModified: new Date(item.),
                })),
            ]
        } catch {
            return getBasicSitemap()
        }
    }

    return getBasicSitemap()
}

function getBasicSitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: SITE_URL,
            lastModified: new Date(),
        },
        {
            url: `${SITE_URL}/game`,
            lastModified: new Date(),
        },
    ]
}
