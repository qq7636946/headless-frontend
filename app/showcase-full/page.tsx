'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ShowcaseFullPage() {
    const heroRef = useRef<HTMLDivElement>(null)

    // GSAP 動畫初始化
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero 區域動畫
            gsap.from('.hero-card', {
                opacity: 0,
                x: 100,
                duration: 1,
                ease: 'power3.out'
            })

            // 所有區塊滾動進入動畫
            gsap.utils.toArray<HTMLElement>('.section-animate').forEach((section) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power2.out'
                })
            })

            // 卡片 stagger 動畫
            gsap.utils.toArray<HTMLElement>('.card-stagger').forEach((container) => {
                const cards = container.querySelectorAll('.card-item')
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 30,
                    stagger: 0.15,
                    duration: 0.6,
                    ease: 'power2.out'
                })
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* 導航列 */}
            <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-pink-500 bg-clip-text text-transparent">
                        Brand Logo
                    </Link>
                    <div className="flex gap-8 text-sm font-medium">
                        <Link href="#concept" className="text-gray-600 hover:text-green-500 transition">Concept</Link>
                        <Link href="#pricing" className="text-gray-600 hover:text-green-500 transition">Pricing</Link>
                        <Link href="#process" className="text-gray-600 hover:text-green-500 transition">Process</Link>
                        <Link href="#contact" className="text-gray-600 hover:text-green-500 transition">Contact</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
                {/* 流線型背景 */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-green-400 via-lime-300 to-pink-400 rounded-full blur-3xl opacity-60 -translate-x-1/4 -translate-y-1/4"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-pink-400 via-rose-300 to-green-300 rounded-full blur-3xl opacity-50 translate-x-1/4 translate-y-1/4"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* 左側文字 */}
                        <div>
                            <div className="text-sm font-semibold text-gray-600 mb-4 tracking-wider">INTRODUCING</div>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                中小企業の生き死にを左右する<br />
                                <span className="bg-gradient-to-r from-green-500 to-pink-500 bg-clip-text text-transparent">
                                    DESIGN戦略
                                </span>
                            </h1>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                デザインの力で、ビジネスを次のステージへ。<br />
                                戦略的なアプローチで、確実な成果を実現します。
                            </p>
                            <button className="px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                                無料相談を予約
                            </button>
                        </div>

                        {/* 右側深色卡片 */}
                        <div className="hero-card bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-pink-400 rounded-lg"></div>
                                    <div>
                                        <h3 className="text-white font-bold text-xl">戦略的デザイン</h3>
                                        <p className="text-gray-400 text-sm">Strategic Design Approach</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    単なる見た目の美しさではなく、ビジネス成果に直結するデザインを提供。
                                    データ分析とユーザー心理に基づいた戦略で、確実な ROI を実現します。
                                </p>
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                                    <div>
                                        <div className="text-3xl font-bold text-green-400">95%</div>
                                        <div className="text-xs text-gray-500">満足度</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-pink-400">3.2x</div>
                                        <div className="text-xs text-gray-500">ROI 平均</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-lime-400">500+</div>
                                        <div className="text-xs text-gray-500">実績</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 圖片展示區 */}
            <section className="section-animate py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 card-stagger">
                        {[1, 2, 3, 4].map((num) => (
                            <div key={num} className="card-item group cursor-pointer">
                                <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-500"></div>
                                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                        {num}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONCEPT 區域 */}
            <section id="concept" className="section-animate py-32 bg-black text-white relative overflow-hidden">
                {/* 背景裝飾 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-9xl font-black text-white/5 pointer-events-none" style={{ writingMode: 'vertical-rl' }}>
                    CONCEPT
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-16">
                        <h2 className="text-5xl md:text-7xl font-black mb-6">CONCEPT</h2>
                        <p className="text-gray-400 text-xl max-w-3xl">
                            デザインで変わる、ビジネスの未来。戦略的な thinking で実現する成果重視のアプローチ。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 card-stagger">
                        {[
                            { title: "戦略設計", desc: "ビジネス goals に基づいた design strategy を策定" },
                            { title: "UX 最適化", desc: "ユーザー experience を徹底的に分析・改善" },
                            { title: "データ analysis", desc: "数値に基づいた意思決定で確実な成果を" },
                            { title: "ブランド構築", desc: "一貫性のある brand identity を確立" },
                            { title: "成果測定", desc: "KPI tracking で継続的な improvement" },
                            { title: "持続可能性", desc: "long term での成長を見据えた design" }
                        ].map((item, idx) => (
                            <div key={idx} className="card-item bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-green-500 transition-colors group">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-pink-400 rounded-lg mb-4 group-hover:scale-110 transition-transform"></div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 詳細說明區 */}
            <section className="section-animate py-32 bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl font-black mb-8">なぜデザインが<br />重要なのか？</h2>
                            <div className="space-y-6 text-gray-300 leading-relaxed">
                                <p>
                                    現代のビジネスにおいて、デザインは単なる装飾ではありません。
                                    それは戦略的な武器であり、競合との差別化要因となります。
                                </p>
                                <p>
                                    私たちは、見た目の美しさだけでなく、ビジネス成果に直結する
                                    デザインを provide します。データ分析、ユーザー調査、
                                    A/B testing などを通じて、最適な solution を導き出します。
                                </p>
                                <p>
                                    結果として、クライアントの売上向上、ブランド認知度の拡大、
                                    顧客満足度の improvement が実現されています。
                                </p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { num: "01", title: "調査・分析", desc: "市場調査とユーザー analysis" },
                                { num: "02", title: "戦略立案", desc: "ビジネス goals に基づいた strategy" },
                                { num: "03", title: "デザイン", desc: "創造的な solution の具現化" },
                                { num: "04", title: "測定・改善", desc: "データに基づく continuous improvement" }
                            ].map((step) => (
                                <div key={step.num} className="flex gap-6">
                                    <div className="text-5xl font-black text-green-400/30">{step.num}</div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 定價方案區域 */}
            <section id="pricing" className="section-animate py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-black mb-6">PRICING PLANS</h2>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                            ビジネスの規模と目的に合わせた、柔軟な料金プラン
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 card-stagger">
                        {[
                            {
                                name: "Starter",
                                price: "¥300,000",
                                period: "/月",
                                features: ["基本 design strategy", "月1回の meeting", "簡易 analysis report", "Email support"]
                            },
                            {
                                name: "Professional",
                                price: "¥800,000",
                                period: "/月",
                                features: ["包括的 design strategy", "週1回の meeting", "詳細 analysis & reporting", "優先 support", "A/B testing 実施"],
                                highlight: true
                            },
                            {
                                name: "Enterprise",
                                price: "Custom",
                                period: "",
                                features: ["完全カスタマイズ", "無制限 meeting", "dedicated team 配置", "24/7 support", "長期契約割引"]
                            }
                        ].map((plan, idx) => (
                            <div
                                key={idx}
                                className={`card-item p-10 rounded-2xl border-2 ${plan.highlight
                                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-pink-50 shadow-2xl scale-105'
                                        : 'border-gray-200 bg-white'
                                    } hover:shadow-xl transition-all duration-300`}
                            >
                                {plan.highlight && (
                                    <div className="text-sm font-bold text-green-600 mb-4">MOST POPULAR</div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-black">{plan.price}</span>
                                    <span className="text-gray-500">{plan.period}</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={`w-full py-4 rounded-lg font-bold transition-colors ${plan.highlight
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    プランを選択
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 產品大圖展示 */}
            <section className="section-animate py-32 bg-black text-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-5xl font-black mb-8">実績に裏打ちされた<br />確かな成果</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                500 社以上のクライアントとの協業を通じて蓄積された know-how。
                                業界を問わず、確実な成果を deliver してきました。
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-900 p-6 rounded-xl">
                                    <div className="text-4xl font-black text-green-400 mb-2">500+</div>
                                    <div className="text-gray-500">プロジェクト実績</div>
                                </div>
                                <div className="bg-gray-900 p-6 rounded-xl">
                                    <div className="text-4xl font-black text-pink-400 mb-2">95%</div>
                                    <div className="text-gray-500">顧客満足度</div>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                            <div className="text-6xl font-black text-gray-700">DEMO</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 流程時間軸 */}
            <section id="process" className="section-animate py-32 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-black mb-6">PROCESS</h2>
                        <p className="text-gray-600 text-xl">明確なプロセスで、確実な成果を</p>
                    </div>

                    <div className="relative">
                        {/* 時間軸線 */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-pink-400 to-green-400"></div>

                        <div className="space-y-16 card-stagger">
                            {[
                                { step: "STEP 01", title: "ヒアリング", desc: "ビジネス目標と課題を深く理解", duration: "1-2週間" },
                                { step: "STEP 02", title: "調査・分析", desc: "市場とユーザーの徹底分析", duration: "2-3週間" },
                                { step: "STEP 03", title: "戦略立案", desc: "データに基づく design strategy", duration: "1-2週間" },
                                { step: "STEP 04", title: "デザイン制作", desc: "創造的な solution の具現化", duration: "4-6週間" },
                                { step: "STEP 05", title: "テスト・改善", desc: "ユーザー testing と optimization", duration: "2-3週間" },
                                { step: "STEP 06", title: "納品・運用", desc: "継続的な support と improvement", duration: "継続的" }
                            ].map((item, idx) => (
                                <div key={idx} className={`card-item relative flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-white p-8 rounded-xl shadow-lg inline-block">
                                            <div className="text-sm font-bold text-green-600 mb-2">{item.step}</div>
                                            <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                                            <p className="text-gray-600 mb-4">{item.desc}</p>
                                            <div className="text-sm text-gray-500">期間：{item.duration}</div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-white text-xl flex-shrink-0 shadow-lg z-10">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 最終展示區 */}
            <section className="section-animate py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 mb-20 card-stagger">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="card-item group">
                                <div className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden mb-6">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-500"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center card-stagger">
                        {[
                            { icon: "🎯", title: "戦略的思考", desc: "ビジネス成果に直結" },
                            { icon: "💡", title: "創造的解決", desc: "独自の視点で課題解決" },
                            { icon: "📈", title: "継続的改善", desc: "データに基づく optimization" }
                        ].map((item, idx) => (
                            <div key={idx} className="card-item">
                                <div className="text-6xl mb-6">{item.icon}</div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 聯絡區域 */}
            <section id="contact" className="section-animate py-32 bg-gradient-to-br from-green-400 via-lime-300 to-pink-400">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
                        一緒に未来を<br />創りましょう
                    </h2>
                    <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto">
                        まずは無料相談から。あなたのビジネス課題をお聞かせください。
                    </p>
                    <button className="px-12 py-5 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-2xl text-lg">
                        無料相談を予約する
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                Brand Logo
                            </h3>
                            <p className="text-gray-400 text-sm">
                                デザインの力でビジネスを変革する戦略的パートナー
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">サービス</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-green-400 transition">Design Strategy</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">UX/UI Design</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Brand Design</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">会社情報</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Our Team</a></li>
                                <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">フォロー</h4>
                            <div className="flex gap-4">
                                {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                                    <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                                        <span className="text-xs">{social[0]}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                        © 2026 Brand Design Studio. All rights reserved. Powered by Next.js + WordPress
                    </div>
                </div>
            </footer>
        </div>
    )
}
