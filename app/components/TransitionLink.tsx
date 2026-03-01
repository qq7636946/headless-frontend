'use client'

import { useRouter } from 'next/navigation'
import { useCallback, MouseEvent, AnchorHTMLAttributes } from 'react'
import gsap from 'gsap'

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
}

export default function TransitionLink({ href, children, onClick, dangerouslySetInnerHTML, ...rest }: TransitionLinkProps) {
    const router = useRouter()

    const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        // If same page, do nothing
        if (href === window.location.pathname) return

        const tl = gsap.timeline({
            onComplete: () => {
                router.push(href)
            }
        })

        // Exit: content fades up, nav items stagger out, curtain slides in
        tl.to('[data-t="content"]', {
            opacity: 0, y: -30, duration: 0.35, ease: 'power2.in'
        })
        .to('[data-t="nav"]', {
            y: -20, opacity: 0, duration: 0.3, stagger: 0.04, ease: 'power2.in'
        }, '-=0.25')
        .to('[data-t="curtain"]', {
            y: '0%', duration: 0.6, ease: 'power3.inOut'
        }, '-=0.1')
    }, [href, router])

    if (dangerouslySetInnerHTML) {
        return <a href={href} onClick={handleClick} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...rest} />
    }

    return (
        <a href={href} onClick={handleClick} {...rest}>
            {children}
        </a>
    )
}
