
'use client';

import { Heart, Shield, Star, ArrowRight } from 'lucide-react';

export default function DesignTestPage() {
  return (
    <div className="min-h-screen sacred-bg-primary">
      {/* Header Section */}
      <div className="sacred-container sacred-section">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold sacred-text-primary mb-4">
            Sacred Journey Design System
          </h1>
          <p className="text-xl sacred-text-secondary max-w-2xl mx-auto">
            Testing the new design foundation with <span className="sacred-text-accent font-semibold">Playfair Display</span> headings 
            and <span className="sacred-text-accent font-semibold">Inter</span> body text
          </p>
        </div>

        {/* Typography Showcase */}
        <div className="sacred-card p-8 mb-8">
          <h2 className="text-3xl font-heading font-bold sacred-text-primary mb-6">Typography Showcase</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-heading font-semibold sacred-text-primary mb-4">Headings (Playfair Display)</h3>
              <h1 className="text-3xl font-heading font-bold sacred-text-primary mb-2">Heading 1 - Bold</h1>
              <h2 className="text-2xl font-heading font-semibold sacred-text-primary mb-2">Heading 2 - Semibold</h2>
              <h3 className="text-xl font-heading font-medium sacred-text-primary mb-2">Heading 3 - Medium</h3>
              <h4 className="text-lg font-heading sacred-text-primary mb-2">Heading 4 - Regular</h4>
            </div>
            
            <div>
              <h3 className="text-2xl font-heading font-semibold sacred-text-primary mb-4">Body Text (Inter)</h3>
              <p className="text-lg sacred-text-secondary mb-3">
                Large body text - This is how larger paragraphs will look with the Inter font family.
              </p>
              <p className="text-base sacred-text-secondary mb-3">
                Regular body text - This is the standard paragraph text that will be used throughout the application.
              </p>
              <p className="text-sm sacred-text-muted">
                Small text - This is for captions, footnotes, and secondary information.
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="sacred-card p-8 mb-8">
          <h2 className="text-3xl font-heading font-bold sacred-text-primary mb-6">Sacred Journey Color Palette</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-sacred-navy rounded-lg mx-auto mb-3 shadow-sacred"></div>
              <h4 className="font-heading font-semibold sacred-text-primary">Sacred Navy</h4>
              <p className="text-sm sacred-text-muted">#1e293b</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sacred-blue rounded-lg mx-auto mb-3 shadow-sacred"></div>
              <h4 className="font-heading font-semibold sacred-text-primary">Sacred Blue</h4>
              <p className="text-sm sacred-text-muted">#3DA9FC</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sacred-bg rounded-lg mx-auto mb-3 shadow-sacred border-2 border-sacred-navy/10"></div>
              <h4 className="font-heading font-semibold sacred-text-primary">Sacred Background</h4>
              <p className="text-sm sacred-text-muted">#f1f5f9</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-sacred-white rounded-lg mx-auto mb-3 shadow-sacred border-2 border-sacred-navy/10"></div>
              <h4 className="font-heading font-semibold sacred-text-primary">Sacred White</h4>
              <p className="text-sm sacred-text-muted">#ffffff</p>
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="sacred-card p-8 mb-8">
          <h2 className="text-3xl font-heading font-bold sacred-text-primary mb-6">Button Components</h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="sacred-btn">
              Primary Button
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            
            <button className="sacred-btn-secondary">
              Secondary Button
            </button>
            
            <button className="sacred-btn" disabled>
              Disabled Button
            </button>
          </div>
        </div>

        {/* Card Components */}
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold sacred-text-primary mb-6 text-center">Sacred Cards</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="sacred-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-sacred-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-sacred-blue" />
              </div>
              <h3 className="text-xl font-heading font-semibold sacred-text-primary mb-3">Peaceful Experience</h3>
              <p className="sacred-text-secondary">
                Experience tranquility and inner peace through our guided journey of spiritual transformation.
              </p>
            </div>
            
            <div className="sacred-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-sacred-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-sacred-blue" />
              </div>
              <h3 className="text-xl font-heading font-semibold sacred-text-primary mb-3">Sacred Security</h3>
              <p className="sacred-text-secondary">
                Feel safe and protected in your spiritual journey with our comprehensive guidance and support.
              </p>
            </div>
            
            <div className="sacred-card p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-sacred-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-sacred-blue" />
              </div>
              <h3 className="text-xl font-heading font-semibold sacred-text-primary mb-3">Guided Renewal</h3>
              <p className="sacred-text-secondary">
                Discover your path to renewal and transformation with personalized guidance and wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="sacred-card p-8 text-center">
          <h2 className="text-3xl font-heading font-bold sacred-text-primary mb-4">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="text-lg sacred-text-secondary mb-6 max-w-2xl mx-auto">
            The Sacred Journey design system is now active. Clean typography, harmonious colors, 
            and beautiful components are ready for your spiritual transformation experience.
          </p>
          <button className="sacred-btn text-lg px-8 py-3">
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
