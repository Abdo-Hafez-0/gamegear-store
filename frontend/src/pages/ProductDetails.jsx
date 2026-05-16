import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, cartApi, resolveImage } from "../services/api.js";
import Spinner from "../components/Spinner.jsx";
import { useState } from "react";
import { Star, ShoppingCart, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetails() {
    const { id } = useParams();
    const nav = useNavigate();
    const { isAuthed } = useAuth();
    const qc = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => productApi.get(id),
    });
    const [active, setActive] = useState(0);
    const add = useMutation({
        mutationFn: () => cartApi.add(id),
        onSuccess: () => {
            toast.success("Added to cart");
            qc.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: e => toast.error(e.message),
    });

    if (isLoading) return <Spinner />;
    if (error)
        return (
            <p className="max-w-7xl mx-auto p-6 text-red-400">
                {error.message}
            </p>
        );
    const p = data?.data || data?.product || data;
    if (!p) return null;
    const images = p.images?.length ? p.images : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
            <div>
                <div className="card aspect-square overflow-hidden bg-slate-800">
                    {images[active] ? (
                        <img
                            src={resolveImage(images[active])}
                            alt={p.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            No image
                        </div>
                    )}
                </div>
                {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`aspect-square card overflow-hidden ${i === active ? "ring-2 ring-brand-500" : ""}`}
                            >
                                <img
                                    src={resolveImage(img)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <div className="text-sm text-slate-400">
                    {p.brand} · {p.category?.name || p.category}
                </div>
                <h1 className="heading-display text-3xl mt-1">{p.title}</h1>
                {p.rating ? (
                    <div className="mt-2 flex items-center gap-1 text-yellow-400">
                        <Star size={16} className="fill-yellow-400" />{" "}
                        {p.rating}
                    </div>
                ) : null}
                <div className="mt-4 text-3xl font-black text-brand-500">
                    ${Number(p.price).toFixed(2)}
                </div>
                <p className="mt-4 text-slate-300 whitespace-pre-line">
                    {p.description}
                </p>
                <div className="mt-4 chip">
                    {p.stock > 0 ? (
                        <>
                            <Check size={12} className="mr-1" /> In stock (
                            {p.stock})
                        </>
                    ) : (
                        "Out of stock"
                    )}
                </div>

                {p.specifications && (
                    <div className="mt-6 card p-4">
                        <h3 className="heading-display mb-2">Specifications</h3>
                        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                            {Object.entries(p.specifications).map(([k, v]) => (
                                <div
                                    key={k}
                                    className="flex justify-between border-b border-slate-800 py-1"
                                >
                                    <dt className="text-slate-400 capitalize">
                                        {k}
                                    </dt>
                                    <dd>{String(v)}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button
                        disabled={!p.stock || add.isPending}
                        onClick={() =>
                            isAuthed ? add.mutate() : nav("/login")
                        }
                        className="btn-primary"
                    >
                        <ShoppingCart size={16} /> Add to cart
                    </button>
                    <button
                        onClick={() => nav("/products")}
                        className="btn-outline"
                    >
                        Keep shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
