export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm text-slate-400">
        <div>
          <h4 className="heading-display text-white mb-2">GAMEGEAR</h4>
          <p>Pro-grade peripherals for players who refuse to lose.</p>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-2">Shop</h5>
          <ul className="space-y-1">
            <li>Keyboards</li><li>Mice</li><li>Headsets</li><li>Monitors</li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-2">Support</h5>
          <ul className="space-y-1"><li>Shipping</li><li>Returns</li><li>Warranty</li></ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} GameGear Store</div>
    </footer>
  )
}
