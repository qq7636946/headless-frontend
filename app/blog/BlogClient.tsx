'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import TransitionLink from '../components/TransitionLink'
import NavHeader from '../components/NavHeader'

gsap.registerPlugin(ScrollTrigger)

interface Post {
    id: number
    date: string
    title: { rendered: string }
    excerpt: { rendered: string }
    slug: string
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
        'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>
    }
}

interface Category {
    id: number
    name: string
    slug: string
    count: number
}

export default function BlogClient({ posts, categories }: { posts: Post[], categories: Category[] }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeCategory, setActiveCategory] = useState<number | null>(null)

    const filteredPosts = activeCategory
        ? posts.filter(post => post._embedded?.['wp:term']?.[0]?.some(cat => cat.id === activeCategory))
        : posts

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        const ctx = gsap.context(() => {
            // Entry: curtain reveals page
            gsap.set('[data-t="curtain"]', { y: '0%' })
            const tl = gsap.timeline()

            tl.to('[data-t="curtain"]', { y: '-100%', duration: 0.8, ease: 'power3.inOut' })
              // Header slides in
              .fromTo('.fl-header',
                  { y: -80, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                  '-=0.3'
              )
              // Banner text
              .fromTo('.blog-banner-title',
                  { opacity: 0, y: 60 },
                  { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' },
                  '-=0.4'
              )
              .fromTo('.blog-banner-sub',
                  { opacity: 0, y: 30 },
                  { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
                  '-=0.8'
              )
              // Filters
              .fromTo('.blog-filters',
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                  '-=0.6'
              )
              // Cards stagger
              .fromTo('.blog-card',
                  { opacity: 0, y: 40 },
                  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 },
                  '-=0.4'
              )
        }, containerRef)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    // Animate cards when filter changes
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.blog-card',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }
            )
        }, containerRef)
        return () => ctx.revert()
    }, [activeCategory])

    function formatDate(dateStr: string) {
        const d = new Date(dateStr)
        return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    function stripHtml(html: string) {
        return html.replace(/<[^>]*>/g, '').trim()
    }

    return (
        <div ref={containerRef} className="blog-body">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,300;0,400&family=Inter:wght@200;300;400&display=swap');

        :root {
          --bg: #f2ede4;
          --dark: #2c2c2c;
          --white: #ffffff;
          --green: #4a5d4e;
          --font-serif: 'Bodoni Moda', serif;
          --font-sans: 'Inter', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .blog-body {
          background-color: var(--bg);
          color: var(--dark);
          font-family: var(--font-sans);
          font-weight: 300;
          overflow-x: hidden;
          line-height: 1.7;
          min-height: 100vh;
        }

        /* Transition Curtain */
        .t-curtain {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          background: var(--green); z-index: 99998; transform: translateY(-100%);
          pointer-events: none;
        }

        /* Banner */
        .blog-banner {
          height: 70vh; position: relative; display: flex; flex-direction: column;
          justify-content: center; align-items: center; overflow: hidden; isolation: isolate;
        }
        .blog-banner-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center; z-index: -1;
        }
        .blog-banner-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(74,93,78,0.6), rgba(44,44,44,0.7)); z-index: -1;
        }
        .blog-banner-title {
          font-family: var(--font-serif); font-size: clamp(3rem, 8vw, 6rem);
          color: white; text-transform: uppercase; font-weight: 300; letter-spacing: 6px;
        }
        .blog-banner-sub {
          font-size: 0.85rem; color: rgba(255,255,255,0.7); text-transform: uppercase;
          letter-spacing: 4px; margin-top: 20px;
        }

        /* Filters */
        .blog-filters {
          display: flex; justify-content: center; gap: 12px; padding: 60px 8% 0;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 10px 28px; border: 0.5px solid rgba(44,44,44,0.2); border-radius: 50px;
          background: transparent; font-family: var(--font-sans); font-size: 0.75rem;
          text-transform: uppercase; letter-spacing: 2px; cursor: pointer;
          transition: all 0.4s ease; color: var(--dark); font-weight: 300;
        }
        .filter-btn:hover { border-color: var(--green); color: var(--green); }
        .filter-btn.active {
          background: var(--green); color: white; border-color: var(--green);
        }

        /* Posts Grid */
        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
          padding: 60px 8% 120px; max-width: 1400px; margin: 0 auto;
        }
        .blog-card {
          background: rgba(255,255,255,0.5); overflow: hidden;
          transition: transform 0.5s cubic-bezier(0.25,0.1,0.25,1);
        }
        .blog-card:hover { transform: translateY(-8px); }
        .blog-card-img {
          width: 100%; aspect-ratio: 16/10; overflow: hidden;
        }
        .blog-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25,0.1,0.25,1);
        }
        .blog-card:hover .blog-card-img img { transform: scale(1.05); }
        .blog-card-body { padding: 30px; }
        .blog-card-cats {
          display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .blog-card-cat {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px;
          color: var(--green); opacity: 0.8;
        }
        .blog-card-title {
          font-family: var(--font-serif); font-size: 1.4rem; font-weight: 300;
          line-height: 1.3; margin-bottom: 16px;
        }
        .blog-card-title a {
          text-decoration: none; color: var(--dark);
          transition: color 0.3s;
        }
        .blog-card-title a:hover { color: var(--green); }
        .blog-card-excerpt {
          font-size: 0.85rem; color: #666; line-height: 1.8;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-card-date {
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px;
          opacity: 0.4; margin-top: 20px;
        }
        .blog-card-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px;
          color: var(--green); text-decoration: none; margin-top: 24px;
          transition: gap 0.3s;
        }
        .blog-card-link:hover { gap: 14px; }

        /* Empty */
        .blog-empty {
          grid-column: 1 / -1; text-align: center; padding: 80px 0;
          font-family: var(--font-serif); font-size: 1.4rem; color: #999;
        }

        /* Footer */
        .blog-footer {
          padding: 60px 8%; border-top: 0.5px solid rgba(44,44,44,0.1);
        }
        .blog-footer-inner {
          display: flex; justify-content: space-between; font-size: 0.75rem;
          opacity: 0.5; text-transform: uppercase; letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); gap: 30px; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr; }
          .blog-banner { height: 50vh; }
        }
      `}</style>

            {/* Transition Curtain */}
            <div className="t-curtain" data-t="curtain"></div>

            <NavHeader />

            {/* Banner */}
            <section className="blog-banner" data-t="content">
                <div className="blog-banner-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600')" }}></div>
                <div className="blog-banner-overlay"></div>
                <h1 className="blog-banner-title">Blog</h1>
                <p className="blog-banner-sub">Inspiratie &amp; Interieurtrends</p>
            </section>

            {/* Category Filter */}
            <div className="blog-filters" data-t="content">
                <button
                    className={`filter-btn ${activeCategory === null ? 'active' : ''}`}
                    onClick={() => setActiveCategory(null)}
                >
                    Alles
                </button>
                {categories.filter(c => c.count > 0 && c.slug !== 'uncategorized').map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="blog-grid" data-t="content">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => {
                        const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
                        const cats = post._embedded?.['wp:term']?.[0] || []
                        return (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card-img">
                                    <img
                                        src={featuredImg || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600'}
                                        alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''}
                                    />
                                </div>
                                <div className="blog-card-body">
                                    <div className="blog-card-cats">
                                        {cats.filter(c => c.slug !== 'uncategorized').map(c => (
                                            <span key={c.id} className="blog-card-cat">{c.name}</span>
                                        ))}
                                    </div>
                                    <h2 className="blog-card-title">
                                        <TransitionLink href={`/blog/${post.slug}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                    </h2>
                                    <p className="blog-card-excerpt">{stripHtml(post.excerpt.rendered)}</p>
                                    <div className="blog-card-date">{formatDate(post.date)}</div>
                                    <TransitionLink href={`/blog/${post.slug}`} className="blog-card-link">
                                        Lees meer <span>→</span>
                                    </TransitionLink>
                                </div>
                            </article>
                        )
                    })
                ) : (
                    <div className="blog-empty">Geen artikelen gevonden</div>
                )}
            </div>

            {/* Footer */}
            <footer className="blog-footer" data-t="content">
                <div className="blog-footer-inner">
                    <span>Hellendoorn</span>
                    <span>&copy; 2026 TA Design</span>
                    <span>Website by Paramor</span>
                </div>
            </footer>
        </div>
    )
}
