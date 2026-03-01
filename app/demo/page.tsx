'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Post {
    id: number
    title: { rendered: string }
    excerpt: { rendered: string }
    slug: string
    date: string
}

export default function DemoPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const heroRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)
    const featuresRef = useRef<HTMLDivElement>(null)

    // 獲取 WordPress 數據
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('http://localhost/headless/wp-json/wp/v2/posts?per_page=6')
                const data = await response.json()
                setPosts(data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching posts:', error)
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    // GSAP 動畫效果
    useEffect(() => {
        // Hero 區域動畫
        if (heroRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.hero-title', {
                    y: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out'
                })
                gsap.from('.hero-subtitle', {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    delay: 0.3,
                    ease: 'power3.out'
                })
                gsap.from('.hero-badge', {
                    scale: 0,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.6,
                    ease: 'back.out(1.7)'
                })
            }, heroRef)
            return () => ctx.revert()
        }
    }, [])

    // 卡片動畫（當數據載入後）
    useEffect(() => {
        if (!loading && posts.length > 0 && cardsRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.post-card', {
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                })
            }, cardsRef)
            return () => ctx.revert()
        }
    }, [loading, posts])

    // 特性區域動畫
    useEffect(() => {
        if (featuresRef.current) {
            const ctx = gsap.context(() => {
                gsap.from('.feature-item', {
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    x: -100,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out'
                })
            }, featuresRef)
            return () => ctx.revert()
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Headless WP
                    </Link>
                    <nav className="flex gap-6">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                            Home
                        </Link>
                        <Link href="/demo" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            Demo
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section ref={heroRef} className="pt-32 pb-20 px-4">
                <div className="container mx-auto text-center max-w-5xl">
                    <div className="hero-badge inline-block mb-6 px-6 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">✨ GSAP + WordPress API</span>
                    </div>
                    <h1 className="hero-title text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        前後端分離
                        <br />
                        全新體驗
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        使用 Next.js + WordPress REST API，結合 GSAP 動畫，
                        打造流暢、現代化且高效能的網站體驗
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        🚀 前後端分離的優勢
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="feature-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">極速載入</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                靜態生成和增量更新，比傳統 WordPress 快 10 倍以上
                            </p>
                        </div>
                        <div className="feature-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                            <div className="text-5xl mb-4">🎨</div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">自由設計</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                不受 WordPress 主題限制，使用 React 和現代化 CSS 框架
                            </p>
                        </div>
                        <div className="feature-item bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                            <div className="text-5xl mb-4">🔒</div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">更高安全性</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                前端與後端分離，降低攻擊面，WordPress 只作為內容管理
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Posts Section - 從 WordPress 動態獲取 */}
            <section ref={cardsRef} className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        📝 來自 WordPress 的即時內容
                    </h2>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">正在從 WordPress 載入數據...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                            <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">尚無文章</p>
                            <a
                                href="http://localhost/headless/wp-admin/post-new.php"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                            >
                                前往 WordPress 建立文章 →
                            </a>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="post-card bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
                                >
                                    <div className="h-48 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                            #{index + 1}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <time className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(post.date).toLocaleDateString('zh-TW')}
                                        </time>
                                        <h3
                                            className="text-xl font-bold mt-2 mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                        />
                                        <div
                                            className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                        />
                                        <Link
                                            href={`/posts/${post.slug}`}
                                            className="inline-flex items-center mt-4 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-2 transition-all"
                                        >
                                            閱讀更多 <span className="ml-1">→</span>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 py-12 mt-20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        ⚡ Powered by Next.js 15 + WordPress REST API + GSAP
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        數據即時從 WordPress 後台獲取，前端使用 React 和 GSAP 渲染
                    </p>
                </div>
            </footer>
        </div>
    )
}
