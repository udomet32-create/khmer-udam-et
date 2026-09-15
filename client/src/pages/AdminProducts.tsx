import { useEffect, useMemo, useState } from "react";
import { Check, ImagePlus, Loader2, Pencil, Plus, Save, ShieldAlert, Trash2, Upload, Video, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type ProductForm = {
  name: string;
  code: string;
  category: string;
  description: string;
  price: string;
  oldPrice: string;
  badge: string;
  imageUrl: string;
  videoUrl: string;
  sortOrder: string;
  isActive: boolean;
};

type AdminProduct = {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string | null;
  priceCents: number;
  oldPriceCents: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  badge: string | null;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: ProductForm = { name: "", code: "", category: "កាបូប", description: "", price: "", oldPrice: "", badge: "", imageUrl: "", videoUrl: "", sortOrder: "0", isActive: true };
const categories = ["កាបូប", "ស្បែកជើង", "ខ្សែក្រវ៉ាត់", "ម៉េកអាប់"];

function toForm(product: AdminProduct): ProductForm {
  return { name: product.name, code: product.code, category: product.category, description: product.description ?? "", price: (product.priceCents / 100).toFixed(2), oldPrice: product.oldPriceCents ? (product.oldPriceCents / 100).toFixed(2) : "", badge: product.badge ?? "", imageUrl: product.imageUrl ?? "", videoUrl: product.videoUrl ?? "", sortOrder: String(product.sortOrder), isActive: product.isActive };
}

export default function AdminProducts() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const productsQuery = trpc.adminProducts.list.useQuery(undefined, { enabled: Boolean(user?.role === "admin"), retry: false });
  const createMutation = trpc.adminProducts.create.useMutation({ onSuccess: () => productsQuery.refetch() });
  const updateMutation = trpc.adminProducts.update.useMutation({ onSuccess: () => productsQuery.refetch() });
  const deleteMutation = trpc.adminProducts.delete.useMutation({ onSuccess: () => productsQuery.refetch() });
  const uploadMutation = trpc.adminProducts.uploadMedia.useMutation();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);

  const products = productsQuery.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const selectedLabel = useMemo(() => editingId ? "កែទិន្នន័យផលិតផល" : "បន្ថែមផលិតផលថ្មី", [editingId]);

  useEffect(() => { if (createMutation.isSuccess || updateMutation.isSuccess) { setMessage("បានរក្សាទុកទិន្នន័យរួចរាល់"); setForm(emptyForm); setEditingId(null); } }, [createMutation.isSuccess, updateMutation.isSuccess]);

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setForm(emptyForm); setEditingId(null); setMessage(""); };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const payload = { name: form.name.trim(), code: form.code.trim(), category: form.category, description: form.description.trim() || null, priceCents: Math.round(Number(form.price) * 100), oldPriceCents: form.oldPrice ? Math.round(Number(form.oldPrice) * 100) : null, imageUrl: form.imageUrl || null, videoUrl: form.videoUrl || null, badge: form.badge.trim() || null, sortOrder: Number(form.sortOrder) || 0, isActive: form.isActive };
    if (!payload.name || !payload.code || !form.price.trim() || !Number.isFinite(payload.priceCents) || payload.priceCents < 0) { setMessage("សូមបំពេញឈ្មោះ, code និងតម្លៃឱ្យបានត្រឹមត្រូវ"); return; }
    try { if (editingId) await updateMutation.mutateAsync({ id: editingId, ...payload }); else await createMutation.mutateAsync(payload); } catch (error) { setMessage(error instanceof Error ? error.message : "មិនអាចរក្សាទុកបានទេ"); }
  };

  const editProduct = (product: AdminProduct) => { setEditingId(product.id); setForm(toForm(product)); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const removeProduct = async (id: number) => { if (!window.confirm("តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?")) return; await deleteMutation.mutateAsync({ id }); if (editingId === id) reset(); };

  const uploadMedia = async (file: File, kind: "image" | "video") => {
    const max = kind === "video" ? 24 * 1024 * 1024 : 7 * 1024 * 1024;
    if (file.size > max) { setMessage(`ឯកសារធំពេក។ ${kind === "video" ? "វីដេអូ" : "រូបភាព"} អាចមានទំហំអតិបរមា ${kind === "video" ? 24 : 7}MB។`); return; }
    setUploading(kind); setMessage("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Cannot read file")); reader.readAsDataURL(file); });
      const dataBase64 = dataUrl.split(",")[1] ?? "";
      const result = await uploadMutation.mutateAsync({ filename: file.name, mimeType: file.type, dataBase64 });
      setField(kind === "image" ? "imageUrl" : "videoUrl", result.url); setMessage(`${kind === "image" ? "រូបភាព" : "វីដេអូ"} upload ជោគជ័យ`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload មិនជោគជ័យ"); } finally { setUploading(null); }
  };

  if (loading) return <div className="admin-loading"><Loader2 className="spin" size={25} /> កំពុងពិនិត្យ admin access...</div>;
  if (!user || user.role !== "admin") return <div className="admin-denied"><ShieldAlert size={42} /><h1>Admin access only</h1><p>សូមចូលដោយគណនី admin របស់គម្រោង ដើម្បីគ្រប់គ្រងផលិតផល។</p><a href="/" className="primary-button">ត្រឡប់ទៅហាង</a></div>;

  return <div className="admin-page"><header className="admin-header"><div><p className="section-kicker">KHMER UDAM ET · ADMIN</p><h1>គ្រប់គ្រងផលិតផល</h1><p>បន្ថែមរូបភាព វីដេអូ កែតម្លៃ និងបើក/បិទការបង្ហាញលើហាង។</p></div><a href="/" className="admin-store-link">មើលហាង →</a></header><main className="admin-layout"><section className="admin-form-panel"><div className="admin-panel-title"><div><p className="section-kicker">PRODUCT EDITOR</p><h2>{selectedLabel}</h2></div>{editingId && <button className="ghost-button" onClick={reset}><X size={15} /> បោះបង់</button>}</div><form onSubmit={saveProduct}><div className="form-grid"><label><span>ឈ្មោះផលិតផល *</span><input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="ឧ. កាបូបដៃ Landea" /></label><label><span>Product code *</span><input value={form.code} onChange={(e) => setField("code", e.target.value)} placeholder="KU-001" /></label><label><span>ប្រភេទ</span><select value={form.category} onChange={(e) => setField("category", e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span>Badge</span><input value={form.badge} onChange={(e) => setField("badge", e.target.value)} placeholder="ថ្មី / លក់ដាច់" /></label><label><span>តម្លៃលក់ (USD) *</span><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="4.50" /></label><label><span>តម្លៃចាស់ (optional)</span><input type="number" min="0" step="0.01" value={form.oldPrice} onChange={(e) => setField("oldPrice", e.target.value)} placeholder="5.50" /></label><label><span>លំដាប់បង្ហាញ</span><input type="number" value={form.sortOrder} onChange={(e) => setField("sortOrder", e.target.value)} /></label><label className="active-check"><span>ស្ថានភាព</span><button type="button" className={form.isActive ? "status-toggle active" : "status-toggle"} onClick={() => setField("isActive", !form.isActive)}><span>{form.isActive ? "បង្ហាញលើហាង" : "លាក់ពីហាង"}</span><i /></button></label></div><label className="full-field"><span>ពិពណ៌នា</span><textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} placeholder="ព័ត៌មានខ្លីៗអំពីផលិតផល..." /></label><div className="media-fields"><div className="media-box"><div className="media-box-heading"><ImagePlus size={18} /><span>រូបភាពផលិតផល</span></div>{form.imageUrl ? <img className="media-preview" src={form.imageUrl} alt="Product preview" /> : <div className="media-placeholder">មិនទាន់មានរូបភាព</div>}<label className="upload-button"><Upload size={16} /> {uploading === "image" ? "កំពុង upload..." : "ជ្រើសរូបភាព"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "image")} disabled={Boolean(uploading)} /></label><input value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} placeholder="ឬ paste image URL" /></div><div className="media-box"><div className="media-box-heading"><Video size={18} /><span>វីដេអូផលិតផល</span></div>{form.videoUrl ? <video className="media-preview" src={form.videoUrl} controls /> : <div className="media-placeholder">មិនទាន់មានវីដេអូ</div>}<label className="upload-button"><Upload size={16} /> {uploading === "video" ? "កំពុង upload..." : "ជ្រើសវីដេអូ"}<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0], "video")} disabled={Boolean(uploading)} /></label><input value={form.videoUrl} onChange={(e) => setField("videoUrl", e.target.value)} placeholder="ឬ paste video URL" /></div></div><div className="admin-form-footer"><span className="admin-message">{message && <><Check size={15} /> {message}</>}</span><button type="submit" className="admin-save-button" disabled={isSaving || Boolean(uploading)}>{isSaving ? <Loader2 className="spin" size={17} /> : editingId ? <Save size={17} /> : <Plus size={17} />}{editingId ? "រក្សាទុកការកែប្រែ" : "បន្ថែមផលិតផល"}</button></div></form></section><section className="admin-list-panel"><div className="admin-panel-title"><div><p className="section-kicker">CATALOG</p><h2>ផលិតផលទាំងអស់ <span>{products.length}</span></h2></div><button className="ghost-button" onClick={reset}><Plus size={15} /> ថ្មី</button></div><div className="admin-product-list">{productsQuery.isLoading ? <div className="admin-empty"><Loader2 className="spin" size={22} /> កំពុងទាញទិន្នន័យ...</div> : products.length === 0 ? <div className="admin-empty"><ShoppingBagIcon /> មិនទាន់មានផលិតផលទេ</div> : products.map((product) => <article className={`admin-product-row ${product.isActive ? "" : "inactive"}`} key={product.id}><div className="admin-row-image">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <ImagePlus size={20} />}</div><div className="admin-row-copy"><div><span className="admin-code">{product.code}</span>{product.badge && <span className="admin-badge">{product.badge}</span>}</div><h3>{product.name}</h3><p>{product.category} · {product.isActive ? "បង្ហាញ" : "លាក់"}{product.videoUrl ? " · មានវីដេអូ" : ""}</p><strong>${(product.priceCents / 100).toFixed(2)}</strong></div><div className="admin-row-actions"><button onClick={() => editProduct(product)} aria-label="កែផលិតផល"><Pencil size={16} /></button><button className="danger" onClick={() => removeProduct(product.id)} aria-label="លុបផលិតផល"><Trash2 size={16} /></button></div></article>)}</div></section></main></div>;
}

function ShoppingBagIcon() { return <ShoppingBagFallback />; }
function ShoppingBagFallback() { return <span className="admin-empty-icon">◎</span>; }
