'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import TransitionLink from './TransitionLink'

export default function NavHeader() {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuTlRef = useRef<gsap.core.Timeline | null>(null)
    const headerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        // Build mobile menu timeline (paused)
        const overlay = document.querySelector('.fl-mobile-overlay')
        const links = document.querySelectorAll('.fl-mobile-links a')

        const tl = gsap.timeline({ paused: true })
        tl.to(overlay, {
            duration: 0.7,
            clipPath: 'circle(150% at calc(100% - 50px) 45px)',
            visibility: 'visible',
            ease: 'power3.inOut'
        })
        .to(links, {
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out'
        }, '-=0.35')

        menuTlRef.current = tl

        // Scroll handler for header shrink
        const onScroll = () => {
            if (headerRef.current) {
                if (window.scrollY > 50) {
                    headerRef.current.classList.add('scrolled')
                } else {
                    headerRef.current.classList.remove('scrolled')
                }
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            tl.kill()
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    const toggleMenu = useCallback(() => {
        if (!menuTlRef.current) return

        if (!menuOpen) {
            menuTlRef.current.play()
            gsap.to('.fl-burger-line-1', { rotation: 45, y: 7.5, duration: 0.3 })
            gsap.to('.fl-burger-line-2', { opacity: 0, duration: 0.3 })
            gsap.to('.fl-burger-line-3', { rotation: -45, y: -7.5, duration: 0.3 })
            // Change burger color to white on green overlay
            gsap.to('.fl-burger-line', { backgroundColor: '#fff', duration: 0.3 })
        } else {
            menuTlRef.current.reverse()
            gsap.to('.fl-burger-line-1', { rotation: 0, y: 0, duration: 0.3 })
            gsap.to('.fl-burger-line-2', { opacity: 1, duration: 0.3 })
            gsap.to('.fl-burger-line-3', { rotation: 0, y: 0, duration: 0.3 })
            gsap.to('.fl-burger-line', { backgroundColor: '#2c2c2c', duration: 0.3 })
        }
        setMenuOpen(!menuOpen)
    }, [menuOpen])

    const closeMenu = useCallback(() => {
        if (menuOpen && menuTlRef.current) {
            menuTlRef.current.reverse()
            gsap.to('.fl-burger-line-1', { rotation: 0, y: 0, duration: 0.3 })
            gsap.to('.fl-burger-line-2', { opacity: 1, duration: 0.3 })
            gsap.to('.fl-burger-line-3', { rotation: 0, y: 0, duration: 0.3 })
            gsap.to('.fl-burger-line', { backgroundColor: '#2c2c2c', duration: 0.3 })
            setMenuOpen(false)
        }
    }, [menuOpen])

    return (
        <>
            <header ref={headerRef} className="fl-header" data-t="nav">
                <TransitionLink href="/ta-design" className="fl-logo" onClick={closeMenu}>T.A.</TransitionLink>

                <nav className="fl-nav">
                    <TransitionLink href="/ta-design">Home</TransitionLink>
                    <TransitionLink href="/blog">Blog</TransitionLink>
                    <a href="#">Portfolio</a>
                    <a href="#">Over TA</a>
                </nav>

                <TransitionLink href="#contact" className="fl-cta">Contact</TransitionLink>

                <button className="fl-burger" onClick={toggleMenu} aria-label="Menu">
                    <div className="fl-burger-line fl-burger-line-1"></div>
                    <div className="fl-burger-line fl-burger-line-2"></div>
                    <div className="fl-burger-line fl-burger-line-3"></div>
                </button>
            </header>

            <div className="fl-mobile-overlay">
                <div className="fl-mobile-circle"></div>
                <ul className="fl-mobile-links">
                    <li><TransitionLink href="/ta-design" onClick={closeMenu}>Home</TransitionLink></li>
                    <li><TransitionLink href="/blog" onClick={closeMenu}>Blog</TransitionLink></li>
                    <li><a href="#" onClick={closeMenu}>Portfolio</a></li>
                    <li><a href="#" onClick={closeMenu}>Over TA</a></li>
                    <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                </ul>
            </div>
        </>
    )
}
