export const contactInfo = {
  phone: '+94 77 123 4567',
  phoneHref: 'tel:+94771234567',
  whatsappHref: 'https://wa.me/94771234567',
  email: 'info@arrowventures.com',
  emailHref: 'mailto:info@arrowventures.com',
  hours: 'Mon – Sat, 9:00 AM – 6:00 PM'
};

/** Static navigation (after "E-Bikes" mega menu + "Accessories", which come from /api/catalog/categories/). */
export const navLinks = [
{ label: 'Reviews', to: '/#reviews' },
{
  label: 'Support',
  to: '/contact',
  children: [
  { label: 'Track Order', to: '/track-order' },
  { label: 'Warranty', to: '/warranty' },
  { label: 'Refund Policy', to: '/refund-policy' },
  { label: 'FAQs', to: '/contact#faq' },
  { label: 'Contact Us', to: '/contact' }]

},
{ label: 'Find a Store', to: '/contact' },
{ label: 'Service', to: '/maintenance' }];


export const socialLinks = [
{ label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
{ label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
{ label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' }] as
const;

/** Brand photography — Sri Lankan riders and locations. Product imagery always comes from the API. */
export const images = {
  hero: "/87051f7c-42ae-4c01-83ff-76996d75df53.jpg",
  galleFace: "/f3263429-b512-473a-b28f-c409ff95ae53.jpg",
  commuter: "/4c783a0d-4c2d-481f-a333-be8cca5f80c7.jpg",
  workshop: "/7d6165b0-3ec9-4f37-9e08-2a3aabfdcb48.jpg",
  hillCountry: "/10819625-dee5-4bff-b4c3-28fea5492f82.jpg",
  aboutHero: "/10819625-dee5-4bff-b4c3-28fea5492f82.jpg",
  story: "/027acfa2-65ce-4be6-8f61-71f2fdc69996.jpg",
  riderVideo: "/10819625-dee5-4bff-b4c3-28fea5492f82.jpg"
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