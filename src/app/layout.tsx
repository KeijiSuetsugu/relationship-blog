import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { createClient } from "@supabase/supabase-js"

// Supabase client initialization for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define SiteSettings interface based on the DB schema
interface SiteSettings {
  site_name: string
  site_description: string
  site_url: string
  contact_email: string
  twitter: string
  github: string
  instagram: string
  google_analytics_id?: string // schemaにはないが、将来的に追加される可能性があるためオプショナル
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error) {
      console.warn('Failed to fetch site settings:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings?.site_name || "Ennek - 公式サイト & ブログ"
  const description = settings?.site_description || "エンネクの公式サイトとブログ"

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    keywords: ["エンネク", "ブログ", "人間関係", "コミュニケーション", "AI", "技術"],
    openGraph: {
      title: siteName,
      description: description,
      type: "website",
      locale: "ja_JP",
      siteName: siteName,
      url: settings?.site_url,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: description,
      creator: settings?.twitter ? `@${settings.twitter.replace('@', '')}` : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // 必要に応じてGoogle Search Consoleのverification codeを追加
      // google: 'verification_token',
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()
  // GA ID is not yet in the DB schema, so currently using env var
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  // Convert DB settings to component props format
  const socialLinks = {
    twitter: settings?.twitter ? `https://twitter.com/${settings.twitter.replace('@', '')}` : undefined,
    github: settings?.github ? `https://github.com/${settings.github}` : undefined,
    instagram: settings?.instagram ? `https://instagram.com/${settings.instagram}` : undefined,
  }

  return (
    <html lang="ja">
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="flex flex-col min-h-screen">
        <Header siteTitle={settings?.site_name || "Ennek"} />
        <main className="flex-grow pt-16 md:pt-20">
          {children}
        </main>
        <Footer
          siteTitle={settings?.site_name || "Ennek"}
          footerText={settings?.site_description}
          socialLinks={socialLinks}
        />
      </body>
    </html>
  )
}
