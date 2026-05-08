import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import Swal from 'sweetalert2';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['Electronics', 'Furniture', 'Clothing', 'Food', 'Other']);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: '',
    category: '',
    description: ''
  });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    if (user) {
      setLoggedInUser(user);
    }
    
    // Set current date
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-PK', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;
      
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/products?userId=${userId}`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(response.data.data.map(p => p.category))];
      if (uniqueCategories.length > 0) {
        setCategories(prev => [...new Set([...prev, ...uniqueCategories])]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  const filterByStockStatus = (status) => {
    let filtered = [];
    if (status === 'inStock') {
      filtered = products.filter(p => p.quantity > 10);
    } else if (status === 'lowStock') {
      filtered = products.filter(p => p.quantity > 0 && p.quantity < 10);
    } else if (status === 'outOfStock') {
      filtered = products.filter(p => p.quantity === 0);
    } else {
      filtered = products;
    }
    setFilteredProducts(filtered);
    setSelectedCategory('all');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      quantity: '',
      price: '',
      category: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
      description: product.description || ''
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${product.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1F6F5F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?._id;
        
        await axios.delete(`http://localhost:5000/api/products/${product._id}?userId=${userId}`);
        await fetchProducts();
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete product.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;
      
      const productData = {
        ...formData,
        userId: userId
      };
      
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, productData);
        Swal.fire('Updated!', 'Product has been updated.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/products', productData);
        Swal.fire('Created!', 'Product has been added.', 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setShowCategoryModal(false);
      Swal.fire('Success!', `Category "${newCategory}" added successfully!`, 'success');
    } else if (categories.includes(newCategory)) {
      Swal.fire('Error!', 'Category already exists!', 'error');
    } else {
      Swal.fire('Error!', 'Please enter a category name!', 'error');
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'danger' };
    if (quantity < 10) return { text: 'Low Stock', class: 'warning' };
    return { text: 'In Stock', class: 'success' };
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.quantity > 10).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity < 10).length,
    outOfStock: products.filter(p => p.quantity === 0).length
  };

  // Render different sections based on activeTab
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <>
          {/* Stats Cards Clickable */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm h-100" style={{ borderRadius: '20px', cursor: 'pointer' }} onClick={() => filterByStockStatus('all')}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold">TOTAL PRODUCTS</p>
                      <h2 className="fw-bold mb-0" style={{ color: '#1F6F5F' }}>{stats.total}</h2>
                    </div>
                    <div className="rounded-circle p-3" style={{ backgroundColor: 'rgba(31, 111, 95, 0.1)' }}>
                      <i className="bi bi-box-seam fs-4" style={{ color: '#1F6F5F' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm h-100" style={{ borderRadius: '20px', cursor: 'pointer' }} onClick={() => filterByStockStatus('inStock')}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold">IN STOCK</p>
                      <h2 className="fw-bold mb-0 text-success">{stats.inStock}</h2>
                    </div>
                    <div className="rounded-circle p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                      <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm h-100" style={{ borderRadius: '20px', cursor: 'pointer' }} onClick={() => filterByStockStatus('lowStock')}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold">LOW STOCK</p>
                      <h2 className="fw-bold mb-0 text-warning">{stats.lowStock}</h2>
                    </div>
                    <div className="rounded-circle p-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm h-100" style={{ borderRadius: '20px', cursor: 'pointer' }} onClick={() => filterByStockStatus('outOfStock')}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold">OUT OF STOCK</p>
                      <h2 className="fw-bold mb-0 text-danger">{stats.outOfStock}</h2>
                    </div>
                    <div className="rounded-circle p-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <i className="bi bi-x-circle-fill fs-4 text-danger"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-header bg-white py-3 px-4" style={{ borderBottom: '1px solid #e9ecef' }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 className="mb-0 fw-semibold" style={{ color: '#1F6F5F' }}>
                  <i className="bi bi-box-seam me-2"></i>Inventory List
                </h5>
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    onClick={() => filterByCategory('all')}
                    className={`btn btn-sm rounded-pill px-3 ${selectedCategory === 'all' ? 'btn-brand' : 'btn-outline-secondary'}`}
                    style={selectedCategory === 'all' ? { backgroundColor: '#1F6F5F', color: 'white' } : {}}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => filterByCategory(cat)}
                      className={`btn btn-sm rounded-pill px-3 ${selectedCategory === cat ? 'btn-brand' : 'btn-outline-secondary'}`}
                      style={selectedCategory === cat ? { backgroundColor: '#1F6F5F', color: 'white' } : {}}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" style={{ color: '#1F6F5F' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No products found in this category.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const status = getStockStatus(product.quantity);
                        return (
                          <tr key={product._id}>
                            <td className="px-4 py-3"><code>{product.sku}</code></td>
                            <td className="px-4 py-3 fw-semibold">{product.name}</td>
                            <td className="px-4 py-3">
                              <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'rgba(31, 111, 95, 0.1)', color: '#1F6F5F' }}>
                                {product.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">PKR {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3">{product.quantity}</td>
                            <td className="px-4 py-3">
                              <span className={`badge rounded-pill px-3 py-2 bg-${status.class} bg-opacity-10 text-${status.class} fw-semibold`} 
                                    style={{ color: status.class === 'success' ? '#15803d' : status.class === 'warning' ? '#b45309' : '#b91c1c' }}>
                                {status.text}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleEditProduct(product)} 
                                className="btn btn-sm me-2"
                                style={{ backgroundColor: 'rgba(31, 111, 95, 0.1)', color: '#1F6F5F', border: 'none', borderRadius: '10px' }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product)} 
                                className="btn btn-sm"
                                style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: 'none', borderRadius: '10px' }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'profile') {
      return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
          <div className="card-body p-5 text-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: 120, height: 120, backgroundColor: 'rgba(31, 111, 95, 0.1)' }}>
              <i className="bi bi-person-fill" style={{ color: '#1F6F5F', fontSize: '4rem' }}></i>
            </div>
            <h2 className="fw-bold" style={{ color: '#1F6F5F' }}>{loggedInUser?.username}</h2>
            <p className="text-muted">{loggedInUser?.email}</p>
            <p className="text-muted">Member since: {new Date().toLocaleDateString()}</p>
            <hr className="my-4" />
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(31, 111, 95, 0.05)' }}>
                  <h4 className="fw-bold" style={{ color: '#1F6F5F' }}>{stats.total}</h4>
                  <p className="text-muted mb-0">Total Products</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(31, 111, 95, 0.05)' }}>
                  <h4 className="fw-bold" style={{ color: '#1F6F5F' }}>{stats.inStock}</h4>
                  <p className="text-muted mb-0">Products In Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
          <div className="card-body p-5">
            <h3 className="fw-bold mb-4" style={{ color: '#1F6F5F' }}>Settings</h3>
            
            <div className="mb-4">
              <h5 className="fw-semibold mb-3">Categories</h5>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {categories.map(cat => (
                  <span key={cat} className="badge rounded-pill px-3 py-2" style={{ backgroundColor: 'rgba(31, 111, 95, 0.1)', color: '#1F6F5F' }}>
                    {cat}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => setShowCategoryModal(true)} 
                className="btn btn-brand rounded-pill px-4"
                style={{ backgroundColor: '#1F6F5F', color: 'white' }}
              >
                <i className="bi bi-plus-circle me-2"></i>Add New Category
              </button>
            </div>

            <hr />
            
            <div className="mb-4">
              <h5 className="fw-semibold mb-3">Account Settings</h5>
              <button className="btn btn-outline-danger rounded-pill px-4" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      <style>{`
        .brand-color { color: #1F6F5F; }
        .brand-bg { background-color: #1F6F5F; }
        .brand-bg:hover { background-color: #195f51; }
        .btn-brand { background-color: #1F6F5F; color: white; border: none; }
        .btn-brand:hover { background-color: #195f51; transform: translateY(-2px); }
        .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; border-radius: 20px; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15); }
        .nav-link-custom { color: white !important; opacity: 0.8; transition: opacity 0.3s ease; cursor: pointer; }
        .nav-link-custom:hover { opacity: 1; }
        .nav-link-active { opacity: 1 !important; border-bottom: 2px solid white; }
      `}</style>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#1F6F5F', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold fs-3" href="#" style={{ color: 'white' }}>
            <i className="bi bi-box-seam-fill me-2" style={{ color: 'white' }}></i>StockMaster
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-3">
              <li className="nav-item">
                <div className={`nav-link-custom ${activeTab === 'dashboard' ? 'nav-link-active' : ''}`} 
                     style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('dashboard'); filterByCategory('all'); }}>
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </div>
              </li>
              <li className="nav-item">
                <div className={`nav-link-custom ${activeTab === 'profile' ? 'nav-link-active' : ''}`} 
                     style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
                  <i className="bi bi-person me-1"></i> Profile
                </div>
              </li>
              <li className="nav-item">
                <div className={`nav-link-custom ${activeTab === 'settings' ? 'nav-link-active' : ''}`} 
                     style={{ cursor: 'pointer' }} onClick={() => setActiveTab('settings')}>
                  <i className="bi bi-gear me-1"></i> Settings
                </div>
              </li>
            </ul>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <i className="bi bi-person-fill" style={{ color: 'white' }}></i>
              </div>
              <div className="d-none d-md-block">
                <small style={{ color: '#e0f2e9' }}>Welcome back,</small>
                <div className="fw-semibold" style={{ color: 'white' }}>
                  {loggedInUser?.username || 'User'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">
        {/* Header with Date */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-6 fw-bold mb-1" style={{ color: '#1F6F5F' }}>
              <i className="bi bi-speedometer2 me-2"></i>{activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'profile' ? 'My Profile' : 'Settings'}
            </h1>
            <p className="text-muted">
              <i className="bi bi-calendar me-1"></i> {currentDate}
            </p>
          </div>
          {activeTab === 'dashboard' && (
            <button 
              onClick={handleAddProduct} 
              className="btn rounded-pill px-4 py-2 fw-semibold"
              style={{ backgroundColor: '#1F6F5F', color: 'white', border: 'none' }}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Product
            </button>
          )}
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1F6F5F' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body px-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Product Name</label>
                    <input type="text" className="form-control" placeholder="Enter product name"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">SKU</label>
                      <input type="text" className="form-control" placeholder="Unique SKU"
                        value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Category</label>
                      <select className="form-select" value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                        <option value="">Select category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Quantity</label>
                      <input type="number" className="form-control" placeholder="Quantity"
                        value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Price (PKR)</label>
                      <input type="number" className="form-control" placeholder="Price"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description (Optional)</label>
                    <textarea className="form-control" rows="3" placeholder="Product description"
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer border-0 pb-4 px-4">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn rounded-pill px-4" style={{ backgroundColor: '#1F6F5F', color: 'white' }}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1F6F5F' }}>Add New Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <div className="modal-body px-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category Name</label>
                  <input type="text" className="form-control" placeholder="Enter category name"
                    value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer border-0 pb-4 px-4">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="button" className="btn rounded-pill px-4" style={{ backgroundColor: '#1F6F5F', color: 'white' }} onClick={handleAddCategory}>
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;