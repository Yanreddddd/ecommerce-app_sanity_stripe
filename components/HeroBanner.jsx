import React from 'react'
import Link from 'next/link';
import banner from '../sanity_ecommerce-app/schemas/banner';

import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner: {slug, buttonText, smallText, midText, largeText1, image, desc} }) => {
  return (
    <div className="hero-banner-container">

      <div className="hero-banner-texts">
        <p className="beats-solo">{smallText}</p>
        <h3>{midText}</h3>
        <h1>{largeText1}</h1>
        <img src={urlFor(image)} alt="headphones" className="hero-banner-image"/>
        <div>

          <Link href={`/product/${slug.current}`}>
            <button className="hero-btn" type="button">{buttonText}</button>
          </Link>
          <div className="desc">
            <h5>Description</h5>
            <p>{desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner