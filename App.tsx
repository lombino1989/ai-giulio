

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobeVisualization } from './components/GlobeVisualization';
import { ControlPanel } from './components/ControlPanel';
import { ImpactMetricsDisplay } from './components/ImpactMetricsDisplay';
import { Section } from './components/Section';
import { Card } from './components/Card';
import { mockTrafficService, TrafficData } from './services/mockTrafficService';
import { BrainIcon, ChartBarIcon, CloudIcon, CogIcon, CubeTransparentIcon, GlobeAltIcon, LightBulbIcon, PaperAirplaneIcon, ScaleIcon, ShieldCheckIcon, SparklesIcon, WifiIcon, BoltIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  useEffect(() => {
    const service = mockTrafficService((data) => {
      setTrafficData(data);
    });

    service.start();
    return () => service.stop();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        
        <Section title="Q-Traffic AI: Rivoluzionare la Gestione del Traffico Aereo" icon={<LightBulbIcon className="w-8 h-8 text-sky-400" />}>
          <p className="text-lg text-slate-300">
            Q-Traffic AI è un sistema visionario che sfrutta l'intelligenza artificiale all'avanguardia e il calcolo quantistico per ottimizzare il traffico aereo globale in tempo reale. Supera i metodi predittivi tradizionali analizzando istantaneamente set di dati vasti e complessi, garantendo cieli più sicuri, efficienti ed ecologici.
          </p>
        </Section>

        <Section title="Come Funziona?" icon={<CogIcon className="w-8 h-8 text-sky-400" />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Apprendimento Automatico Quantistico" icon={<BrainIcon className="w-6 h-6 text-purple-400" />}>
              Utilizza algoritmi di ML quantistico per elaborare dati complessi e multidimensionali in tempo reale, superando di gran lunga le capacità classiche.
            </Card>
            <Card title="Ottimizzazione Probabilistica" icon={<ChartBarIcon className="w-6 h-6 text-green-400" />}>
              Simula scenari futuri con tecniche probabilistiche avanzate per identificare rotte ottimali e modelli di flusso del traffico.
            </Card>
            <Card title="Integrazione Sensori IoT" icon={<WifiIcon className="w-6 h-6 text-blue-400" />}>
              Si connette con i sensori IoT sugli aeromobili per aggiornamenti dinamici e automatici delle rotte in base alle condizioni in tempo reale.
            </Card>
            <Card title="Comunicazione Quantistica" icon={<BoltIcon className="w-6 h-6 text-yellow-400" />}>
              Abilita una comunicazione ultra-veloce e sicura tra torri di controllo e piloti, basata sui principi della tecnologia quantistica.
            </Card>
          </div>
        </Section>

        <Section title="Panoramica del Sistema in Tempo Reale" icon={<GlobeAltIcon className="w-8 h-8 text-sky-400" />}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <GlobeVisualization flights={trafficData?.flights || []} />
            </div>
            <div className="space-y-6">
              <ControlPanel 
                variables={trafficData?.variablesAnalyzed || []} 
                systemStatus={trafficData?.systemStatus || { quantumProcessingLoad:0, iotSensorConnections:0, dataThroughputGbps:0, aiModelAccuracy:0 }}
              />
            </div>
          </div>
        </Section>

        <Section title="Impatti Previsti" icon={<SparklesIcon className="w-8 h-8 text-sky-400" />}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Efficienza Migliorata" icon={<PaperAirplaneIcon className="w-6 h-6 text-teal-400" />}>
              Miglioramento significativo del flusso del traffico aereo, riducendo drasticamente i ritardi e ottimizzando l'utilizzo dello spazio aereo. Previsto un aumento dell'efficienza del {trafficData?.impactMetrics.efficiencyGainPercent || 0}%.
            </Card>
            <Card title="Maggiore Sicurezza" icon={<ShieldCheckIcon className="w-6 h-6 text-red-400" />}>
              Identificazione proattiva dei pericoli ed elusione delle collisioni attraverso analisi predittive in tempo reale. {trafficData?.impactMetrics.safetyIncidentsPrevented || 0} potenziali incidenti evitati giornalmente.
            </Card>
            <Card title="Riduzione Carburante ed Emissioni" icon={<CloudIcon className="w-6 h-6 text-lime-400" />}>
              Rotte di volo ottimizzate portano a un minor consumo di carburante e a ridotte emissioni inquinanti, contribuendo a un pianeta più verde. {trafficData?.impactMetrics.fuelSavedMillionsLiters || 0}M litri di carburante risparmiati annualmente.
            </Card>
          </div>
          {trafficData && <ImpactMetricsDisplay metrics={trafficData.impactMetrics} />}
        </Section>

      </main>
      <Footer />
    </div>
  );
};

export default App;