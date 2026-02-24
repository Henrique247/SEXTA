import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Search, MapPin, Pill, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function Pharmacy() {
  const [search, setSearch] = useState('');
  const { data: medications, isLoading } = useQuery({
    queryKey: ['medications'],
    queryFn: () => fetch('/api/medications').then(res => res.json())
  });

  const filteredMeds = medications?.filter((m: any) => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace de Farmácias</h2>
          <p className="text-slate-500">Encontre medicamentos e verifique disponibilidade em Luanda.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar medicamento..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeds?.map((med: any) => (
            <motion.div layout key={med.id}>
              <Card className="group hover:border-emerald-200 transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Pill size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                      <Check size={12} /> Em estoque
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{med.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                      <MapPin size={14} />
                      {med.pharmacy_name}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">{formatCurrency(med.price)}</span>
                    <Button className="gap-2">
                      <ShoppingCart size={16} />
                      Comprar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Card className="p-8 bg-slate-900 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Entrega Expressa KudiMed</h3>
            <p className="text-slate-400 text-sm max-w-md">Receba seus medicamentos em casa em até 60 minutos em qualquer zona de Luanda.</p>
          </div>
          <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold whitespace-nowrap">
            Ativar Geolocalização
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      </Card>
    </div>
  );
}
