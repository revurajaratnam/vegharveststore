import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../store/api/ecommerceApi';

const EMPTY_PRODUCT = {
  name: '',
  category: '',
  price: '',
  unit: '',
  image: '',
  inStock: true,
};

export default function AdminProductManager() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [draft, setDraft] = useState(EMPTY_PRODUCT);

  const handleCreate = async (event) => {
    event.preventDefault();
    await createProduct({
      ...draft,
      price: Number(draft.price),
    }).unwrap();
    setDraft(EMPTY_PRODUCT);
  };

  const handleStockChange = async (product, inStock) => {
    await updateProduct({ id: product.id, inStock }).unwrap();
  };

  const handleDelete = async (productId) => {
    await deleteProduct(productId).unwrap();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="bg-white border border-slate-200 rounded-2xl p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        {[
          ['name', 'Name'],
          ['category', 'Category'],
          ['price', 'Price'],
          ['unit', 'Unit'],
          ['image', 'Image URL'],
        ].map(([field, label]) => (
          <label
            key={field}
            className={`text-xs font-semibold text-slate-600 ${field === 'image' ? 'lg:col-span-2' : ''}`}
          >
            {label}
            <input
              required
              type={field === 'price' ? 'number' : 'text'}
              step={field === 'price' ? '0.01' : undefined}
              value={draft[field]}
              onChange={(event) => setDraft((current) => ({ ...current, [field]: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={isCreating}
          className="lg:col-span-1 self-end inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-bold text-slate-900">
          Product Inventory
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-slate-400">Loading inventory...</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((product) => (
              <div key={product.id} className="p-4 flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.category} - {product.unit}</p>
                </div>
                <p className="font-bold text-slate-900">${Number(product.price).toFixed(2)}</p>
                <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(product.inStock)}
                    onChange={(event) => handleStockChange(product, event.target.checked)}
                  />
                  In stock
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
