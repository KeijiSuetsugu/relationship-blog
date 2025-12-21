import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Ennek Lab - 人間関係のヒントを見つける",
  description: "毎日更新される、科学的根拠に基づいた人間関係改善のためのアドバイス",
  keywords: ["人間関係", "コミュニケーション", "心理学", "マインドフルネス", "自己肯定感"],
  openGraph: {
    title: "Ennek Lab - 人間関係のヒントを見つける",
    description: "毎日更新される、科学的根拠に基づいた人間関係改善のためのアドバイス",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
      </head>
      <body>
        {children}
        <Script id="netlify-identity-redirect" strategy="afterInteractive">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
