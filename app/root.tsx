import { Theme } from '@radix-ui/themes'
import type { LinksFunction } from '@remix-run/node'
import { Links, Meta, Outlet, redirectDocument, Scripts, ScrollRestoration } from '@remix-run/react'

import '@radix-ui/themes/styles.css'
import './global.css'

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export async function clientLoader() {
  const token = localStorage.getItem('token')

  if (location.pathname !== '/login') {
    if (!token) {
      return redirectDocument('/login')
    }
  }

  return {}
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme
          accentColor="blue"
          grayColor="sand"
          panelBackground="solid"
          hasBackground
          scaling="100%"
          radius="medium">
          {children}
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
