import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">{'Play & Draw 3D'}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with MediaPipe, Canvas API, and Next.js. No data collected.
        </p>
      </div>
    </footer>
  )
}
