import { getBeautyPage, getPosts, getCategories } from '../../lib/wordpress'
import BeautyClient from './BeautyClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'RADIANT SKIN | Beauty Clinic',
    description: '重拾肌膚的自然光彩 - Professional laser treatments and deep nourishment',
}

export default async function BeautyPage() {
    const [data, posts, categories] = await Promise.all([
        getBeautyPage(),
        getPosts(10),
        getCategories(),
    ])

    return <main><BeautyClient data={data} posts={posts} categories={categories} /></main>
}
