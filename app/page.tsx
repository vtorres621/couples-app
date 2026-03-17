import { redirect } from 'next/navigation'

// Middleware handles auth, but if someone hits / directly it redirects to /home
export default function RootPage() {
  redirect('/home')
}
