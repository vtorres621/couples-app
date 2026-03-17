import TabBar from '@/components/ui/TabBar'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <TabBar />
    </div>
  )
}
