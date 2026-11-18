export type PolicyBlock =
{type: 'p';text: string;} |
{type: 'ul';items: string[];} |
{type: 'h3';text: string;} |
{type: 'note';text: string;};

export interface PolicySection {
  id: string;
  heading: string;
  blocks: PolicyBlock[];
}

export interface Policy {
  slug: 'refund-policy' | 'privacy-policy' | 'terms-and-conditions';
  title: string;
  summary: string;
  sections: PolicySection[];
}

const contactList = [
'**Business:** Arrow Ventures',
'**Email:** info@arrowventures.com',
'**Telephone/WhatsApp:** +94 77 123 4567'];


export const policiesLastUpdated = 'November 2026';

export const policies: Policy[] = [
{
  slug: 'refund-policy',
  title: 'Refund, Return & Exchange Policy',
  summary: 'When a product may be returned, exchanged, repaired, or refunded.',
  sections: [
  { id: 'commitment', heading: 'Our commitment', blocks: [
    { type: 'p', text: 'Thank you for shopping with Arrow Ventures. We sell electric bicycles, bicycle parts, components, and accessories. We want you to receive products that match your order and are in the condition described on our website.' },
    { type: 'p', text: 'This policy explains when a product may be returned, exchanged, repaired, or refunded. It applies to purchases made through the Arrow Ventures website, subject always to any consumer rights that cannot legally be excluded or limited.' }]
  },
  { id: 'contact-first', heading: 'Contact us before returning an item', blocks: [
    { type: 'p', text: 'Please contact our support team before sending or bringing an item back. Include:' },
    { type: 'ul', items: ['Your order number and the name used for the order.', 'The product name and quantity.', 'A description of the issue and when you noticed it.', 'Clear photographs or a video, where relevant.'] },
    { type: 'ul', items: ['**Return/support contact:** info@arrowventures.com', '**Telephone/WhatsApp:** +94 77 123 4567'] },
    { type: 'p', text: 'Please do not send a product to an address before receiving return instructions from us.' }]
  },
  { id: 'change-of-mind', heading: 'Change-of-mind returns', blocks: [
    { type: 'p', text: 'A return requested because you changed your mind may be accepted within **7 days** of delivery, provided that:' },
    { type: 'ul', items: ['The product is unused, uninstalled, unmodified, and in resalable condition.', 'It is returned with its original packaging, accessories, manuals, keys, chargers, tools, and other supplied items, where applicable.', 'There are no signs of use, damage, attempted repair, or misuse.', 'You provide proof of purchase.'] },
    { type: 'p', text: 'For hygiene, safety, and product-integrity reasons, certain products may not be eligible for change-of-mind returns once opened, used, installed, or fitted. Examples may include helmets, personal protective equipment, electrical components, batteries, and custom-ordered items. Any exclusion will be applied only where permitted by applicable law and should be disclosed clearly before purchase.' }]
  },
  { id: 'used-ebikes', heading: 'Electric bicycles and products that have been used or assembled', blocks: [
    { type: 'p', text: 'An electric bicycle that has been ridden, assembled beyond what is necessary for inspection, modified, or registered/activated where applicable may not qualify for a change-of-mind return.' },
    { type: 'p', text: 'If an electric bicycle or component is faulty, damaged, incorrectly supplied, or materially different from its description, contact us. We will assess the issue and explain the available remedy in accordance with this policy and applicable consumer law.' },
    { type: 'p', text: 'Before returning an electric bicycle:' },
    { type: 'ul', items: ['Stop using it if you suspect a battery, motor, wiring, brake, frame, or other safety-related fault.', 'Do not continue charging or operating a battery that is swollen, leaking, unusually hot, emitting an unusual smell, or visibly damaged.', 'Do not dismantle, modify, or attempt an unauthorised repair before contacting us, unless immediate action is necessary to prevent injury or damage.'] }]
  },
  { id: 'parts', heading: 'Parts and accessories', blocks: [
    { type: 'p', text: 'When ordering parts or accessories, customers should check the product description, dimensions, specifications, connector type, voltage, mounting standard, and compatibility information before purchase.' },
    { type: 'p', text: 'If a part is incompatible because the website description or compatibility information supplied by Arrow Ventures was incorrect, contact us. If the customer selected a part that was accurately described but is incompatible with their particular bicycle, any change-of-mind return will be assessed under the change-of-mind returns section.' },
    { type: 'p', text: 'Installation, fitting, or modification may affect return eligibility for a change-of-mind request. This does not remove any rights relating to a defective or incorrectly described product.' }]
  },
  { id: 'damaged', heading: 'Damaged, defective, incorrect, or missing items', blocks: [
    { type: 'p', text: 'Please inspect your order as soon as reasonably possible after delivery. If an item arrives damaged, defective, incorrect, or incomplete, contact us promptly and provide photographs of:' },
    { type: 'ul', items: ['The product and the affected area.', 'The packaging and shipping label, if relevant.', 'Any visible damage to the parcel.'] },
    { type: 'p', text: 'We may ask you to make the product available for inspection. Depending on the circumstances, the product and applicable legal requirements, we may arrange a repair, replacement, exchange, price adjustment, or refund.' },
    { type: 'p', text: 'For safety-related defects involving an electric bicycle, battery, charger, brakes, motor, or electrical system, stop using the affected product until the issue has been assessed.' }]
  },
  { id: 'warranty', heading: 'Warranty claims', blocks: [
    { type: 'p', text: "A manufacturer's warranty or Arrow Ventures warranty may apply to certain electric bicycles, batteries, motors, chargers, parts, and accessories. Warranty coverage, duration, exclusions, and claim procedures vary by product." },
    { type: 'p', text: "The warranty applicable to a product will be the warranty stated on that product's listing, warranty document, invoice, or other documentation supplied with the purchase. Please retain your invoice and warranty documents." },
    { type: 'p', text: "A warranty may not cover damage caused by misuse, accidents, water exposure beyond the product's stated rating, overloading, unauthorised modification, incorrect installation, failure to follow care instructions, normal wear and tear, or use of incompatible chargers or components. These exclusions apply only to the extent permitted by applicable law and do not override non-excludable consumer rights." },
    { type: 'p', text: 'To make a warranty claim, contact info@arrowventures.com or +94 77 123 4567 with your order details and a description of the problem. We may request photographs, videos, diagnostic information, or an inspection by an authorised service provider.' }]
  },
  { id: 'not-eligible', heading: 'Items that may not be eligible for change-of-mind returns', blocks: [
    { type: 'p', text: 'Subject to applicable consumer rights, the following may be excluded from change-of-mind returns:' },
    { type: 'ul', items: ['Products made, configured, or ordered specifically for a customer.', 'Products that have been used, installed, modified, or damaged after delivery.', 'Personal protective or hygiene-sensitive products that have been opened or used, where return is not appropriate or legally required.', 'Products or accessories clearly identified as non-returnable before purchase.', 'Gift cards or digital items, if offered.'] },
    { type: 'p', text: 'This section does not prevent a customer from making a valid claim where an item is defective, incorrectly supplied, or otherwise covered by applicable law.' }]
  },
  { id: 'return-shipping', heading: 'Return shipping and collection', blocks: [
    { type: 'p', text: 'For an approved change-of-mind return, the customer is responsible for return shipping or collection costs unless we state otherwise.' },
    { type: 'p', text: 'If the return is due to our error, such as an incorrect item supplied, or an issue for which we are responsible, we will explain how the return or collection costs will be handled.' },
    { type: 'note', text: '**Important – lithium batteries:** Electric-bike batteries and other lithium batteries may be subject to special transport and packaging requirements. Do not send a battery through an ordinary courier service without first obtaining our instructions. We will advise on an appropriate return method where a battery must be returned.' }]
  },
  { id: 'refunds', heading: 'Refund method and processing', blocks: [
    { type: 'p', text: 'Once the returned product has been received and inspected, we will inform you of the outcome.' },
    { type: 'p', text: 'If a refund is approved, it will normally be made to the original payment method where the payment provider supports this. If that is not possible, we will contact you to agree on an appropriate method.' },
    { type: 'p', text: 'Approved refunds will be initiated within **7 business days** after approval. The time taken for the amount to appear in your account may depend on your bank or payment provider.' },
    { type: 'p', text: 'Delivery charges, collection charges, discounts, promotional benefits, and partial refunds will be handled according to the circumstances of the return and applicable law. We will explain any deduction before processing the refund.' }]
  },
  { id: 'exchanges', heading: 'Exchanges', blocks: [
    { type: 'p', text: 'If you want to exchange an item for another model, size, colour, or specification, contact us within **7 days** of delivery.' },
    { type: 'p', text: 'Exchanges are subject to stock availability, product condition, price differences, and any applicable delivery or collection charges. An exchange may not be available for a product that has been used, installed, modified, or specially ordered, unless the exchange is required to resolve a valid product issue.' }]
  },
  { id: 'cancellations', heading: 'Order cancellations', blocks: [
    { type: 'p', text: 'If you need to cancel an order, contact us as soon as possible with your order number. We will try to stop processing or dispatch if the order has not already been prepared or handed to the delivery provider.' },
    { type: 'p', text: 'If the order has already been dispatched, cancellation may need to be handled as a return under this policy. Custom-ordered or specially configured products may have additional cancellation conditions, which will be disclosed before the order is confirmed and applied only as permitted by law.' }]
  },
  { id: 'contact', heading: 'Contact', blocks: [
    { type: 'p', text: 'For return, refund, exchange, or warranty assistance:' },
    { type: 'ul', items: contactList }]
  }]

},
{
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  summary: 'What information we collect, how we use it, and your choices.',
  sections: [
  { id: 'introduction', heading: 'Introduction', blocks: [
    { type: 'p', text: 'Arrow Ventures respects your privacy and is committed to handling your personal information responsibly. This Privacy Policy explains what information we may collect when you visit our website, create an account, place an order, contact us, or otherwise interact with our services.' },
    { type: 'p', text: 'By using our website, you acknowledge that you have read this policy. Where consent is required by applicable law, we will request it separately.' }]
  },
  { id: 'information-we-collect', heading: 'Information we collect', blocks: [
    { type: 'p', text: 'Depending on how you use our website, we may collect the following categories of information:' },
    { type: 'h3', text: 'Information you provide' },
    { type: 'ul', items: ['Name and contact details, such as email address and telephone number.', 'Billing and delivery addresses.', 'Account information, such as login credentials and account preferences.', 'Order details, including products purchased, quantities, delivery instructions, and transaction references.', 'Messages, reviews, enquiries, warranty claims, and customer-support communications.', 'Information you choose to provide when requesting product recommendations or compatibility assistance.'] },
    { type: 'h3', text: 'Payment information' },
    { type: 'p', text: 'Payments are processed by third-party payment service providers (Koko and Mintpay) or by direct bank transfer. We receive payment status, transaction references, and limited payment-related details needed to confirm and manage your order. For bank transfers, we receive the deposit slip and reference you submit so that our team can verify the payment.' },
    { type: 'h3', text: 'Automatically collected information' },
    { type: 'p', text: 'When you use the website, we may collect technical and usage information such as IP address, browser type, device information, pages viewed, approximate visit times, and interactions with website features. Cookies and similar technologies may be used for this purpose.' }]
  },
  { id: 'how-we-use', heading: 'How we use your information', blocks: [
    { type: 'p', text: 'We may use personal information to:' },
    { type: 'ul', items: ['Create and manage customer accounts.', 'Process payments, confirm orders, and arrange delivery.', 'Provide order updates and respond to customer enquiries.', 'Provide after-sales support, returns, repairs, and warranty assistance.', 'Help assess product compatibility when you request assistance.', 'Maintain purchase and service records.', 'Improve website performance, product information, and customer experience.', 'Send marketing messages or promotional offers where permitted and, where required, with your consent.', 'Detect fraud, protect website security, and prevent unauthorised activity.', 'Meet legal, regulatory, accounting, and record-keeping obligations.'] },
    { type: 'p', text: 'You may opt out of promotional communications using the unsubscribe method provided or by contacting us. Service messages relating to an order or account may still be sent where necessary.' }]
  },
  { id: 'sharing', heading: 'Sharing information with third parties', blocks: [
    { type: 'p', text: 'We do not sell your personal information. We may share relevant information with trusted third parties when necessary to operate our business, including:' },
    { type: 'ul', items: ['Payment processors and banks to process transactions.', 'Courier, delivery, and logistics providers to deliver orders.', 'Website hosting, maintenance, analytics, security, and technology providers.', 'Manufacturers, distributors, or authorised service centres where necessary to handle a product enquiry, repair, or warranty claim.', 'Professional advisers, auditors, or insurers where reasonably necessary.', 'Government authorities, regulators, courts, or law-enforcement bodies where disclosure is required or permitted by law.'] },
    { type: 'p', text: 'These parties should receive only the information reasonably needed for their service. Their handling of information may also be governed by their own privacy policies and contractual obligations.' }]
  },
  { id: 'cookies', heading: 'Cookies and similar technologies', blocks: [
    { type: 'p', text: 'Our website may use cookies and similar technologies to:' },
    { type: 'ul', items: ['Keep the website and shopping cart working.', 'Remember preferences and improve navigation.', 'Understand website traffic and usage.', 'Support website security and performance.', 'Measure the effectiveness of promotions, where enabled.'] },
    { type: 'p', text: 'You can manage or disable cookies through your browser settings. Some website features may not work correctly if essential cookies are disabled.' }]
  },
  { id: 'product-viewing', heading: 'Product viewing and website features', blocks: [
    { type: 'p', text: 'Some Arrow Ventures product pages provide interactive product viewing, such as a 3D viewer that allows supported products to be rotated or zoomed. Other products use standard product images or galleries.' },
    { type: 'p', text: 'The 3D viewer runs in your browser and loads model files directly from our media storage. Use of these features may generate technical usage information, such as device and browser details, depending on how the feature is implemented.' }]
  },
  { id: 'security', heading: 'Data security', blocks: [
    { type: 'p', text: 'We use reasonable technical and organisational measures intended to protect personal information against unauthorised access, loss, misuse, alteration, or disclosure.' },
    { type: 'p', text: 'No method of internet transmission or electronic storage is completely secure. While we take reasonable steps to protect information, we cannot guarantee absolute security.' }]
  },
  { id: 'retention', heading: 'How long we retain information', blocks: [
    { type: 'p', text: 'We retain personal information for as long as reasonably necessary for the purposes described in this policy, including order fulfilment, customer support, warranty administration, dispute resolution, security, and legal or accounting obligations.' },
    { type: 'p', text: 'Retention periods may differ depending on the type of information and the reason it was collected. When information is no longer required, we will take reasonable steps to delete it, anonymise it, or securely dispose of it, subject to applicable legal requirements.' }]
  },
  { id: 'rights', heading: 'Your choices and privacy rights', blocks: [
    { type: 'p', text: 'Depending on applicable law, you may have rights to request access to, correction of, deletion of, or restriction of certain personal information, or to object to certain processing.' },
    { type: 'p', text: 'You may also ask us to stop sending promotional communications. To make a privacy request, contact us using the details below. We may need to verify your identity before responding.' }]
  },
  { id: 'children', heading: "Children's privacy", blocks: [
    { type: 'p', text: 'Our website is intended for general customers and is not designed to knowingly collect personal information from children without appropriate authorisation. If you believe a child has provided personal information inappropriately, contact us so that we can review the matter.' }]
  },
  { id: 'third-party', heading: 'Third-party websites and services', blocks: [
    { type: 'p', text: 'Our website may contain links to third-party websites or services, including payment providers, manufacturers, and delivery providers. We are not responsible for the privacy practices of websites or services that we do not operate. Please review their privacy policies before providing information to them.' }]
  },
  { id: 'changes', heading: 'Changes to this Privacy Policy', blocks: [
    { type: 'p', text: 'We may update this policy from time to time to reflect changes in our services, technology, or legal obligations. The updated version will be published on this page with a revised “Last updated” date. Where required, we will provide additional notice or obtain consent.' }]
  },
  { id: 'contact', heading: 'Contact us', blocks: [
    { type: 'p', text: 'For privacy questions or requests:' },
    { type: 'ul', items: contactList }]
  }]

},
{
  slug: 'terms-and-conditions',
  title: 'Terms & Conditions',
  summary: 'The terms that govern use of our website and purchases made through it.',
  sections: [
  { id: 'about', heading: 'About these terms', blocks: [
    { type: 'p', text: 'Welcome to Arrow Ventures. These Terms and Conditions govern access to and use of the Arrow Ventures website and purchases made through it.' },
    { type: 'p', text: 'The website offers electric bicycles, bicycle parts, components, and accessories. By accessing the website or placing an order, you agree to these terms. Please read them carefully before making a purchase.' },
    { type: 'p', text: 'These terms must be read together with our Refund, Return and Exchange Policy and Privacy Policy. Nothing in these terms is intended to exclude or limit a consumer right that cannot legally be excluded or limited.' }]
  },
  { id: 'accounts', heading: 'Eligibility and customer accounts', blocks: [
    { type: 'ul', items: ['You must be legally capable of entering into a binding purchase contract to place an order.', 'If you create an account, you must provide accurate and current information.', 'You are responsible for keeping your password and account credentials confidential.', 'You must notify us promptly if you believe your account has been accessed without permission.', 'You must not use the website for unlawful, fraudulent, or unauthorised purposes.', 'We may suspend or restrict an account where reasonably necessary for security, suspected fraud, misuse, or legal compliance.'] }]
  },
  { id: 'product-information', heading: 'Product information, images, and specifications', blocks: [
    { type: 'p', text: 'We make reasonable efforts to display accurate product descriptions, images, prices, specifications, and availability information.' },
    { type: 'p', text: 'Electric bicycles and their components may have important specifications, including motor power, battery capacity, voltage, range estimates, charging time, maximum load, dimensions, weight, braking system, and compatibility requirements. Customers should read the product listing and supplied documentation carefully before purchasing.' },
    { type: 'p', text: 'Unless expressly stated otherwise:' },
    { type: 'ul', items: ['Images are for product identification and illustration. Colours and appearance may vary slightly because of lighting, photography, display settings, or product revisions.', 'Product specifications may vary by model, production batch, or manufacturer revision.', 'Any stated riding range, charging time, speed, or performance figure is an estimate and may vary with rider weight, terrain, weather, tyre pressure, riding mode, battery condition, maintenance, and other conditions.', 'A stated compatibility list is based on the information available to us. Customers should contact us before purchase if they are unsure whether a component is compatible with their bicycle.'] },
    { type: 'p', text: 'If a product listing contains a material error, we will take reasonable steps to correct it and contact affected customers where appropriate.' }]
  },
  { id: '3d-viewer', heading: '3D product viewer and product media', blocks: [
    { type: 'p', text: 'Some selected products may include an interactive 3D viewer that allows customers to rotate and zoom the product. Other products may be presented through ordinary photographs or image galleries.' },
    { type: 'p', text: "A 3D model, photograph, or other visual representation is provided to help customers understand a product's appearance. It may not show every detail, accessory, colour variation, component revision, or item included in the package. The written product description and the confirmed order details determine what is included in the sale." }]
  },
  { id: 'prices', heading: 'Prices, availability, and promotions', blocks: [
    { type: 'ul', items: ['Product prices and availability are displayed on the relevant product pages and may change.', 'The price applicable to an order is the price shown at checkout when the order is submitted, subject to correction of an obvious pricing or listing error.', 'Delivery charges, taxes, and other applicable charges will be shown or communicated before the order is confirmed, where applicable.', 'Promotions and discounts may be subject to separate eligibility requirements, validity periods, and conditions.', 'If a product becomes unavailable after an order is placed, we will contact the customer to discuss the available options, which may include waiting for stock, selecting an alternative, or receiving a refund where appropriate.'] }]
  },
  { id: 'orders', heading: 'Orders and order acceptance', blocks: [
    { type: 'p', text: 'Placing an order through the website is a request to purchase the selected products. An automated order acknowledgement confirms that we have received the order; it does not necessarily mean that the order has been accepted.' },
    { type: 'p', text: 'We may contact you to verify order details, delivery information, payment status, or product availability. We reserve the right to decline or cancel an order where reasonably necessary, including where:' },
    { type: 'ul', items: ['A product is unavailable.', 'A material pricing, description, or listing error has occurred.', 'Payment is not authorised or cannot be verified.', 'Delivery cannot reasonably be arranged for the supplied address.', 'We suspect fraud, unauthorised activity, or misuse of the website.'] },
    { type: 'p', text: 'If payment has already been collected for an order that we cancel, we will arrange an appropriate refund.' }]
  },
  { id: 'payments', heading: 'Payments', blocks: [
    { type: 'p', text: 'Available payment methods (Koko, Mintpay and direct bank transfer) are displayed at checkout. By submitting payment details, you confirm that you are authorised to use the selected payment method.' },
    { type: 'p', text: 'Payments may be processed by third-party payment providers. Their terms and privacy practices may also apply. An order may not be dispatched until the required payment has been successfully confirmed, unless another arrangement has been expressly agreed.' }]
  },
  { id: 'delivery', heading: 'Delivery and collection', blocks: [
    { type: 'p', text: 'We will make reasonable efforts to deliver orders to the address provided at checkout or to arrange collection where that option is offered.' },
    { type: 'ul', items: ['Delivery areas, fees, estimated delivery periods, and available methods will be shown or communicated before the order is confirmed.', 'Delivery dates and times are estimates unless expressly confirmed as guaranteed.', 'Delivery may be affected by stock availability, courier operations, weather, public holidays, remote locations, or other circumstances beyond our reasonable control.', 'Customers are responsible for providing a complete and accurate delivery address and a reachable contact number.', 'Certain electric bicycles, batteries, or bulky items may require special delivery arrangements.', 'The customer or an authorised recipient may be required to be present to receive and inspect the delivery.'] },
    { type: 'p', text: 'If a delivery is delayed or an item appears to be missing or damaged, contact us using the details on our website.' }]
  },
  { id: 'safety', heading: 'Electric bicycle safety and responsible use', blocks: [
    { type: 'p', text: 'Electric bicycles are vehicles with mechanical and electrical systems. Safe use, inspection, charging, and maintenance are important.' },
    { type: 'p', text: 'Customers are responsible for:' },
    { type: 'ul', items: ["Reading and following the manufacturer's user manual, warnings, and maintenance instructions.", 'Using the bicycle only for its intended purpose and within the stated load, terrain, and operating limits.', 'Checking brakes, tyres, lights, steering, fasteners, and other safety-critical components before riding.', 'Wearing appropriate protective equipment, including a suitable helmet.', 'Following applicable road traffic, vehicle, helmet, age, and other safety requirements in the place where the bicycle is used.', 'Ensuring that the bicycle is correctly assembled and adjusted before riding. Where the customer is not competent to assemble or inspect it, professional assistance should be obtained.', 'Using only compatible chargers, batteries, and components approved or specified for the relevant model.'] },
    { type: 'p', text: 'Do not ride an electric bicycle if you suspect a fault affecting the brakes, frame, steering, wheels, motor, battery, charger, or electrical system. Arrange an inspection or repair before using it again.' }]
  },
  { id: 'battery-safety', heading: 'Battery and charging safety', blocks: [
    { type: 'p', text: 'Lithium-ion batteries require appropriate handling and care. Customers must follow the instructions supplied with the battery and bicycle. In particular:' },
    { type: 'ul', items: ['Use only the charger specified or approved for the battery.', 'Do not use a battery or charger that is visibly damaged, swollen, leaking, unusually hot, or producing an unusual smell.', 'Do not open, puncture, crush, modify, or attempt an unauthorised repair of a battery.', "Keep batteries and chargers away from excessive heat, open flames, and conditions prohibited by the manufacturer's instructions.", "Charge and store batteries in accordance with the manufacturer's guidance.", 'Keep batteries away from children and protect terminals from short circuits.', 'Do not dispose of batteries in ordinary household waste where separate battery disposal is required.'] },
    { type: 'p', text: 'If a battery shows signs of damage or abnormal behaviour, stop using and charging it and seek appropriate professional advice. Contact us for product-related support. Battery transport and return arrangements may be subject to special requirements.' }]
  },
  { id: 'maintenance', heading: 'Installation, maintenance, and modifications', blocks: [
    { type: 'p', text: 'Some parts and accessories require specialist tools, technical knowledge, or professional installation. Customers are responsible for ensuring that parts are installed correctly and safely.' },
    { type: 'p', text: 'Unauthorised modifications, incorrect installation, incompatible components, or failure to maintain a bicycle may create safety risks and may affect applicable warranty coverage. This does not remove rights relating to a product defect or any rights that cannot legally be excluded.' },
    { type: 'p', text: "Before making electrical or structural modifications, customers should check the manufacturer's instructions and obtain qualified assistance where necessary." }]
  },
  { id: 'compatibility', heading: 'Compatibility of parts and accessories', blocks: [
    { type: 'p', text: 'Customers should check the specifications and compatibility information for parts and accessories before ordering. Relevant details may include model, frame size, wheel size, brake type, axle standard, connector, voltage, battery system, and mounting dimensions.' },
    { type: 'p', text: "If you are unsure, contact Arrow Ventures with your bicycle's make, model, year, and relevant component details before purchasing. We may be unable to guarantee compatibility where the customer has not supplied sufficient or accurate information." }]
  },
  { id: 'returns', heading: 'Returns, refunds, and warranty', blocks: [
    { type: 'p', text: 'Returns, exchanges, refunds, and warranty claims are handled under our **Refund, Return and Exchange Policy**, which forms part of these Terms and Conditions.' },
    { type: 'p', text: 'Warranty coverage may differ between bicycles, batteries, motors, chargers, parts, and accessories. The applicable product listing or warranty document will provide the relevant details. Customers should retain proof of purchase and warranty documents.' }]
  },
  { id: 'ip', heading: 'Intellectual property', blocks: [
    { type: 'p', text: 'Unless otherwise stated, the website and its content—including text, graphics, logos, product photography, page designs, and other materials—are owned by Arrow Ventures or used with permission from the relevant rights holder.' },
    { type: 'p', text: 'You may use the website for personal, lawful shopping and browsing. You must not copy, reproduce, distribute, modify, publish, or commercially exploit website content without prior written permission, except where permitted by law.' },
    { type: 'p', text: 'Product names, logos, and trademarks belonging to manufacturers or other third parties remain the property of their respective owners.' }]
  },
  { id: 'availability', heading: 'Website availability and acceptable use', blocks: [
    { type: 'p', text: 'We aim to keep the website available and functioning correctly, but we do not guarantee uninterrupted or error-free access. We may update, suspend, or temporarily restrict parts of the website for maintenance, security, or operational reasons.' },
    { type: 'p', text: "You must not attempt to interfere with the website, bypass security measures, introduce malicious code, scrape or harvest information without permission, or use the website in a way that may damage its operation or other users' access." }]
  },
  { id: 'liability', heading: 'Limitation of liability', blocks: [
    { type: 'p', text: "To the extent permitted by applicable law, Arrow Ventures will not be responsible for losses that are not reasonably foreseeable or that arise from a customer's misuse of a product, failure to follow manufacturer instructions, unauthorised modification, incorrect installation, or use of incompatible components." },
    { type: 'p', text: 'Nothing in these terms excludes or limits liability where doing so would be unlawful, including any non-excludable consumer rights, statutory guarantees, or liability that cannot legally be limited.' },
    { type: 'p', text: 'Where liability may lawfully be limited, the extent of that limitation will be determined in accordance with applicable law and the circumstances of the claim.' }]
  },
  { id: 'indemnity', heading: 'Indemnity', blocks: [
    { type: 'p', text: 'To the extent permitted by law, you agree not to misuse the website or infringe the rights of others. You may be responsible for losses reasonably arising from your unlawful use of the website, fraud, or deliberate misuse. This clause does not apply to the extent that a loss was caused by Arrow Ventures or where the law does not permit such responsibility to be imposed on you.' }]
  },
  { id: 'changes', heading: 'Changes to these terms', blocks: [
    { type: 'p', text: 'We may update these Terms and Conditions from time to time. The revised version will be published on this page with an updated date. Changes will not retrospectively remove rights relating to an order already placed where doing so would be unlawful.' }]
  },
  { id: 'governing-law', heading: 'Governing law and disputes', blocks: [
    { type: 'p', text: 'These Terms and Conditions are governed by the laws of **Sri Lanka**, subject to any mandatory consumer-protection laws that apply.' },
    { type: 'p', text: 'If you have a concern about an order or product, please contact us first so that we can try to resolve it. This does not prevent you from exercising any legal rights or using any available dispute-resolution process.' }]
  },
  { id: 'contact', heading: 'Contact details', blocks: [
    { type: 'p', text: 'For questions about these Terms and Conditions:' },
    { type: 'ul', items: contactList }]
  }]

}];