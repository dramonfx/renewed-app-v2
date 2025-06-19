
'use client';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="sacred-glass rounded-3xl p-12 max-w-2xl w-full text-center animate-fade-in">
        {/* Sacred Journey Header */}
        <div className="mb-8">
          <h1 className="font-sacred-serif text-5xl md:text-6xl font-bold text-sacred mb-4">
            Sacred Journey
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-sacred-gold-500 to-sacred-gold-400 mx-auto rounded-full mb-6"></div>
          <p className="text-sacred-muted text-xl font-sacred-sans leading-relaxed">
            Welcome to your path of inner transformation and mindful growth
          </p>
        </div>

        {/* Sacred Description */}
        <div className="mb-10">
          <p className="text-sacred-muted text-lg font-sacred-sans leading-relaxed mb-6">
            Embark on a journey of self-discovery through guided reflection, 
            mindful practices, and intentional living. Your sacred path awaits.
          </p>
          
          {/* Sacred Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sacred-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-sacred-serif text-lg font-semibold text-sacred mb-2">Mindful Reflection</h3>
              <p className="text-sacred-muted text-sm">Daily practices for inner awareness</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sacred-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-sacred-serif text-lg font-semibold text-sacred mb-2">Sacred Growth</h3>
              <p className="text-sacred-muted text-sm">Transform through intentional living</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-sacred-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-sacred-serif text-lg font-semibold text-sacred mb-2">Inner Wisdom</h3>
              <p className="text-sacred-muted text-sm">Discover your authentic self</p>
            </div>
          </div>
        </div>

        {/* Sacred Action Button */}
        <button 
          onClick={onNext}
          className="sacred-gold-button text-lg px-8 py-4 font-sacred-sans animate-slide-up"
        >
          Begin Your Sacred Journey
        </button>
        
        {/* Sacred Subtitle */}
        <p className="text-sacred-muted text-sm mt-6 font-sacred-sans">
          Take the first step towards mindful transformation
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
