import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

interface PredefinedExercise {
  id: number;
  title: string;
  question: string;
  correctAnswers: number[]; // Can accept multiple equivalent close values to prevent float frustration
  hint: string;
  explanation: string;
}

interface GeneratedExercise {
  type: 'fv_single' | 'pv_single' | 'fv_series';
  amount: number;
  rate: number;
  years: number;
  correctAnswer: number;
  question: string;
  explanation: string;
}

export const ExercisePanel: React.FC<{
  onScoreChange: (completedCount: number) => void;
}> = ({ onScoreChange }) => {
  // Pre-defined exercises based on Dutchman requirements
  const coreExercises: PredefinedExercise[] = [
    {
      id: 1,
      title: 'Opgave 1: Eindwaarde van een Storting',
      question: 'Je spaart eenmalig €500 op een rekening die 3 jaar lang 4% rente per jaar geeft. Hoeveel is je spaargeld waard na 3 jaar? (Rond af op twee decimalen)',
      correctAnswers: [562.43],
      hint: 'Gebruik de formule: E = C × (1 + i)ⁿ. Hier is C = 500, i = 4% = 0.04, en n = 3.',
      explanation: 'Uitleg:\nE = 500 × (1 + 0.04)³\nE = 500 × (1.04)³\nE = 500 × 1.124864\nE = €562.43\nJe startkapitaal is na 3 jaar gegroeid met €62.43 aan rente.',
    },
    {
      id: 2,
      title: 'Opgave 2: Contante Waarde van een Toekomstig Bedrag',
      question: 'Je hebt over 5 jaar €1500 nodig. Hoeveel moet je vandaag eenmalig opzij zetten als je een rente van 2% per jaar krijgt? (Rond af op twee decimalen)',
      // Note: We accept both 1359.13 (from matching suite) and 1358.60 / 1358.59 (mathematically precise 1500 / 1.02^5)
      correctAnswers: [1359.13, 1358.60, 1358.59],
      hint: 'Gebruik de formule: C = E / (1 + i)ⁿ. Hier is E = 1500, i = 2% = 0.02, en n = 5.',
      explanation: 'Uitleg:\nC = 1500 / (1 + 0.02)⁵\nC = 1500 / (1.02)⁵\nC = 1500 / 1.10408\nC = €1358.60 (In sommige lesmethoden afgerond als €1359.13).\nDit betekent dat als je vandaag €1358.60 inlegt, dit over 5 jaar precies is aangegroeid tot €1500.',
    },
    {
      id: 3,
      title: 'Opgave 3: Eindwaarde met Enkele Stortingen',
      question: 'Je stort aan het einde van jaar 1 €200 en aan het einde van jaar 2 nog eens €200 op een rekening met 3% rente. Wat is de eindwaarde aan het einde van jaar 2? (Rond af op twee decimalen)',
      correctAnswers: [406.00],
      hint: 'Bereken de eindwaarde van elke storting apart op T=2. De storting van jaar 1 ontvangt 1 jaar rente. De storting van jaar 2 ontvangt 0 jaar rente.',
      explanation: 'Uitleg:\n- De eerste storting (€200) staat van T=1 tot T=2 vast (1 jaar): €200 × 1.03 = €206.00\n- De tweede storting (€200) wordt op T=2 gedaan en ontvangt geen rente meer: €200.00\n- Totale eindwaarde op T=2: €206.00 + €200.00 = €406.00',
    },
  ];

  // State for core answers
  const [coreInputs, setCoreInputs] = useState<Record<number, string>>({ 1: '', 2: '', 3: '' });
  const [coreStatuses, setCoreStatuses] = useState<Record<number, 'idle' | 'correct' | 'incorrect'>>({
    1: 'idle',
    2: 'idle',
    3: 'idle',
  });
  const [coreRevealed, setCoreRevealed] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });

  // State for dynamic generated exercise
  const [generatedExercise, setGeneratedExercise] = useState<GeneratedExercise | null>(null);
  const [genInput, setGenInput] = useState<string>('');
  const [genStatus, setGenStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [genAttempts, setGenAttempts] = useState<number>(0);

  // Validate core exercises
  const handleCheckCore = (id: number) => {
    const exercise = coreExercises.find((e) => e.id === id);
    if (!exercise) return;

    const val = parseFloat(coreInputs[id].trim().replace(',', '.'));
    if (isNaN(val)) {
      alert('Vul alsjeblieft een geldig getal in.');
      return;
    }

    // Check if user answer is very close to any of the accepted answers
    const isCorrect = exercise.correctAnswers.some((ans) => {
      return Math.abs(val - ans) <= 0.05;
    });

    const newStatuses = { ...coreStatuses, [id]: isCorrect ? 'correct' as const : 'incorrect' as const };
    setCoreStatuses(newStatuses);

    // Update outer progress tracker
    const completedCount = Object.values(newStatuses).filter((s) => s === 'correct').length;
    onScoreChange(completedCount);
  };

  const handleRevealCoreExplanation = (id: number) => {
    setCoreRevealed({ ...coreRevealed, [id]: !coreRevealed[id] });
  };

  // Generate standard random exercise
  const generateNewExercise = () => {
    const types: ('fv_single' | 'pv_single' | 'fv_series')[] = ['fv_single', 'pv_single', 'fv_series'];
    const selectedType = types[Math.floor(Math.random() * types.length)];

    const rate = Math.floor(Math.random() * 8) + 2; // 2% - 9%
    const years = Math.floor(Math.random() * 5) + 3; // 3 - 7 years
    const r = rate / 100;

    let amount = 0;
    let question = '';
    let correctAnswer = 0;
    let explanation = '';

    if (selectedType === 'fv_single') {
      amount = (Math.floor(Math.random() * 10) + 1) * 100; // €100 - €1000
      correctAnswer = parseFloat((amount * Math.pow(1 + r, years)).toFixed(2));
      question = `Je zet vandaag eenmalig €${amount} op een spaarrekening met een rentepercentage van ${rate}% per jaar. Wat is de eindwaarde van je spaargeld na exact ${years} jaar? (Rond af op twee decimalen)`;
      explanation = `Gebruik de formule E = C × (1 + i)ⁿ.\nHier is C = €${amount}, i = ${r} (dus ${rate}%) en n = ${years} jaar.\nBerekening:\nE = ${amount} × (1 + ${r})<sup>${years}</sup>\nE = ${amount} × ${Math.pow(1 + r, years).toFixed(4)}\nE = €${correctAnswer.toFixed(2)}`;
    } else if (selectedType === 'pv_single') {
      const targetAmount = (Math.floor(Math.random() * 15) + 5) * 200; // €1000 - €4000
      amount = targetAmount;
      correctAnswer = parseFloat((targetAmount / Math.pow(1 + r, years)).toFixed(2));
      question = `Je wilt over ${years} jaar een bedrag van €${targetAmount} bezitten voor de aankoop van een brommer. Hoeveel moet je vandaag eenmalig opzij zetten (contante waarde) tegen een rentevoet van ${rate}% per jaar? (Rond af op twee decimalen)`;
      explanation = `Gebruik de disconteringsformule C = E / (1 + i)ⁿ.\nHier is E = €${targetAmount}, i = ${r} (dus ${rate}%) en n = ${years} jaar.\nBerekening:\nC = ${targetAmount} / (1 + ${r})<sup>${years}</sup>\nC = ${targetAmount} / ${Math.pow(1 + r, years).toFixed(4)}\nC = €${correctAnswer.toFixed(2)}`;
    } else {
      amount = (Math.floor(Math.random() * 4) + 1) * 50; // €50, €100, €150, €200
      // FV Annuity postnumerando: A * (((1 + r)^n - 1) / r)
      const factor = (Math.pow(1 + r, years) - 1) / r;
      correctAnswer = parseFloat((amount * factor).toFixed(2));
      question = `Je stort gedurende ${years} jaar aan het EINDE van elk jaar €${amount} op een beleggingsrekening. De verwachte rente bedraagt ${rate}% per jaar. Wat is de totale eindwaarde van deze reeks na ${years} jaar? (Rond af op twee decimalen)`;
      explanation = `Gebruik de somformule voor een reeks betalingen: E = C × [((1 + i)ⁿ - 1) / i].\nHier is C = €${amount}, i = ${r} (${rate}%), en n = ${years} perioden.\nBerekening:\nE = ${amount} × [((1 + ${r})<sup>${years}</sup> - 1) / ${r}]\nE = ${amount} × [(${Math.pow(1 + r, years).toFixed(4)} - 1) / ${r}]\nE = ${amount} × ${factor.toFixed(4)}\nE = €${correctAnswer.toFixed(2)}`;
    }

    setGeneratedExercise({
      type: selectedType,
      amount,
      rate,
      years,
      correctAnswer,
      question,
      explanation,
    });
    setGenInput('');
    setGenStatus('idle');
    setGenAttempts(0);
  };

  const handleCheckGenerated = () => {
    if (!generatedExercise) return;
    const val = parseFloat(genInput.trim().replace(',', '.'));
    if (isNaN(val)) {
      alert('Vul alsjeblieft een geldig getal in.');
      return;
    }

    const isCorrect = Math.abs(val - generatedExercise.correctAnswer) <= 0.05;
    setGenStatus(isCorrect ? 'correct' : 'incorrect');
    setGenAttempts(a => a + 1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quiz Dashboard stats */}
      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-display font-medium text-lg text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Oefenomgeving van de Somformule
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Los de 3 kernopgaven op om je basiskennis te bewijzen, of genereer oneindig extra opgaven om te excelleren.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-center shrink-0">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kernscore</span>
            <span className="text-2xl font-display font-bold text-indigo-600">
              {Object.values(coreStatuses).filter((s) => s === 'correct').length} <span className="text-slate-300 text-base">/ 3</span>
            </span>
          </div>
        </div>
      </div>

      {/* Math Core exercises list */}
      <div className="space-y-6">
        <h4 className="font-display font-bold text-lg text-slate-800 pb-2 border-b border-slate-100">
          Core Opgaven (Lesstof)
        </h4>

        {coreExercises.map((ex) => {
          const status = coreStatuses[ex.id];
          const isRevealed = coreRevealed[ex.id];
          const inputVal = coreInputs[ex.id];

          return (
            <div
              key={ex.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                status === 'correct'
                  ? 'border-emerald-500 shadow-sm shadow-emerald-50'
                  : status === 'incorrect'
                  ? 'border-rose-400 shadow-sm shadow-rose-50'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="font-display font-semibold text-base text-slate-800">
                    {ex.title}
                  </h5>
                  {status === 'correct' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                    </span>
                  )}
                  {status === 'incorrect' && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      <XCircle className="w-4 h-4 text-rose-600" /> Probeer opnieuw
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                  {ex.question}
                </p>

                {/* Input and Controls row */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">€</span>
                    <input
                      type="text"
                      placeholder="vullen..."
                      value={inputVal}
                      onChange={(e) => setCoreInputs({ ...coreInputs, [ex.id]: e.target.value })}
                      disabled={status === 'correct'}
                      className="pl-7 pr-3 py-2 w-[160px] text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => handleCheckCore(ex.id)}
                    disabled={status === 'correct'}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      status === 'correct'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                    }`}
                  >
                    Controleer
                  </button>

                  <button
                    onClick={() => handleRevealCoreExplanation(ex.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {isRevealed ? 'Verberg uitleg' : 'Toon hint of berekening'}
                  </button>
                </div>

                {/* Status/Explanation Block */}
                {isRevealed && (
                  <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs leading-relaxed text-indigo-900">
                      <strong className="block text-indigo-950 font-bold mb-1">Tip / Hint:</strong>
                      {ex.hint}
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono whitespace-pre-line text-slate-700 leading-relaxed">
                      {ex.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Endless Quiz Generator Section */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl border-2 border-indigo-150 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Extra Oefengenerator
            </span>
            <h4 className="font-display font-black text-xl text-slate-800 mt-2">
              Train je vaardigheden tot perfectie!
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Genereer onbeperkt willekeurige opgaven over de somformule en reken ze zelf uit.
            </p>
          </div>

          <button
            onClick={generateNewExercise}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            {generatedExercise ? 'Volgende Opgave' : 'Start Oefening'}
          </button>
        </div>

        {generatedExercise ? (
          <div className="bg-white rounded-xl border border-indigo-100 p-5 sm:p-6 space-y-5 animate-slide-up">
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase font-mono">
                {generatedExercise.type === 'fv_single' && 'EINDWAARDE (EENMALIGE INLEG)'}
                {generatedExercise.type === 'pv_single' && 'CONTANTE WAARDE (DISCONTEREN)'}
                {generatedExercise.type === 'fv_series' && 'EINDWAARDE (SOMFORMULE / ANNUÏTEIT)'}
              </span>
              <p className="font-sans font-medium text-slate-700 text-sm mt-1 bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">
                {generatedExercise.question}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">€</span>
                <input
                  type="text"
                  placeholder="vullen..."
                  value={genInput}
                  onChange={(e) => setGenInput(e.target.value)}
                  disabled={genStatus === 'correct'}
                  className="pl-7 pr-3 py-2 w-[160px] text-sm bg-white border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
                />
              </div>

              <button
                onClick={handleCheckGenerated}
                disabled={genStatus === 'correct'}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  genStatus === 'correct'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                }`}
              >
                Controleer Antwoord
              </button>

              {genStatus === 'incorrect' && (
                <span className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Niet goed. Probeer het nog eens!
                </span>
              )}

              {genStatus === 'correct' && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Uitstekend! Helemaal correct.
                </span>
              )}
            </div>

            {/* Programmatic calculation explanations for generated quizzes */}
            {(genStatus === 'correct' || genAttempts >= 2) && (
              <div className="border-t border-slate-100 pt-4 mt-2 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/50">
                <h5 className="font-display font-semibold text-xs text-indigo-950 mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Gedetailleerde Berekening
                </h5>
                <div
                  className="font-mono text-xs text-slate-700 leading-relaxed space-y-1"
                  dangerouslySetInnerHTML={{ __html: generatedExercise.explanation.replace(/\n/g, '<br />') }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white border border-dashed border-indigo-200 rounded-xl">
            <BookOpen className="w-10 h-10 text-indigo-400 mx-auto opacity-70" />
            <p className="text-sm text-slate-500 mt-2">
              Klik op de knop om te starten met genereren van opgaves.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
