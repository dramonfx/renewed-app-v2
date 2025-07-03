'use client';

import { Heart, Shield, Star, ArrowRight } from 'lucide-react';

export default function DesignTestPage() {
  return (
    <div className="sacred-bg-primary min-h-screen">
      {/* Header Section */}
      <div className="sacred-container sacred-section">
        <div className="mb-12 text-center">
          <h1 className="font-heading sacred-text-primary mb-4 text-4xl font-bold md:text-5xl">
            Sacred Journey Design System
          </h1>
          <p className="sacred-text-secondary mx-auto max-w-2xl text-xl">
            Testing the new design foundation with{' '}
            <span className="sacred-text-accent font-semibold">Playfair Display</span> headings and{' '}
            <span className="sacred-text-accent font-semibold">Inter</span> body text
          </p>
        </div>

        {/* Typography Showcase */}
        <div className="sacred-card mb-8 p-8">
          <h2 className="font-heading sacred-text-primary mb-6 text-3xl font-bold">
            Typography Showcase
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-heading sacred-text-primary mb-4 text-2xl font-semibold">
                Headings (Playfair Display)
              </h3>
              <h1 className="font-heading sacred-text-primary mb-2 text-3xl font-bold">
                Heading 1 - Bold
              </h1>
              <h2 className="font-heading sacred-text-primary mb-2 text-2xl font-semibold">
                Heading 2 - Semibold
              </h2>
              <h3 className="font-heading sacred-text-primary mb-2 text-xl font-medium">
                Heading 3 - Medium
              </h3>
              <h4 className="font-heading sacred-text-primary mb-2 text-lg">Heading 4 - Regular</h4>
            </div>

            <div>
              <h3 className="font-heading sacred-text-primary mb-4 text-2xl font-semibold">
                Body Text (Inter)
              </h3>
              <p className="sacred-text-secondary mb-3 text-lg">
                Large body text - This is how larger paragraphs will look with the Inter font
                family.
              </p>
              <p className="sacred-text-secondary mb-3 text-base">
                Regular body text - This is the standard paragraph text that will be used throughout
                the application.
              </p>
              <p className="sacred-text-muted text-sm">
                Small text - This is for captions, footnotes, and secondary information.
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="sacred-card mb-8 p-8">
          <h2 className="font-heading sacred-text-primary mb-6 text-3xl font-bold">
            Sacred Journey Color Palette
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="bg-sacred-navy shadow-sacred mx-auto mb-3 h-20 w-20 rounded-lg"></div>
              <h4 className="font-heading sacred-text-primary font-semibold">Sacred Navy</h4>
              <p className="sacred-text-muted text-sm">#1e293b</p>
            </div>

            <div className="text-center">
              <div className="bg-sacred-blue shadow-sacred mx-auto mb-3 h-20 w-20 rounded-lg"></div>
              <h4 className="font-heading sacred-text-primary font-semibold">Sacred Blue</h4>
              <p className="sacred-text-muted text-sm">#3DA9FC</p>
            </div>

            <div className="text-center">
              <div className="bg-sacred-bg shadow-sacred border-sacred-navy/10 mx-auto mb-3 h-20 w-20 rounded-lg border-2"></div>
              <h4 className="font-heading sacred-text-primary font-semibold">Sacred Background</h4>
              <p className="sacred-text-muted text-sm">#f1f5f9</p>
            </div>

            <div className="text-center">
              <div className="bg-sacred-white shadow-sacred border-sacred-navy/10 mx-auto mb-3 h-20 w-20 rounded-lg border-2"></div>
              <h4 className="font-heading sacred-text-primary font-semibold">Sacred White</h4>
              <p className="sacred-text-muted text-sm">#ffffff</p>
            </div>
          </div>
        </div>

        {/* Button Showcase */}
        <div className="sacred-card mb-8 p-8">
          <h2 className="font-heading sacred-text-primary mb-6 text-3xl font-bold">
            Button Components
          </h2>

          <div className="flex flex-wrap gap-4">
            <button className="sacred-btn">
              Primary Button
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            <button className="sacred-btn-secondary">Secondary Button</button>

            <button className="sacred-btn" disabled>
              Disabled Button
            </button>
          </div>
        </div>

        {/* Card Components */}
        <div className="mb-8">
          <h2 className="font-heading sacred-text-primary mb-6 text-center text-3xl font-bold">
            Sacred Cards
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="sacred-card p-6 text-center transition-transform duration-300 hover:scale-105">
              <div className="bg-sacred-blue/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-sacred-blue h-8 w-8" />
              </div>
              <h3 className="font-heading sacred-text-primary mb-3 text-xl font-semibold">
                Peaceful Experience
              </h3>
              <p className="sacred-text-secondary">
                Experience tranquility and inner peace through our guided journey of spiritual
                transformation.
              </p>
            </div>

            <div className="sacred-card p-6 text-center transition-transform duration-300 hover:scale-105">
              <div className="bg-sacred-blue/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Shield className="text-sacred-blue h-8 w-8" />
              </div>
              <h3 className="font-heading sacred-text-primary mb-3 text-xl font-semibold">
                Sacred Security
              </h3>
              <p className="sacred-text-secondary">
                Feel safe and protected in your spiritual journey with our comprehensive guidance
                and support.
              </p>
            </div>

            <div className="sacred-card p-6 text-center transition-transform duration-300 hover:scale-105">
              <div className="bg-sacred-blue/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Star className="text-sacred-blue h-8 w-8" />
              </div>
              <h3 className="font-heading sacred-text-primary mb-3 text-xl font-semibold">
                Guided Renewal
              </h3>
              <p className="sacred-text-secondary">
                Discover your path to renewal and transformation with personalized guidance and
                wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="sacred-card p-8 text-center">
          <h2 className="font-heading sacred-text-primary mb-4 text-3xl font-bold">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="sacred-text-secondary mx-auto mb-6 max-w-2xl text-lg">
            The Sacred Journey design system is now active. Clean typography, harmonious colors, and
            beautiful components are ready for your spiritual transformation experience.
          </p>
          <button className="sacred-btn px-8 py-3 text-lg">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
