export interface CarRecommendation {
  marca_modello: string;
  anno_consigliato: string;
  segmento: string;
  analisi_tecnica: {
    motore_trasmissione: string;
    punto_debole: string;
    voto_affidabilita: number;
  };
  dati_economici: {
    prezzo_stimato: string;
    svalutazione_5anni: string;
    tco_mensile: string;
  };
  search_keyword: string;
}

export interface AnalysisResponse {
  recommendations: CarRecommendation[];
}
