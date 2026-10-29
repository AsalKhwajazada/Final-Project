import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notify } from '../utils/toast';

const INITIAL_ASSETS = [
  {
    id: 1,
    title: 'E-Commerce Mobile UI Kit',
    category: 'figma',
    author: 'Studio Craft',
    price: 35,
    rating: 4.9,
    sales: 1420,
    downloads: 3200,
    icon: 'fa-solid fa-mobile-screen',
    color: 'pink',
    description: '120+ clean mobile eCommerce screens, auto-layout 5.0, dark & light mode included.'
  },
  {
    id: 2,
    title: '3D Clay Isometric Workspace Pack',
    category: '3d',
    author: 'BlenderMaster',
    price: 45,
    rating: 5.0,
    sales: 890,
    downloads: 1950,
    icon: 'fa-solid fa-cube',
    color: 'purple',
    description: 'High-resolution rendered PNGs and original Blender (.blend) project files with lighting.'
  },
  {
    id: 3,
    title: 'Branding Identity Guidelines Template',
    category: 'vector',
    author: 'DesignForge',
    price: 25,
    rating: 4.8,
    sales: 640,
    downloads: 1200,
    icon: 'fa-solid fa-shapes',
    color: 'blue',
    description: 'Comprehensive 48-page brand identity manual for Adobe Illustrator and Figma.'
  },
  {
    id: 4,
    title: 'Geometric Display Serif Font Family',
    category: 'fonts',
    author: 'TypeFoundry Nilai',
    price: 18,
    rating: 4.9,
    sales: 980,
    downloads: 2400,
    icon: 'fa-solid fa-font',
    color: 'yellow',
    description: 'Modern luxury serif with 6 weights, stylistic alternates, and extensive multilingual support.'
  },
  {
    id: 5,
    title: 'Minimalist Line Icon System (600+)',
    category: 'icons',
    author: 'PixelGrid',
    price: 15,
    rating: 4.7,
    sales: 2150,
    downloads: 5100,
    icon: 'fa-solid fa-icons',
    color: 'green',
    description: 'Crisp vector outline icons on 24x24 pixel grid with stroke weight control.'
  },
  {
    id: 6,
    title: 'SaaS Dashboard Pro Design System',
    category: 'figma',
    author: 'CraftedUI',
    price: 50,
    rating: 5.0,
    sales: 1820,
    downloads: 4100,
    icon: 'fa-solid fa-chart-line',
    color: 'pink',
    description: 'Enterprise analytics, billing, user management, charts, and 50+ reusable Figma components.'
  }
];

export default function AssetMarketplacePage() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [assets] = useState(INITIAL_ASSETS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState('popular');
  const [walletBalance, setWalletBalance] = useState(120); // 120 RM
  const [purchasedModal, setPurchasedModal] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setPurchasedModal(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  const filteredAssets = assets
    .filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.sales - a.sales; // default popular
    });

  const handleBuy = (asset) => {
    if (walletBalance < asset.price) {
      notify(`Insufficient balance. You need ${asset.price} RM, but currently have ${walletBalance} RM.`, 'error');
      return;
    }
    setPurchasedModal(asset);
  };

  const confirmPurchase = () => {
    setWalletBalance(prev => prev - purchasedModal.price);
    notify(`Successfully purchased "${purchasedModal.title}" for ${purchasedModal.price} RM! Download link ready.`, 'success');
    setPurchasedModal(null);
  };

  return (
    <div className="marketplace-page">
      {/* Marketplace Hero Banner */}
      <section className="marketplace-hero">
        <div className="market-hero-left">
          <span className="badge-pill">CREATIVE STORE</span>
          <h1>Asset Marketplace</h1>
          <p>
            Download curated design assets, Figma UI kits, 3D models, fonts, and project templates 
            curated by verified designers and instructors.
          </p>
          <div className="market-search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search 1,200+ Figma kits, 3D assets, fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="market-wallet-card">
          <div className="wallet-header">
            <span><i className="fa-solid fa-wallet"></i> Student Wallet</span>
            <span className="wallet-status text-success">Active</span>
          </div>
          <div className="wallet-amount">
            {walletBalance} <span>RM</span>
          </div>
          <p className="wallet-note">Educational discount applied across all resources.</p>
          <button 
            type="button" 
            className="btn-topup-wallet"
            onClick={() => {
              setWalletBalance(prev => prev + 50);
              notify('Added 50 RM demo credits to your wallet!', 'success');
            }}
          >
            <i className="fa-solid fa-plus"></i> Add +50 RM Credits
          </button>
        </div>
      </section>

      {/* Category Pills & Filters */}
      <div className="market-filter-toolbar">
        <div className="category-pills-list">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'figma', label: 'Figma UI Kits' },
            { id: '3d', label: '3D Assets' },
            { id: 'fonts', label: 'Fonts & Typography' },
            { id: 'vector', label: 'Brand Templates' },
            { id: 'icons', label: 'Icon Sets' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`category-pill ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sort-selector-wrap">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="market-items-grid">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="market-asset-card">
            <div className={`asset-preview-banner bg-${asset.color}`}>
              <i className={`asset-preview-icon ${asset.icon}`}></i>
              <span className="asset-category-tag">{asset.category.toUpperCase()}</span>
            </div>

            <div className="asset-card-content">
              <div className="asset-title-row">
                <h3>{asset.title}</h3>
                <span className="asset-price-tag">{asset.price} RM</span>
              </div>
              <p className="asset-author">By <strong>{asset.author}</strong></p>
              <p className="asset-description">{asset.description}</p>

              <div className="asset-stats-row">
                <span><i className="fa-solid fa-star text-warning"></i> {asset.rating}</span>
                <span><i className="fa-solid fa-bag-shopping"></i> {asset.sales} sales</span>
                <span><i className="fa-solid fa-download"></i> {asset.downloads}</span>
              </div>

              <div className="asset-card-footer">
                <button 
                  type="button" 
                  className="btn-preview-asset"
                  onClick={() => notify(`Previewing screenshots for "${asset.title}"`)}
                >
                  <i className="fa-regular fa-eye"></i> Preview
                </button>
                <button 
                  type="button" 
                  className="btn-buy-asset"
                  onClick={() => handleBuy(asset)}
                >
                  <i className="fa-solid fa-cart-arrow-down"></i> Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {purchasedModal && (
        <div className="modal-backdrop" onClick={() => setPurchasedModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Purchase</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setPurchasedModal(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="purchase-summary-box">
                <h4>{purchasedModal.title}</h4>
                <p>Creator: <strong>{purchasedModal.author}</strong></p>
                <p>Format: Figma (.fig) + Vector Assets (.svg, .png)</p>
                <div className="purchase-pricing-breakdown">
                  <div><span>Item Price:</span><strong>{purchasedModal.price} RM</strong></div>
                  <div><span>Student Discount:</span><strong className="text-success">- 0.00 RM</strong></div>
                  <hr />
                  <div className="total-row"><span>Total Deducted:</span><strong>{purchasedModal.price} RM</strong></div>
                  <div><span>Remaining Balance after purchase:</span><span>{walletBalance - purchasedModal.price} RM</span></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setPurchasedModal(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={confirmPurchase}
              >
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
