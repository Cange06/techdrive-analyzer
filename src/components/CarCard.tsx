import React from "react";
import { CarRecommendation } from "../types";
import { Settings, TrendingDown, Wallet, AlertTriangle, Star, Calendar, Box } from "lucide-react";
import { motion } from "motion/react";

interface CarCardProps {
  car: CarRecommendation;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="tech-card rounded-lg overflow-hidden flex flex-col h-full border-t-4 border-t-blue-600"
    >
      <div className="p-5 bg-industrial-blue/30 border-b border-tech-accent">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">{car.marca_modello}</h3>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center gap-1 text-[10px] text-gray-400 uppercase mono-data">
                <Calendar size={10} /> {car.anno_consigliato}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400 uppercase mono-data">
                <Box size={10} /> {car.segmento}
              </span>
            </div>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/30 px-2 py-1 rounded flex items-center gap-1">
            <span className="mono-data text-sm font-bold text-blue-400">{car.analisi_tecnica.voto_affidabilita}</span>
            <Star size={12} className="text-blue-400 fill-blue-400" />
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow space-y-4">
        {/* Technical Analysis */}
        <section>
          <div className="flex items-center gap-2 mb-2 text-blue-300">
            <Settings size={16} />
            <h4 className="text-xs font-bold uppercase tracking-widest">Analisi Meccanica</h4>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{car.analisi_tecnica.motore_trasmissione}</p>
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-900/10 border border-red-900/20 rounded">
            <AlertTriangle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-300/90 leading-tight">
              <span className="font-bold uppercase text-[10px] block mb-1">Punto Debole Critico:</span> 
              {car.analisi_tecnica.punto_debole}
            </p>
          </div>
        </section>

        {/* Economic Data */}
        <section className="grid grid-cols-2 gap-4 pt-4 border-t border-tech-accent/50">
          <div>
            <div className="flex items-center gap-1 mb-1 text-gray-500">
              <Wallet size={14} />
              <span className="text-[10px] uppercase font-bold tracking-tighter">Prezzo Stimato</span>
            </div>
            <p className="mono-data text-sm font-bold text-ice-white">{car.dati_economici.prezzo_stimato}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1 text-gray-500">
              <TrendingDown size={14} />
              <span className="text-[10px] uppercase font-bold tracking-tighter">Svalutazione (5a)</span>
            </div>
            <p className="mono-data text-sm font-bold text-red-400/80">{car.dati_economici.svalutazione_5anni}</p>
          </div>
        </section>

        <div className="pt-4 border-t border-tech-accent/50">
          <div className="flex justify-between items-center bg-black/20 p-3 rounded">
            <span className="text-[10px] text-gray-400 uppercase font-bold">TCO Mensile Stimato</span>
            <p className="mono-data text-lg font-bold text-green-400">{car.dati_economici.tco_mensile}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
