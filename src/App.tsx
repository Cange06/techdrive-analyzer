import React, { useState } from "react";
import { CarRecommendation } from "./types";
import { CarCard } from "./components/CarCard";
import { Search, Loader2, Gauge, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [budget, setBudget] = useState("");
  const [kmAnnui, setKmAnnui] = useState("");
  const [usoPrevalente, setUsoPrevalente] = useState("");
  const [carburante, setCarburante] = useState("");
  const [preferenze, setPreferenze] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CarRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Initialize Gemini in the frontend as per system guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const prompt = `
        Agisci come TechDrive Analyzer, un ingegnere meccanico freddo e analitico.
        Dati utente:
        - Budget: ${budget} €
        - Km annui: ${kmAnnui}
        - Uso prevalente: ${usoPrevalente}
        - Carburante preferito: ${carburante || "Qualsiasi (valuta tu in base ai km)"}
        - Altre preferenze: ${preferenze || "Nessuna"}

        Analizza il mercato e fornisci esattamente 4 raccomandazioni di auto (per una griglia 2x2).
        Concentrati su affidabilità meccanica, TCO, svalutazione e dati tecnici reali.
        Disprezza il marketing. Sii onesto sui difetti.

        RISPONDI ESCLUSIVAMENTE CON UN OGGETTO JSON PURO (senza markdown, senza testo extra) con questa struttura:
        {
          "recommendations": [
            {
              "marca_modello": "Nome Modello",
              "anno_consigliato": "202X",
              "segmento": "SUV/Berlina/etc",
              "analisi_tecnica": {
                "motore_trasmissione": "Dettagli tecnici su affidabilità",
                "punto_debole": "Il difetto meccanico noto",
                "voto_affidabilita": 8
              },
              "dati_economici": {
                "prezzo_stimato": "€ 25.000",
                "svalutazione_5anni": "35%",
                "tco_mensile": "€ 450"
              }
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      });

      const result = JSON.parse(response.text || "{}");
      if (result.recommendations) {
        setResults(result.recommendations);
      } else {
        throw new Error("Formato risposta non valido");
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("Errore durante l'analisi tecnica. Verifica la connessione o la chiave API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-industrial-dark text-ice-white selection:bg-blue-500/30 overflow-hidden">
      {/* Header */}
      <header className="border-b border-tech-accent bg-industrial-blue/50 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded">
              <Gauge className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter uppercase">TechDrive Analyzer</h1>
              <p className="text-[10px] text-gray-400 uppercase mono-data tracking-widest">Mechanical Engineering Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-4 py-6 md:py-8 grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Input Section - Scrollable if needed */}
          <div className="lg:col-span-4 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                <Info size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Parametri di Input</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Inserisci i dati tecnici per avviare l'analisi. Il sistema ignorerà le preferenze estetiche a favore di affidabilità e TCO.
              </p>
            </section>

            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mono-data">Budget Massimo (€)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="es. 30000"
                  className="w-full bg-industrial-blue border border-tech-accent rounded px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors mono-data"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mono-data">Km Annui Stimati</label>
                <input
                  type="number"
                  required
                  value={kmAnnui}
                  onChange={(e) => setKmAnnui(e.target.value)}
                  placeholder="es. 15000"
                  className="w-full bg-industrial-blue border border-tech-accent rounded px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors mono-data"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mono-data">Uso Prevalente</label>
                <select
                  required
                  value={usoPrevalente}
                  onChange={(e) => setUsoPrevalente(e.target.value)}
                  className="w-full bg-industrial-blue border border-tech-accent rounded px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="">Seleziona...</option>
                  <option value="Urbano">Urbano / Città</option>
                  <option value="Autostradale">Autostradale / Lunghe distanze</option>
                  <option value="Misto">Misto (Città + Extraurbano)</option>
                  <option value="Montagna">Montagna / Off-road leggero</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mono-data">Tipo di Carburante</label>
                <select
                  value={carburante}
                  onChange={(e) => setCarburante(e.target.value)}
                  className="w-full bg-industrial-blue border border-tech-accent rounded px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="">Qualsiasi (Consigliato)</option>
                  <option value="Benzina">Benzina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="GPL">GPL</option>
                  <option value="Elettrico">Elettrico</option>
                  <option value="Ibrido">Ibrido</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mono-data">Note / Preferenze Extra</label>
                <textarea
                  value={preferenze}
                  onChange={(e) => setPreferenze(e.target.value)}
                  placeholder="es. Cambio automatico obbligatorio, 5 porte..."
                  rows={3}
                  className="w-full bg-industrial-blue border border-tech-accent rounded px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-4 rounded flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analisi in corso...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Avvia Analisi Tecnica
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section - Scrollable if needed */}
          <div className="lg:col-span-8 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-6 py-10"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-bold uppercase tracking-tighter">Elaborazione Parametri</p>
                    <p className="text-sm text-gray-500 mono-data">Consultazione database affidabilità meccanica...</p>
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-tech-accent pb-4">
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">Verdetto Ingegneristico</h2>
                    <div className="flex items-center gap-4">
                      <span className="bg-blue-900/40 text-blue-300 text-[10px] px-2 py-1 rounded border border-blue-800 mono-data">
                        {results.length} MODELLI ANALIZZATI
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.map((car, index) => (
                      <CarCard key={index} car={car} />
                    ))}
                  </div>

                  <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg flex gap-4">
                    <Info className="text-blue-400 shrink-0" size={20} />
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      Nota: I dati sopra riportati sono stime basate su analisi di mercato e database di affidabilità. 
                      Il TCO include manutenzione ordinaria, consumi medi e costi fissi stimati.
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center py-10 text-center space-y-4"
                >
                  <AlertTriangle size={48} className="text-red-500" />
                  <div className="space-y-2">
                    <p className="text-xl font-bold uppercase">Errore di Sistema</p>
                    <p className="text-sm text-gray-500">{error}</p>
                  </div>
                  <button 
                    onClick={() => setError(null)}
                    className="text-blue-400 hover:underline text-sm uppercase font-bold tracking-widest"
                  >
                    Riprova
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center py-10 text-center space-y-6 border-2 border-dashed border-tech-accent rounded-2xl"
                >
                  <Gauge size={64} className="text-gray-700" />
                  <div className="space-y-2 max-w-md">
                    <p className="text-xl font-bold uppercase tracking-tighter">Analizzatore Pronto</p>
                    <p className="text-sm text-gray-500">
                      Inserisci i parametri tecnici nel modulo a sinistra per ricevere una consulenza ingegneristica imparziale.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="border-t border-tech-accent py-3 bg-black/20 shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[9px] text-gray-500 uppercase mono-data tracking-widest">
            TechDrive Analyzer v1.0.4 // Proprietary Analysis Engine
          </p>
          <p className="text-[9px] text-gray-600 uppercase mono-data">
            © 2026 Industrial Intelligence Systems.
          </p>
        </div>
      </footer>
    </div>
  );
}
