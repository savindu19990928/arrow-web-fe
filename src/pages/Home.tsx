import React from 'react';
import { HomeHero } from '../components/home/HomeHero';
import { CategorySections } from '../components/home/CategorySections';
import { FeatureTabs } from '../components/home/FeatureTabs';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { PromoBanners } from '../components/home/PromoBanners';
import { CommunityGrid } from '../components/home/CommunityGrid';
import { BenefitsStrip } from '../components/home/BenefitsStrip';

export function Home() {
  return (
    <>
      <HomeHero />
      <CategorySections />
      <FeatureTabs />
      <ReviewsSection />
      <PromoBanners />
      <CommunityGrid />
      <BenefitsStrip />
    </>);

}