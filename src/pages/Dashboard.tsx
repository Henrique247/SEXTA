import { useQuery } from '@tanstack/react-query';
import { Card, Button } from '../components/ui';
import { Calendar, FileText, Wallet, ArrowRight, Clock, MapPin, User } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => fetch('/api/me').then(res => res.json())
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: () => fetch(`/api/appointments?userId=${user?.id}`).then(res => res.json()),
    enabled: !!user?.id
  });

  const { data: prescriptions } = useQuery({
    queryKey: ['prescriptions', user?.id],
    queryFn: () => fetch(`/api/prescriptions?userId=${user?.id}`).then(res => res.json()),
    enabled: !!user?.id
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Olá, {user?.name?.split(' ')[0]}</h2>
        <p className="text-slate-500">Bem-vindo ao seu ecossistema de saúde KudiMed.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <Card className="bg-slate-900 text-white p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <Wallet className="text-emerald-400" size={24} />
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Carteira Digital</span>
            </div>
            <p className="text-sm opacity-70 mb-1">Saldo Disponível</p>
            <h3 className="text-3xl font-bold tracking-tight">{formatCurrency(user?.wallet_balance || 0)}</h3>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </Card>

        {/* Stats */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-emerald-600 mb-4">
            <Calendar size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Próxima Consulta</span>
          </div>
          {appointments?.[0] ? (
            <div>
              <p className="font-bold text-slate-900">{appointments[0].doctor_name}</p>
              <p className="text-sm text-slate-500">{appointments[0].specialty}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <Clock size={14} />
                {appointments[0].date}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Nenhuma consulta agendada.</p>
          )}
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-blue-600 mb-4">
            <FileText size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Receitas Recentes</span>
          </div>
          {prescriptions?.[0] ? (
            <div>
              <p className="font-bold text-slate-900">Prescrição #{prescriptions[0].id}</p>
              <p className="text-sm text-slate-500">{prescriptions[0].doctor_name}</p>
              <p className="text-xs text-slate-400 mt-2">{prescriptions[0].date}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Sem receitas no histórico.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Consultas Agendadas</h3>
            <Button variant="ghost" className="text-xs">Ver todas</Button>
          </div>
          <div className="space-y-4">
            {appointments?.map((apt: any) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={apt.id}>
                <Card className="p-4 flex items-center justify-between hover:border-emerald-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{apt.doctor_name}</p>
                      <p className="text-xs text-slate-500">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{apt.date}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Confirmada</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Marketplace de Farmácias</h3>
            <Button variant="ghost" className="text-xs">Ver mapa</Button>
          </div>
          <Card className="p-6 bg-emerald-600 text-white">
            <h4 className="font-bold mb-2">Precisa de medicamentos?</h4>
            <p className="text-sm text-emerald-50 mb-4">Verifique a disponibilidade em tempo real nas farmácias mais próximas de Luanda.</p>
            <Button variant="secondary" className="w-full bg-white text-emerald-700 hover:bg-emerald-50">
              Buscar Medicamentos
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
