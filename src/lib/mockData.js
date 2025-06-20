// src/lib/mockData.js

// Mock data for development when Supabase is not available
export const mockSections = {
  '00_prologue': { id: 1, slug: '00_prologue', title: 'Prologue', description: 'Introduction to the book', audio_file_path: '00_prologue/audio.mp3', text_file_path: '00_prologue/text.md', order: 0 },
  '01_intro_through_next_steps': { id: 2, slug: '01_intro_through_next_steps', title: 'Introduction Through Next Steps', description: 'Comprehensive introduction and next steps', audio_file_path: '01_intro_through_next_steps/audio.mp3', text_file_path: '01_intro_through_next_steps/text.md', order: 1 },
  '02_kingdom_government': { id: 3, slug: '02_kingdom_government', title: 'Kingdom Government', description: 'Understanding kingdom government principles', audio_file_path: '02_kingdom_government/audio.mp3', text_file_path: '02_kingdom_government/text.md', order: 2 },
  '03_elephant_in_the_kingdom': { id: 4, slug: '03_elephant_in_the_kingdom', title: 'Elephant in the Kingdom', description: 'Addressing the unspoken challenges', audio_file_path: '03_elephant_in_the_kingdom/audio.mp3', text_file_path: '03_elephant_in_the_kingdom/text.md', order: 3 },
  '04_characteristics_of_principles': { id: 5, slug: '04_characteristics_of_principles', title: 'Characteristics of Principles', description: 'The nature of governing principles', audio_file_path: '04_characteristics_of_principles/audio.mp3', text_file_path: '04_characteristics_of_principles/text.md', order: 4 },
  '05_approved': { id: 6, slug: '05_approved', title: 'Approved', description: 'Validation of the principles', audio_file_path: '05_approved/audio.mp3', text_file_path: '05_approved/text.md', order: 5 },
  '06_key_principles_01-10': { id: 7, slug: '06_key_principles_01-10', title: '30 Key Principles (01–10)', description: 'Essential principles for understanding', audio_file_path: '06_key_principles_01-10/audio.mp3', text_file_path: '06_key_principles_01-10/text.md', order: 6 },
  '06_key_principles_11-20': { id: 8, slug: '06_key_principles_11-20', title: '30 Key Principles (11–20)', description: 'Advanced principles for deeper understanding', audio_file_path: '06_key_principles_11-20/audio.mp3', text_file_path: '06_key_principles_11-20/text.md', order: 7 },
  '06_key_principles_21-30': { id: 9, slug: '06_key_principles_21-30', title: '30 Key Principles (21–30)', description: 'Master-level principles for complete understanding', audio_file_path: '06_key_principles_21-30/audio.mp3', text_file_path: '06_key_principles_21-30/text.md', order: 8 },
  '07_conclusion': { id: 10, slug: '07_conclusion', title: 'Conclusion', description: 'Final thoughts and conclusions', audio_file_path: '07_conclusion/audio.mp3', text_file_path: '07_conclusion/text.md', order: 9 }
};

export const mockMarkdownContent = {
  '00_prologue/text.md': `# Prologue\n\nThis is the mock content for the prologue.`,
  '01_intro_through_next_steps/text.md': `# Introduction\n\nThis is the mock content for the introduction.`,
  '02_kingdom_government/text.md': `# Kingdom Government\n\nThis is the mock content for kingdom government.`,
  '03_elephant_in_the_kingdom/text.md': `# Elephant in the Kingdom\n\nThis is the mock content for the elephant in the kingdom.`,
  '04_characteristics_of_principles/text.md': `# Characteristics of Principles\n\nThis is the mock content for characteristics of principles.`,
  '05_approved/text.md': `# Approved\n\nThis is the mock content for the approved section.`,
  '06_key_principles_01-10/text.md': `# Key Principles 1-10\n\nThis is the mock content for key principles 1-10.`,
  '06_key_principles_11-20/text.md': `# Key Principles 11-20\n\nThis is the mock content for key principles 11-20.`,
  '06_key_principles_21-30/text.md': `# Key Principles 21-30\n\nThis is the mock content for key principles 21-30.`,
  '07_conclusion/text.md': `# Conclusion\n\nThis is the mock content for the conclusion.`
};

// THIS IS THE NEW, MISSING PART
export const mockVisuals = {
  // Visuals for section_id 2 ('01_intro_through_next_steps')
  '2': [
    { id: 101, section_id: 2, file_path: '01_intro_through_next_steps/visuals/base_chart.png', caption: 'Mind Transformation Chart', display_order: 1, markdown_tag: '![MTC]' }
  ],
  // Visuals for section_id 3 ('02_kingdom_government')
  '3': [
    { id: 102, section_id: 3, file_path: '02_kingdom_government/visuals/some_visual.png', caption: 'A visual for Kingdom Government', display_order: 1, markdown_tag: '![KG_VISUAL]' }
  ],
  // Add other visuals here, keyed by section_id.
  // If a section has no visuals, it doesn't need an entry.
};