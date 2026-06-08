import { useState } from 'react';
import { TheorySection } from './components/TheorySection';
import { ExercisePanel } from './components/ExercisePanel';
import { BookOpen, GraduationCap, Percent, HelpCircle, ArrowRightLeft, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'exercises'>('theory');
  const [completedOpgaven, setCompletedOpgaven] = useState<number>(0);

  // Calculate percentage for progress display bar
  const progressPercent = Math.round((completedOpgaven / 3) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header Section */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                Uitleg de Somformule
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Eindwaarde & Contante Waarde Educatief Platform
              </p>
            </div>
          </div>

          {/* Quick tab switchers */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Theorie & Visualisatie
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'exercises'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Oefenopgaven
              {completedOpgaven > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {completedOpgaven}/3
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container wrapper */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 flex-grow">
        {/* Progress Tracker Banner if doing exercises */}
        {activeTab === 'exercises' && (
          <div className="mb-6 bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-xs">
            <div className="text-sm font-medium text-slate-600">
              Voortgang op de Core Opgaven: <span className="text-indigo-600 font-bold">{completedOpgaven} / 3</span> opgelost
            </div>
            
            {/* Visual progress bar bar */}
            <div className="w-full sm:w-[240px] h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tab display condition */}
        {activeTab === 'theory' ? (
          <TheorySection />
        ) : (
          <ExercisePanel onScoreChange={(count) => setCompletedOpgaven(count)} />
        )}
      </main>

      {/* Professional Humble Minimal Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            Somformule Uitleg &copy; {new Date().getFullYear()} &mdash; Interactief Financieel Leerplatform
          </p>
          <div className="flex gap-4 font-medium text-slate-500">
            <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Samengestelde interest</span>
            <span className="flex items-center gap-1"><ArrowRightLeft className="w-3.5 h-3.5" /> Disconteren</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
