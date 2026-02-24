import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Stethoscope, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getTriageSuggestion } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function Triage() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTriage = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const suggestion = await getTriageSuggestion(symptoms);
      setResult(suggestion);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Stethoscope size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Triagem Inteligente IA</h2>
        <p className="text-slate-500">Descreva seus sintomas e nossa IA sugerirá a especialidade e urgência baseada no Protocolo de Manchester.</p>
      </header>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">O que você está sentindo?</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Ex: Estou com febre alta há 2 dias, dor de cabeça intensa e tosse seca..."
            className="w-full h-32 rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          />
        </div>
        <Button 
          onClick={handleTriage} 
          disabled={loading || !symptoms} 
          className="w-full h-12 gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          {loading ? 'Analisando Sintomas...' : 'Iniciar Triagem'}
        </Button>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="p-8 border-t-4" style={{ borderTopColor: result.color }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Resultado da Triagem</p>
                  <h3 className="text-2xl font-bold text-slate-900">{result.specialty}</h3>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                  style={{ backgroundColor: `${result.color}20`, color: result.color }}
                >
                  {result.urgency}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="text-slate-400 shrink-0" size={20} />
                  <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">Agendar Agora</Button>
                <Button className="w-full">Ver Hospitais Próximos</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
        <CheckCircle2 size={12} />
        Este é um sistema de apoio. Em caso de emergência grave, ligue 112.
      </div>
    </div>
  );
}
