import { getPostBySlug, getPosts } from '../../../lib/wordpress'
import PostClient from './PostClient'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    if (!post) return { title: 'Post Not Found' }
    return {
        title: `${post.title.rendered.replace(/<[^>]*>/g, '')} | TA Design Blog`,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) notFound()

    // Get related posts (latest 3, excluding current)
    const allPosts = await getPosts(4)
    const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3)

    return <PostClient post={post} relatedPosts={relatedPosts} />
}
