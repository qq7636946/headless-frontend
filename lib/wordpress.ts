export const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/headless/wp-json/wp/v2'

export interface Post {
  id: number
  date: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

export interface Category {
  id: number
  name: string
  slug: string
  count: number
}

// Fetch all posts
export async function getPosts(perPage: number = 10): Promise<Post[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&per_page=${perPage}`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    )

    if (!res.ok) {
      throw new Error('Failed to fetch posts')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${slug}`)
    }

    const posts = await res.json()
    return posts[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/categories`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    )

    if (!res.ok) {
      throw new Error('Failed to fetch categories')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Fetch posts by category
export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?categories=${categoryId}&_embed`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch posts by category')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

// Banner Interface
export interface Banner {
  id: number
  title: {
    rendered: string
  }
  acf?: {
    subtitle?: string
    english_title?: string
    button_text?: string
    button_link?: string
  }
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

// Product/Design Interface
export interface Product {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  acf?: {
    country?: string
    year?: string
    feature_text?: string
    main_image?: string
    feature_image?: string
  }
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

// Fetch Banners (從自訂文章類型獲取)
export async function getBanners(): Promise<Banner[]> {
  try {
    // 使用自訂文章類型 'banner'
    const res = await fetch(
      `${WORDPRESS_API_URL}/banner?_embed&per_page=10&orderby=date&order=desc`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch banners')
    }

    const data = await res.json()

    // 轉換自訂欄位格式
    return data.map((item: any) => ({
      ...item,
      acf: {
        subtitle: item.meta?._banner_subtitle || item.acf?.subtitle,
        english_title: item.meta?._banner_english_title || item.acf?.english_title,
        button_text: item.meta?._banner_button_text || item.acf?.button_text,
        button_link: item.meta?._banner_button_link || item.acf?.button_link,
      }
    }))
  } catch (error) {
    console.error('Error fetching banners:', error)
    return []
  }
}

// Fetch Products/Designs (從自訂文章類型獲取)
export async function getProducts(): Promise<Product[]> {
  try {
    // 使用自訂文章類型 'product'
    const res = await fetch(
      `${WORDPRESS_API_URL}/product?_embed&per_page=10&orderby=date&order=desc`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await res.json()

    // 轉換自訂欄位格式
    return data.map((item: any) => ({
      ...item,
      acf: {
        country: item.meta?._product_country || item.acf?.country,
        year: item.meta?._product_year || item.acf?.year,
        feature_text: item.meta?._product_feature_text || item.acf?.feature_text,
        main_image: item.acf?.main_image,
        feature_image: item.meta?._product_feature_image_url || item.acf?.feature_image,
      }
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch TA Design Page Data
export async function getTaPage() {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/ta_design?_embed&per_page=1`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null

    const data = await res.json()
    if (!data.length) return null

    const item = data[0]
    return {
      title: item.title.rendered,
      meta: {
        hero_title: item.meta?.ta_hero_title,
        hero_bg: item.meta?.ta_hero_bg ? await getMediaUrl(item.meta.ta_hero_bg) : null,
        about_title: item.meta?.ta_about_title,
        about_desc: item.meta?.ta_about_desc,
        about_img: item.meta?.ta_about_img ? await getMediaUrl(item.meta.ta_about_img) : null,
        services_title: item.meta?.ta_services_title,
        service_img_1: item.meta?.ta_service_img_1 ? await getMediaUrl(item.meta.ta_service_img_1) : null,
        service_img_2: item.meta?.ta_service_img_2 ? await getMediaUrl(item.meta.ta_service_img_2) : null,
        service_img_3: item.meta?.ta_service_img_3 ? await getMediaUrl(item.meta.ta_service_img_3) : null,
        service_img_4: item.meta?.ta_service_img_4 ? await getMediaUrl(item.meta.ta_service_img_4) : null,
        quote_text: item.meta?.ta_quote_text,
        quote_bg: item.meta?.ta_quote_bg ? await getMediaUrl(item.meta.ta_quote_bg) : null,
      }
    }
  } catch (error) {
    console.error('Error fetching TA page:', error)
    return null
  }
}

// Fetch Beauty Clinic Page Data
export async function getBeautyPage() {
  try {
    const res = await fetch(
      `${WORDPRESS_API_URL}/beauty?_embed&per_page=1`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null

    const data = await res.json()
    if (!data.length) return null

    const item = data[0]
    const m = item.meta || {}

    // Image fields that need URL conversion
    const imgFields = [
      'beauty_hero_bg', 'beauty_hero_bg_2', 'beauty_hero_bg_3',
      'beauty_hero_float_img', 'beauty_hero_video_thumb',
      'beauty_svc_img', 'beauty_svc_slide_1', 'beauty_svc_slide_2', 'beauty_svc_slide_3', 'beauty_svc_slide_4',
      'beauty_rsv_bg',
      'beauty_team_img1', 'beauty_team_img2',
      'beauty_doc_img', 'beauty_doc_gallery1', 'beauty_doc_gallery2', 'beauty_doc_gallery3',
      'beauty_wit_img_1', 'beauty_wit_img_2', 'beauty_wit_img_3', 'beauty_wit_img_4',
    ]

    const meta: Record<string, string> = {}

    // Copy all meta fields
    for (const key of Object.keys(m)) {
      if (key.startsWith('beauty_')) {
        meta[key] = m[key]
      }
    }

    // Convert image IDs to URLs
    for (const field of imgFields) {
      if (m[field]) {
        meta[field] = await getMediaUrl(Number(m[field])) || ''
      }
    }

    return {
      title: item.title.rendered,
      meta,
    }
  } catch (error) {
    console.error('Error fetching Beauty page:', error)
    return null
  }
}

// Submit contact form
export async function submitContactForm(data: { name: string; email: string; phone?: string; message: string }) {
  const baseUrl = WORDPRESS_API_URL.replace('/wp/v2', '')
  const res = await fetch(`${baseUrl}/ta/v1/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json() as Promise<{ success: boolean; message: string }>
}

async function getMediaUrl(id: number) {
  if (!id) return ''
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/media/${id}`, { cache: 'no-store' })
    const data = await res.json()
    return data.source_url
  } catch (e) {
    return ''
  }
}

export function getField(key: string, defaultVal: string, meta: any = {}) {
  if (meta && meta[key] !== undefined && meta[key] !== null && meta[key] !== '') {
    return meta[key]
  }
  return defaultVal
}
