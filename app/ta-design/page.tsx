import { getTaPage, getPosts } from '../../lib/wordpress'
import TaClient from './TaClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'TA Design | Interieurontwerp met Eenheid',
    description: 'Interieurontwerp met Eenheid en Rust',
}

export default async function TaDesignPage() {
    const [data, posts] = await Promise.all([
        getTaPage(),
        getPosts(3) // 取最新的 3 篇文章
    ])

    return (
        <main>
            <TaClient data={data} posts={posts} />
        </main>
    )
}
