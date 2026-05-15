export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container mx-auto px-4 md:px-8 text-center text-slate-500 text-sm">
        <p className="font-medium text-slate-700 mb-2">&copy; {new Date().getFullYear()} REACH Platform. All rights reserved.</p>
        <p>Connecting Rwandan entrepreneurs to capital through verified data, not paperwork.</p>
      </div>
    </footer>
  )
}
