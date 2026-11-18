export const serviceTypes = ['Repair / diagnosis', 'General service', 'Safety check', 'Battery health check', 'Warranty inspection'];

export const maintenanceSchedule = [
{ when: 'Before every ride', tasks: 'Squeeze both brakes, check tyre pressure, confirm lights and battery level.' },
{ when: 'Weekly', tasks: 'Wipe down the frame and chain, check for loose bolts, inspect tyres for cuts.' },
{ when: 'Monthly', tasks: 'Clean and lubricate the chain, check brake pad wear, inspect cables and connectors.' },
{ when: 'Every 6 months / 1,500 km', tasks: 'Full professional service: drivetrain, brakes, wheels, motor and electrical inspection.' },
{ when: 'Yearly', tasks: 'Battery health check, brake fluid bleed (hydraulic), suspension service.' }];


export const commonRepairs = [
{ issue: 'Puncture & tyre replacement', turnaround: 'Same day', from: 'Rs. 1,500' },
{ issue: 'Brake bleed / pad replacement', turnaround: 'Same day', from: 'Rs. 2,000' },
{ issue: 'Gear & derailleur tuning', turnaround: 'Same day', from: 'Rs. 1,800' },
{ issue: 'Display or controller fault', turnaround: '1 – 3 days', from: 'Rs. 3,500' },
{ issue: 'Motor diagnosis & repair', turnaround: '2 – 5 days', from: 'Rs. 4,500' },
{ issue: 'Battery repair or replacement', turnaround: '3 – 7 days', from: 'Rs. 6,000' },
{ issue: 'Wiring & connector repair', turnaround: '1 – 2 days', from: 'Rs. 2,500' },
{ issue: 'Accident damage assessment', turnaround: '1 – 2 days', from: 'Free' }];


export const warningSigns = [
'Brakes feel spongy, squeal constantly or need more lever travel',
'Motor cuts out, stutters or makes grinding noises',
'Range has dropped noticeably on a full charge',
'Display shows an error code or flickers',
'Gears skip, slip or won’t shift cleanly',
'Clicking, creaking or wobbling from wheels or frame'];


export const serviceSteps = [
{ title: 'Book', text: 'Send a request below or WhatsApp us. We confirm a time within one working day.' },
{ title: 'Drop off', text: 'Bring your e-cycle to our service centre, or ask about pickup in the Colombo area.' },
{ title: 'Diagnose & quote', text: 'A technician inspects it and we send you a written quote before any work begins.' },
{ title: 'Ride away', text: 'We test-ride every e-cycle after service and walk you through what was done.' }];


export const warrantyCoverage = [
{ component: 'Motor', period: '2 years', notes: 'Manufacturing defects in hub and mid-drive motors.' },
{ component: 'Battery', period: '2 years', notes: 'Capacity loss beyond normal ageing, BMS faults. Subject to cycle count.' },
{ component: 'Frame', period: '1 year', notes: 'Cracks or weld failures under normal use.' },
{ component: 'Display & Controller', period: '1 year', notes: 'Electronic faults not caused by water ingress or impact.' },
{ component: 'Charger', period: '6 months', notes: 'Must be used with the matching Arrow battery.' },
{ component: 'Parts & Accessories', period: 'As listed', notes: 'Coverage is shown on each product page and on your invoice.' }];


export const warrantyExclusions = [
'Misuse, accidents or crash damage',
"Water exposure beyond the product's stated rating",
'Overloading beyond the stated maximum load',
'Unauthorised modification or incorrect installation',
'Failure to follow care instructions',
'Normal wear and tear (tyres, pads, chain, cables)',
'Use of incompatible chargers or components'];


export const claimSteps = [
{ title: 'Contact us', text: 'Call, WhatsApp or email us with your order number and a short description of the problem.' },
{ title: 'Share evidence', text: 'Send clear photos or a video. We may ask for diagnostic information or error codes from your display.' },
{ title: 'Inspection', text: 'We arrange an inspection at our service centre or with an authorised service provider.' },
{ title: 'Resolution', text: 'Depending on the outcome, we repair, replace or offer another remedy under the Refund Policy.' }];


export const batteryCareTips = [
'Use only the charger specified for your battery.',
'Store between 40 – 60% charge if not riding for more than two weeks.',
'Avoid charging in direct sun or right after a hot ride — let it cool first.',
'Never use a battery that is swollen, leaking, unusually hot or smells unusual.',
'Do not open, puncture or attempt to repair a battery yourself.'];