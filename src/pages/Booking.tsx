import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Calendar, User, Clock, CreditCard, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const specialties = ['Clínica Geral', 'Pediatria', 'Ginecologia', 'Cardiologia', 'Dermatologia'];
const doctors = [
  { id: 'd1', name: 'Dra. Ana Paula', specialty: 'Clínica Geral', price: 15000 },
  { id: 'd2', name: 'Dr. Manuel Bento', specialty: 'Pediatria', price: 18000 },
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<any>({
    specialty: '',
    doctor: null,
    date: '',
    time: ''
  });
  const [isPaying, setIsPaying] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handlePayment = async () => {
    setIsPaying(true);
    // Mock Multicaixa Express delay
    await new Promise(r => setTimeout(r, 2000));
    
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'p1',
        doctorId: selection.doctor.id,
        specialty: selection.specialty,
        date: `${selection.date} ${selection.time}`
      })
    });
    
    setIsPaying(false);
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agendar Consulta</h2>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                step >= i ? "bg-emerald-500" : "bg-slate-200"
              )} 
            />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step1" className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Selecione a Especialidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelection({ ...selection, specialty: s }); nextStep(); }}
                  className={cn(
                    "p-6 text-left rounded-2xl border-2 transition-all hover:border-emerald-500 group",
                    selection.specialty === s ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-white"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{s}</span>
                    <ChevronRight className="text-slate-300 group-hover:text-emerald-500" size={20} />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step2" className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Escolha o Médico e Horário</h3>
            <div className="space-y-4">
              {doctors.filter(d => d.specialty === selection.specialty || !selection.specialty).map(d => (
                <Card key={d.id} className={cn("p-4 cursor-pointer border-2", selection.doctor?.id === d.id ? "border-emerald-500" : "border-transparent")} onClick={() => setSelection({ ...selection, doctor: d })}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{formatCurrency(d.price)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {selection.doctor && (
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" onChange={(e) => setSelection({ ...selection, date: e.target.value })} />
                <Input type="time" onChange={(e) => setSelection({ ...selection, time: e.target.value })} />
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">Voltar</Button>
              <Button onClick={nextStep} disabled={!selection.doctor || !selection.date} className="flex-1">Continuar</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step3" className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Pagamento Multicaixa Express</h3>
            <Card className="p-6 bg-slate-50 border-dashed border-2 border-slate-200">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Serviço</span>
                  <span className="font-semibold">Consulta de {selection.specialty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Médico</span>
                  <span className="font-semibold">{selection.doctor?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Data e Hora</span>
                  <span className="font-semibold">{selection.date} às {selection.time}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between">
                  <span className="font-bold">Total a Pagar</span>
                  <span className="font-bold text-xl text-emerald-600">{formatCurrency(selection.doctor?.price || 0)}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <p className="text-xs text-slate-500 text-center">Insira o número de telefone associado ao seu Multicaixa Express</p>
              <div className="flex gap-2">
                <div className="bg-slate-100 flex items-center px-3 rounded-xl text-sm font-bold text-slate-500">+244</div>
                <Input placeholder="9XX XXX XXX" className="flex-1" />
              </div>
              <Button onClick={handlePayment} disabled={isPaying} className="w-full h-12 gap-2">
                {isPaying ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                {isPaying ? 'Aguardando Aprovação no App...' : 'Pagar Agora'}
              </Button>
              <Button variant="ghost" onClick={prevStep} className="w-full">Cancelar</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key="step4" className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Consulta Agendada!</h3>
              <p className="text-slate-500">Seu agendamento foi confirmado. Você receberá um SMS com os detalhes e o link para a teleconsulta se aplicável.</p>
            </div>
            <Button onClick={() => window.location.href = '/'} className="px-8">Voltar ao Dashboard</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
