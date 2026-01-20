import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Supabaseクライアントの初期化
    // クッキーの取得・設定を行うためのカスタム設定
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // セッションの確認とリフレッシュ
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 管理画面のルート保護
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // ログインページへのアクセス
        if (request.nextUrl.pathname === '/admin/login') {
            // 既にログインしている場合はダッシュボードへリダイレクト
            if (user) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return response
        }

        // その他の管理画面ページへのアクセス
        // 未ログインの場合はログインページへリダイレクト
        if (!user) {
            const redirectUrl = new URL('/admin/login', request.url)
            // リダイレクト後に元のページに戻れるようにクエリパラメータを追加（任意）
            // redirectUrl.searchParams.set('next', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
