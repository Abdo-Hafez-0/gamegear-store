import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryApi, productApi } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Truck, Shield } from "lucide-react";

export default function Home() {
    const cats = useQuery({
        queryKey: ["categories"],
        queryFn: categoryApi.list,
    });
    const prods = useQuery({
        queryKey: ["products", "featured"],
        queryFn: () => productApi.list(),
    });

    return (
        <div>
            <section className="relative overflow-hidden border-b border-slate-800 -top-[50px]">
                <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="chip mb-4 bg-brand-500/10 text-brand-500">
                            NEW DROP · 2026
                        </span>
                        <h1 className="heading-display text-4xl md:text-6xl font-black text-white leading-tight">
                            GEAR UP.
                            <br />
                            <span className="text-brand-500">DOMINATE.</span>
                        </h1>
                        <p className="mt-5 text-slate-400 max-w-md">
                            Premium keyboards, mice, headsets, and streaming kit
                            engineered for esports performance.
                        </p>
                        <div className="mt-8 flex gap-3">
                            <Link to="/products" className="btn-primary">
                                Shop now <ArrowRight size={16} />
                            </Link>
                            <Link to="/categories" className="btn-outline">
                                Browse categories
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-500/30 via-neon-purple/20 to-transparent border border-slate-800 flex items-center justify-center">
                            <div className="heading-display text-7xl md:text-8xl text-white/10">
                                RGB
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-4">
                {[
                    { i: Zap, t: "Lightning ship", d: "Same-day dispatch" },
                    { i: Truck, t: "Free returns", d: "Within 30 days" },
                    {
                        i: Shield,
                        t: "2-year warranty",
                        d: "On all peripherals",
                    },
                ].map(({ i: Icon, t, d }) => (
                    <div key={t} className="card p-5 flex items-center gap-4">
                        <Icon className="text-brand-500" />
                        <div>
                            <div className="font-semibold">{t}</div>
                            <div className="text-sm text-slate-400">{d}</div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="heading-display text-2xl">
                        Shop by category
                    </h2>
                    <Link
                        to="/categories"
                        className="text-sm text-brand-500 hover:underline"
                    >
                        View all →
                    </Link>
                </div>
                {cats.isLoading ? (
                    <Spinner />
                ) : cats.error ? (
                    <p className="text-red-400 text-sm">{cats.error.message}</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(cats.data?.data || []).slice(0, 4).map(c => (
                            <CategoryCard key={c._id} category={c} />
                        ))}
                    </div>
                )}
            </section>

            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="heading-display text-2xl">
                        Featured products
                    </h2>
                    <Link
                        to="/products"
                        className="text-sm text-brand-500 hover:underline"
                    >
                        View all →
                    </Link>
                </div>
                {prods.isLoading ? (
                    <Spinner />
                ) : prods.error ? (
                    <p className="text-red-400 text-sm">
                        {prods.error.message}
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(prods.data?.data || prods.data?.products || [])
                            .slice(0, 8)
                            .map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                    </div>
                )}
            </section>
        </div>
    );
}
