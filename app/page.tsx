"use client"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import LanguageSelector from "./_components/LanguageSelector";

export default function Home() {
  const { user } = useUser();
  const t = useTranslations('landing');
  
  return (
    <div className="bg-white dark:bg-neutral-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-neutral-900/95 dark:border-neutral-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AgriBoost
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
              href="#features"
              className="hidden md:inline-flex items-center px-3 py-2 rounded-md text-neutral-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors font-medium"
              >
              {t('header.features')}
              </a>
              <a
              href="#how-it-works"
              className="hidden md:inline-flex items-center px-3 py-2 rounded-md text-neutral-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-neutral-800 transition-colors font-medium"
              >
              {t('header.howItWorks')}
              </a>
              {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl="/crop-analysis/upload">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                {t('header.getStarted')}
                </button>
              </SignInButton>
              ) : (
              <UserButton />
              )}
              <LanguageSelector />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {t('hero.badge')}
              </span>
            </div>
          </div>

          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
              {t('hero.title.part1')}{" "} <br/>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t('hero.title.part2')}
              </span>
            </h1>
            
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a 
                href="/crop-analysis/upload"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-lg"
              >
                {t('hero.cta.primary')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
              <a 
                href="#how-it-works"
                className="px-8 py-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-semibold border-2 border-neutral-200 dark:border-neutral-700 flex items-center gap-2 text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {t('hero.cta.secondary')}
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">{t('hero.stats.accuracy.value')}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('hero.stats.accuracy.label')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">{t('hero.stats.predictions.value')}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('hero.stats.predictions.label')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">{t('hero.stats.yieldIncrease.value')}</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('hero.stats.yieldIncrease.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl hover:shadow-xl transition-all border border-primary-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('features.items.yieldPrediction.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('features.items.yieldPrediction.description')}
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-feature-blue-light to-feature-cyan-light dark:from-neutral-900 dark:to-neutral-800 rounded-2xl hover:shadow-xl transition-all border border-blue-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-gradient-to-br from-feature-blue to-feature-cyan rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('features.items.weatherIntegration.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('features.items.weatherIntegration.description')}
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-feature-purple-light to-feature-pink-light dark:from-neutral-900 dark:to-neutral-800 rounded-2xl hover:shadow-xl transition-all border border-purple-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-gradient-to-br from-feature-purple to-feature-pink rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('features.items.smartOptimization.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('features.items.smartOptimization.description')}
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-feature-orange-light to-feature-amber-light dark:from-neutral-900 dark:to-neutral-800 rounded-2xl hover:shadow-xl transition-all border border-orange-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-gradient-to-br from-feature-orange to-feature-amber rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                {t('features.items.riskAssessment.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('features.items.riskAssessment.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary-50 dark:from-neutral-800 dark:to-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                {t('howItWorks.steps.step1.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('howItWorks.steps.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-feature-blue to-feature-cyan rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                {t('howItWorks.steps.step2.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('howItWorks.steps.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-feature-purple to-feature-pink rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                {t('howItWorks.steps.step3.title')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('howItWorks.steps.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            {t('cta.subtitle')}
          </p>
          <a 
            href="/crop-analysis"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-neutral-50 transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
          >
            {t('cta.button')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AgroBoost</span>
          </div>
          <p className="text-neutral-400 mb-6">
            {t('footer.description')}
          </p>
          <div className="text-sm text-neutral-500">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}