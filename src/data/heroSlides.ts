/**
 * Home hero carousel — Tenways-style: light lead line, bold model line, offer line, bike thumbnail switcher.
 * A slide with `video` plays it muted + looped, using `image` as the poster while it loads.
 */
export type HeroSlide = {
  id: string;
  lead: string;
  title: string;
  offer: string;
  cta: {label: string;to: string;};
  image: string;
  video?: string;
  thumb: string;
  alt: string;
  focus: string;
};

export const heroSlides: HeroSlide[] = [
{
  id: 'ride',
  lead: 'Made for Sri Lankan Streets',
  title: 'Electric, Everyday',
  offer: 'Free islandwide delivery on orders over LKR 100,000',
  cta: { label: 'Explore More', to: '/shop' },
  image: "/b4cfff67-2857-4ee3-905b-89c028dc2911.jpg",
  video: 'https://cdn.shopify.com/videos/c/o/v/6e16fb1725b643cca37124c99aa20af4.mp4',
  thumb: "/67b957c5-a44c-44b8-b969-19ef193f6926.jpg",
  alt: 'Three friends riding grey e-bikes along the Colombo seafront at golden hour',
  focus: '70% center'
},
{
  id: 'city',
  lead: 'The Lightweight Champion',
  title: 'City E-Bikes',
  offer: 'Free islandwide delivery on orders over LKR 100,000',
  cta: { label: 'Explore More', to: '/shop' },
  image: "/87051f7c-42ae-4c01-83ff-76996d75df53.jpg",
  thumb: "/de3fd3e6-2c02-43f0-bba4-a06a007be78f.jpg",
  alt: 'A rider on a black lightweight city e-bike passing modern white architecture',
  focus: '65% center'
},
{
  id: 'cruiser',
  lead: 'Easygoing, Every Day',
  title: 'Cruiser E-Bikes',
  offer: 'Split your payment with Koko or Mintpay at checkout',
  cta: { label: 'Explore More', to: '/shop?ordering=-average_rating' },
  image: "/f3263429-b512-473a-b28f-c409ff95ae53.jpg",
  thumb: "/aa92711a-de50-4842-a801-bcf7ec2dc0d0.jpg",
  alt: 'A woman riding a mint step-through cruiser e-bike along a palm-lined promenade',
  focus: '70% center'
},
{
  id: 'hybrid',
  lead: 'Go Further, Off the Map',
  title: 'Hybrid E-Bikes',
  offer: 'Book a test ride or service with our Sri Lankan technicians',
  cta: { label: 'Explore More', to: '/shop?in_stock=true' },
  image: "/0dff9f74-c9a9-4d66-aee6-c832cb577351.jpg",
  thumb: "/19402f2f-f3a5-484c-86aa-dbfbb263fb6c.jpg",
  alt: 'A rider on a navy hybrid e-bike on a countryside gravel road at golden hour',
  focus: '70% center'
}];