import { Truck, ShieldCheck, Sprout } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-50 via-white to-lime-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
            <Sprout className="w-3.5 h-3.5" /> Harvested Fresh Every Morning
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Farm-Fresh Vegetables, Delivered to Your Kitchen.
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Sourced directly from certified local farms. Crisp greens, organic
            roots, and seasonal produce delivered within hours of harvest.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-200/60">
            <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              Free Delivery Over $25
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              100% Pesticide-Tested
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
              <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
              Direct Farm Pricing
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}