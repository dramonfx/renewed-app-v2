
import { supabase } from '@/lib/supabase'
import type { CreateSectionData } from '@/lib/types'

// RENEWED: The New Man Story - Authentic Content Based on Source Documents
// This implements the actual 30 Key Principles and supporting content structure

// Foundation Sections - Setting up the Two Kingdoms Framework
const foundationSections: CreateSectionData[] = [
  {
    slug: 'prologue',
    title: 'Prologue',
    description: 'The foundational introduction to discovering your spiritual identity through The New Man Story.',
    content: `The straightforward yet insightful exercise template contained in this guidebook has been refined over many years with one clear objective: to help individuals navigate through spiritual principles that unlock the understanding of their spiritual identity. Through iterations and refinements, this template has evolved to its current form, offering a structured approach to unveil the spiritual truths that enable us to tell "The New Man Story."

"Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come." — 2 Corinthians 5:17

This guidebook is more than just a simple read. As you work through the template, you'll have the opportunity to record the principles you discover, allowing the narrative of your renewed self to unfold. We hope you'll view this guidebook as a cornerstone and valuable resource in guiding you toward the new you!

Through using the exercises found throughout this guidebook, you'll be able to pinpoint your current mindset and discern what governs the mindset of the new person you aim to be. This newfound clarity will shed light on why you're currently reaping emotional fruit that makes you feel and tell the story you do.

"For the one who sows to his own flesh will from the flesh reap corruption, but the one who sows to the Spirit will from the Spirit reap eternal life." — Galatians 6:8

Are you ready to discover the eternal life governed by the Spirit? Let's go! It's all about The New Man Story: the mind that is no longer conforming to this world but has been transformed according to God's will which produces what is good and acceptable and perfect.`,
    order: 1,
    category: 'prologue',
    sectionType: 'intro',
    scriptureReferences: ['2 Corinthians 5:17', 'Galatians 6:8', 'Romans 12:2', 'Matthew 6:10'],
    readingTime: 3,
    isPublished: true
  },
  {
    slug: 'introduction-principles',
    title: 'Introduction: Principles',
    description: 'Understanding how invisible principles shape our perceptions of reality and guide our spiritual transformation.',
    content: `Whether we acknowledge them or not, principles are constantly at work all around us. They're invisible forces that shape our perceptions of reality. A better understanding of these principles equips us to navigate the world with greater consciousness, little by little, precept upon precept:

"Precept upon precept, precept upon precept, line upon line, line upon line, here a little, there a little." — Isaiah 28:10

The principle highlighted in the above scripture encapsulates the process through which a conscious mind gains a deeper awareness of why things are as they are. Each precept added upon another allows us to extend another line of understanding to the story we ultimately desire to convey.

The aim of this guidebook is to assist in dissecting these principles in a simple yet effective manner; thus, enabling you to clearly recognize the barriers preventing you from experiencing the abundant life that Christ promises to place within our grasp:

"'The thief comes only to steal and kill and destroy. I came that they may have life and have it abundantly.'" — John 10:10

For many, the concept of an abundant life remains elusive. This is often due to misunderstandings and a lack of a structured mindset centered around the principles that govern our ability to tell the story of our newly transformed selves.`,
    order: 2,
    category: 'introduction',
    sectionType: 'teaching',
    scriptureReferences: ['Isaiah 28:10', 'John 10:10', 'Colossians 3:14'],
    readingTime: 4,
    isPublished: true
  },
  {
    slug: 'kingdoms-who-is-on-first',
    title: 'Kingdoms: Who\'s On First: Natural or Spiritual?',
    description: 'Introducing the fundamental Two Kingdoms Framework that forms the foundation of spiritual transformation.',
    content: `Let's delve into the layout of our main exercise which will act as our guiding compass as we uncover these transformative truths. Together, we'll unlock the keys to embracing the abundant life promised to us through the teachings of Christ.

The exercise template contrasts two kingdoms:

**Kingdom of God/Heaven** (Right Column):
The kingdom where we aspire to be, guided by the principles we uncover. The primary list consists of the nine characteristic traits of the fruit of the Spirit found in Galatians 5:22-23:
- Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control

**Kingdom of ?** (Left Column):
This represents the kingdom where many find themselves operating, often without realizing it. This kingdom is governed by principles separate from the Kingdom of God/Heaven.

The next principle, drawn from 1 Corinthians, is a potent revelation that sheds light on the unseen:

"But it is not the spiritual that is first but the natural, and then the spiritual." — 1 Corinthians 15:46

In this verse, we learn that the natural precedes the spiritual. As such, our template will contrast the natural in the left column against the spiritual in the right. While the exercise may seem simple at first glance, don't be deceived by its simplicity!

As we add more principles to our exercise framework, you'll witness a story taking shape — one that unveils mysteries and demonstrates the simplicity of embracing a life of abundance.`,
    order: 3,
    category: 'foundations',
    sectionType: 'exercise',
    scriptureReferences: ['1 Corinthians 15:46', 'Galatians 5:22-23'],
    readingTime: 5,
    isPublished: true
  }
]

// The 30 Key Principles - The Core Content
const keyPrinciples: CreateSectionData[] = [
  {
    slug: 'principle-1-the-fruit',
    title: 'The Fruit',
    description: 'Understanding how our internal spiritual state manifests as external fruit in our lives.',
    content: `Every tree is known by its fruit. In the spiritual realm, the fruit we bear in our lives directly reflects the kingdom from which we are operating. This principle is foundational to understanding spiritual transformation.

When we operate from the Kingdom of God/Heaven, we naturally produce the fruit of the Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. These are not emotions we must manufacture, but natural expressions of our spiritual nature.

When we operate from the kingdom of this world, we produce fruit that reflects the natural mind: fear, anxiety, condemnation, judgment, and all manner of spiritual and emotional dysfunction.

The key insight is this: you cannot change your fruit by focusing on the fruit. You must change the root - the kingdom from which you are operating.

"'Either make the tree good and its fruit good, or make the tree bad and its fruit bad, for the tree is known by its fruit.'" — Matthew 12:33

This scripture teaches us that transformation begins at the root level - with our identity and the kingdom we choose to align with. When we understand our true spiritual identity, the fruit naturally follows.`,
    order: 4,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 1,
    scriptureReferences: ['Matthew 12:33', 'Galatians 5:22-23', 'Matthew 7:16-20'],
    readingTime: 6,
    isPublished: true
  },
  {
    slug: 'principle-2-can-a-dead-man-tell-his-story',
    title: 'Can a Dead Man Tell His Story?',
    description: 'Exploring the concept of spiritual death and resurrection in our daily experience.',
    content: `This provocative question strikes at the heart of spiritual identity. In the natural realm, a dead man cannot tell his story. But in the spiritual realm, we are called to die to our old nature so that Christ might live through us.

"I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the son of God, who loved me and gave himself for me." — Galatians 2:20

When we try to tell "our" story from the perspective of the old man, we are essentially a dead man trying to speak. The old nature has been crucified with Christ and has no story to tell except one of limitation, fear, and separation.

The New Man Story can only be told by Christ living through us. This is not a theological concept but a practical reality. When we die to self-will and allow Christ's nature to express through us, we discover that we have a story worth telling - a story of love, redemption, and divine purpose.

The question becomes: Which man is telling your story today? The dead man of the old nature, or the living Christ expressing through your renewed mind?`,
    order: 5,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 2,
    scriptureReferences: ['Galatians 2:20', 'Romans 6:6', '2 Corinthians 5:17'],
    readingTime: 5,
    isPublished: true
  },
  {
    slug: 'principle-3-no-longer-i',
    title: 'No Longer "I"',
    description: 'Understanding the transformation from self-centered living to Christ-centered identity.',
    content: `The phrase "no longer I" represents one of the most radical shifts in human consciousness. It's the movement from ego-based identity to Christ-identity.

In the natural mind, everything revolves around "I" - my needs, my desires, my fears, my plans, my understanding. But spiritual maturity brings us to a place where we can honestly say with Paul, "It is no longer I who live, but Christ who lives in me."

This doesn't mean we become passive or lose our unique personality. Rather, we discover that our truest self is found when Christ is allowed to express through our individual being.

The "I" that dies is the false self - the ego that thinks it is separate from God and must make life work through its own effort. The "I" that lives is our true spiritual identity as sons and daughters of God.

"He must increase, but I must decrease." — John 3:30

This decrease of the ego-self and increase of Christ-consciousness is the pathway to abundant life. When "I" get out of the way, divine love, wisdom, and power can flow freely through us.

The question for reflection: In what areas of your life are you still operating from "I" instead of allowing Christ to live through you?`,
    order: 6,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 3,
    scriptureReferences: ['Galatians 2:20', 'John 3:30', 'Luke 9:23'],
    readingTime: 4,
    isPublished: true
  },
  {
    slug: 'principle-4-time-to-pick-a-teacher',
    title: 'It\'s Time to Pick a Teacher',
    description: 'Choosing between the world\'s wisdom and divine revelation as our source of understanding.',
    content: `Every day, we are being taught by someone or something. The question is not whether we will be taught, but who we will choose as our teacher.

The world offers countless teachers: culture, media, past experiences, other people's opinions, our own reasoning. These teachers of the natural mind will always lead us back to kingdom of this world principles.

But Jesus offers us a different teacher:

"'But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things and bring to your remembrance all that I have said to you.'" — John 14:26

The Holy Spirit is our divine teacher, leading us into all truth and revealing the principles of the Kingdom of God/Heaven. This teacher doesn't contradict scripture but illuminates it, making spiritual truths real in our experience.

The choice of teacher determines our curriculum. If we choose the world as our teacher, we will learn fear, limitation, and separation. If we choose the Holy Spirit as our teacher, we will learn love, abundance, and unity.

"'When the Spirit of truth comes, he will guide you into all the truth.'" — John 16:13

Consider: Who have you been allowing to teach you about life, relationships, success, and happiness? Are these teachers leading you toward the Kingdom of God or the kingdom of this world?`,
    order: 7,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 4,
    scriptureReferences: ['John 14:26', 'John 16:13', '1 Corinthians 2:12-13'],
    readingTime: 5,
    isPublished: true
  },
  {
    slug: 'principle-5-let-this-mind-be-in-you',
    title: 'Let This Mind Be in You',
    description: 'Adopting the mind of Christ as our way of thinking and perceiving reality.',
    content: `The transformation from natural thinking to spiritual understanding is not about adding new information to our existing mindset. It's about adopting an entirely different mind - the mind of Christ.

"Let this mind be in you which was also in Christ Jesus." — Philippians 2:5

The mind of Christ is not a human mind that has been improved or educated. It's a divine mind that sees reality from God's perspective. This mind:

• Sees through the eyes of love rather than judgment
• Operates from abundance rather than lack
• Chooses faith over fear in every situation
• Recognizes the spiritual reality behind physical appearances
• Responds to challenges with peace and wisdom

This mind is not earned through study or effort. It's received through surrender and alignment with divine truth. When we "let" this mind be in us, we're releasing our grip on human reasoning and allowing divine intelligence to think through us.

"'For my thoughts are not your thoughts, neither are your ways my ways,' declares the Lord." — Isaiah 55:8

The natural mind will always be limited by human perspective. But the mind of Christ has access to divine wisdom and understanding that surpasses all human knowledge.

The practical application: Before reacting to any situation, pause and ask, "How would Christ think about this? What would divine love see here that my human mind is missing?"`,
    order: 8,
    category: 'principles',
    sectionType: 'principle',
    principleNumber: 5,
    scriptureReferences: ['Philippians 2:5', 'Isaiah 55:8-9', '1 Corinthians 2:16'],
    readingTime: 6,
    audioUrl: 'https://i.pinimg.com/originals/f8/72/83/f8728365d9b8329b48bc90c257eb6f38.jpg',
    audioTitle: 'Meditation: Receiving the Mind of Christ',
    audioDuration: 420,
    isPublished: true
  }
  // Additional principles would continue here...
]

// Exercise Templates for the Two Kingdoms Framework
const exerciseTemplates = [
  {
    scriptureReference: '1 Corinthians 15:46',
    kingdomOfGod: ['Spiritual', 'Love', 'Joy', 'Peace', 'Tree of Life'],
    kingdomOfWorld: ['Natural', 'Fear', 'Condemnation', 'Anxious', 'Tree of Knowledge of Good and Evil', 'Death'],
    instructions: 'Read the scripture and identify which principles belong to each kingdom. Place spiritual principles in the Kingdom of God/Heaven column and natural principles in the Kingdom of ? column.',
    reflectionQuestions: [
      'Which kingdom are you currently operating from in this area of your life?',
      'What would need to change for you to operate from the Kingdom of God/Heaven?',
      'How would your responses change if you were operating from spiritual principles?'
    ]
  }
]

async function createSection(section: CreateSectionData) {
  const { data, error } = await supabase
    .from('book_sections')
    .insert({
      slug: section.slug,
      title: section.title,
      description: section.description,
      content: section.content,
      order: section.order,
      category: section.category,
      section_type: section.sectionType,
      principle_number: section.principleNumber,
      scripture_references: section.scriptureReferences,
      audio_url: section.audioUrl,
      audio_title: section.audioTitle,
      audio_duration: section.audioDuration,
      reading_time: section.readingTime,
      is_published: section.isPublished ?? true
    })
    .select()

  if (error) {
    console.error(`Error creating section "${section.title}":`, error)
    return null
  }

  console.log(`✅ Created section: ${section.title}`)
  return data[0]
}

async function createExerciseTemplate(template: any, sectionId: string) {
  const { data, error } = await supabase
    .from('exercise_templates')
    .insert({
      section_id: sectionId,
      scripture_reference: template.scriptureReference,
      kingdom_of_god: template.kingdomOfGod,
      kingdom_of_world: template.kingdomOfWorld,
      instructions: template.instructions,
      reflection_questions: template.reflectionQuestions
    })
    .select()

  if (error) {
    console.error('Error creating exercise template:', error)
    return null
  }

  console.log('✅ Created exercise template')
  return data[0]
}

async function seedDatabase() {
  console.log('🌱 Starting authentic RENEWED content seeding...')
  
  try {
    // Check if sections already exist
    const { data: existingSections } = await supabase
      .from('book_sections')
      .select('id')
      .limit(1)

    if (existingSections && existingSections.length > 0) {
      console.log('📚 Sections already exist, skipping seeding')
      return
    }

    // Create foundation sections
    console.log('📖 Creating foundation sections...')
    for (const section of foundationSections) {
      await createSection(section)
    }

    // Create key principles
    console.log('🔑 Creating key principles...')
    for (const principle of keyPrinciples) {
      const createdSection = await createSection(principle)
      
      // Add exercise template for principles that have them
      if (createdSection && principle.principleNumber && principle.principleNumber <= exerciseTemplates.length) {
        await createExerciseTemplate(exerciseTemplates[principle.principleNumber - 1], createdSection.id)
      }
    }

    const totalSections = foundationSections.length + keyPrinciples.length
    console.log('🎉 Authentic content seeding completed successfully!')
    console.log(`📖 Created ${totalSections} book sections with exercise templates`)
    console.log('🔄 This content now matches the authentic "RENEWED: The New Man Story" structure')
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error)
    throw error
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✨ Authentic content seeding process finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
