'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { getField as g } from '@/lib/wordpress'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import type SwiperType from 'swiper'
import './beauty.css'

gsap.registerPlugin(ScrollTrigger)

interface BeautyProps {
    data: any
    posts: any[]
    categories: any[]
}

export default function BeautyClient({ data, posts, categories }: BeautyProps) {
    const [activeTab, setActiveTab] = useState(0)
    const swiperRef = useRef<SwiperType | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const m = data?.meta || {}

    const heroImg = g('beauty_hero_bg', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop', m)
    const svcItems = g('beauty_svc_items', "皮秒雷射\n水飛梭保養\n全能美肌脈衝光\n酸類煥膚", m).split('\n').filter(Boolean)
    const svcSlides = [
        g('beauty_svc_slide_1', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop', m),
        g('beauty_svc_slide_2', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop', m),
        g('beauty_svc_slide_3', 'https://images.unsplash.com/photo-1609188076685-a405238d6f68?q=80&w=800&auto=format&fit=crop', m),
        g('beauty_svc_slide_4', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', m),
    ]
    const docExp1 = g('beauty_doc_exp1_list', "超過 20 年皮膚臨床與醫美經驗\n前醫學中心皮膚科主治醫師\n亞洲皮秒雷射技術教學導師", m).split('\n').filter(Boolean)
    const docExp2 = g('beauty_doc_exp2_list', "頑固斑點處理\n全臉結構式拉提\n疤痕組織修復", m).split('\n').filter(Boolean)
    const footerNotice = g('beauty_footer_notice', "本診所所有網站平台內之個案...\n本診所係由取得整形外科醫師執照...\n網站中所提之整形手術...\n禁止任何網際網路服務業者...", m).split('\n').filter(Boolean)
    const svcQuote = g('beauty_svc_quote', "We only provide your skin with the nutrients it needs most.\nAt our skin care center, we treat every inch of skin like a work of art.", m)
    const teamDesc = g('beauty_team_desc', "我們深知每張臉都是獨一無二的。這裡只有針對你膚況的專業建議。我們的醫師團隊定期進修國際最新醫美科技，確保每一次雷射與護理都在最安全的規範下進行。\n\n在我們的皮膚管理中心，我們把每一吋肌膚都當成藝術品來呵護。", m).split('\n\n')

    const witnesses = [1, 2, 3, 4].map(i => ({
        img: g(`beauty_wit_img_${i}`, [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2?q=80&w=800&auto=format&fit=crop',
        ][i - 1], m),
        tag: g(`beauty_wit_tag_${i}`, ['告別痘疤', '抗痘之路', '亮顏保養', '素顏自信'][i - 1], m),
        desc: g(`beauty_wit_desc_${i}`, ['從此化妝不再需要遮瑕膏', '終於找回平滑的側臉', '婚禮前的完美急救', '讓皮膚在自然光下也發亮'][i - 1], m),
    }))

    const tabs = ['本月限定', '衛教新知', '全新設備', '活動分享']

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
        const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)

        // Mobile menu
        const mobileToggle = document.getElementById('mobile-toggle')
        const mobileMenu = document.getElementById('mobile-menu')
        const mobileLinks = document.querySelectorAll('.mobile-link')
        const handleToggle = () => {
            mobileMenu?.classList.toggle('active')
            if (mobileToggle) mobileToggle.innerHTML = mobileMenu?.classList.contains('active') ? '<span>✕</span>' : '<span>☰</span>'
        }
        const handleMobileLink = () => {
            mobileMenu?.classList.remove('active')
            if (mobileToggle) mobileToggle.innerHTML = '<span>☰</span>'
        }
        mobileToggle?.addEventListener('click', handleToggle)
        mobileLinks.forEach(l => l.addEventListener('click', handleMobileLink))

        // Mouse parallax
        const handleMouse = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20
            const y = (e.clientY / window.innerHeight - 0.5) * 20
            gsap.to('#parallax-bg', { x: x * 0.5, y: y * 0.5, duration: 1, ease: 'power2.out' })
            gsap.to('.hero-left', { x: -x * 0.8, y: -y * 0.8, duration: 1, ease: 'power2.out' })
            gsap.to('.hero-right', { x: -x * 0.5, y: -y * 0.5, duration: 1, ease: 'power2.out' })
            gsap.to('#floating-card', { x: x * 1.5, y: y * 1.5, duration: 1.5, ease: 'power2.out' })
            gsap.to('.bg-blob', { x: x, y: y, duration: 2, ease: 'power1.out' })
        }
        document.addEventListener('mousemove', handleMouse)

        // 3D Tilt
        const cards = document.querySelectorAll('.witness-card')
        cards.forEach(card => {
            const onMove = (e: Event) => {
                const me = e as MouseEvent
                const rect = (card as HTMLElement).getBoundingClientRect()
                const cx = rect.width / 2, cy = rect.height / 2
                const rx = ((me.clientY - rect.top - cy) / cy) * -5
                const ry = ((me.clientX - rect.left - cx) / cx) * 5
                gsap.to(card.querySelector('.witness-inner'), { rotateX: rx, rotateY: ry, transformPerspective: 1000, duration: 0.4, ease: 'power2.out' })
            }
            const onLeave = () => gsap.to(card.querySelector('.witness-inner'), { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
            card.addEventListener('mousemove', onMove)
            card.addEventListener('mouseleave', onLeave)
        })

        // Magnetic buttons
        const magneticBtn = (sel: string) => {
            const btn = document.querySelector(sel) as HTMLElement | null
            if (!btn) return
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect()
                gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3, duration: 0.3, ease: 'power2.out' })
            })
            btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }))
        }
        magneticBtn('#btn-magnetic-1')
        magneticBtn('#btn-magnetic-2')
        magneticBtn('#btn-magnetic-reserve')

        // Hero timeline (plays after loader)
        const tl = gsap.timeline({ paused: true })
        tl.from('.hero-left', { x: -50, opacity: 0, duration: 1.2, ease: 'power3.out' })
            .from('.hero-right', { x: 50, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')
            .from('#floating-card', { y: 50, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
            .from('.glass-nav-container', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.5')

        // Hero zoom out on scroll
        gsap.set('#parallax-bg img', { scale: 1.2 })
        gsap.to('#parallax-bg img', { scale: 1.0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })

        // Reserve zoom out
        gsap.set('.reserve-bg img', { scale: 1.2 })
        gsap.to('.reserve-bg img', { scale: 1.0, ease: 'none', scrollTrigger: { trigger: '#section-3', start: 'top bottom', end: 'bottom top', scrub: true } })

        // Loader
        lenis.stop()
        const counter = { val: 0 }
        const loadTl = gsap.timeline({
            onComplete: () => {
                lenis.start()
                const lw = document.getElementById('loader-wrap')
                if (lw) lw.style.pointerEvents = 'none'
                tl.play()
            }
        })
        loadTl.to('.loader-count', { y: 0, duration: 1, ease: 'power4.out' })
            .to('.loader-symbol', { opacity: 1, duration: 1 }, '<0.2')
            .to('.loader-text', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '<0.4')
        loadTl.to(counter, {
            val: 100, duration: 2, ease: 'power2.inOut',
            onUpdate: () => {
                const el = document.querySelector('.loader-count')
                if (el) el.textContent = Math.floor(counter.val).toString()
            }
        }, '<')
        loadTl.to('.loader-count-wrap', { yPercent: -120, duration: 0.8, ease: 'power3.in' }, '+=0.2')
            .to('.loader-text', { opacity: 0, duration: 0.5 }, '<')
            .to('.loader-bg', { scaleY: 0, transformOrigin: 'top', duration: 1, ease: 'expo.inOut' }, '-=0.4')

        // Line animations
        gsap.from('.hero-line', { scaleX: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 })
        gsap.from('.scroll-line', { scaleY: 0, duration: 1.5, ease: 'power3.out', delay: 1 })

        const sd = { toggleActions: 'play none none reverse', start: 'top 80%' }
        gsap.from('#interior-img', { scrollTrigger: { trigger: '#section-2', start: 'top 70%', toggleActions: 'play none none reverse' }, y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' })
        gsap.from('.headline-group', { scrollTrigger: { trigger: '.headline-group', ...sd }, y: 30, opacity: 0, duration: 1, delay: 0.2 })
        gsap.from('.interaction-area', { scrollTrigger: { trigger: '.interaction-area', start: 'top 75%', toggleActions: 'play none none reverse' }, y: 40, opacity: 0, duration: 1, delay: 0.4 })
        gsap.from('.bottom-quote-line', { scrollTrigger: { trigger: '.bottom-quote', ...sd }, scaleX: 0, duration: 1.2, ease: 'power3.out' })
        gsap.from('.reserve-subtitle', { scrollTrigger: { trigger: '#section-3', start: 'top 60%', toggleActions: 'play none none reverse' }, x: -20, opacity: 0, duration: 0.8 })
        gsap.from('.reserve-line', { scrollTrigger: { trigger: '#section-3', start: 'top 60%', toggleActions: 'play none none reverse' }, scaleX: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
        gsap.from('.reserve-title', { scrollTrigger: { trigger: '#section-3', start: 'top 60%', toggleActions: 'play none none reverse' }, y: 30, opacity: 0, duration: 1, delay: 0.2 })
        gsap.from('.reserve-badge', { scrollTrigger: { trigger: '#section-3', start: 'top 60%', toggleActions: 'play none none reverse' }, scale: 0.5, opacity: 0, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' })
        gsap.from('.team-title', { scrollTrigger: { trigger: '#section-4', start: 'top 80%', toggleActions: 'play none none reverse' }, y: 30, opacity: 0, duration: 1, ease: 'power3.out' })
        gsap.from('.collage-item', { scrollTrigger: { trigger: '.team-collage', start: 'top 70%', toggleActions: 'play none none reverse' }, scale: 0.5, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)' })
        gsap.from('.team-text-content', { scrollTrigger: { trigger: '.team-text-content', start: 'top 75%', toggleActions: 'play none none reverse' }, x: 30, opacity: 0, duration: 1, delay: 0.4 })
        gsap.from('.doctor-top-line', { scrollTrigger: { trigger: '#section-5', ...sd }, scaleX: 0, duration: 1.5, ease: 'power3.out', transformOrigin: 'center' })
        gsap.from('.doctor-img-wrapper', { scrollTrigger: { trigger: '#section-5', start: 'top 70%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, duration: 1.2, ease: 'power3.out' })
        gsap.from('.doctor-content', { scrollTrigger: { trigger: '.doctor-content', start: 'top 80%', toggleActions: 'play none none reverse' }, x: 50, opacity: 0, duration: 1, delay: 0.2 })
        gsap.from('.doctor-header-line', { scrollTrigger: { trigger: '.doctor-content', start: 'top 80%', toggleActions: 'play none none reverse' }, scaleX: 0, duration: 1, ease: 'power3.out', delay: 0.3 })
        gsap.from('.witness-card', { scrollTrigger: { trigger: '.witness-grid', start: 'top 75%', toggleActions: 'play none none reverse' }, y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out' })
        gsap.from('.witness-line', { scrollTrigger: { trigger: '.witness-grid', start: 'top 75%', toggleActions: 'play none none reverse' }, scaleX: 0, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.2 })
        gsap.from('.news-item', { scrollTrigger: { trigger: '.news-list', start: 'top 80%', toggleActions: 'play none none reverse' }, x: -30, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power2.out' })
        gsap.from('.news-line', { scrollTrigger: { trigger: '.news-list', start: 'top 80%', toggleActions: 'play none none reverse' }, scaleX: 0, stagger: 0.2, duration: 1, ease: 'power3.out' })
        gsap.from('.footer-line', { scrollTrigger: { trigger: '.site-footer', start: 'top 90%', toggleActions: 'play none none reverse' }, scaleX: 0, duration: 1.5, ease: 'power3.out' })
        gsap.to('#hero-bg-img', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.5 }, y: 100 })

        return () => {
            lenis.destroy()
            ScrollTrigger.getAll().forEach(t => t.kill())
            document.removeEventListener('mousemove', handleMouse)
            mobileToggle?.removeEventListener('click', handleToggle)
        }
    }, [])

    const handleSvcClick = (i: number) => {
        swiperRef.current?.slideTo(i)
        document.querySelectorAll('#service-list li').forEach((li, idx) => {
            li.classList.toggle('active', idx === i)
        })
    }

    const onSwiperChange = (swiper: SwiperType) => {
        document.querySelectorAll('#service-list li').forEach((li, i) => {
            li.classList.toggle('active', i === swiper.activeIndex)
        })
    }

    return (
        <div ref={containerRef} className="beauty-page">
            {/* SVG Clip Path */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="star-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.5 0.05 C 0.5 0.05 0.6 0.3 0.95 0.5 C 0.6 0.7 0.5 0.95 0.5 0.95 C 0.5 0.95 0.4 0.7 0.05 0.5 C 0.4 0.3 0.5 0.05 0.5 0.05 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* Loader */}
            <div className="loader-wrap" id="loader-wrap">
                <div className="loader-content">
                    <div className="loader-count-wrap">
                        <div className="loader-count">0</div>
                        <div className="loader-symbol">%</div>
                    </div>
                    <div className="loader-text">Redefining Beauty</div>
                </div>
                <div className="loader-bg"></div>
            </div>

            {/* Nav */}
            <div className="glass-nav-container">
                <nav className="glass-nav">
                    <div className="nav-logo">
                        <svg viewBox="0 0 100 100" fill="none">
                            <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M50 10 V90 M10 50 H90" stroke="currentColor" strokeWidth="2" />
                            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>BEAUTY-CLINIC</span>
                    </div>
                    <ul className="nav-links">
                        <li><a href="#section-2">服務項目</a></li>
                        <li><a href="#section-7">最新消息</a></li>
                        <li><a href="#section-4">關於我們</a></li>
                        <li><a href="#section-5">醫師團隊</a></li>
                        <li><a href="#section-6">美麗見證</a></li>
                    </ul>
                    <div className="mobile-menu-btn" id="mobile-toggle"><span>☰</span></div>
                    <a href="#reserve" className="nav-reserve">( RESERVE 立即預約 )</a>
                </nav>
            </div>

            {/* Mobile Menu */}
            <div className="mobile-menu-overlay" id="mobile-menu">
                <ul className="mobile-menu-links">
                    <li><a href="#section-2" className="mobile-link">服務項目</a></li>
                    <li><a href="#section-7" className="mobile-link">最新消息</a></li>
                    <li><a href="#section-4" className="mobile-link">關於我們</a></li>
                    <li><a href="#section-5" className="mobile-link">醫師團隊</a></li>
                    <li><a href="#section-6" className="mobile-link">美麗見證</a></li>
                    <li><a href="#reserve" className="mobile-link" style={{ color: 'var(--color-accent)' }}>( 立即預約 )</a></li>
                </ul>
            </div>

            {/* Hero */}
            <section className="hero" id="hero">
                <div className="hero-bg" id="parallax-bg">
                    <img src={heroImg} id="hero-bg-img" alt="Background" />
                    <div className="hero-overlay"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-left">
                        <p className="hero-subtitle">{g('beauty_hero_subtitle', '重拾肌膚的自然光彩', m)}</p>
                        <h1>{g('beauty_hero_title', 'RADIANT', m)}</h1>
                        <div className="hero-deco"><span>✦</span><span>✦</span><span>✦</span><span>✦</span></div>
                    </div>
                    <div className="hero-right">
                        <p className="hero-desc">{g('beauty_hero_desc', 'Professional laser treatments and deep nourishment allow you to glow without filters.', m)}</p>
                        <div className="skin-title-wrap">
                            <div className="hero-line"></div>
                            <h2>{g('beauty_hero_title2', 'SKIN', m)}</h2>
                        </div>
                        <p className="hero-chinese-desc">{g('beauty_hero_cn_desc', '將醫學美容融入您的日常護膚程序，打造自然自信之美', m)}</p>
                    </div>
                </div>
                <div className="hero-float-img" id="floating-card">
                    <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop" alt="Small Preview" />
                    <div className="play-btn">▶</div>
                </div>
                <div className="scroll-down">
                    <span className="scroll-text">SCROLL DOWN</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* Services */}
            <section className="section-services" id="section-2">
                <div className="bg-blob" id="blob-1"></div>
                <div className="container services-layout">
                    <div className="interior-img-wrapper">
                        <img src={g('beauty_svc_img', 'https://images.unsplash.com/photo-1620733723572-11c52f7c2d82?q=80&w=900&auto=format&fit=crop', m)} alt="Interior" id="interior-img" />
                    </div>
                    <div className="services-content">
                        <div className="headline-group">
                            <h2>
                                <span className="headline-light">{g('beauty_svc_headline_light', "( We don't )", m)}</span>
                                {g('beauty_svc_headline', 'Sell Treatments', m)}
                            </h2>
                            <p className="headline-sub" dangerouslySetInnerHTML={{ __html: g('beauty_svc_subtitle', '我們不推銷療程\n只給妳皮膚最需要的養分', m).replace(/\n/g, '<br>') }} />
                        </div>
                        <div className="interaction-area">
                            <div className="service-list-col">
                                <div>
                                    <span className="service-deco-plus">+</span>
                                    <span className="service-label">BEAUTY SERVICES</span>
                                    <p className="service-desc-mini">{g('beauty_svc_desc', '在我們的皮膚管理中心，我們把每一吋肌膚都當成藝術品來呵護。', m)}</p>
                                    <ul className="service-list" id="service-list">
                                        {svcItems.map((item: string, i: number) => (
                                            <li key={i} className={i === 0 ? 'active' : ''} data-index={i} onClick={() => handleSvcClick(i)}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="nav-controls-wrapper">
                                    <div className="arrows-group">
                                        <button className="nav-btn prev-btn" onClick={() => swiperRef.current?.slidePrev()}>
                                            <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M0 7.5H29M0 7.5L7 0.5M0 7.5L7 14.5" /></svg>
                                        </button>
                                        <button className="nav-btn next-btn" onClick={() => swiperRef.current?.slideNext()}>
                                            <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M30 7.5H1M30 7.5L23 0.5M30 7.5L23 14.5" /></svg>
                                        </button>
                                    </div>
                                    <div className="more-group" id="btn-magnetic-1"><span className="more-icon">✿</span> <span className="more-link">MORE</span></div>
                                </div>
                            </div>
                            <div className="swiper-container-custom">
                                <Swiper
                                    modules={[EffectFade]}
                                    spaceBetween={20}
                                    effect="fade"
                                    fadeEffect={{ crossFade: true }}
                                    speed={800}
                                    loop={false}
                                    onSwiper={(s) => { swiperRef.current = s }}
                                    onSlideChange={onSwiperChange}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    {svcSlides.map((src, i) => (
                                        <SwiperSlide key={i}><img src={src} alt={`Slide ${i + 1}`} /></SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="bottom-quote">
                            <div className="bottom-quote-line"></div>
                            {svcQuote.split('\n').map((line: string, i: number) => <span key={i}>{line}{i < svcQuote.split('\n').length - 1 && <br />}</span>)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reservation */}
            <section className="section-reserve" id="section-3">
                <div className="reserve-bg">
                    <img src={g('beauty_rsv_bg', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', m)} alt="Consultation" />
                    <div className="reserve-overlay-gradient"></div>
                </div>
                <div className="reserve-content-container">
                    <div className="reserve-text-group">
                        <span className="reserve-subtitle"><span className="reserve-line"></span>{g('beauty_rsv_subtitle', 'STARTING', m)}</span>
                        <h2 className="reserve-title" dangerouslySetInnerHTML={{ __html: g('beauty_rsv_title', 'WITH IMPROVING\nYOUR BASAL\nMETABOLIC RATE', m).replace(/\n/g, '<br>') }} />
                    </div>
                    <a href="#reserve" className="reserve-badge" id="btn-magnetic-reserve">
                        <svg className="badge-bg-svg" viewBox="0 0 200 200" fill="none">
                            <filter id="badge-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="rgba(0,0,0,0.1)" />
                            </filter>
                            <path d="M100 10 C 115 50 140 75 190 100 C 140 125 115 150 100 190 C 85 150 60 125 10 100 C 60 75 85 50 100 10 Z" fill="white" filter="url(#badge-shadow)" />
                        </svg>
                        <div className="badge-content">
                            <span className="badge-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                                    <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
                                </svg>
                            </span>
                            <span className="badge-main">RESERVE</span>
                            <span className="badge-sub">( 立即預約 )</span>
                        </div>
                    </a>
                </div>
            </section>

            {/* Team */}
            <section className="section-team" id="section-4">
                <div className="container">
                    <div className="team-header">
                        <h2 className="team-title">MEDICAL TEAM</h2>
                    </div>
                    <div className="team-layout">
                        <div className="team-collage">
                            <div className="collage-item collage-1">
                                <img src={g('beauty_team_img1', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', m)} alt="Team 1" />
                            </div>
                            <div className="collage-item collage-2">
                                <img src={g('beauty_team_img2', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop', m)} alt="Team 2" />
                            </div>
                            <div className="collage-deco"></div>
                        </div>
                        <div className="team-text-content">
                            <span className="team-star-icon">✦</span>
                            <h3 className="team-subtitle">{g('beauty_team_subtitle', '關於我們與醫師團隊', m)}</h3>
                            <p className="team-desc">
                                <span className="team-desc-highlight">{g('beauty_team_highlight', '經驗豐富的皮膚科專業團隊，守護你的每一吋肌膚', m)}</span>
                                {teamDesc[0]}
                            </p>
                            {teamDesc.slice(1).map((p: string, i: number) => <p key={i} className="team-desc">{p}</p>)}
                        </div>
                        <div className="team-btn-wrapper">
                            <div className="team-more-btn" id="btn-magnetic-2">
                                <div className="btn-bg-shape"></div>
                                <div className="btn-text">
                                    <span className="btn-main">MORE</span>
                                    <span className="btn-sub">( 了解更多 )</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctor */}
            <section className="section-doctor" id="section-5">
                <div className="doctor-top-line"></div>
                <div className="container">
                    <div className="doctor-layout">
                        <div className="doctor-left">
                            <div className="doctor-img-wrapper">
                                <img src={g('beauty_doc_img', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop', m)} alt="Doctor" />
                            </div>
                            <div className="doctor-nav">
                                <button className="nav-btn prev-btn">
                                    <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M0 7.5H29M0 7.5L7 0.5M0 7.5L7 14.5" /></svg>
                                </button>
                                <button className="nav-btn next-btn">
                                    <svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M30 7.5H1M30 7.5L23 0.5M30 7.5L23 14.5" /></svg>
                                </button>
                                <div className="more-group" style={{ marginLeft: '30px' }}><span className="more-icon">✿</span> <span className="more-link">VIEW MORE</span></div>
                            </div>
                        </div>
                        <div className="doctor-content">
                            <div className="doctor-header-group">
                                <div className="doctor-header-line"></div>
                                <h2><span className="doctor-header-light">( About )</span> Doctor 醫師介紹</h2>
                                <div className="doctor-name-row">
                                    <span className="doctor-name">{g('beauty_doc_name', '陳博文', m)} <span className="doctor-title-en">( {g('beauty_doc_name_en', 'DR. KEVIN CHEN', m)} )</span></span>
                                    <span className="doctor-badge">{g('beauty_doc_badge', '院長', m)}</span>
                                </div>
                                <p className="doctor-quote">{g('beauty_doc_quote', '醫美不只是改變外表，而是找回自信的起點。', m)}</p>
                            </div>
                            <div className="doctor-exp-grid">
                                <div className="exp-col">
                                    <h4>{g('beauty_doc_exp1_title', '專業經驗 :', m)}</h4>
                                    <ul className="exp-list">{docExp1.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
                                </div>
                                <div className="exp-col">
                                    <h4>{g('beauty_doc_exp2_title', '擅長項目 :', m)}</h4>
                                    <ul className="exp-list">{docExp2.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul>
                                </div>
                            </div>
                            <div className="doctor-gallery">
                                {[
                                    g('beauty_doc_gallery1', 'https://images.unsplash.com/photo-1590611936760-eeb9bc598548?q=80&w=600&auto=format&fit=crop', m),
                                    g('beauty_doc_gallery2', 'https://images.unsplash.com/photo-1629909615184-74f495363b63?q=80&w=600&auto=format&fit=crop', m),
                                    g('beauty_doc_gallery3', 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=600&auto=format&fit=crop', m),
                                ].map((src, i) => (
                                    <div className="gallery-item" key={i}><img src={src} alt={`Gallery ${i + 1}`} /></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Witnesses */}
            <section className="section-witness" id="section-6">
                <div className="container">
                    <div className="witness-header">
                        <h2 className="witness-title"><span className="witness-title-light">( Witnesses )</span> of Beauty</h2>
                        <span className="witness-sub">美的見證者</span>
                    </div>
                    <div className="witness-grid">
                        {witnesses.map((w, i) => (
                            <div className="witness-card" key={i}>
                                <div className="witness-inner">
                                    <div className="witness-img"><img src={w.img} alt={`Witness ${i + 1}`} /></div>
                                    <div className="witness-meta">
                                        <div className="witness-line"></div>
                                        <span>✦ OUR CASE - {String(i + 1).padStart(3, '0')}</span>
                                        <span className="witness-tag">{w.tag}</span>
                                    </div>
                                    <p className="witness-desc">{w.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News */}
            <section className="section-news" id="section-7">
                <div className="container">
                    <div className="news-header">
                        <div className="news-title-wrap">
                            <h2 className="news-title">NEWS</h2>
                            <span className="news-subtitle">優惠與新知</span>
                        </div>
                    </div>
                    <div className="news-container">
                        <div className="news-tabs">
                            {tabs.map((tab, i) => (
                                <div key={i} className={`news-tab-item${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{tab}</div>
                            ))}
                        </div>
                        <div className="news-list">
                            {posts && posts.slice(0, 3).map((post: any) => {
                                const date = new Date(post.date)
                                const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
                                return (
                                    <a href={`/blog/${post.slug}`} className="news-item" key={post.id} style={{ textDecoration: 'none' }}>
                                        <div className="news-line"></div>
                                        <span className="news-tag">✦ {dateStr}</span>
                                        <span className="news-tag" style={{ background: '#e8e4dc', border: 'none' }}>{tabs[activeTab]}</span>
                                        <p className="news-content" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                        <span className="news-link">了解更多 &gt;</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                    <div className="news-footer">
                        <div className="arrows-group">
                            <button className="nav-btn prev-btn"><svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M0 7.5H29M0 7.5L7 0.5M0 7.5L7 14.5" /></svg></button>
                            <button className="nav-btn next-btn"><svg width="30" height="15" viewBox="0 0 30 15" fill="none" stroke="currentColor"><path d="M30 7.5H1M30 7.5L23 0.5M30 7.5L23 14.5" /></svg></button>
                        </div>
                        <div className="more-group"><span className="more-icon">✿</span> <span className="more-link">VIEW MORE</span></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-notice">
                        <div className="footer-line"></div>
                        <div className="notice-title">NOTICE 提醒事項</div>
                        <ul className="notice-list">
                            {footerNotice.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="footer-grid">
                        <div className="footer-info-col">
                            <div className="info-row"><span className="info-label">MAIL</span><span>{g('beauty_footer_email', 'service@gmail.com', m)}</span></div>
                            <div className="info-row"><span className="info-label">ADD</span><span>{g('beauty_footer_addr', '台北市大安區敦化南路二段', m)}</span></div>
                            <div className="info-row"><span className="info-label">OPEN</span><span>{g('beauty_footer_hours', '週一至週五 : 11:00 - 20:30', m)}</span></div>
                        </div>
                        <div className="footer-logo">
                            <svg className="logo-icon-svg" viewBox="0 0 100 100" fill="none">
                                <path d="M50 10 L90 50 L50 90 L10 50 Z" stroke="white" strokeWidth="1" />
                                <path d="M50 10 V90 M10 50 H90" stroke="white" strokeWidth="1" />
                                <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" />
                            </svg>
                            <span className="logo-text">BEAUTY-CLINIC</span>
                        </div>
                        <div className="footer-social-col">
                            <div className="info-row"><span className="info-label">TEL</span><span className="tel-number">{g('beauty_footer_tel', '02-2700-8888', m)}</span></div>
                            <div className="info-row">
                                <span className="info-label">FOLLOW</span>
                                <div className="social-icons"><a href="#">F</a><a href="#">I</a><a href="#">Y</a></div>
                            </div>
                        </div>
                    </div>
                    <div className="copyright">© BEAUTY-CLINIC ALL RIGHTS RESERVED</div>
                </div>
            </footer>
        </div>
    )
}
