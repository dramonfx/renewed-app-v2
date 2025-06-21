
'use client';

import SingleSectionPlayer from '@/components/SingleSectionPlayer';

export default function SectionPageClient({ section, visuals, visualsMap, params }) {
  return (
    <SingleSectionPlayer 
      section={section}
      visuals={visuals}
      visualsMap={visualsMap}
      params={params}
    />
  );
}
