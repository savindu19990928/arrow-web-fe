/** "Find your ride" — use-case entry points into the shop. */
export const rideStyles = [
{
  id: 'commute',
  title: 'City commute',
  text: 'Light frames, integrated lights and a quiet motor for Colombo traffic.',
  to: '/shop?in_stock=true',
  image: "/0cc42fcc-7611-452d-bcc6-935e10363ffb.jpg",
  alt: 'A rider on a black e-bike in Colombo Fort'
},
{
  id: 'trail',
  title: 'Hills & trails',
  text: 'High-torque motors and big batteries for Ella climbs and red-earth tracks.',
  to: '/shop?ordering=-average_rating',
  image: "/d961a71a-5c14-49d1-973d-b64d2a0784d2.jpg",
  alt: 'A rider on an electric mountain bike on a trail in the Ella hills'
},
{
  id: 'cargo',
  title: 'Cargo & business',
  text: 'Carry the day’s stock across town — no fuel, no parking hassle.',
  to: '/shop',
  image: "/7ba38987-aea1-4974-b6eb-c2198535fed5.jpg",
  alt: 'A shop owner loading produce onto an electric cargo bike in Kandy'
}];