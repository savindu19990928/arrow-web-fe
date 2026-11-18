import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { RideFinder } from '../components/home/RideFinder';
import { WhyArrow } from '../components/home/WhyArrow';
import { CampaignBanners } from '../components/home/CampaignBanners';
import { ServiceBand } from '../components/home/ServiceBand';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { BrandStrip } from '../components/home/BrandStrip';

export function Home() {
  return (
    <>
      <HomeHero />
      <CategoryShowcase />
      <RideFinder />
      <WhyArrow />
      <CampaignBanners />
      <ServiceBand />
      <CustomerReviews />
      <BrandStrip />
    </>);

}