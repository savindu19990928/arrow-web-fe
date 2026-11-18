export const contactInfo = {
  phone: '+94 77 123 4567',
  phoneHref: 'tel:+94771234567',
  whatsappHref: 'https://wa.me/94771234567',
  email: 'info@arrowventures.com',
  emailHref: 'mailto:info@arrowventures.com',
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM'
};

/** Static navigation. The "Shop" mega menu is populated from /api/catalog/categories/. */
export const navLinks = [
{ label: '3D Showroom', to: '/shop?has_3d_model=true' },
{ label: 'Service', to: '/maintenance' },
{
  label: 'Support',
  to: '/contact',
  children: [
  { label: 'Track Order', to: '/track-order' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'Contact Us', to: '/contact' }]

},
{ label: 'About', to: '/about' }];


export const socialLinks = [
{ label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
{ label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
{ label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' }] as
const;

/** Brand photography — Sri Lankan riders and locations. Product imagery always comes from the API. */
export const images = {
  hero: "/2ed444ed-1549-48df-b32f-fde4267ee2c7.jpg",
  galleFace: "/027acfa2-65ce-4be6-8f61-71f2fdc69996.jpg",
  commuter: "/0582fc6e-f6b1-425a-8729-edb39309555a.jpg",
  workshop: "/cc9e4b15-0399-43bd-be48-76bd3b21ebc1.jpg",
  hillCountry: "/1738cc0b-a37e-422a-9241-3d0573e2b89f.jpg",
  aboutHero: "/1738cc0b-a37e-422a-9241-3d0573e2b89f.jpg",
  story: "/027acfa2-65ce-4be6-8f61-71f2fdc69996.jpg",
  riderVideo: "/1738cc0b-a37e-422a-9241-3d0573e2b89f.jpg"
};

export const whyArrow = [
{ title: 'Free islandwide delivery', text: 'On every order of LKR 100,000 or more. A flat LKR 2,500 below that.', icon: 'truck' },
{ title: 'Pay your way', text: 'Split with Koko or Mintpay, or pay by bank transfer — verified by our finance team.', icon: 'wallet' },
{ title: 'Warranty you can read', text: 'Coverage is printed on every product page and on your invoice.', icon: 'shield' },
{ title: 'Serviced in Sri Lanka', text: 'Book maintenance and repairs with technicians who know our roads.', icon: 'wrench' }] as
const;

export const aboutValues = [
{
  title: 'Our Mission',
  icon: 'leaf',
  text: 'To provide high-quality electric cycles and related products, while promoting sustainable and eco-friendly mobility across Sri Lanka.'
},
{
  title: 'Our Vision',
  icon: 'eye',
  text: 'To become the most trusted and innovative e-mobility brand in Sri Lanka, driving a cleaner, greener tomorrow.'
},
{
  title: 'Our Values',
  icon: 'gem',
  text: 'Innovation  •  Quality  •  Sustainability  •  Customer First  •  Integrity'
}];


export const whyChooseUs = [
{ title: 'Quality Assurance', text: 'Ride with confidence knowing you get the best.', icon: 'shield' },
{ title: 'Dedicated Support', text: 'Our team is always here to help you.', icon: 'headset' },
{ title: 'Fast Islandwide Delivery', text: 'Get your ride, wherever you are in Sri Lanka.', icon: 'truck' },
{ title: 'Eco-Friendly Choice', text: 'Together for a greener planet.', icon: 'leaf' }];


export const faqs = [
{
  q: 'Do you deliver islandwide?',
  a: 'Yes. We deliver electric cycles, parts and accessories across Sri Lanka. Estimated arrival dates are shown in your cart and at checkout.'
},
{
  q: 'Which payment options can I use?',
  a: 'You can pay with Koko or Mintpay (buy now, pay later in instalments), or by direct bank transfer. Bank transfers are confirmed once our team verifies your deposit slip.'
},
{
  q: 'Can I track my order without an account?',
  a: 'Yes. Use Track Order with your order number and the email or phone number you used at checkout.'
},
{
  q: 'What warranty do electric cycles come with?',
  a: 'Warranty varies by product and is shown on each product page and on your invoice. Visit our Warranty page for full coverage details and how to claim.'
},
{
  q: 'Can I cancel an order?',
  a: 'You can request a cancellation from your account before the order is packed. After dispatch, it is handled as a return under our Refund Policy.'
}];