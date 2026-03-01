"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPosts, Post, getBanners, Banner, getProducts, Product } from "@/lib/wordpress";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const [postsData, bannersData, productsData] = await Promise.all([
        getPosts(10),
        getBanners(),
        getProducts()
      ]);
      setPosts(postsData);
      setBanners(bannersData);
      setProducts(productsData);
      setLoading(false);
    }
    fetchData();

    // Load GSAP
    const script1 = document.createElement('script');
    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
    script2.async = true;
    document.body.appendChild(script2);

    script2.onload = () => {
      setTimeout(() => initAnimations(), 100);
    };

    return () => {
      try {
        if (document.body.contains(script1)) document.body.removeChild(script1);
        if (document.body.contains(script2)) document.body.removeChild(script2);
      } catch (e) {
        // Scripts already removed
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Banner navigation
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Product navigation
  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length);
  };

  const currentBannerData = banners[currentBanner];
  const currentProductData = products[currentProduct];

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Serif+TC:wght@400;700&family=Orbitron:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="site-header fixed top-0 left-0 w-full h-[90px] bg-white/90 backdrop-blur-sm z-[1000] border-b border-black/5">
          <div className="container-fluid flex justify-between items-center h-full max-w-[1600px] mx-auto px-[6vw]">
            <a href="#" className="logo flex items-center gap-3 font-bold text-2xl">
              <i className="fa-solid fa-couch text-[#E65100]"></i> DELO SOFA
            </a>
            <nav className="main-nav">
              <ul className="flex gap-14 text-sm font-medium">
                <li><a href="#" className="hover:text-[#E65100] transition-colors">首頁</a></li>
                <li><a href="#" className="hover:text-[#E65100] transition-colors">產品中心</a></li>
                <li><a href="#" className="hover:text-[#E65100] transition-colors">合作共贏</a></li>
                <li><a href="#" className="hover:text-[#E65100] transition-colors">案例・售後</a></li>
                <li><a href="#" className="hover:text-[#E65100] transition-colors">關於德客</a></li>
                <li><a href="#" className="hover:text-[#E65100] transition-colors">聯繫我們</a></li>
              </ul>
            </nav>
            <div className="header-icons flex gap-7 text-lg">
              <i className="fa-solid fa-magnifying-glass hover:text-[#E65100] cursor-pointer transition-all"></i>
              <i className="fa-regular fa-heart hover:text-[#E65100] cursor-pointer transition-all"></i>
              <i className="fa-regular fa-user hover:text-[#E65100] cursor-pointer transition-all"></i>
              <i className="fa-solid fa-bag-shopping hover:text-[#E65100] cursor-pointer transition-all"></i>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="hero-section relative w-full h-screen flex flex-col justify-end overflow-hidden mt-[90px]">
          {loading || !currentBannerData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E65100] mb-4"></div>
                <p className="text-gray-600">載入中...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hero-bg-wrapper absolute top-0 left-0 w-full h-[120%] z-0">
                <div
                  className="hero-bg w-full h-full bg-cover bg-center transition-all duration-700"
                  style={{
                    backgroundImage: `url('${currentBannerData._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1920&auto=format&fit=crop'}')`
                  }}
                ></div>
              </div>
              <div className="hero-overlay absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 via-black/30 to-black/60 z-[1]"></div>

              <div className="hero-content-wrapper absolute top-1/2 -translate-y-1/2 w-full z-[2] pointer-events-none">
                <div className="container-fluid max-w-[1600px] mx-auto px-[6vw]">
                  <div className="hero-text-block text-white pointer-events-auto max-w-[600px]">
                    <p className="hero-subtitle text-base tracking-[0.2em] mb-6 font-light border-l-[3px] border-[#E65100] pl-4 uppercase">
                      {currentBannerData.acf?.subtitle || 'Living Room Exceptional'}
                    </p>
                    <h1 className="hero-title font-serif text-7xl font-bold mb-2 leading-tight">
                      <span dangerouslySetInnerHTML={{ __html: currentBannerData.title.rendered }} />
                    </h1>
                    <h2 className="hero-eng-title font-serif italic text-3xl tracking-[0.15em] mb-12 opacity-90">
                      {currentBannerData.acf?.english_title || 'Different, by Design.'}
                    </h2>
                    <button className="hero-btn px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/50 text-white text-sm tracking-wider inline-flex items-center gap-4 hover:bg-white hover:text-black transition-all duration-400">
                      {currentBannerData.acf?.button_text || '探索系列'} <i className="fa-solid fa-arrow-right-long"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="banner-bottom-bar relative z-[3] w-full flex flex-col">
                <div className="container-fluid max-w-[1600px] mx-auto px-[6vw]">
                  <div className="overlay-controls flex justify-between items-end pb-8 text-white">
                    <div className="phone-contact flex items-center gap-4 font-mono text-lg tracking-wider">
                      <i className="fa-solid fa-phone-volume"></i><span>400-8376 333</span>
                    </div>
                    <div className="slide-controls flex gap-3">
                      <button
                        onClick={prevBanner}
                        className="slide-btn w-11 h-11 border border-white/30 rounded-full text-white flex justify-center items-center hover:bg-white hover:text-black transition-all"
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={nextBanner}
                        className="slide-btn w-11 h-11 border border-white/30 rounded-full text-white flex justify-center items-center hover:bg-white hover:text-black transition-all"
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="features-strip-wrapper bg-white/85 backdrop-blur-2xl border-t border-white/40 w-full">
                  <div className="container-fluid max-w-[1600px] mx-auto px-[6vw]">
                    <div className="features-strip flex justify-between py-10">
                      <div className="feature-item flex-1 pr-12 border-r border-black/8 pl-12 first:pl-0 last:border-r-0 last:pr-0 hover:-translate-y-1 transition-transform">
                        <div className="f-title text-lg font-bold font-serif mb-2">匠 · 行全球</div>
                        <div className="f-desc text-sm text-gray-600 leading-relaxed">全球80多個國家城市代工長期合作</div>
                      </div>
                      <div className="feature-item flex-1 pr-12 border-r border-black/8 pl-12 first:pl-0 last:border-r-0 last:pr-0 hover:-translate-y-1 transition-transform">
                        <div className="f-title text-lg font-bold font-serif mb-2">森 · 行天下</div>
                        <div className="f-desc text-sm text-gray-600 leading-relaxed">從世界之源獲取環保好材</div>
                      </div>
                      <div className="feature-item flex-1 pr-12 border-r border-black/8 pl-12 first:pl-0 last:border-r-0 last:pr-0 hover:-translate-y-1 transition-transform">
                        <div className="f-title text-lg font-bold font-serif mb-2">工 · 藝求精</div>
                        <div className="f-desc text-sm text-gray-600 leading-relaxed">10年以上行業老師傅精工細作</div>
                      </div>
                      <div className="feature-item flex-1 pr-12 border-r border-black/8 pl-12 first:pl-0 last:border-r-0 last:pr-0 hover:-translate-y-1 transition-transform">
                        <div className="f-title text-lg font-bold font-serif mb-2">創 · 意無界</div>
                        <div className="f-desc text-sm text-gray-600 leading-relaxed">設計大咖領銜研發更具國際視野</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Orbit Section - Products */}
        <section className="orbit-section-wrapper w-full min-h-screen flex justify-center items-center py-32 bg-white relative">
          {loading || !currentProductData ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E65100] mb-4"></div>
                <p className="text-gray-600">載入產品中...</p>
              </div>
            </div>
          ) : (
            <div className="container-fluid orbit-container max-w-[1600px] mx-auto px-[6vw] flex justify-between items-center relative">
              {/* Left Section */}
              <div className="left-section flex-[0_0_25%] z-10 relative opacity-0">
                <h1 className="main-title font-serif text-5xl font-bold leading-tight mb-6" id="main-title">
                  <span dangerouslySetInnerHTML={{ __html: currentProductData.title.rendered }} />
                </h1>
                <div className="title-divider w-12 h-1 bg-[#E65100] mb-10"></div>
                <p className="description text-base leading-relaxed text-gray-600 mb-14 text-justify" id="main-desc">
                  <span dangerouslySetInnerHTML={{ __html: currentProductData.content.rendered }} />
                </p>
                <a href="#" className="learn-more inline-flex items-center gap-3 text-sm font-semibold border-b border-transparent hover:border-[#E65100] pb-1 transition-all">
                  READ MORE <i className="fa-solid fa-arrow-right-long"></i>
                </a>
              </div>

              {/* Center Section */}
              <div className="center-section flex-1 relative flex justify-center items-center h-[700px]">
                <div className="orbit-circle opacity-0 absolute w-[600px] h-[600px] border border-black/8 rounded-full flex justify-center items-center">
                  <div className="inner-bg-circle absolute w-[380px] h-[380px] bg-[#fafafa] rounded-full z-0"></div>
                  <div className="inner-pattern-circle absolute w-[320px] h-[320px] rounded-full z-[1] opacity-50" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 8px, #f2f2f2 8px, #f2f2f2 9px)" }}></div>

                  {/* Country Labels */}
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`orbit-label opacity-0 absolute flex items-center gap-2 text-sm bg-white px-2 ${index === currentProduct ? 'text-[#E65100] font-semibold' : 'text-gray-400'
                        }`}
                      style={{
                        top: index === 0 ? '-8px' : index === 1 ? '30%' : index === 2 ? 'auto' : index === 3 ? 'auto' : '50%',
                        bottom: index === 2 ? '15%' : index === 3 ? '30%' : 'auto',
                        left: index === 0 ? '50%' : index === 3 ? '15%' : 'auto',
                        right: index === 1 ? '-8px' : index === 2 ? '15%' : 'auto',
                        transform: index === 0 ? 'translateX(-50%)' : 'none'
                      }}
                      data-country={product.acf?.country || `country-${index}`}
                    >
                      <span className="orbit-dot w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {product.acf?.country || product.title.rendered}
                    </div>
                  ))}

                  {/* Product Images */}
                  <div className="sofa-stack absolute w-[500px] h-[300px] z-[2]" id="sofa-stack">
                    {currentProductData._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                      <img
                        src={currentProductData._embedded['wp:featuredmedia'][0].source_url}
                        alt={currentProductData.title.rendered}
                        className="sofa-img absolute top-0 left-0 w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="right-section flex-[0_0_25%] z-10 relative opacity-0 flex flex-col items-end">
                <div className="year-badge font-mono text-sm tracking-[0.3em] text-gray-400 mb-8" id="year-badge">
                  {currentProductData.acf?.year || 'SINCE 1999'}
                </div>
                <div className="feature-img-wrapper w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white shadow-2xl mb-10" id="feature-img-wrapper">
                  {currentProductData.acf?.feature_image ? (
                    <img
                      src={currentProductData.acf.feature_image}
                      alt="Feature"
                      className="w-full h-full object-cover"
                    />
                  ) : currentProductData._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                    <img
                      src={currentProductData._embedded['wp:featuredmedia'][0].source_url}
                      alt="Feature"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="feature-text text-sm leading-relaxed text-gray-600 text-right max-w-[280px] mb-10" id="feature-text">
                  {currentProductData.acf?.feature_text || '聚焦牛皮純手工製成，保留細節紋理，高品質、高質感，呈現出與眾不同的輕奢格調，聞名于海內外。'}
                </p>
                <div className="nav-btns flex gap-4">
                  <button
                    onClick={prevProduct}
                    className="nav-btn w-12 h-12 rounded-full border border-black/10 flex justify-center items-center hover:bg-[#E65100] hover:text-white hover:border-[#E65100] transition-all"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextProduct}
                    className="nav-btn w-12 h-12 rounded-full border border-black/10 flex justify-center items-center hover:bg-[#E65100] hover:text-white hover:border-[#E65100] transition-all"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* WordPress Posts Section */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">最新消息</h2>
              <p className="text-slate-600 text-lg">探索我們的最新文章與動態</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#E65100] mb-4"></div>
                  <p className="text-slate-600">載入文章中...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {post._embedded?.['wp:featuredmedia']?.[0] && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={post._embedded['wp:featuredmedia'][0].source_url}
                          alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <time className="text-sm text-slate-500">{new Date(post.date).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      {post._embedded?.['wp:term']?.[0] && post._embedded['wp:term'][0].length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post._embedded['wp:term'][0].map((category) => (
                            <span key={category.id} className="inline-block px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">{category.name}</span>
                          ))}
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-3 group-hover:text-[#E65100] transition-colors">
                        <Link href={`/posts/${post.slug}`}><span dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></Link>
                      </h3>
                      <div className="text-slate-600 line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                      <Link href={`/posts/${post.slug}`} className="inline-flex items-center text-[#E65100] font-medium hover:gap-2 transition-all">閱讀更多 <span className="ml-1">→</span></Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function initAnimations() {
  if (typeof window === 'undefined' || !(window as any).gsap) return;

  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // Hero animations
  gsap.from('.site-header', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('.hero-subtitle', { x: -50, opacity: 0, duration: 0.8, delay: 0.3 });
  gsap.from('.hero-title', { x: -50, opacity: 0, duration: 0.8, delay: 0.5 });
  gsap.from('.hero-eng-title', { x: -50, opacity: 0, duration: 0.8, delay: 0.7 });
  gsap.from('.hero-btn', { y: 20, opacity: 0, duration: 0.8, delay: 0.9 });
  gsap.from('.banner-bottom-bar', { y: 100, opacity: 0, duration: 1, delay: 1.1 });

  // Parallax effect
  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Orbit section animations
  ScrollTrigger.create({
    trigger: '.orbit-section-wrapper',
    start: 'top 60%',
    onEnter: () => {
      gsap.to('.left-section', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' });
      gsap.to('.right-section', { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.to('.orbit-circle', { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.2)', delay: 0.3 });
      gsap.to('.orbit-label', { opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.8 });
    }
  });

  // Mouse parallax for sofa images
  const sofaStack = document.getElementById('sofa-stack');
  if (sofaStack) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(sofaStack, { x, y, duration: 0.5, ease: 'power2.out' });
    });
  }
}
