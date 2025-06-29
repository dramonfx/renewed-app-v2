-- Create content_engine table for the New Genesis mission
CREATE TABLE IF NOT EXISTS content_engine (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  principle_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  section TEXT NOT NULL,
  kingdom TEXT CHECK (kingdom IN ('light', 'darkness')) NOT NULL,
  order_index INTEGER NOT NULL,
  audio_url TEXT,
  visual_elements JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_engine_principle ON content_engine(principle_number);
CREATE INDEX IF NOT EXISTS idx_content_engine_section ON content_engine(section);
CREATE INDEX IF NOT EXISTS idx_content_engine_kingdom ON content_engine(kingdom);
CREATE INDEX IF NOT EXISTS idx_content_engine_order ON content_engine(order_index);

-- Create user_progress table for tracking user journey
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  principle_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, principle_number)
);

-- Create indexes for user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_principle ON user_progress(principle_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);

-- Insert the 30 Key Principles content
INSERT INTO content_engine (principle_number, title, content, section, kingdom, order_index) VALUES
(1, 'The Foundation of Truth', 'In the beginning was the Word, and the Word was with God, and the Word was God. This principle establishes the foundation of all truth - that reality itself is grounded in the divine nature of God.', 'foundations', 'light', 1),
(2, 'The Nature of Deception', 'The enemy comes to steal, kill, and destroy. Understanding the nature of deception is crucial for spiritual discernment and protection against the schemes of darkness.', 'foundations', 'darkness', 2),
(3, 'The Power of Faith', 'Faith is the substance of things hoped for, the evidence of things not seen. This principle reveals how faith operates as a spiritual force that connects us to divine reality.', 'foundations', 'light', 3),
(4, 'The Trap of Fear', 'Fear is the opposite of faith and opens the door to the enemy. Understanding how fear operates helps us recognize and overcome its paralyzing effects.', 'foundations', 'darkness', 4),
(5, 'The Authority of Scripture', 'All Scripture is God-breathed and useful for teaching, rebuking, correcting and training in righteousness. This principle establishes the Bible as our ultimate authority.', 'foundations', 'light', 5),
(6, 'The Distortion of Truth', 'Satan is the father of lies and when he lies, he speaks his native language. Understanding how truth gets distorted helps us maintain clarity in spiritual matters.', 'foundations', 'darkness', 6),
(7, 'The Identity in Christ', 'We are chosen, beloved, and set apart for His purposes. This principle reveals our true identity as children of God and heirs of His kingdom.', 'identity', 'light', 7),
(8, 'The False Self', 'The enemy seeks to establish false identities based on performance, comparison, and worldly standards. Recognizing these helps us reject counterfeit identities.', 'identity', 'darkness', 8),
(9, 'The Renewed Mind', 'Be transformed by the renewing of your mind. This principle shows how our thinking patterns must align with God\'s truth for lasting transformation.', 'identity', 'light', 9),
(10, 'The Strongholds of Thought', 'We demolish arguments and every pretension that sets itself up against the knowledge of God. Understanding mental strongholds helps us break free from limiting beliefs.', 'identity', 'darkness', 10),
(11, 'The Heart of Worship', 'God seeks those who worship Him in spirit and in truth. This principle reveals worship as the natural response of a heart aligned with God.', 'identity', 'light', 11),
(12, 'The Idolatry of Self', 'Pride goes before destruction and a haughty spirit before a fall. Understanding the subtle forms of self-worship helps us maintain humility before God.', 'identity', 'darkness', 12),
(13, 'The Power of Purpose', 'For we are His workmanship, created in Christ Jesus for good works. This principle reveals that each person has a unique divine purpose and calling.', 'purpose', 'light', 13),
(14, 'The Confusion of Direction', 'Without vision, the people perish. Understanding how the enemy creates confusion about our purpose helps us stay focused on God\'s calling.', 'purpose', 'darkness', 14),
(15, 'The Gifts and Calling', 'Each person has been given gifts according to the grace given to them. This principle helps us discover and operate in our spiritual gifts.', 'purpose', 'light', 15),
(16, 'The Comparison Trap', 'Comparison is the thief of joy and purpose. Understanding how comparison derails our calling helps us stay focused on our unique path.', 'purpose', 'darkness', 16),
(17, 'The Fruit of the Spirit', 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. This principle reveals the character God develops in us.', 'purpose', 'light', 17),
(18, 'The Works of the Flesh', 'The works of the flesh are evident: sexual immorality, impurity, sensuality, idolatry, sorcery, enmity, strife, jealousy, fits of anger, rivalries, dissensions, divisions, envy, drunkenness, orgies, and things like these.', 'purpose', 'darkness', 18),
(19, 'The Community of Faith', 'As iron sharpens iron, so one person sharpens another. This principle reveals the importance of authentic Christian community for spiritual growth.', 'relationships', 'light', 19),
(20, 'The Isolation Strategy', 'The enemy seeks to isolate believers from community to make them vulnerable to attack. Understanding this strategy helps us prioritize authentic relationships.', 'relationships', 'darkness', 20),
(21, 'The Love of God', 'God is love, and whoever abides in love abides in God, and God abides in him. This principle reveals love as the fundamental nature of God and the foundation of all relationships.', 'relationships', 'light', 21),
(22, 'The Counterfeit Love', 'The world offers counterfeit forms of love based on conditions, performance, and selfish desires. Recognizing these helps us pursue authentic love.', 'relationships', 'darkness', 22),
(23, 'The Forgiveness Factor', 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you. This principle reveals forgiveness as essential for healthy relationships.', 'relationships', 'light', 23),
(24, 'The Bitterness Root', 'See to it that no one fails to obtain the grace of God; that no root of bitterness springs up and causes trouble. Understanding how bitterness destroys relationships helps us choose forgiveness.', 'relationships', 'darkness', 24),
(25, 'The Eternal Perspective', 'Set your minds on things that are above, not on things that are on earth. This principle helps us maintain an eternal perspective in all of life\'s circumstances.', 'victory', 'light', 25),
(26, 'The Temporal Trap', 'The enemy seeks to trap us in temporal thinking that focuses only on immediate circumstances. Understanding this helps us maintain hope in difficult times.', 'victory', 'darkness', 26),
(27, 'The Victory in Christ', 'Thanks be to God, who gives us the victory through our Lord Jesus Christ. This principle reveals that victory is already secured through Christ\'s finished work.', 'victory', 'light', 27),
(28, 'The Defeat Mentality', 'The enemy seeks to establish a defeat mentality that focuses on past failures and current struggles. Recognizing this helps us walk in victory.', 'victory', 'darkness', 28),
(29, 'The Hope of Glory', 'Christ in you, the hope of glory. This principle reveals the incredible reality of Christ\'s presence within believers as the source of all hope.', 'victory', 'light', 29),
(30, 'The Despair of Darkness', 'Without Christ, humanity is without hope and without God in the world. Understanding the reality of life without God helps us appreciate the gift of salvation.', 'victory', 'darkness', 30);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_content_engine_updated_at BEFORE UPDATE ON content_engine FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();