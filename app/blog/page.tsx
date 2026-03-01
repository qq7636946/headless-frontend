import { getPosts, getCategories } from '../../lib/wordpress'
import BlogClient from './BlogClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Blog | TA Design',
    description: 'Ontdek de laatste trends en inspiratie voor interieurontwerp',
}

export default async function BlogPage() {
    const [posts, categories] = await Promise.all([
        getPosts(20),
        getCategories()
    ])

    return <BlogClient posts={posts} categories={categories} />
}
