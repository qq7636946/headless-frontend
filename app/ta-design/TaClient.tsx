'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import Lenis from '@studio-freight/lenis'
import TransitionLink from '../components/TransitionLink'
import NavHeader from '../components/NavHeader'
import { submitContactForm } from '../../lib/wordpress'

gsap.registerPlugin(ScrollTrigger)

export default function TaClient({ data, posts }: { data: any, posts: any[] }) {
    const [loadingComplete, setLoadingComplete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [formMsg, setFormMsg] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setFormStatus('sending')
        try {
            const result = await submitContactForm(formData)
            if (result.success) {
                setFormStatus('success')
                setFormMsg(result.message)
                setFormData({ name: '', email: '', phone: '', message: '' })
            } else {
                setFormStatus('error')
                setFormMsg(result.message)
            }
        } catch {
            setFormStatus('error')
            setFormMsg('Er is een fout opgetreden. Probeer het later opnieuw.')
        }
    }

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        lenis.stop()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        window.addEventListener('resize', () => ScrollTrigger.refresh())

        // Check if loader already shown this session
        const loaderShown = sessionStorage.getItem('ta-loader-shown')

        const ctx = gsap.context(() => {
            if (loaderShown) {
                // Skip loader, just do entry from curtain
                gsap.set('#loader', { display: 'none' })
                gsap.set('[data-t="curtain"]', { y: '0%' })

                const tl = gsap.timeline({
                    onComplete: () => {
                        setLoadingComplete(true)
                        lenis.start()
                    }
                })

                tl.to('[data-t="curtain"]', { y: '-100%', duration: 0.8, ease: 'power3.inOut' })
                    .fromTo('.hero-title', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' }, '-=0.4')
                    .fromTo('.fl-header', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=1')
                    .to('.hero-footer', { opacity: 1, y: -20, duration: 1 }, '-=0.8')
            } else {
                // First visit: full loader
                const tl = gsap.timeline({
                    onComplete: () => {
                        setLoadingComplete(true)
                        lenis.start()
                        sessionStorage.setItem('ta-loader-shown', '1')
                    }
                })

                const counter = { val: 0 }
                const counterEl = document.querySelector('.loader-counter') as HTMLElement
                const barEl = document.querySelector('.loader-progress-bar') as HTMLElement

                tl.to('.loader-logo span', { y: 0, duration: 1, ease: 'power4.out' })
                    .to(counter, {
                        val: 100, duration: 2.5, ease: 'power2.inOut',
                        onUpdate: () => {
                            if (counterEl) counterEl.textContent = Math.round(counter.val).toString().padStart(2, '0')
                            if (barEl) gsap.set(barEl, { x: `${counter.val - 100}%` })
                        }
                    }, '-=0.5')
                    .to('#loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'expo.inOut' })
                    .set('#loader', { display: 'none' })
                    .fromTo('.hero-title', { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 2, ease: 'power4.out' }, '-=1')
                    .fromTo('.fl-header', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=1.5')
                    .to('.hero-footer', { opacity: 1, y: -20, duration: 1 }, '-=1.2')
            }
        }, containerRef)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    // Main Animations after loading
    useEffect(() => {
        if (!loadingComplete) return

        const ctx = gsap.context(() => {
            const splitTargets = document.querySelectorAll('.split-text')
            splitTargets.forEach(target => {
                const split = new SplitType(target as HTMLElement, { types: 'lines,chars' })
                gsap.set(split.chars, { y: 100, opacity: 0 })
                gsap.to(split.chars, {
                    y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.02,
                    scrollTrigger: { trigger: target, start: 'top 85%', toggleActions: 'play none none reverse' }
                })
            })

            gsap.to('.hero-bg', { scale: 1, scrollTrigger: { trigger: '.hero', start: 'top top', scrub: true } })
            gsap.to('.about-img-mask img', { scale: 1, scrollTrigger: { trigger: '.about', start: 'top bottom', scrub: true } })
            gsap.to('.quote-bg', { scale: 1, scrollTrigger: { trigger: '.quote', start: 'top bottom', scrub: true } })

            document.querySelectorAll('.floating-img').forEach((img) => {
                const speed = parseFloat((img as HTMLElement).dataset.speed || '0.05')
                gsap.to(img, { y: -400 * speed, scrollTrigger: { trigger: '.services', start: 'top bottom', scrub: true } })
            })

            gsap.to('.about-img-mask', {
                clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'power4.inOut',
                scrollTrigger: { trigger: '.about-center', start: 'top 85%' }
            })

            const cursor = document.querySelector('#cursor')
            const follower = document.querySelector('#cursor-follower')
            window.addEventListener('mousemove', (e) => {
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 })
                gsap.to(follower, { x: e.clientX - 17, y: e.clientY - 17, duration: 0.35, ease: 'power2.out' })
            })
        }, containerRef)

        return () => ctx.revert()
    }, [loadingComplete])

    const meta = data?.meta || {}

    return (
        <div ref={containerRef} className="ta-design-body">
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

        .ta-design-body {
          background-color: var(--bg);
          color: var(--dark);
          font-family: var(--font-sans);
          font-weight: 300;
         
          line-height: 1.7;
        }

        /* Transition Curtain */
        .t-curtain {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          background: var(--green); z-index: 99998; transform: translateY(-100%);
          pointer-events: none;
        }

        #loader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background-color: #e9e4db; z-index: 99999;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
        }
        .loader-logo { font-family: var(--font-serif); font-size: 3rem; letter-spacing: 8px; margin-bottom: 20px; overflow: hidden; }
        .loader-logo span { display: inline-block; transform: translateY(100%); }
        .loader-progress-wrap { width: 200px; height: 1px; background: rgba(44,44,44,0.1); position: relative; overflow: hidden; }
        .loader-progress-bar { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--dark); transform: translateX(-100%); }
        .loader-counter { font-family: var(--font-serif); font-size: 0.8rem; margin-top: 15px; letter-spacing: 2px; opacity: 0.6; }

        #cursor { position: fixed; width: 6px; height: 6px; background: var(--dark); border-radius: 50%; pointer-events: none; z-index: 10000; }
        #cursor-follower { position: fixed; width: 34px; height: 34px; border: 0.5px solid var(--dark); border-radius: 50%; pointer-events: none; z-index: 9999; display: flex; align-items: center; justify-content: center; }

        .hero { height: 100vh; width: 100%; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; isolation: isolate; }
        .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: -1; transform: scale(1.2); }
        .hero-title { font-family: var(--font-serif); font-size: clamp(2.5rem, 8vw, 6rem); line-height: 1.1; text-align: center; color: white; text-transform: uppercase; font-weight: 300; }
        .hero-footer { position: absolute; bottom: 50px; width: 100%; display: flex; justify-content: space-between; padding: 0 60px; opacity: 0; }
        .btn-pill { background: var(--green); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 12px; }

        .about { padding: 200px 10%; display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 80px; align-items: start; }
        .about-title { font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.8rem); line-height: 1.1; color: #8a7e72; text-transform: uppercase; font-weight: 300; }
        .about-img-mask { width: 100%; aspect-ratio: 4/5; overflow: hidden; clip-path: inset(100% 0 0 0); }
        .about-img-mask img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.4); }
        .about-right { padding-top: 180px; }
        .btn-dark { background: var(--dark); color: white; padding: 16px 40px; text-decoration: none; border-radius: 4px; display: inline-flex; align-items: center; gap: 20px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; }

        .services { padding: 220px 5%; min-height: 120vh; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .services-title { font-family: var(--font-serif); font-size: clamp(1.8rem, 4vw, 2.8rem); color: var(--green); text-align: center; text-transform: uppercase; z-index: 10; max-width: 900px; font-weight: 300; }
        .floating-img { position: absolute; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.06); }
        .floating-img img { width: 100%; height: 100%; object-fit: cover; }
        .f-1 { width: 280px; height: 360px; top: 10%; left: 8%; }
        .f-2 { width: 200px; height: 140px; top: 15%; right: 18%; }
        .f-3 { width: 330px; height: 240px; bottom: 8%; left: 38%; }
        .f-4 { width: 260px; height: 380px; top: 42%; right: 7%; }

        .quote { height: 100vh; position: relative; display: flex; align-items: center; justify-content: flex-end; padding-right: 15%; overflow: hidden; isolation: isolate; }
        .quote-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: -1; transform: scale(1.3); }
        .quote-text { font-family: var(--font-serif); font-size: clamp(2.2rem, 7vw, 4.8rem); color: var(--green); text-transform: uppercase; line-height: 1.1; font-weight: 300; }

        .footer { padding: 180px 8% 60px; position: relative; }
        .contact-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 100px; margin-bottom: 180px; }
        .form-input { width: 100%; background: #e9e4db; border: none; padding: 22px; margin-bottom: 25px; font-family: inherit; font-weight: 300; font-size: 0.9rem; margin-top:20px; outline: none; transition: box-shadow 0.3s; }
        .form-input:focus { box-shadow: 0 0 0 2px var(--green); }
        .btn-dark:disabled { opacity: 0.5; cursor: not-allowed; }
        .form-feedback { margin-top: 16px; font-size: 0.85rem; letter-spacing: 1px; }
        .form-feedback.success { color: var(--green); }
        .form-feedback.error { color: #c0392b; }
        .footer-info { display: flex; justify-content: space-between; border-top: 0.5px solid #ccc; padding-top: 45px; font-size: 0.75rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 2px; }
        .big-footer-text { font-family: var(--font-serif); font-size: 16vw; color: #e9e4db; text-align: center; text-transform: uppercase; line-height: 0.8; margin-top: 60px; font-weight: 300; }

        .posts-section { padding: 100px 8%; background: #fdfbf7; }
        .posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; margin-top: 60px; }
        .post-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s; }
        .post-card:hover { transform: translateY(-10px); }
        .post-img { height: 200px; background-size: cover; background-position: center; }
        .post-content { padding: 25px; }
        .post-title { font-family: var(--font-serif); margin-bottom: 15px; font-size: 1.2rem; }
      `}</style>

            {/* Transition Curtain */}
            <div className="t-curtain" data-t="curtain"></div>

            {/* Loader */}
            <div id="loader">
                <div className="loader-logo"><span>T.A. DESIGN</span></div>
                <div className="loader-progress-wrap">
                    <div className="loader-progress-bar"></div>
                </div>
                <div className="loader-counter">00</div>
            </div>

            <div id="cursor"></div>
            <div id="cursor-follower"></div>

            <NavHeader />

            {/* Hero */}
            <section className="hero" data-t="content">
                <div className="hero-bg" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('${meta.hero_bg || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600"}')` }}></div>
                <div className="hero-content">
                    <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: (meta.hero_title || "TA DESIGN,<br>INTERIEURONTWERP<br>MET EENHEID").replace(/\r?\n/g, '<br>') }} />
                </div>
                <div className="hero-footer">
                    <a href="#" className="btn-pill mag">Contact →</a>
                    <a href="#" className="btn-pill mag">Portfolio →</a>
                </div>
            </section>

            {/* About */}
            <section className="about" data-t="content">
                <div className="about-left">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '40px', fontWeight: 300 }}>( T.A. )</div>
                    <h2 className="about-title split-text" dangerouslySetInnerHTML={{ __html: (meta.about_title || "WAAR JOUW<br>PLEKJE JOUW<br>VERHAAL VERTELT").replace(/\r?\n/g, '<br>') }} />
                </div>
                <div className="about-center">
                    <div className="about-img-mask">
                        <img src={meta.about_img || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800"} alt="Founder" />
                    </div>
                </div>
                <div className="about-right">
                    <p style={{ letterSpacing: '4px', fontWeight: 400, fontSize: '0.75rem', marginBottom: '45px', opacity: 0.6, textTransform: 'uppercase' }}>EIGENAAR TA DESIGN</p>
                    <p style={{ fontSize: '1.15rem', marginBottom: '60px', maxWidth: '420px', fontWeight: 200 }}>
                        {meta.about_desc || "TA Design biedt professioneel interieurontwerp voor woning en kantoor, in heel Nederland. Je ontvangt een compleet plan op maat."}
                    </p>
                    <a href="#" className="btn-dark mag">Over mij →</a>
                </div>
            </section>

            {/* Services */}
            <section className="services" data-t="content">
                <div className="floating-img f-1" data-speed="0.04"><img src={meta.service_img_1 || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"} /></div>
                <div className="floating-img f-2" data-speed="-0.02"><img src={meta.service_img_2 || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600"} /></div>
                <div className="services-title">
                    <p style={{ fontSize: '0.75rem', letterSpacing: '4px', marginBottom: '35px', opacity: 0.6, textTransform: 'uppercase' }}>Diensten</p>
                    <h2 className="split-text" dangerouslySetInnerHTML={{ __html: (meta.services_title || "Kleuradvies, Interieuradvies,\nen 3D ontwerp, voor\nhuis en kantoor").replace(/\r?\n/g, '<br>') }} />
                </div>
                <div className="floating-img f-3" data-speed="0.06"><img src={meta.service_img_3 || "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800"} /></div>
                <div className="floating-img f-4" data-speed="-0.05"><img src={meta.service_img_4 || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"} /></div>
            </section>

            {/* Quote */}
            <section className="quote" data-t="content">
                <div className="quote-bg" style={{ backgroundImage: `url('${meta.quote_bg || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600"}')` }}></div>
                <h2 className="quote-text split-text" dangerouslySetInnerHTML={{ __html: (meta.quote_text || "\"EEN INTERIEUR<br>MET EENHEID<br>EN RUST\"").replace(/\r?\n/g, '<br>') }} />
            </section>

            {/* News Section */}
            <section className="posts-section" data-t="content">
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 className="services-title" style={{ color: '#2c2c2c', fontSize: '2.5rem' }}>Latest News</h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>Ontdek de laatste trends</p>
                    </div>

                    <div className="posts-grid">
                        {posts && posts.length > 0 ? (
                            posts.map((post: any) => (
                                <TransitionLink key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="post-card">
                                        <div className="post-img" style={{ backgroundImage: `url(${post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/400'})` }}></div>
                                        <div className="post-content">
                                            <h3 className="post-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.substring(0, 80) + '...' }} style={{ fontSize: '0.9rem', color: '#666' }} />
                                        </div>
                                    </div>
                                </TransitionLink>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Loading posts...</p>
                        )}
                    </div>
                </div>
            </section>

            <footer id="contact" className="footer" data-t="content">
                <div className="contact-grid">
                    <h2 className="about-title split-text" style={{ fontSize: '2rem' }}>Plan een kennismaking<br />voor je eigen interieur</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Naam" className="form-input" required value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} />
                        <input type="email" placeholder="E-mailadres" className="form-input" required value={formData.email} onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
                        <input type="tel" placeholder="Telefoonnummer (optioneel)" className="form-input" value={formData.phone} onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))} />
                        <textarea placeholder="Bericht" className="form-input" rows={4} required value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}></textarea>
                        <button type="submit" className="btn-dark mag" disabled={formStatus === 'sending'}>
                            {formStatus === 'sending' ? 'Verzenden...' : 'Verzenden →'}
                        </button>
                        {formStatus === 'success' && <p className="form-feedback success">{formMsg}</p>}
                        {formStatus === 'error' && <p className="form-feedback error">{formMsg}</p>}
                    </form>
                </div>
                <div className="footer-info">
                    <span>Hellendoorn</span>
                    <span>© 2026 TA Design</span>
                    <span>Website by Paramor</span>
                </div>
                <div className="big-footer-text" id="f-text">TA DESIGN</div>
            </footer>
        </div>
    )
}
