import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("gg_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        const status = err.response?.status;
        const msg =
            err.response?.data?.message || err.message || "Request failed";
        if (status === 401) {
            // optionally clear token
        }
        if (status >= 500) toast.error("Server error. Please try again.");
        return Promise.reject({ ...err, message: msg, status });
    },
);

export const authApi = {
    register: data => api.post("/auth/register", data).then(r => r.data),
    login: data => api.post("/auth/login", data).then(r => r.data),
    profile: () => api.get("/auth/profile").then(r => r.data),
};

export const categoryApi = {
    list: () => api.get("/categories/getCategories").then(r => r.data),
    create: formData =>
        api
            .post("/categories/createCategory", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(r => r.data),
    update: (id, formData) =>
        api
            .put(`/categories/updateCategory/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(r => r.data),
    remove: id =>
        api.delete(`/categories/deleteCategory/${id}`).then(r => r.data),
};

export const productApi = {
    list: (params = {}) =>
        api.get("/products/getProducts", { params }).then(r => r.data),
    get: id => api.get(`/products/getProductById/${id}`).then(r => r.data),
    create: formData =>
        api
            .post("/products/createProduct", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(r => r.data),
    update: (id, formData) =>
        api
            .put(`/products/updateProduct/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(r => r.data),
    remove: id => api.delete(`/products/deleteProduct/${id}`).then(r => r.data),
};

export const cartApi = {
    get: () => api.get("/cart").then(r => r.data),
    add: productId => api.post("/cart", { productId }).then(r => r.data),
    update: (productId, quantity) =>
        api.put(`/cart/${productId}`, { quantity }).then(r => r.data),
    remove: productId => api.delete(`/cart/${productId}`).then(r => r.data),
    clear: () => api.delete("/cart").then(r => r.data),
};

export const orderApi = {
    create: data => api.post("/orders", data).then(r => r.data),
    mine: () => api.get("/orders").then(r => r.data),
    all: (params = {}) =>
        api.get("/orders/admin", { params }).then(r => r.data),
    updateStatus: (id, orderStatus) =>
        api.put(`/orders/${id}`, { orderStatus }).then(r => r.data),
};

// Helper to resolve image url (backend serves /uploads)
export const resolveImage = path => {
    if (!path) return "";

    if (/^https?:\/\//.test(path)) return path;

    const cleanPath = String(path)
        .replace(/\\/g, "/") // windows -> web slashes
        .replace(/^.*uploads\//, "uploads/"); // remove backend/src if exists

    const base = (
        import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    ).replace(/\/api\/?$/, "");

    return `${base}/${cleanPath.replace(/^\//, "")}`;
};

export default api;
