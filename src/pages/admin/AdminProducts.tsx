import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Package, X, Check, ChevronDown, Bell, User, LayoutGrid, List } from 'lucide-react'
import { getProducts, addProduct, deleteProduct, deleteProducts } from '../../services/admin/productsService'

const emptyForm = {
  name: '',
  id: '',
  category: 'Pharma',
  type: 'Software',
  shortDescription: '',
  fullDescription: '',
  os: '',
  ram: '',
  storage: '',
  features: [''],
}

const AdminProducts = () => {
  const [productList, setProductList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const tabs = ['All', 'Software', 'Hardware']

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts(search, activeTab)
      setProductList(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search, activeTab])

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProductList(prev => prev.filter(p => p.id !== id))
      setSelected(prev => prev.filter(s => s !== id))
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await deleteProducts(selected)
      setProductList(prev => prev.filter(p => !selected.includes(p.id)))
      setSelected([])
    } catch (error) {
      console.error('Error deleting products:', error)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...form.features]
    updated[index] = value
    setForm(prev => ({ ...prev, features: updated }))
  }

  const addFeature = () => setForm(prev => ({ ...prev, features: [...prev.features, ''] }))

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    if (!form.name || !form.shortDescription) return
    setSaving(true)
    try {
      const newProduct = {
        id: form.id || undefined,
        name: form.name,
        category: form.category,
        type: form.type,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription || form.shortDescription,
        features: form.features.filter(f => f.trim()),
        specs: { os: form.os, ram: form.ram, storage: form.storage },
      }
      await addProduct(newProduct)
      await fetchProducts()
      setShowAddForm(false)
      setForm(emptyForm)
    } catch (error) {
      console.error('Error adding product:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">

      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Products</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell size={20} />
          </button>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add New Product
          </button>
        </div>
      </div>

      <div className="p-8">

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              All Categories <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-xs' : ''}`}
              >
                <List size={15} className={viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs' : ''}`}
              >
                <LayoutGrid size={15} className={viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-semibold text-gray-900">{productList.length}</span> products
            </p>

            {/* Products List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                <span>
                  <input
                    type="checkbox"
                    onChange={e => setSelected(e.target.checked ? productList.map(p => p.id) : [])}
                    checked={selected.length === productList.length && productList.length > 0}
                    className="rounded"
                  />
                </span>
                <span className="col-span-2">Product</span>
                <span>Category</span>
                <span>Type</span>
                <span>Actions</span>
              </div>

              {productList.length === 0 ? (
                <div className="text-center py-20">
                  <Package size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No products found</p>
                </div>
              ) : (
                productList.map(product => (
                  <div key={product.id} className="grid grid-cols-6 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors items-center">
                    <span>
                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded"
                      />
                    </span>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Package size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.id}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{product.category}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                      product.type === 'Hardware' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.type?.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="text-green-500 hover:text-green-700 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Bulk Delete */}
        {selected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-3 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">{selected.length} selected</span>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-900 text-lg">Add New Product</h2>
              <button onClick={() => { setShowAddForm(false); setForm(emptyForm) }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange}
                    placeholder="e.g. Enterprise Cloud Firewall V2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product ID</label>
                  <input type="text" name="id" value={form.id} onChange={handleFormChange}
                    placeholder="e.g. AIT-007"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['Pharma', 'Retail', 'FMCG', 'Hardware'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                  <select name="type" value={form.type} onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description</label>
                <textarea name="shortDescription" value={form.shortDescription} onChange={handleFormChange}
                  placeholder="Brief summary for catalog listings..."
                  rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description</label>
                <textarea name="fullDescription" value={form.fullDescription} onChange={handleFormChange}
                  placeholder="Detail all technical specifications and benefits..."
                  rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-700 mb-3">System Requirements</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Operating System', name: 'os', placeholder: 'Windows/Linux' },
                    { label: 'Minimum RAM', name: 'ram', placeholder: '16GB DDR4' },
                    { label: 'Storage Space', name: 'storage', placeholder: '500GB SSD' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={(form as any)[field.name]}
                        onChange={handleFormChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Features List</p>
                <div className="space-y-2">
                  {form.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-blue-400" />
                      </div>
                      <input
                        type="text"
                        value={feature}
                        onChange={e => handleFeatureChange(i, e.target.value)}
                        placeholder="Add feature..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={() => removeFeature(i)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button onClick={addFeature} className="text-blue-600 text-sm font-semibold hover:text-blue-700 mt-1 block">
                    + Add Feature Row
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => { setShowAddForm(false); setForm(emptyForm) }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={16} /> Save Product</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h2>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts