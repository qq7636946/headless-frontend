'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Post {
    id: number
    title: { rendered: string }
    content: { rendered: string }
    excerpt: { rendered: string }
    slug: string
    date: string
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string
            alt_text: string
        }>
    }
}

export default function ShowcasePage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const heroRef = useRef<HTMLDivElement>(null)
    const parallaxRef = useRef<HTMLDivElement>(null)

    // 獲取 WordPress 數據（包含圖片）
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('http://localhost/headless/wp-json/wp/v2/posts?per_page=9&_embed')
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

    // Hero 視差滾動動畫
    useEffect(() => {
        if (heroRef.current) {
            const ctx = gsap.context(() => {
                // 標題進場動畫
                gsap.from('.hero-content', {
                    opacity: 0,
                    y: 100,
                    duration: 1.5,
                    ease: 'power4.out'
                })

                // 視差滾動效果
                gsap.to('.hero-bg', {
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    },
                    y: 200,
                    scale: 1.1
                })
            }, heroRef)
            return () => ctx.revert()
        }
    }, [])

    // 滾動觸發動畫
    useEffect(() => {
        if (!loading && posts.length > 0) {
            const ctx = gsap.context(() => {
                // 圓形圖片動畫
                gsap.from('.circle-img', {
                    scrollTrigger: {
                        trigger: '.circle-section',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0,
                    opacity: 0,
                    duration: 1,
                    ease: 'back.out(1.7)'
                })

                // 產品卡片動畫
                gsap.from('.product-card', {
                    scrollTrigger: {
                        trigger: '.products-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 100,
                    opacity: 0,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: 'power3.out'
                })

                // 大圖網格動畫
                gsap.from('.gallery-item', {
                    scrollTrigger: {
                        trigger: '.gallery-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 0.8,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 1,
                    ease: 'power2.out'
                })
            })
            return () => ctx.revert()
        }
    }, [loading, posts])

    return (
        <div className="bg-white">
            {/* 導航列 */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        Headless WP
                    </Link>
                    <div className="flex gap-8 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition">首頁</Link>
                        <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition">Demo</Link>
                        <Link href="/showcase" className="text-blue-600 font-semibold">Showcase</Link>
                    </div>
                </div>
            </nav>

            {/* Hero 區域 - 海鮮風格 Banner */}
            <section ref={heroRef} className="relative h-[70vh] md:h-screen overflow-hidden">
                {/* 背景圖片層 */}
                <div className="hero-bg absolute inset-0">
                    {!loading && posts.length > 0 && posts[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                        <img
                            src={posts[0]._embedded['wp:featuredmedia'][0].source_url}
                            alt="Hero Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src="/api/placeholder/1920/800"
                            alt="Hero Banner"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* 輕微白色覆蓋層（模仿霧面效果） */}
                    <div className="absolute inset-0 bg-white/10"></div>
                </div>

                {/* 直排主標題 - 右側 */}
                <div className="hero-content absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-20">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                        <span className="text-gray-800">鮮度</span>
                        <span className="text-gray-700">に</span>
                        <span className="text-gray-800">本気</span>
                        <span className="text-gray-700">の</span>
                    </h1>
                    <h2 className="text-6xl md:text-8xl font-black mt-4" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                        <span className="text-blue-600">牡</span>
                        <span className="text-blue-500">蠣</span>
                        <span className="text-cyan-500">フ</span>
                        <span className="text-cyan-400">ラ</span>
                        <span className="text-blue-400">イ</span>
                    </h2>
                </div>

                {/* 左上角小文字 */}
                <div className="absolute left-8 top-8 z-20 text-gray-700 text-xs md:text-sm space-y-1">
                    <p className="leading-relaxed">每日嚴選新鮮直送才有</p>
                    <p className="leading-relaxed">這樣令人驚艷的味道</p>
                    <p className="leading-relaxed">來自大海的恩賜，</p>
                    <p className="leading-relaxed">每一口都是幸福。</p>
                </div>

                {/* 底部圓形圖標區域 */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-6 md:gap-8">
                    {/* 圖標 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 group hover:scale-110 transition-transform">
                            <span className="text-2xl">🦪</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-800 font-bold text-center leading-tight">新鮮<br />嚴選</p>
                    </div>

                    {/* 圖標 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 group hover:scale-110 transition-transform">
                            <span className="text-2xl">🍴</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-800 font-bold text-center leading-tight">精心<br />料理</p>
                    </div>

                    {/* 圖標 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 group hover:scale-110 transition-transform">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-800 font-bold text-center leading-tight">頂級<br />美味</p>
                    </div>

                    {/* 圖標 4 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 group hover:scale-110 transition-transform">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-800 font-bold text-center leading-tight">用心<br />呈現</p>
                    </div>
                </div>
            </section>

            {/* 圓形展示區域 */}
            <section className="circle-section py-32 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <div className="circle-img w-96 h-96 rounded-full overflow-hidden shadow-2xl mx-auto">
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-6xl font-bold">
                                    WP
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                                從 WordPress<br />獲取即時內容
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                後台管理輕鬆簡單，前台設計自由發揮。
                                結合現代化技術與傳統 CMS 的優勢，打造無與倫比的使用體驗。
                            </p>
                            <div className="flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>REST API</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>GSAP Animations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Next.js 15</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 產品卡片區域 */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">精選內容</h2>
                        <p className="text-xl text-gray-600">來自 WordPress 的動態數據</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-400">請先在 WordPress 後台新增文章</p>
                        </div>
                    ) : (
                        <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                            {posts.slice(0, 3).map((post) => (
                                <Link key={post.id} href={`/posts/${post.slug}`}>
                                    <article className="product-card group cursor-pointer">
                                        <div className="aspect-square overflow-hidden rounded-2xl mb-4 bg-gradient-to-br from-blue-100 to-purple-100">
                                            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                                                <img
                                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                                    alt={post.title.rendered}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white">
                                                    {post.id}
                                                </div>
                                            )}
                                        </div>
                                        <h3
                                            className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                        />
                                        <div
                                            className="text-gray-600 line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                        />
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 大圖網格區域 */}
            <section className="py-32 bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-4">視覺饗宴</h2>
                        <p className="text-xl text-gray-400">精心策劃的內容展示</p>
                    </div>

                    {!loading && posts.length >= 6 && (
                        <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                            {posts.slice(0, 6).map((post, index) => {
                                const isLarge = index === 0 || index === 5
                                return (
                                    <Link key={post.id} href={`/posts/${post.slug}`}>
                                        <div
                                            className={`gallery-item relative overflow-hidden rounded-lg group cursor-pointer ${isLarge ? 'md:col-span-2 md:row-span-2' : ''
                                                }`}
                                            style={{ aspectRatio: isLarge ? '2/1' : '1/1' }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                                <img
                                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                                    alt={post.title.rendered}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                <h3
                                                    className="text-white text-2xl font-bold"
                                                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                                />
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA 區域 */}
            <section className="py-32 bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        體驗前後端分離的威力
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
                        WordPress 管理內容，Next.js 呈現畫面，GSAP 打造動畫
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="http://localhost/headless/wp-admin"
                            target="_blank"
                            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            前往 WordPress 後台
                        </Link>
                        <Link
                            href="/"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            查看更多範例
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-2">⚡ Powered by Next.js 15 + WordPress REST API + GSAP</p>
                    <p className="text-sm">所有內容即時從 WordPress 後台獲取並渲染</p>
                </div>
            </footer>
        </div>
    )
}
