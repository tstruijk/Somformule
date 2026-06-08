import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Info } from 'lucide-react';

interface InteractiveTimelineProps {
  type: 'fv' | 'pv';
  mode: 'single' | 'series';
  amount: number;
  rate: number;
  years: number;
  timing?: 'begin' | 'end';
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  type,
  mode,
  amount,
  rate,
  years,
  timing = 'end',
}) => {
  const [hoveredArc, setHoveredArc] = useState<number | null>(null);

  const padding = 60;
  const width = 800;
  const height = 220;
  const timelineY = 130;
  const trackWidth = width - padding * 2;

  // Calculate X coord for dynamic year ticks
  const getX = (year: number) => {
    if (years === 0) return padding;
    return padding + (year / years) * trackWidth;
  };

  const numRate = rate / 100;

  // Generate lists of payments and arcs
  interface VisualItem {
    year: number;
    amount: number;
    label: string;
    isDeposit: boolean;
  }

  interface VisualArc {
    id: number;
    fromYear: number;
    toYear: number;
    label: string;
    calculation: string;
    result: number;
  }

  const items: VisualItem[] = [];
  const arcs: VisualArc[] = [];

  if (type === 'fv') {
    if (mode === 'single') {
      // Single deposit at T=0
      items.push({
        year: 0,
        amount: amount,
        label: 'Startstorting',
        isDeposit: true,
      });

      // Show final accumulated value tick
      const fv = amount * Math.pow(1 + numRate, years);
      items.push({
        year: years,
        amount: fv,
        label: 'Eindwaarde',
        isDeposit: false,
      });

      // Arc from 0 to N
      arcs.push({
        id: 0,
        fromYear: 0,
         toYear: years,
        label: `× (1 + ${numRate.toFixed(2)})^${years}`,
        calculation: `€${amount.toFixed(2)} × (1 + ${numRate.toFixed(3)})^${years}`,
        result: fv,
      });
    } else {
      // Series of payments
      const start = timing === 'begin' ? 0 : 1;
      const end = timing === 'begin' ? years - 1 : years;

      for (let y = 0; y <= years; y++) {
        const isPayingPeriod = y >= start && y <= end;
        if (isPayingPeriod) {
          items.push({
            year: y,
            amount: amount,
            label: `Storting T=${y}`,
            isDeposit: true,
          });
        }
      }

      // Generate arcs showing how each deposit accumulates to T=years
      let arcId = 1;
      for (let y = start; y <= end; y++) {
        const periods = years - y;
        const subFv = amount * Math.pow(1 + numRate, periods);
        if (periods > 0) {
          arcs.push({
            id: arcId++,
            fromYear: y,
            toYear: years,
            label: `× 1.${rate.toFixed(0).padStart(2, '0')}^${periods}`,
            calculation: `€${amount.toFixed(2)} × (1 + ${numRate.toFixed(3)})^${periods}`,
            result: subFv,
          });
        } else {
          arcs.push({
            id: arcId++,
            fromYear: y,
            toYear: years,
            label: `Geen rente (T=${years})`,
            calculation: `€${amount.toFixed(2)} (Direct gestort op einddatum)`,
            result: amount,
          });
        }
      }
    }
  } else {
    // Present Value
    if (mode === 'single') {
      // Single future payment at T=years
      items.push({
        year: years,
        amount: amount,
        label: 'Toekomstig bedrag',
        isDeposit: true,
      });

      const pv = amount / Math.pow(1 + numRate, years);
      items.push({
        year: 0,
        amount: pv,
        label: 'Contante Waarde',
        isDeposit: false,
      });

      // Arc from N backwards to 0
      arcs.push({
        id: 0,
        fromYear: years,
        toYear: 0,
        label: `÷ (1 + ${numRate.toFixed(2)})^${years}`,
        calculation: `€${amount.toFixed(2)} / (1 + ${numRate.toFixed(3)})^${years}`,
        result: pv,
      });
    } else {
      // Series of future outflows/receipts from T=1 to T=years
      for (let y = 1; y <= years; y++) {
        items.push({
          year: y,
          amount: amount,
          label: `Ontvangst T=${y}`,
          isDeposit: true,
        });
      }

      // Arcs discounting back to T=0
      let arcId = 1;
      for (let y = 1; y <= years; y++) {
        const subPv = amount / Math.pow(1 + numRate, y);
        arcs.push({
          id: arcId++,
          fromYear: y,
          toYear: 0,
          label: `÷ 1.${rate.toFixed(0).padStart(2, '0')}^${y}`,
          calculation: `€${amount.toFixed(2)} / (1 + ${numRate.toFixed(3)})^${y}`,
          result: subPv,
        });
      }
    }
  }

  const totalVal: number = type === 'fv'
    ? (mode === 'single'
      ? amount * Math.pow(1 + numRate, years)
      : (Array.from({ length: years + (timing === 'begin' ? 0 : 1) }).reduce((acc: number, _, idx) => {
          const y = timing === 'begin' ? idx : idx + 1;
          if (y > years) return acc;
          return acc + amount * Math.pow(1 + numRate, years - y);
        }, 0) as number))
    : (mode === 'single'
      ? amount / Math.pow(1 + numRate, years)
      : (Array.from({ length: years }).reduce((acc: number, _, idx) => {
          return acc + amount / Math.pow(1 + numRate, idx + 1);
        }, 0) as number));

  return (
    <div className="bg-white rounded-xl shadow-xs border border-blue-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Interactieve Tijdlijn (Getallenlijn)
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {type === 'fv' 
              ? 'Beweeg over de bogen om het rente-op-rente effect van elke storting te zien.'
              : 'Beweeg over de bogen om de terugrekening (disconteren) naar vandaag te zien.'}
          </p>
        </div>
        <div className="text-xs font-mono text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100 mt-2 sm:mt-0">
          Jaarlijkse Rente: {rate}% ({numRate.toFixed(3)})
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto select-none py-2">
        <svg className="min-w-[700px] w-full h-[220px]" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            {/* Markers for Arrowheads */}
            <marker id="arrow-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-left" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 10 1 L 0 5 L 10 9 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-hover-right" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker id="arrow-hover-left" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 10 1 L 0 5 L 10 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Timeline horizon line */}
          <line
            x1={padding - 20}
            y1={timelineY}
            x2={width - padding + 20}
            y2={timelineY}
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Year ticks */}
          {Array.from({ length: years + 1 }).map((_, y) => {
            const x = getX(y);
            return (
              <g key={`tick-${y}`}>
                <line
                  x1={x}
                  y1={timelineY - 8}
                  x2={x}
                  y2={timelineY + 8}
                  stroke="#475569"
                  strokeWidth="3.5"
                />
                <text
                  x={x}
                  y={timelineY + 28}
                  textAnchor="middle"
                  className="font-display font-bold text-xs sm:text-sm fill-slate-700"
                >
                  {y === 0 ? 'T=0 (Nu)' : `T=${y}`}
                </text>
              </g>
            );
          })}

          {/* Draw Bezier Arcs */}
          {arcs.map((arc) => {
            const startX = getX(arc.fromYear);
            const endX = getX(arc.toYear);
            const midX = (startX + endX) / 2;
            const distance = Math.abs(endX - startX);
            const isHovered = hoveredArc === arc.id;

            // Compute curve height based on arc distance
            const curveDepth = Math.max(40, Math.min(85, distance * 0.25));
            const arcY = timelineY - 15;

            // SVG Path: M startX arcY Q midX (arcY - curveDepth) endX arcY
            const pathData = `M ${startX} ${arcY} Q ${midX} ${arcY - curveDepth} ${endX} ${arcY}`;

            const isForward = endX > startX;
            const markerId = isHovered 
              ? (isForward ? 'url(#arrow-hover-right)' : 'url(#arrow-hover-left)')
              : (isForward ? 'url(#arrow-right)' : 'url(#arrow-left)');

            return (
              <g
                key={`arc-${arc.id}`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredArc(arc.id)}
                onMouseLeave={() => setHoveredArc(null)}
              >
                {/* Visual Glow Layer for hover */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHovered ? '#fef3c7' : 'transparent'}
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Core Curve */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHovered ? '#f59e0b' : '#3b82f6'}
                  strokeWidth={isHovered ? '3' : '1.5'}
                  strokeDasharray={isHovered ? 'none' : '3 3'}
                  markerEnd={markerId}
                  className="transition-all duration-200"
                />
                {/* Arc Label near top peak */}
                <g transform={`translate(${midX}, ${arcY - curveDepth / 2 - 8})`}>
                  <rect
                    x="-45"
                    y="-12"
                    width="90"
                    height="18"
                    rx="4"
                    fill={isHovered ? '#fef3c7' : '#f0f5ff'}
                    stroke={isHovered ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="0.5"
                  />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-mono text-[9px] font-semibold ${isHovered ? 'fill-amber-800' : 'fill-blue-600'}`}
                  >
                    {arc.fromYear === arc.toYear ? 'Geen Rente' : arc.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Dots & amounts on timeline */}
          {items.map((item, index) => {
            const x = getX(item.year);
            const isFutureAccumulation = !item.isDeposit;

            return (
              <g key={`item-${index}`} className="transition-all duration-200">
                {/* Outer halo */}
                <circle
                  cx={x}
                  cy={timelineY}
                  r={isFutureAccumulation ? '10' : '7'}
                  className={isFutureAccumulation ? 'fill-emerald-100 animate-pulse' : 'fill-blue-100'}
                />
                {/* Inner dot */}
                <circle
                  cx={x}
                  cy={timelineY}
                  r="5"
                  className={isFutureAccumulation ? 'fill-emerald-600' : 'fill-blue-600'}
                />

                {/* Amount label tag ABOVE/ON timeline */}
                <g transform={`translate(${x}, ${timelineY - 36})`}>
                  <rect
                    x="-40"
                    y="-10"
                    width="80"
                    height="20"
                    rx="5"
                    fill={isFutureAccumulation ? '#ecfdf5' : '#f8fafc'}
                    stroke={isFutureAccumulation ? '#10b981' : '#e2e8f0'}
                    strokeWidth={isFutureAccumulation ? '1.5' : '1'}
                    className="shadow-xs"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className={`font-mono text-xs font-bold ${isFutureAccumulation ? 'fill-emerald-700' : 'fill-slate-800'}`}
                  >
                    €{item.amount.toFixed(2)}
                  </text>
                </g>

                {/* Subtitle tag below timeline */}
                <text
                  x={x}
                  y={timelineY - 50}
                  textAnchor="middle"
                  className="font-sans text-[10px] text-slate-500 font-semibold uppercase tracking-wider"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Tooltip showing calculations */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-2 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          {hoveredArc !== null ? (
            <div>
              <p className="font-semibold text-slate-700">Geselecteerde rentestap:</p>
              <p className="font-mono text-blue-600 text-xs mt-1 bg-white p-1.5 rounded border border-blue-50 inline-block">
                {arcs.find((a) => a.id === hoveredArc)?.calculation} ={' '}
                <span className="font-bold">€{arcs.find((a) => a.id === hoveredArc)?.result.toFixed(2)}</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-slate-700">Weergave overzicht:</p>
              <p className="text-slate-600 mt-0.5 text-xs">
                {type === 'fv' 
                ? `De totale eindwaarde is de optelsom van de individuele, geaccumuleerde stortingen: ` 
                : `De totale contante waarde is de optelsom van alle op T=0 gedisconteerde bedragen: `}
                <span className="font-bold font-mono text-blue-600">
                  €{totalVal.toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
