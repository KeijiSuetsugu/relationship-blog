import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { client, isSanityConfigured } from "@/sanity/lib/client"
import { siteSettingsQuery } from "@/sanity/lib/queries"
import type { SiteSettings } from "@/sanity/lib/types"

async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null
  
  try {
    return await client.fetch(siteSettingsQuery)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  return {
    title: {
      default: settings?.title || "Ennek - 公式サイト & ブログ",
      template: `%s | ${settings?.title || "Ennek"}`,
    },
    description: settings?.description || "エンネクの公式サイトとブログ",
    keywords: ["エンネク", "ブログ", "人間関係", "コミュニケーション"],
    openGraph: {
      title: settings?.title || "Ennek - 公式サイト & ブログ",
      description: settings?.description || "エンネクの公式サイトとブログ",
      type: "website",
      locale: "ja_JP",
      siteName: settings?.title || "Ennek",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.title || "Ennek - 公式サイト & ブログ",
      description: settings?.description || "エンネクの公式サイトとブログ",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()
  const gaId = settings?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID

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
        <Header siteTitle={settings?.title || "Ennek"} />
        <main className="flex-grow pt-16 md:pt-20">
          {children}
        </main>
        <Footer
          siteTitle={settings?.title || "Ennek"}
          footerText={settings?.footerText}
          socialLinks={settings?.socialLinks}
        />
      </body>
    </html>
  )
}
