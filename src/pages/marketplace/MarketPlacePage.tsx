import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

import './MarketplacePage.css';

const products = [
  {
    title: 'High Yield Savings',
    category: 'Savings',
    rate: '5.2% APY',
    description:
      'Flexible high interest savings account with instant withdrawal.',
    tag: 'Popular',
  },
  {
    title: 'Retirement ETF Bundle',
    category: 'Investment',
    rate: '+12.4%',
    description:
      'Diversified ETF portfolio designed for long-term retirement growth.',
    tag: 'Trending',
  },
  {
    title: 'Crypto Starter Pack',
    category: 'Crypto',
    rate: '+18.7%',
    description:
      'Beginner-friendly crypto investment portfolio with low entry risk.',
    tag: 'Hot',
  },
  {
    title: 'Travel Insurance',
    category: 'Insurance',
    rate: 'From $12/mo',
    description:
      'Affordable travel coverage with global emergency support.',
    tag: 'Secure',
  },
];

const trendingAssets = [
  {
    name: 'S&P 500 ETF',
    change: '+4.2%',
    positive: true,
  },
  {
    name: 'Bitcoin',
    change: '+9.8%',
    positive: true,
  },
  {
    name: 'Gold Futures',
    change: '-1.4%',
    positive: false,
  },
  {
    name: 'Tech Growth Fund',
    change: '+7.1%',
    positive: true,
  },
];

export default function MarketplacePage() {
  return (
    <main className="marketplace-page">
      {/* HERO */}
      <section className="marketplace-hero">
        <div>
          <span className="marketplace-badge">
            <Sparkles size={16} />
            Smart Investment Marketplace
          </span>

          <h1 className="marketplace-title">
            Discover financial products tailored for your goals.
          </h1>

          <p className="marketplace-subtitle">
            Compare investments, savings, insurance, and more in one place.
          </p>
        </div>

        <div className="marketplace-search-wrapper">
          <div className="marketplace-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search investments, funds, crypto..."
            />
          </div>

          <button className="marketplace-filter-btn">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="marketplace-section">
        <div className="marketplace-section__header">
          <div>
            <h2>Featured Products</h2>
            <p>Recommended financial opportunities for you</p>
          </div>
        </div>

        <div className="marketplace-grid">
          {products.map((product) => (
            <article className="marketplace-card" key={product.title}>
              <div className="marketplace-card__top">
                <span className="marketplace-card__tag">
                  {product.tag}
                </span>

                <button className="marketplace-card__action">
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="marketplace-card__content">
                <p className="marketplace-card__category">
                  {product.category}
                </p>

                <h3>{product.title}</h3>

                <span className="marketplace-card__rate">
                  {product.rate}
                </span>

                <p>{product.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MARKET INSIGHTS */}
      <section className="marketplace-bottom-grid">
        <article className="marketplace-panel">
          <div className="marketplace-section__header">
            <div>
              <h2>Trending Assets</h2>
              <p>Most watched products this week</p>
            </div>
          </div>

          <div className="marketplace-assets-list">
            {trendingAssets.map((asset) => (
              <div className="marketplace-asset-item" key={asset.name}>
                <div className="marketplace-asset-item__left">
                  <div className="marketplace-asset-icon">
                    <TrendingUp size={18} />
                  </div>

                  <div>
                    <h4>{asset.name}</h4>
                    <p>Updated today</p>
                  </div>
                </div>

                <span
                  className={
                    asset.positive
                      ? 'marketplace-positive'
                      : 'marketplace-negative'
                  }
                >
                  {asset.change}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="marketplace-panel marketplace-security-panel">
          <div className="marketplace-section__header">
            <div>
              <h2>Why Choose Us</h2>
              <p>Safe and transparent investing experience</p>
            </div>
          </div>

          <div className="marketplace-benefits">
            <div className="marketplace-benefit-item">
              <ShieldCheck size={20} />
              <div>
                <h4>Verified Financial Partners</h4>
                <p>
                  All products are reviewed and verified by trusted providers.
                </p>
              </div>
            </div>

            <div className="marketplace-benefit-item">
              <TrendingUp size={20} />
              <div>
                <h4>Real-time Market Insights</h4>
                <p>
                  Stay updated with live trends and portfolio performance.
                </p>
              </div>
            </div>

            <div className="marketplace-benefit-item">
              <Sparkles size={20} />
              <div>
                <h4>AI Recommendations</h4>
                <p>
                  Discover personalized financial opportunities instantly.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}