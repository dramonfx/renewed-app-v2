// src/app/book/[sectionSlug]/page.js
import SectionPageClient from './SectionPageClient';

export default function SectionPage({ params }) {
  const { sectionSlug } = params;
  
  return <SectionPageClient sectionSlug={sectionSlug} />;
}
