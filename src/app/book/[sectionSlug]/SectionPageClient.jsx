'use client';

import ImmersiveSectionPlayer from '@/components/ImmersiveSectionPlayer';

export default function SectionPageClient({ section, visuals, visualsMap, params }) {
  return (
    <ImmersiveSectionPlayer
      section={section}
      visuals={visuals}
      visualsMap={visualsMap}
      params={params}
    />
  );
}
