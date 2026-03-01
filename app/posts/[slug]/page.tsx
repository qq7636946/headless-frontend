import { getPostBySlug } from "@/lib/wordpress";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                            Headless WordPress
                        </Link>
                        <Link
                            href="/"
                            className="text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Article */}
            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Featured Image */}
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <div className="aspect-video overflow-hidden rounded-2xl bg-slate-200 dark:bg-gray-700 mb-8 shadow-2xl">
                        <img
                            src={post._embedded['wp:featuredmedia'][0].source_url}
                            alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Post Meta */}
                <div className="mb-8">
                    <time className="text-slate-500 dark:text-gray-400 text-lg">
                        {new Date(post.date).toLocaleDateString('zh-TW', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                    <h1
                        className="text-5xl font-bold text-slate-900 dark:text-white mt-4 leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </div>

                {/* Post Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-700 dark:prose-p:text-gray-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-img:rounded-lg prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
            </article>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-gray-700 mt-20 py-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center text-slate-600 dark:text-gray-400">
                    <p>Built with Next.js 15 & WordPress REST API</p>
                </div>
            </footer>
        </div>
    );
}
