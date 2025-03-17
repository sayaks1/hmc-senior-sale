import Link from 'next/link'
import Layout from '@/components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="landing-page">
        <h1>Welcome to HMC Senior Sale</h1>
        <p>Buy and sell items from fellow students</p>
        
        <div className="cta-buttons">
          <Link href="/marketplace" className="primary-button">
            Browse Marketplace
          </Link>
          <Link href="/new-listing" className="secondary-button">
            Sell an Item
          </Link>
        </div>
      </div>
    </Layout>
  )
}