import React from 'react'
import Portfolio from './Portfolio'
import Header from './Header'
import Footer from './Footer'
import APIIntegration from './Api'
const PortfolioWrapper = () => {
  return (
    <div>
        <Header />
        <Portfolio />
        <APIIntegration />
        <Footer />
    </div>
  )
}

export default PortfolioWrapper