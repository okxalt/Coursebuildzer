import './globals.css'

export const metadata = {
  title: 'AI Course Creator',
  description: 'Generate complete courses and ebooks from a single idea',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}