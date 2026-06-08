import React, { useState } from 'react';
import { InteractiveTimeline } from './InteractiveTimeline';
import { Sliders, TrendingUp, Coins, Calculator, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

export const TheorySection: React.FC = () => {
  // Stats & sliders for Eindwaarde (FV)
  const [fvAmount, setFvAmount] = useState<number>(100);
  const [fvRate, setFvRate] = useState<number>(5);
  const [fvYears, setFvYears] = useState<number>(3);
  const [fvMode, setFvMode] = useState<'single' | 'series'>('series');
  const [fvTiming, setFvTiming] = useState<'begin' | 'end'>('end');

  // Stats & sliders for Contante Waarde (PV)
  const [pvAmount, setPvAmount] = useState<number>(300);
  const [pvRate, setPvRate] = useState<number>(5);
  const [pvYears, setPvYears] = useState<number>(3);
  const [pvMode, setPvMode] = useState<'single' | 'series'>('single');

  // Calculations for display
  const calculateFV = (): number => {
    const r = fvRate / 100;
    if (fvMode === 'single') {
      return fvAmount * Math.pow(1 + r, fvYears);
    } else {
      // Series of payments (Somformule)
      let sum = 0;
      const start = fvTiming === 'begin' ? 0 : 1;
      const end = fvTiming === 'begin' ? fvYears - 1 : fvYears;
      for (let y = start; y <= end; y++) {
        sum += fvAmount * Math.pow(1 + r, fvYears - y);
      }
      return sum;
    }
  };

  const calculatePV = (): number => {
    const r = pvRate / 100;
    if (pvMode === 'single') {
      return pvAmount / Math.pow(1 + r, pvYears);
    } else {
      // Annual annuity
      let sum = 0;
      for (let y = 1; y <= pvYears; y++) {
        sum += pvAmount / Math.pow(1 + r, y);
      }
      return sum;
    }
  };

  return (
    <div className="space-y-12">
      {/* Intro Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 shadow-md">
        <div className="max-w-3xl">
          <span className="bg-blue-400/30 text-blue-100 font-mono text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-blue-200/25">
            Theorie & Concepten
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-4 tracking-tight">
            De Tijdswaarde van Geld (Time Value of Money)
          </h2>
          <p className="text-blue-100 mt-3 text-base leading-relaxed">
            De basis van alle financiële berekeningen is simpel: <strong>een euro vandaag is meer waard dan een euro morgen</strong>. Dit komt omdat je geld vandaag direct kunt investeren of op een spaarrekening kunt zetten om rente te verdienen. 
          </p>
          <p className="text-blue-200/90 mt-2 text-sm">
            Twee fundamentele begrippen staan hierin centraal: <strong>Eindwaarde</strong> (hoeveel is geld in de toekomst waard?) en <strong>Contante Waarde</strong> (hoeveel zijn toekomstige bedragen op dit moment waard?). Met de somformule herleiden we reeksen van regelmatige betalingen.
          </p>
        </div>
      </section>

      {/* Concept 1: Somformule */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          1. Wat is de Somformule?
        </h3>
        <p className="text-slate-600 mt-3 leading-relaxed">
          De somformule (of som van een meetkundige reeks) helpt ons om de totale waarde van een reeks gelijke betalingen te berekenen, rekening houdend met de opbouw van samengestelde rente (rente-op-rente). Denk aan:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-600">
          <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Sparen:</strong> Elke maand of elk jaar een vast bedrag opzij zetten.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Grote aankopen:</strong> Berekenen hoeveel je over een aantal perioden spaart.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Investeren:</strong> De contante waarde van een jaarlijkse opbrengst bepalen.</span>
          </li>
          <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Pensioen:</strong> De nodige vaste inleg bepalen om een doelbedrag te halen.</span>
          </li>
        </ul>
      </section>

      {/* Concept 2: Eindwaarde */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            2. Eindwaarde (Toekomstige Waarde) Berekenen
          </h3>
          <p className="text-slate-600 mt-2">
            Met de **eindwaarde** bereken je hoeveel een startbedrag of een reeks van stortingen waard zal zijn in de toekomst, inclusief de samengestelde rente op rente.
          </p>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100/50 px-2.5 py-0.5 rounded-full uppercase">
                Eenmalige Storting (E)
              </span>
              <p className="font-mono text-lg font-bold text-slate-800 my-3">
                E = C × (1 + i)ⁿ
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Gebruikt voor een eenmalig startbedrag op T=0 dat renderend op de bank staat.
            </p>
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-100/50 px-2.5 py-0.5 rounded-full uppercase">
                Reeks van Stortingen (Eind van jaar)
              </span>
              <p className="font-mono text-lg font-bold text-slate-800 my-3">
                E = C × <span className="text-indigo-600">((1 + i)ⁿ - 1) / i</span>
              </p>
            </div>
            <p className="text-xs text-slate-500">
              De <strong>somformule</strong> voor postnumerando (stortingen aan het einde van elk jaar).
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-100">
          <div><code className="text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border">E</code> = Eindwaarde</div>
          <div><code className="text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border">C</code> = Storting of Beginkapitaal</div>
          <div><code className="text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border">i</code> = Rentevoet (decimaal, bijv. 5% = 0.05)</div>
          <div><code className="text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border">n</code> = Aantal perioden (jaren)</div>
        </div>

        {/* Live Simulator Widget */}
        <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
            <Sliders className="w-5 h-5 text-blue-600" />
            Interactieve Eindwaarde Simulator
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left sliders side */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Inleg / Storting (C)</span>
                  <span className="font-mono text-blue-600 font-bold">€{fvAmount}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={fvAmount}
                  onChange={(e) => setFvAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Jaarlijkse Rente (i)</span>
                  <span className="font-mono text-blue-600 font-bold">{fvRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={fvRate}
                  onChange={(e) => setFvRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Looptijd (n)</span>
                  <span className="font-mono text-blue-600 font-bold">{fvYears} jaar</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={fvYears}
                  onChange={(e) => setFvYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Mode Button Selectors */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold text-slate-600">Stortingsmethode:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFvMode('single')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      fvMode === 'single'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Eenmalige storting
                  </button>
                  <button
                    onClick={() => setFvMode('series')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      fvMode === 'series'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Reeks stortingen
                  </button>
                </div>
              </div>

              {fvMode === 'series' && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-600">Timing van storting:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFvTiming('end')}
                      className={`py-1 px-2.5 rounded-lg text-[11px] font-medium transition-all ${
                        fvTiming === 'end'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      Einde jaar (Postnumerando)
                    </button>
                    <button
                      onClick={() => setFvTiming('begin')}
                      className={`py-1 px-2.5 rounded-lg text-[11px] font-medium transition-all ${
                        fvTiming === 'begin'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      Begin jaar (Prenumerando)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right result cards side */}
            <div className="md:col-span-7 bg-white rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gezamenlijke Uitkomst</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="font-display font-bold text-3xl text-emerald-600">
                    €{calculateFV().toFixed(2)}
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold">Totaal geaccumuleerd</span>
                </div>
              </div>

              {/* Step-by-step description breakdown */}
              <div className="space-y-2.5 p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border border-slate-100">
                <span className="font-semibold text-slate-700">Hoe dit tot stand komt:</span>
                {fvMode === 'single' ? (
                  <p>
                    De eenmalige inleg van <strong>€{fvAmount}</strong> ontvangt <strong>{fvYears} jaar</strong> lang <strong>{fvRate}%</strong> rente op rente:{' '}
                    <code className="bg-white px-1 py-0.5 rounded font-mono font-bold block mt-1 border">
                      €{fvAmount} × (1 + {(fvRate / 100).toFixed(3)})^{fvYears} = €{calculateFV().toFixed(2)}
                    </code>
                  </p>
                ) : (
                  <div>
                    <p>
                      Er wordt in totaal <strong>{fvYears} keer</strong> <strong>€{fvAmount}</strong> ingelegd ({fvTiming === 'begin' ? 'begin van het jaar' : 'einde van het jaar'}).
                    </p>
                    <div className="mt-1 space-y-1 font-mono text-[10px] text-indigo-700 bg-white p-2 rounded border border-indigo-50">
                      {Array.from({ length: fvYears }).map((_, idx) => {
                        const y = fvTiming === 'begin' ? idx : idx + 1;
                        const periodsLeft = fvYears - y;
                        const result = fvAmount * Math.pow(1 + fvRate / 100, periodsLeft);
                        return (
                          <div key={idx} className="flex justify-between">
                            <span>Inleg op T={y} ({periodsLeft} j. rente):</span>
                            <span className="font-semibold">
                              €{fvAmount} × {Math.pow(1 + fvRate / 100, periodsLeft).toFixed(4)} = €{result.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Embed Interactive Tijdlijn for FV */}
        <InteractiveTimeline
          type="fv"
          mode={fvMode}
          amount={fvAmount}
          rate={fvRate}
          years={fvYears}
          timing={fvTiming}
        />
      </section>

      {/* Concept 3: Contante Waarde */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-600" />
            3. Contante Waarde (Huidige Waarde) Berekenen
          </h3>
          <p className="text-slate-600 mt-2">
            Met de **contante waarde** reken je toekomstig geld terug naar het heden: "wat is een beloofd bedrag in de toekomst vandaag waard?". We noemen dit ook wel <strong>disconteren</strong>.
          </p>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sky-50/50 rounded-xl p-5 border border-sky-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-100/50 px-2.5 py-0.5 rounded-full uppercase">
                Eenmalig Toekomstig Bedrag (C)
              </span>
              <p className="font-mono text-lg font-bold text-slate-800 my-3">
                C = E / (1 + i)ⁿ
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Disconteren van een enkel bedrag dat je over <code>n</code> perioden ontvangt.
            </p>
          </div>

          <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded-full uppercase">
                Annuïteit (Reeks van Gelijke Ontvangsten)
              </span>
              <p className="font-mono text-lg font-bold text-slate-800 my-3">
                C = E × <span className="text-emerald-600">(1 - (1 + i)⁻ⁿ) / i</span>
              </p>
            </div>
            <p className="text-xs text-slate-500">
              De <strong>somformule</strong> om te berekenen wat een periodieke gelijke stroom vandaag waard is.
            </p>
          </div>
        </div>

        {/* Live Simulator Widget */}
        <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
            <Sliders className="w-5 h-5 text-blue-600" />
            Interactieve Contante Waarde Simulator
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left sliders side */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Toekomstig Bedrag (E)</span>
                  <span className="font-mono text-blue-600 font-bold">€{pvAmount}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={pvAmount}
                  onChange={(e) => setPvAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Disconteringsrente (i)</span>
                  <span className="font-mono text-blue-600 font-bold">{pvRate}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={pvRate}
                  onChange={(e) => setPvRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Aantal Jaar Wachten (n)</span>
                  <span className="font-mono text-blue-600 font-bold">{pvYears} jaar</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={pvYears}
                  onChange={(e) => setPvYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Mode Button Selectors */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold text-slate-600">Reekscategorie:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPvMode('single')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      pvMode === 'single'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Eenmalige ontvangst
                  </button>
                  <button
                    onClick={() => setPvMode('series')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      pvMode === 'series'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Jaarlijkse Reeks
                  </button>
                </div>
              </div>
            </div>

            {/* Right result cards side */}
            <div className="md:col-span-7 bg-white rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gezamenlijke Uitkomst</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="font-display font-bold text-3xl text-blue-600">
                    €{calculatePV().toFixed(2)}
                  </h4>
                  <span className="text-xs text-slate-500 font-semibold">Totaal nu waard (Contant)</span>
                </div>
              </div>

              {/* Step-by-step description breakdown */}
              <div className="space-y-2.5 p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border border-slate-100">
                <span className="font-semibold text-slate-700">Hoe dit tot stand komt:</span>
                {pvMode === 'single' ? (
                  <p>
                    Het bedrag van <strong>€{pvAmount}</strong> dat je pas over <strong>{pvYears} jaar</strong> ontvangt, is nu minder waard omdat we het disconteren tegen <strong>{pvRate}%</strong> per jaar:{' '}
                    <code className="bg-white px-1 py-0.5 rounded font-mono font-bold block mt-1 border">
                      €{pvAmount} / (1 + {(pvRate / 100).toFixed(3)})^{pvYears} = €{calculatePV().toFixed(2)}
                    </code>
                  </p>
                ) : (
                  <div>
                    <p>
                      Elk jaar (van T=1 tot T={pvYears}) ontvang je <strong>€{pvAmount}</strong>. We rekenen elk van deze bedragen terug naar vandaag (T=0).
                    </p>
                    <div className="mt-1 space-y-1 font-mono text-[10px] text-emerald-700 bg-white p-2 rounded border border-emerald-50">
                      {Array.from({ length: pvYears }).map((_, idx) => {
                        const y = idx + 1;
                        const result = pvAmount / Math.pow(1 + pvRate / 100, y);
                        return (
                          <div key={idx} className="flex justify-between">
                            <span>Ontvangst op T={y} (terug naar T=0):</span>
                            <span className="font-semibold">
                              €{pvAmount} / {Math.pow(1 + pvRate / 100, y).toFixed(4)} = €{result.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Embed Interactive Tijdlijn for PV */}
        <InteractiveTimeline
          type="pv"
          mode={pvMode}
          amount={pvAmount}
          rate={pvRate}
          years={pvYears}
        />
      </section>
    </div>
  );
};
