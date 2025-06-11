// Mock data for development when Supabase is not available
export const mockSections = {
  '00_prologue': {
    id: 1,
    slug: '00_prologue',
    title: 'Prologue',
    description: 'Introduction to the book',
    audio_file_path: null,
    text_file_path: 'prologue.md',
    display_order: 0
  },
  '01_intro_through_next_steps': {
    id: 2,
    slug: '01_intro_through_next_steps',
    title: 'Introduction Through Next Steps',
    description: 'Comprehensive introduction and next steps',
    audio_file_path: null,
    text_file_path: 'intro_next_steps.md',
    display_order: 1
  },
  '02_kingdom_government': {
    id: 3,
    slug: '02_kingdom_government',
    title: 'Kingdom Government',
    description: 'Understanding kingdom government principles',
    audio_file_path: null,
    text_file_path: 'kingdom_government.md',
    display_order: 2
  },
  '06_key_principles_01-10': {
    id: 4,
    slug: '06_key_principles_01-10',
    title: 'Key Principles 01-10',
    description: 'Essential principles for understanding',
    audio_file_path: null,
    text_file_path: 'key_principles.md',
    display_order: 6
  },
  '07_conclusion': {
    id: 5,
    slug: '07_conclusion',
    title: 'Conclusion',
    description: 'Final thoughts and conclusions',
    audio_file_path: null,
    text_file_path: 'conclusion.md',
    display_order: 7
  }
};

export const mockMarkdownContent = {
  'prologue.md': `# Prologue

Welcome to this comprehensive guide. This is a simple page with minimal content to test the basic functionality.

## Overview

This prologue serves as an introduction to the concepts that will be explored throughout this book.

### Key Points

- Introduction to core concepts
- Setting the foundation
- Preparing for the journey ahead

This content loads quickly and efficiently.`,

  'intro_next_steps.md': `# Introduction Through Next Steps

This is a content-heavy section designed to test the application's performance with larger amounts of text and data.

## Comprehensive Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Section 1: Foundation Concepts

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

#### Subsection 1.1: Core Principles

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

#### Subsection 1.2: Advanced Applications

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

### Section 2: Implementation Strategies

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

#### Subsection 2.1: Planning Phase

Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

#### Subsection 2.2: Execution Phase

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

### Section 3: Next Steps and Future Considerations

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

#### Subsection 3.1: Immediate Actions

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Subsection 3.2: Long-term Planning

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Conclusion

This comprehensive section demonstrates how the application handles larger amounts of content. The performance characteristics should be monitored to ensure optimal user experience.`,

  'kingdom_government.md': `# Kingdom Government

This section explores the principles and practices of kingdom government, representing another content-heavy page for testing application performance.

## Understanding Kingdom Principles

The concept of kingdom government encompasses a comprehensive framework for understanding authority, responsibility, and governance structures that transcend traditional political boundaries.

### Historical Context

Throughout history, various forms of government have emerged, each with their own strengths and weaknesses. Kingdom government represents a unique approach that combines elements of:

- **Divine Authority**: Recognition of higher principles
- **Servant Leadership**: Leaders who serve rather than dominate
- **Community Focus**: Emphasis on collective well-being
- **Justice and Mercy**: Balanced approach to governance

#### Ancient Examples

Many ancient civilizations demonstrated aspects of kingdom government:

1. **Mesopotamian Kingdoms**: Early examples of centralized authority with divine mandate
2. **Egyptian Pharaohs**: Integration of spiritual and temporal power
3. **Hebrew Kingdom**: Theocratic elements with prophetic accountability
4. **Persian Empire**: Administrative efficiency with cultural tolerance

#### Medieval Developments

The medieval period saw the evolution of kingdom concepts:

- **Feudal Systems**: Hierarchical structures with mutual obligations
- **Divine Right**: Theological justification for royal authority
- **Magna Carta**: Limitations on absolute power
- **Scholastic Thought**: Integration of philosophy and governance

### Modern Applications

Contemporary understanding of kingdom government principles can be applied in various contexts:

#### Organizational Leadership

Modern organizations can benefit from kingdom government principles:

- **Servant Leadership Models**: Leaders who prioritize team development
- **Ethical Decision Making**: Decisions based on moral principles
- **Stakeholder Consideration**: Balancing multiple interests
- **Long-term Thinking**: Sustainable practices over short-term gains

#### Community Development

Communities can implement kingdom principles through:

- **Participatory Governance**: Inclusive decision-making processes
- **Social Justice Initiatives**: Addressing inequality and injustice
- **Environmental Stewardship**: Responsible resource management
- **Cultural Preservation**: Maintaining heritage while embracing progress

### Implementation Challenges

Implementing kingdom government principles faces several challenges:

#### Structural Obstacles

- **Existing Power Structures**: Resistance from established authorities
- **Legal Frameworks**: Incompatibility with current legal systems
- **Economic Systems**: Tension with profit-driven models
- **Cultural Barriers**: Conflicting worldviews and values

#### Practical Considerations

- **Scale Issues**: Difficulty implementing in large populations
- **Accountability Mechanisms**: Ensuring leaders remain accountable
- **Resource Allocation**: Fair distribution of resources and opportunities
- **Conflict Resolution**: Managing disputes and disagreements

### Future Directions

The future of kingdom government principles may involve:

#### Technological Integration

- **Digital Democracy**: Using technology for broader participation
- **Transparency Tools**: Blockchain and other technologies for accountability
- **Communication Platforms**: Enhanced dialogue between leaders and citizens
- **Data-Driven Decisions**: Evidence-based policy making

#### Global Applications

- **International Relations**: Kingdom principles in diplomacy
- **Trade Agreements**: Ethical considerations in commerce
- **Environmental Cooperation**: Collaborative stewardship
- **Cultural Exchange**: Mutual respect and understanding

## Conclusion

Kingdom government represents a comprehensive approach to governance that emphasizes service, justice, and community well-being. While implementation faces significant challenges, the principles offer valuable insights for modern leadership and organizational development.

The exploration of these concepts requires careful consideration of historical precedents, contemporary applications, and future possibilities. Success depends on commitment to the underlying values and willingness to adapt principles to specific contexts and circumstances.`,

  'key_principles.md': `# Key Principles 01-10

This comprehensive section outlines the fundamental principles that form the foundation of effective governance and leadership. Each principle builds upon the previous ones to create a cohesive framework.

## Principle 1: Servant Leadership

True leadership begins with a heart to serve others rather than to be served. This foundational principle establishes the proper orientation for all authority and influence.

### Understanding Servant Leadership

Servant leadership represents a fundamental shift from traditional command-and-control models to a more collaborative and empowering approach. Key characteristics include:

- **Humility**: Recognizing that leadership is a privilege, not a right
- **Empathy**: Understanding and caring about the needs of others
- **Stewardship**: Managing resources and opportunities for the benefit of all
- **Commitment to Growth**: Helping others develop their potential

### Practical Applications

Implementing servant leadership requires:

1. **Active Listening**: Truly hearing and understanding others' perspectives
2. **Empowerment**: Giving others the authority and resources to succeed
3. **Support**: Providing guidance and assistance when needed
4. **Recognition**: Acknowledging others' contributions and achievements

## Principle 2: Integrity and Transparency

Integrity forms the bedrock of trust, while transparency ensures accountability and builds confidence in leadership decisions.

### Components of Integrity

- **Consistency**: Alignment between values, words, and actions
- **Honesty**: Truthfulness in all communications and dealings
- **Reliability**: Following through on commitments and promises
- **Moral Courage**: Standing for what is right, even when difficult

### Transparency Practices

- **Open Communication**: Sharing information appropriately and timely
- **Decision Rationale**: Explaining the reasoning behind important choices
- **Feedback Mechanisms**: Creating channels for input and concerns
- **Regular Reporting**: Providing updates on progress and challenges

## Principle 3: Justice and Fairness

Justice ensures that all individuals are treated equitably and that decisions are made based on merit and need rather than favoritism or bias.

### Elements of Justice

- **Impartiality**: Making decisions without prejudice or favoritism
- **Due Process**: Following established procedures and protocols
- **Proportionality**: Ensuring consequences match actions
- **Restoration**: Focusing on healing and improvement rather than punishment

### Implementing Fairness

- **Clear Standards**: Establishing and communicating expectations
- **Consistent Application**: Applying rules and policies uniformly
- **Appeal Processes**: Providing mechanisms for addressing grievances
- **Regular Review**: Evaluating and updating policies as needed

## Principle 4: Wisdom and Discernment

Wisdom involves the ability to make sound judgments and decisions based on knowledge, experience, and understanding of complex situations.

### Developing Wisdom

- **Continuous Learning**: Staying informed and educated
- **Seeking Counsel**: Consulting with advisors and experts
- **Reflection**: Taking time to consider options and consequences
- **Experience**: Learning from both successes and failures

### Exercising Discernment

- **Situation Analysis**: Understanding context and circumstances
- **Stakeholder Consideration**: Evaluating impact on all affected parties
- **Long-term Thinking**: Considering future implications
- **Ethical Evaluation**: Ensuring decisions align with moral principles

## Principle 5: Compassion and Mercy

Compassion drives leaders to care for the well-being of others, while mercy provides opportunities for redemption and second chances.

### Demonstrating Compassion

- **Empathetic Response**: Understanding and sharing others' feelings
- **Practical Help**: Providing tangible assistance when needed
- **Emotional Support**: Offering comfort and encouragement
- **Advocacy**: Speaking up for those who cannot speak for themselves

### Practicing Mercy

- **Forgiveness**: Releasing resentment and offering fresh starts
- **Restoration**: Helping people recover from mistakes or failures
- **Grace**: Extending kindness beyond what is deserved
- **Patience**: Allowing time for growth and change

## Principle 6: Unity and Collaboration

Unity creates strength through diversity, while collaboration harnesses collective wisdom and resources for greater impact.

### Building Unity

- **Shared Vision**: Creating common goals and purposes
- **Mutual Respect**: Valuing different perspectives and contributions
- **Conflict Resolution**: Addressing disagreements constructively
- **Celebration**: Recognizing collective achievements

### Fostering Collaboration

- **Team Building**: Developing strong working relationships
- **Resource Sharing**: Pooling assets and capabilities
- **Communication**: Maintaining open and regular dialogue
- **Coordination**: Aligning efforts and activities

## Principle 7: Stewardship and Responsibility

Stewardship recognizes that leaders are caretakers of resources, relationships, and opportunities that belong to the community.

### Stewardship Mindset

- **Accountability**: Taking responsibility for outcomes and decisions
- **Conservation**: Protecting and preserving valuable resources
- **Investment**: Using resources to create long-term value
- **Legacy**: Considering the impact on future generations

### Responsible Leadership

- **Risk Management**: Identifying and mitigating potential problems
- **Resource Allocation**: Distributing assets fairly and efficiently
- **Performance Monitoring**: Tracking progress and results
- **Continuous Improvement**: Seeking ways to enhance effectiveness

## Principle 8: Growth and Development

Effective leaders prioritize the growth and development of individuals and organizations, creating environments where potential can be realized.

### Personal Development

- **Self-Awareness**: Understanding strengths and weaknesses
- **Skill Building**: Continuously improving capabilities
- **Goal Setting**: Establishing clear objectives and milestones
- **Feedback Integration**: Learning from input and criticism

### Organizational Development

- **Capacity Building**: Strengthening systems and processes
- **Innovation**: Encouraging creativity and new ideas
- **Learning Culture**: Promoting continuous education and improvement
- **Succession Planning**: Preparing future leaders

## Principle 9: Communication and Relationship

Strong relationships built on effective communication form the foundation for all successful leadership endeavors.

### Communication Excellence

- **Clarity**: Expressing ideas clearly and understandably
- **Timeliness**: Sharing information when it's needed
- **Appropriateness**: Matching communication style to audience and situation
- **Feedback**: Creating two-way dialogue and interaction

### Relationship Building

- **Trust Development**: Building confidence through consistency and reliability
- **Conflict Management**: Addressing disagreements constructively
- **Network Expansion**: Developing broad and diverse connections
- **Maintenance**: Investing time and energy in ongoing relationships

## Principle 10: Vision and Purpose

Vision provides direction and inspiration, while purpose gives meaning and motivation to all activities and decisions.

### Developing Vision

- **Future Focus**: Looking beyond current circumstances
- **Inspiration**: Creating compelling pictures of possibility
- **Alignment**: Ensuring vision connects with values and mission
- **Communication**: Sharing vision effectively with others

### Living Purpose

- **Mission Clarity**: Understanding the fundamental reason for existence
- **Value Alignment**: Ensuring actions reflect stated beliefs
- **Impact Measurement**: Evaluating progress toward purpose fulfillment
- **Adaptation**: Adjusting methods while maintaining core purpose

## Integration and Implementation

These ten principles work together to create a comprehensive framework for effective leadership and governance. Success requires:

### Holistic Approach

- **Balance**: Maintaining appropriate emphasis on all principles
- **Integration**: Connecting principles in practical applications
- **Consistency**: Applying principles uniformly across situations
- **Flexibility**: Adapting application to specific contexts

### Continuous Development

- **Assessment**: Regular evaluation of principle implementation
- **Improvement**: Identifying and addressing areas for growth
- **Accountability**: Creating systems for monitoring and feedback
- **Commitment**: Maintaining dedication to principle-based leadership

## Conclusion

These key principles provide a solid foundation for effective leadership and governance. Their implementation requires dedication, practice, and continuous refinement. When applied consistently and authentically, they create environments where individuals and organizations can thrive and achieve their full potential.

The journey of implementing these principles is ongoing, requiring patience, persistence, and commitment to growth. Success is measured not only by immediate results but by the long-term impact on people, communities, and future generations.`,

  'conclusion.md': `# Conclusion

As we reach the end of this comprehensive exploration, it's important to reflect on the key insights and principles that have been presented throughout this work.

## Summary of Key Points

The journey through these concepts has revealed several fundamental truths:

- **Leadership is Service**: True authority comes from serving others
- **Integrity Matters**: Trust is the foundation of all relationships
- **Growth is Essential**: Continuous development benefits everyone
- **Unity Creates Strength**: Collaboration achieves more than individual effort

## Moving Forward

The principles and concepts explored in this work are not merely theoretical constructs but practical tools for transformation and growth.

### Personal Application

Each reader is encouraged to:

1. Reflect on the principles that resonate most strongly
2. Identify areas for personal growth and development
3. Create action plans for implementing these concepts
4. Seek accountability and support from others

### Community Impact

These principles have the potential to transform communities when applied collectively:

- **Improved Relationships**: Better communication and understanding
- **Enhanced Cooperation**: More effective collaboration and teamwork
- **Increased Trust**: Greater confidence in leadership and institutions
- **Sustainable Growth**: Long-term development and prosperity

## Final Thoughts

The path forward requires commitment, patience, and perseverance. Change doesn't happen overnight, but with consistent application of these principles, meaningful transformation is possible.

Thank you for taking this journey. May these insights serve you well in your continued growth and service to others.`
};

export const mockVisuals = {
  1: [], // prologue - no visuals
  2: [ // intro_next_steps
    {
      id: 1,
      section_id: 2,
      file_path: 'intro/diagram1.png',
      alt_text: 'Introduction Framework Diagram',
      caption: 'Overview of the introduction framework',
      markdown_tag: '![intro-framework]',
      display_order: 1,
      displayUrl: 'https://i.pinimg.com/originals/96/a3/9e/96a39ec02d1a7947a1e3aae677efca0e.png'
    },
    {
      id: 2,
      section_id: 2,
      file_path: 'intro/chart1.png',
      alt_text: 'Progress Chart',
      caption: 'Chart showing progression through concepts',
      markdown_tag: '![progress-chart]',
      display_order: 2,
      displayUrl: 'https://i.pinimg.com/originals/83/a3/65/83a365da5e646e49a448d54c7b545587.jpg'
    }
  ],
  3: [ // kingdom_government
    {
      id: 3,
      section_id: 3,
      file_path: 'kingdom/structure.png',
      alt_text: 'Kingdom Government Structure',
      caption: 'Organizational structure of kingdom government',
      markdown_tag: '![kingdom-structure]',
      display_order: 1,
      displayUrl: 'https://lh5.googleusercontent.com/proxy/yz2rh2ceopVqiDBfOsUvvUxREp5CLLP08QUEHMsROKNnwx1uZnn6zB9swskzsPNj0zbK7aW0Hwl-oJAyz7qjq3yoWgqm6XypwysnvDq9P2fRDLEp34NMcwDltBxAE6bxjFSpyd70BP6giufpmADke8AOF7OadZEdrVdPWYw_A3xitTmIOaTR=s0-d'
    }
  ],
  4: [ // key_principles
    {
      id: 4,
      section_id: 4,
      file_path: 'principles/principle1.png',
      alt_text: 'Principle 1 Illustration',
      caption: 'Visual representation of the first principle',
      markdown_tag: '![principle-1]',
      display_order: 1,
      displayUrl: 'https://i.pinimg.com/originals/12/7c/c9/127cc9cc22194237728dae6980a560b7.png'
    },
    {
      id: 5,
      section_id: 4,
      file_path: 'principles/principle2.png',
      alt_text: 'Principle 2 Illustration',
      caption: 'Visual representation of the second principle',
      markdown_tag: '![principle-2]',
      display_order: 2,
      displayUrl: 'https://s-media-cache-ak0.pinimg.com/originals/a7/1b/dc/a71bdc603328017b55a38004d01bace7.jpg'
    },
    {
      id: 6,
      section_id: 4,
      file_path: 'principles/overview.png',
      alt_text: 'Principles Overview',
      caption: 'Complete overview of all key principles',
      markdown_tag: '![principles-overview]',
      display_order: 3,
      displayUrl: 'https://i.pinimg.com/originals/bb/8c/7a/bb8c7a9cfb13715e75df65a73d0659cc.jpg'
    }
  ],
  5: [] // conclusion - no visuals
};