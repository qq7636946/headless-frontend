'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import TransitionLink from '../../components/TransitionLink'
import NavHeader from '../../components/NavHeader'

gsap.registerPlugin(ScrollTrigger)

interface Post {
    id: number
    date: string
    title: { rendered: string }
    content: { rendered: string }
    excerpt: { rendered: string }
    slug: string
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
        'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>
    }
}

export default function PostClient({ post, relatedPosts }: { post: Post, relatedPosts: Post[] }) {
    const containerRef = useRef<HTMLDivElement>(null)

    const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const cats = post._embedded?.['wp:term']?.[0]?.filter(c => c.slug !== 'uncategorized') || []

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
              .fromTo('.fl-header',
                  { y: -80, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                  '-=0.3'
              )
              .fromTo('.post-hero-img img',
                  { scale: 1.15 },
                  { scale: 1, duration: 1.6, ease: 'power3.out' },
                  '-=0.5'
              )
              .fromTo('.post-header',
                  { opacity: 0, y: 50 },
                  { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' },
                  '-=1'
              )
              .fromTo('.post-article-content',
                  { opacity: 0, y: 30 },
                  { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                  '-=0.6'
              )

            // Related posts scroll animation
            gsap.fromTo('.related-card', { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
                scrollTrigger: { trigger: '.related-section', start: 'top 85%' }
            })
        }, containerRef)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    function formatDate(dateStr: string) {
        const d = new Date(dateStr)
        return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    return (
        <div ref={containerRef} className="post-body">
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

        .post-body {
          background-color: var(--bg);
          color: var(--dark);
          font-family: var(--font-sans);
          font-weight: 300;
          overflow-x: hidden;
          line-height: 1.7;
          min-height: 100vh;
        }

        .t-curtain {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          background: var(--green); z-index: 99998; transform: translateY(-100%);
          pointer-events: none;
        }

        .post-hero-img { width: 100%; height: 70vh; overflow: hidden; }
        .post-hero-img img { width: 100%; height: 100%; object-fit: cover; }

        .post-header {
          max-width: 800px; margin: -80px auto 0; position: relative; z-index: 10;
          background: var(--bg); padding: 60px 60px 40px; text-align: center;
        }
        .post-cats { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
        .post-cat {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 3px;
          color: var(--green); padding: 6px 18px; border: 0.5px solid var(--green); border-radius: 50px;
        }
        .post-title {
          font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 300; line-height: 1.2; margin-bottom: 20px;
        }
        .post-meta { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.4; }

        .post-article-content { max-width: 720px; margin: 0 auto; padding: 40px 30px 100px; }
        .post-article-content h2 { font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; margin: 50px 0 20px; }
        .post-article-content h3 { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 400; margin: 40px 0 16px; }
        .post-article-content p { margin-bottom: 24px; font-size: 1.05rem; line-height: 1.9; color: #444; }
        .post-article-content img { width: 100%; height: auto; margin: 40px 0; display: block; }
        .post-article-content blockquote {
          border-left: 2px solid var(--green); margin: 40px 0; padding: 20px 30px;
          font-family: var(--font-serif); font-size: 1.3rem; font-style: italic; color: var(--green); line-height: 1.6;
        }
        .post-article-content ul, .post-article-content ol { margin-bottom: 24px; padding-left: 24px; }
        .post-article-content li { margin-bottom: 8px; font-size: 1.05rem; color: #444; }
        .post-article-content a { color: var(--green); text-decoration: underline; text-underline-offset: 3px; }

        .post-back { max-width: 720px; margin: 0 auto; padding: 0 30px; }
        .post-back a {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px;
          color: var(--green); text-decoration: none; transition: gap 0.3s;
        }
        .post-back a:hover { gap: 16px; }

        .related-section { padding: 100px 8% 120px; border-top: 0.5px solid rgba(44,44,44,0.1); margin-top: 80px; }
        .related-title {
          font-family: var(--font-serif); font-size: 2rem; font-weight: 300;
          text-align: center; margin-bottom: 60px; text-transform: uppercase; letter-spacing: 4px;
        }
        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; }
        .related-card { overflow: hidden; transition: transform 0.5s cubic-bezier(0.25,0.1,0.25,1); }
        .related-card:hover { transform: translateY(-6px); }
        .related-card-img { width: 100%; aspect-ratio: 16/10; overflow: hidden; }
        .related-card-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.25,0.1,0.25,1);
        }
        .related-card:hover .related-card-img img { transform: scale(1.05); }
        .related-card-body { padding: 24px 0; }
        .related-card-title { font-family: var(--font-serif); font-size: 1.2rem; font-weight: 300; }
        .related-card-title a { text-decoration: none; color: var(--dark); transition: color 0.3s; }
        .related-card-title a:hover { color: var(--green); }
        .related-card-date { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.4; margin-top: 10px; }

        .post-footer { padding: 60px 8%; border-top: 0.5px solid rgba(44,44,44,0.1); }
        .post-footer-inner {
          display: flex; justify-content: space-between; font-size: 0.75rem;
          opacity: 0.5; text-transform: uppercase; letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .related-grid { grid-template-columns: repeat(2, 1fr); }
          .post-header { padding: 40px 30px 30px; margin-top: -40px; }
        }
        @media (max-width: 600px) {
          .related-grid { grid-template-columns: 1fr; }
          .post-hero-img { height: 50vh; }
        }
      `}</style>

            {/* Transition Curtain */}
            <div className="t-curtain" data-t="curtain"></div>

            {/* Nav */}
            <NavHeader />

            {/* Hero Image */}
            {featuredImg && (
                <div className="post-hero-img" data-t="content">
                    <img src={featuredImg} alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''} />
                </div>
            )}

            {/* Header */}
            <div className="post-header" data-t="content">
                {cats.length > 0 && (
                    <div className="post-cats">
                        {cats.map(c => <span key={c.id} className="post-cat">{c.name}</span>)}
                    </div>
                )}
                <h1 className="post-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <div className="post-meta">{formatDate(post.date)}</div>
            </div>

            {/* Content */}
            <div className="post-article-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

            {/* Back */}
            <div className="post-back" data-t="content">
                <TransitionLink href="/blog"><span>←</span> Terug naar Blog</TransitionLink>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="related-section" data-t="content">
                    <h2 className="related-title">Meer Artikelen</h2>
                    <div className="related-grid">
                        {relatedPosts.map(p => (
                            <article key={p.id} className="related-card">
                                <div className="related-card-img">
                                    <img
                                        src={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600'}
                                        alt=""
                                    />
                                </div>
                                <div className="related-card-body">
                                    <h3 className="related-card-title">
                                        <TransitionLink href={`/blog/${p.slug}`} dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
                                    </h3>
                                    <div className="related-card-date">{formatDate(p.date)}</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="post-footer" data-t="content">
                <div className="post-footer-inner">
                    <span>Hellendoorn</span>
                    <span>&copy; 2026 TA Design</span>
                    <span>Website by Paramor</span>
                </div>
            </footer>
        </div>
    )
}
