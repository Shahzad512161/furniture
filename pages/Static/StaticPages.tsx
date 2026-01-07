
import React from 'react';

// Fix: Made children optional to resolve TypeScript "missing property" errors in JSX usage
const StaticWrapper = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
    <h1 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white">{title}</h1>
    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
      {children}
    </div>
  </div>
);

export const About = () => (
  <StaticWrapper title="About Oak & Iron">
    <p>Established in the heart of London, Oak & Iron Furniture began with a simple mission: to bring the timeless beauty of artisanal wooden furniture to every British home.</p>
    <p>Our journey started in a small workshop where we focused on sourcing the finest sustainable hardwoods. Today, we collaborate with master craftsmen to design pieces that are not just furniture, but heirlooms.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
      <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
        <p>To be the UK's most trusted provider of premium wooden furniture, known for exceptional quality and uncompromising comfort.</p>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Our Commitment</h3>
        <p>We believe in transparent pricing, local UK expertise, and the convenience of Cash on Delivery to ensure total customer peace of mind.</p>
      </div>
    </div>
  </StaticWrapper>
);

export const Terms = () => (
  <StaticWrapper title="Terms & Conditions">
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
      <p>By accessing and using Oak & Iron Furniture, you agree to comply with and be bound by these Terms and Conditions. Our services are exclusively available to residents of the United Kingdom.</p>
    </section>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Orders and Payment</h3>
      <p>We currently operate solely on a Cash on Delivery (COD) basis. No online payments are processed. Payment must be made in full to the delivery personnel upon arrival of the goods.</p>
    </section>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Product Descriptions</h3>
      <p>While we strive for accuracy, natural wood variations mean that specific grain patterns and colors may vary slightly from the images shown on our website.</p>
    </section>
  </StaticWrapper>
);

export const Privacy = () => (
  <StaticWrapper title="Privacy Policy">
    <p>Your privacy is paramount to us. This policy outlines how we collect, use, and protect your personal information.</p>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Information We Collect</h3>
      <ul className="list-disc pl-5">
        <li>Contact information (Name, Phone, Email)</li>
        <li>Delivery details (Full UK Address)</li>
        <li>Browsing behavior on our platform</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">How We Use It</h3>
      <p>We use your data strictly for order processing, delivery coordination, and improving our customer experience. We never sell your personal data to third parties.</p>
    </section>
  </StaticWrapper>
);

export const ReturnPolicy = () => (
  <StaticWrapper title="Return Policy">
    <p>We want you to love your furniture. If you are not completely satisfied, here is how we can help.</p>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inspection at Delivery</h3>
      <p>Since we offer Cash on Delivery, we encourage all customers to inspect their furniture thoroughly upon arrival. If the item is damaged or not as described, you can refuse the delivery immediately at no cost.</p>
    </section>
    <section>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Post-Delivery Returns</h3>
      <p>Items can be returned within 14 days of delivery provided they are in their original condition. Return shipping costs may apply. Custom-made pieces or mattresses are generally non-returnable unless defective.</p>
    </section>
  </StaticWrapper>
);
