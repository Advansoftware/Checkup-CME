'use client';

import React, { useState, useMemo } from 'react';
import {
  Shield, FileText, Target, Download, BarChart3,
  HeartPulse, AlertTriangle, TrendingDown, TrendingUp,
  AlertCircle, DollarSign, ArrowDownRight, ArrowUpRight,
  ShieldAlert, Activity, Minus, Lock, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CATEGORIES, ESTABLISHMENT_TYPES, BED_COUNT_OPTIONS,
  CME_PROFESSIONALS_OPTIONS, REGIONS, CategoryKey,
  getClassification, getClassificationColor, getClassificationBg,
} from '@/lib/types';
import { checkupQuestions } from '@/lib/checkup-questions';

// ============================
// Section toggles
// ============================
type SectionKey = 'categoryClassification' | 'strongWeakPoints' | 'statistics' | 'financialAnalysis' | 'top5Worst' | 'adminObservation' | 'adjustedFinancials' | 'recommendations' | 'visibilityGaps';

const DEFAULT_SECTIONS: Record<SectionKey, boolean> = {
  categoryClassification: true,
  strongWeakPoints: true,
  statistics: true,
  financialAnalysis: true,
  top5Worst: true,
  adminObservation: true,
  adjustedFinancials: true,
  recommendations: true,
  visibilityGaps: true,
};

const SECTION_META: Record<SectionKey, { label: string; icon: React.ReactNode }> = {
  categoryClassification: { label: 'Classificação por Categoria', icon: <BarChart3 className="w-4 h-4" /> },
  strongWeakPoints: { label: 'Ponto Forte & Crítico', icon: <TrendingUp className="w-4 h-4" /> },
  statistics: { label: 'Estatísticas', icon: <Activity className="w-4 h-4" /> },
  financialAnalysis: { label: 'Análise Financeira', icon: <DollarSign className="w-4 h-4" /> },
  top5Worst: { label: 'Top 5 Críticos', icon: <ArrowDownRight className="w-4 h-4" /> },
  adminObservation: { label: 'Observação do Especialista', icon: <HeartPulse className="w-4 h-4" /> },
  adjustedFinancials: { label: 'Dados Financeiros Ajustados', icon: <FileText className="w-4 h-4" /> },
  recommendations: { label: 'Recomendações', icon: <Target className="w-4 h-4" /> },
  visibilityGaps: { label: 'Lacunas de Visibilidade', icon: <AlertTriangle className="w-4 h-4" /> },
};

// ============================
// Circular Progress
// ============================
function CircularProgress({ percentage, size = 180, strokeWidth = 12, label }: {
  percentage: number; size?: number; strokeWidth?: number; label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? '#059669' : percentage >= 60 ? '#0D9488' : percentage >= 40 ? '#D97706' : '#DC2626';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="circular-progress" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.93 0.025 165)" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{Math.round(percentage)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      </div>
    </div>
  );
}

function getClassificationIcon(classification: string) {
  switch (classification) {
    case 'Avançado': return <TrendingUp className="w-3.5 h-3.5" />;
    case 'Moderado': return <Minus className="w-3.5 h-3.5" />;
    case 'Atenção': return <AlertTriangle className="w-3.5 h-3.5" />;
    case 'Crítico': return <ShieldAlert className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-teal-600 bg-teal-50';
  if (score >= 40) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

// ============================
// MOCK DATA
// ============================
function generateMockResponses(): Record<string, number> {
  const m: Record<string, number> = {};
  m['gestao_1']=2;m['gestao_2']=3;m['gestao_3']=2;m['gestao_4']=1;m['gestao_5']=0;
  m['gestao_6']=3;m['gestao_7']=1;m['gestao_8']=2;m['gestao_9']=3;m['gestao_10']=2;
  m['processo_1']=2;m['processo_2']=3;m['processo_3']=1;m['processo_4']=0;m['processo_5']=2;
  m['processo_6']=3;m['processo_7']=1;m['processo_8']=2;m['processo_9']=0;m['processo_10']=2;
  m['processo_11']=3;m['processo_12']=1;m['processo_13']=2;m['processo_14']=0;m['processo_15']=2;
  m['processo_16']=3;m['processo_17']=1;m['processo_18']=2;
  m['tecnologia_1']=1;m['tecnologia_2']=2;m['tecnologia_3']=1;m['tecnologia_4']=0;m['tecnologia_5']=2;
  m['tecnologia_6']=1;m['tecnologia_7']=3;m['tecnologia_8']=2;m['tecnologia_9']=0;m['tecnologia_10']=1;
  m['tecnologia_11']=2;m['tecnologia_12']=1;m['tecnologia_13']=2;m['tecnologia_14']=1;
  m['financeiro_1']=2;m['financeiro_2']=1;m['financeiro_3']=1;m['financeiro_4']=2;
  m['financeiro_5']=3;m['financeiro_6']=1;m['financeiro_7']=0;m['financeiro_8']=1;
  m['financeiro_9']=2;m['financeiro_10']=1;
  return m;
}

const MOCK = {
  name: 'Dr. Carlos Eduardo Silva', position: 'Enfermeiro Supervisor CME',
  phone: '(11) 98765-4321', email: 'carlos.silva@hospitalabc.com.br',
  establishmentType: 'hospital_geral', bedCount: '51_a_100', cmeProfessionals: '7_a_10',
  region: 'sudeste', state: 'SP',
  totalScore: 42.5, managementScore: 48.2, processScore: 45.1, technologyScore: 35.8, financialScore: 28.3,
  adminObservation: 'Prezado Dr. Carlos, sua CME apresenta deficiências significativas na área tecnológica e financeira. Identificamos oportunidades de economia de R$ 8.000 a R$ 25.000/mês com otimização de processos e redução de desperdícios. Recomendamos uma consultoria presencial para mapeamento detalhado.',
  economyMinEdited: 15, economyMaxEdited: 35, financialRiskLevelEdited: 'Alto',
  financialLossEdited: 'R$ 96.000 - R$ 300.000/ano',
};

// ============================
// Financial cost maps
// ============================
const FIN_COSTS: Record<string, Record<number, string>> = {
  financeiro_2: {1:'R$ 80.000 - R$ 200.000/ano',2:'R$ 40.000 - R$ 80.000/ano',3:'R$ 5.000 - R$ 40.000/ano',4:'Sem custo'},
  financeiro_3: {1:'R$ 15.000 - R$ 50.000/ano',2:'R$ 8.000 - R$ 15.000/ano',3:'R$ 2.000 - R$ 8.000/ano',4:'Abaixo de R$ 2.000/ano'},
  financeiro_4: {1:'R$ 30.000 - R$ 100.000/ano',2:'R$ 12.000 - R$ 30.000/ano',3:'R$ 3.000 - R$ 12.000/ano',4:'Abaixo de R$ 3.000/ano'},
  financeiro_6: {1:'Acima de R$ 10.000/mês',2:'R$ 5.000 - R$ 10.000/mês',3:'R$ 1.000 - R$ 5.000/mês',4:'Abaixo de R$ 1.000/mês'},
  financeiro_8: {1:'Risco alto: perda de cirurgiões',2:'Risco moderado',3:'Risco baixo',4:'Sem risco'},
  financeiro_10: {1:'Acima de R$ 5.000/mês',2:'R$ 2.000 - R$ 5.000/mês',3:'R$ 500 - R$ 2.000/mês',4:'Abaixo de R$ 500/mês'},
};
const FIN_LABELS: Record<string, string> = {
  financeiro_2:'Cancelamentos de Cirurgia',financeiro_3:'Reprocessamentos',financeiro_4:'Perdas de Instrumentais',
  financeiro_6:'Manutenção Corretiva',financeiro_8:'Reclamações de Cirurgiões',financeiro_10:'Desperdício de Insumos',
};

// ============================
// Page
// ============================
export default function SimulacaoPage() {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>(DEFAULT_SECTIONS);
  const responses = useMemo(() => generateMockResponses(), []);
  const data = MOCK;

  const classification = getClassification(data.totalScore);
  const classColor = getClassificationColor(classification);
  const classBg = getClassificationBg(classification);

  const categoryScores = [
    { category: 'gestao' as CategoryKey, label: 'Gestão', percentage: data.managementScore },
    { category: 'processo' as CategoryKey, label: 'Processo', percentage: data.processScore },
    { category: 'tecnologia' as CategoryKey, label: 'Tecnologia', percentage: data.technologyScore },
    { category: 'financeiro' as CategoryKey, label: 'Financeiro e Riscos', percentage: data.financialScore },
  ];

  const sortedCategories = [...categoryScores].sort((a, b) => a.percentage - b.percentage);
  const weakestCategories = sortedCategories.slice(0, 2);
  const weakestCategory = sortedCategories[0];
  const strongestCategory = sortedCategories[sortedCategories.length - 1];

  const recommendations: Record<CategoryKey, string> = {
    gestao: 'Fortaleça a liderança com capacitação gerencial, implemente reuniões periódicas de acompanhamento de KPIs, e estruture um programa formal de gestão de riscos e planejamento estratégico para o CME.',
    processo: 'Revise e atualize POPs, fortaleça o programa de monitoramento com Indicador Biológico (IB) e Indicador Químico (IQ), implante auditorias internas sistemáticas, e padronize o fluxo de rastreabilidade de materiais em todas as etapas.',
    tecnologia: 'Invista em sistemas de gestão informatizados, implemente monitoramento digital em tempo real, estabeleça programa de manutenção preventiva calibrada, e avalie oportunidades de automação de processos repetitivos.',
    financeiro: 'Implemente controle detalhado de custos por categoria, realize análises de ROI antes de investimentos, otimize contratos com fornecedores, e crie um plano de redução de desperdícios com metas mensuráveis.',
  };

  const visibilityGaps: { question: string; cat: string }[] = [];
  Object.entries(responses).forEach(([qId, val]) => {
    if (val === 0) {
      const q = checkupQuestions.find(q => q.id === qId);
      if (q) { const c = CATEGORIES.find(c => c.key === q.category); visibilityGaps.push({ question: q.question, cat: c?.label ?? '' }); }
    }
  });

  const totalQuestions = checkupQuestions.length;
  const totalAnswered = Object.keys(responses).filter(k => responses[k] > 0).length;
  const totalNoInfo = Object.keys(responses).filter(k => responses[k] === 0).length;

  const worstQuestions = checkupQuestions.map(q => {
    const a = responses[q.id]; if (a === undefined || a === 0) return null;
    return { question: q, answer: a, relativeScore: a / 4 };
  }).filter(Boolean).sort((a, b) => (a?.relativeScore ?? 0) - (b?.relativeScore ?? 0)).slice(0, 5) as { question: typeof checkupQuestions[0]; answer: number; relativeScore: number }[];

  const financialItems: { label: string; answerLabel: string; impact: string; cost: string; val: number }[] = [];
  Object.entries(FIN_LABELS).forEach(([qId, label]) => {
    const a = responses[qId]; if (!a || a === 0) return;
    const q = checkupQuestions.find(q => q.id === qId); if (!q) return;
    const opt = q.options.find(o => o.value === a);
    financialItems.push({ label, answerLabel: opt?.label ?? '', impact: opt?.impact ?? '', cost: FIN_COSTS[qId]?.[a] ?? 'N/A', val: a });
  });

  const waste = { minMonthly: 18750, maxMonthly: 42833, minAnnual: 225000, maxAnnual: 514000 };

  const stateLabel = (() => {
    for (const r of REGIONS) { const s = r.states.find(st => st.id === data.state); if (s) return `${r.label} - ${s.label}`; }
    return data.state;
  })();

  const toggle = (key: SectionKey) => setSections(p => ({ ...p, [key]: !p[key] }));
  const activeCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Simulação Badge */}
      <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2">
        <Lock className="w-4 h-4" />
        MODO SIMULAÇÃO — Prévia para avaliação do admin
      </div>

      {/* ===== TOGGLE PANEL — STICKY ===== */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Controlar seções visíveis ({activeCount}/{Object.keys(sections).length} ativas)
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSections(Object.keys(DEFAULT_SECTIONS).reduce((a, k) => ({ ...a, [k]: true }), {} as Record<SectionKey, boolean>))} className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium">Ativar Todas</button>
              <button onClick={() => setSections(Object.keys(DEFAULT_SECTIONS).reduce((a, k) => ({ ...a, [k]: false }), {} as Record<SectionKey, boolean>))} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">Desativar Todas</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(SECTION_META) as [SectionKey, { label: string; icon: React.ReactNode }][]).map(([key, meta]) => {
              const isOn = sections[key];
              return (
                <button key={key} onClick={() => toggle(key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isOn ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  {isOn ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== RESULT PREVIEW ===== */}
      <div className="flex-1 bg-white">
        <div className="medical-gradient text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Diagnóstico do Checkup</h1>
            <p className="text-white/80">{data.name}{data.position && <span> — {data.position}</span>}</p>
            <p className="text-white/60 text-sm mt-1">{ESTABLISHMENT_TYPES.find(t => t.id === data.establishmentType)?.label} — {stateLabel}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6 relative z-10 pb-16 space-y-6">

          {/* Overall Score — ALWAYS */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-8 pb-8 flex flex-col items-center">
              <CircularProgress percentage={data.totalScore} size={200} strokeWidth={14} label="Nota Geral" />
              <div className={`mt-4 px-6 py-2 rounded-full border-2 font-bold text-lg flex items-center gap-2 ${classBg} ${classColor}`}>
                {getClassificationIcon(classification)} {classification}
              </div>
              <p className="text-sm text-muted-foreground mt-3 text-center max-w-md">
                {classification === 'Atenção' && 'Sua CME apresenta deficiências significativas que necessitam de atenção imediata. Riscos financeiros e operacionais identificados.'}
              </p>
            </CardContent>
          </Card>

          {/* Category Classification */}
          {sections.categoryClassification && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><BarChart3 className="w-5 h-5 text-teal-600" />Classificação por Categoria</CardTitle>
                <CardDescription>Desempenho detalhado por área de avaliação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryScores.map((cs) => {
                  const ci = CATEGORIES.find(c => c.key === cs.category)!;
                  const cc = getClassification(cs.percentage);
                  const bc = cs.percentage >= 80 ? 'bg-emerald-500' : cs.percentage >= 60 ? 'bg-teal-500' : cs.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <div key={cs.category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><span>{ci.icon}</span><span className="font-medium text-sm">{cs.label}</span></div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${getClassificationColor(cc)}`}>{cs.percentage.toFixed(1)}%</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getClassificationBg(cc)} ${getClassificationColor(cc)}`}>{getClassificationIcon(cc)} {cc}</span>
                        </div>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${bc}`} style={{ width: `${cs.percentage}%` }} /></div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Strong & Weak */}
          {sections.strongWeakPoints && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700"><TrendingUp className="w-4 h-4" /><span className="text-sm font-bold">Ponto Forte: {strongestCategory.label}</span></div>
                <p className="text-xs text-emerald-600 mt-1">{Math.round(strongestCategory.percentage)}% — {getClassification(strongestCategory.percentage)}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-700"><TrendingDown className="w-4 h-4" /><span className="text-sm font-bold">Ponto Crítico: {weakestCategory.label}</span></div>
                <p className="text-xs text-red-600 mt-1">{Math.round(weakestCategory.percentage)}% — {getClassification(weakestCategory.percentage)}</p>
              </div>
            </div>
          )}

          {/* Statistics */}
          {sections.statistics && (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-center text-muted-foreground mb-3 font-medium">ESTATÍSTICAS DA AVALIAÇÃO</p>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center"><p className="text-2xl font-bold text-gray-900">{totalAnswered}</p><p className="text-xs text-muted-foreground">Respondidas</p></div>
                  <div className="text-center"><p className="text-2xl font-bold text-amber-600">{totalNoInfo}</p><p className="text-xs text-muted-foreground">Sem Informação</p></div>
                  <div className="text-center"><p className="text-2xl font-bold text-gray-900">{totalQuestions}</p><p className="text-xs text-muted-foreground">Total</p></div>
                  <div className="text-center"><p className="text-2xl font-bold text-teal-600">{Math.round(totalAnswered / totalQuestions * 100)}%</p><p className="text-xs text-muted-foreground">Completude</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Analysis */}
          {sections.financialAnalysis && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-amber-800"><DollarSign className="w-5 h-5" />Análise Financeira</CardTitle>
                <CardDescription>Impactos financeiros identificados com base nas suas respostas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-red-600" /><span className="text-sm font-bold text-red-800">Estimativa de Desperdício</span></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-white rounded-lg border"><p className="text-xs text-muted-foreground">Mínimo/mês</p><p className="text-lg font-bold text-red-600">R$ {waste.minMonthly.toLocaleString('pt-BR')}</p></div>
                    <div className="p-3 bg-white rounded-lg border"><p className="text-xs text-muted-foreground">Máximo/mês</p><p className="text-lg font-bold text-red-700">R$ {waste.maxMonthly.toLocaleString('pt-BR')}</p></div>
                    <div className="p-3 bg-white rounded-lg border"><p className="text-xs text-muted-foreground">Mínimo/ano</p><p className="text-lg font-bold text-red-800">R$ {waste.minAnnual.toLocaleString('pt-BR')}</p></div>
                    <div className="p-3 bg-white rounded-lg border"><p className="text-xs text-muted-foreground">Máximo/ano</p><p className="text-lg font-bold text-red-900">R$ {waste.maxAnnual.toLocaleString('pt-BR')}</p></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {financialItems.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><span className="text-sm font-bold text-gray-900">{item.label}</span><span className={`px-2 py-0.5 rounded text-xs font-semibold ${getScoreColor(item.val * 25)}`}>{item.val}/4</span></div>
                          <p className="text-sm text-muted-foreground">Resposta: <span className="font-medium text-gray-700">{item.answerLabel}</span></p>
                          <p className="text-sm text-red-600 mt-1 font-medium">{item.impact}</p>
                        </div>
                        <div className="text-right shrink-0"><p className="text-xs text-muted-foreground mb-1">Custo Estimado</p><p className="text-sm font-bold text-red-700">{item.cost}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 5 Worst */}
          {sections.top5Worst && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-red-800"><ArrowDownRight className="w-5 h-5" />Top 5 Pontos Críticos</CardTitle>
                <CardDescription>Áreas prioritárias que necessitam de atenção imediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {worstQuestions.map((item, idx) => {
                    const opt = item.question.options.find(o => o.value === item.answer);
                    const ci = CATEGORIES.find(c => c.key === item.question.category);
                    const pct = Math.round(item.relativeScore * 100);
                    return (
                      <div key={item.question.id} className="p-4 rounded-xl border bg-white">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${idx < 2 ? 'bg-red-500' : 'bg-amber-500'}`}>{idx + 1}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div><p className="text-sm font-semibold text-gray-900">{item.question.question}</p><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs mt-1" style={{ backgroundColor: (ci?.color ?? '#666') + '15', color: ci?.color }}>{ci?.icon} {ci?.label}</span></div>
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${getScoreColor(pct)}`}>{pct}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Resposta: <span className="font-medium text-gray-700">{opt?.label}</span></p>
                            {opt?.impact && <p className="text-sm text-red-600 mt-1 font-medium">{opt.impact}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Observation */}
          {sections.adminObservation && (
            <Card className="border-0 shadow-lg bg-teal-50/50 border-teal-200">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2 text-teal-800"><HeartPulse className="w-5 h-5" />Observação do Especialista</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-teal-900 leading-relaxed whitespace-pre-wrap">{data.adminObservation}</p></CardContent>
            </Card>
          )}

          {/* Adjusted Financials */}
          {sections.adjustedFinancials && (
            <Card className="border-0 shadow-lg bg-amber-50/50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-amber-800"><FileText className="w-5 h-5" />Análise Financeira Ajustada</CardTitle>
                <CardDescription>Valores revisados pelo especialista Klever Oliveira Lopes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border"><p className="text-xs text-muted-foreground">Economia Mínima Estimada</p><p className="text-xl font-bold text-emerald-600">{data.economyMinEdited}%</p></div>
                  <div className="p-4 bg-white rounded-xl border"><p className="text-xs text-muted-foreground">Economia Máxima Estimada</p><p className="text-xl font-bold text-emerald-600">{data.economyMaxEdited}%</p></div>
                  <div className="p-4 bg-white rounded-xl border"><p className="text-xs text-muted-foreground">Nível de Risco Financeiro</p><p className="text-lg font-bold text-amber-600">{data.financialRiskLevelEdited}</p></div>
                  <div className="p-4 bg-white rounded-xl border"><p className="text-xs text-muted-foreground">Prejuízo Estimado</p><p className="text-lg font-bold text-red-600">{data.financialLossEdited}</p></div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {sections.recommendations && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Target className="w-5 h-5 text-teal-600" />Recomendações Prioritárias</CardTitle>
                <CardDescription>Ações sugeridas com base nos pontos mais críticos identificados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weakestCategories.map((cs) => {
                  const ci = CATEGORIES.find(c => c.key === cs.category)!;
                  return (
                    <div key={cs.category} className="flex gap-3 p-4 rounded-xl border bg-gray-50/50">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: ci.color + '20' }}>{ci.icon}</div>
                      <div>
                        <div className="flex items-center justify-between mb-1"><p className="font-semibold text-sm">{ci.label}</p><Badge variant="secondary" className="text-xs">{cs.percentage.toFixed(1)}%</Badge></div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{recommendations[cs.category]}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Visibility Gaps */}
          {sections.visibilityGaps && visibilityGaps.length > 0 && (
            <Card className="border-0 shadow-lg border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-amber-700"><AlertTriangle className="w-5 h-5" />Lacunas de Visibilidade ({visibilityGaps.length})</CardTitle>
                <CardDescription>Questões onde não há informação disponível — indicam necessidade de indicadores e controles</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {visibilityGaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <div><span>{g.question}</span><span className="text-xs text-amber-600 ml-2">({g.cat})</span></div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* CTA */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="font-semibold text-gray-900 mb-2">Se essa jornada foi proveitosa e você deseja iniciar um processo de assessoria e tecnologia para sua CME, entre em contato:</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">📧</span><span className="font-medium">CMEINTELIGENTE@GMAIL.COM</span></div>
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">📱</span><span className="font-medium">(11) 9.99661-0399</span></div>
              </div>
            </CardContent>
          </Card>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed max-w-lg mx-auto mb-6">
            Material exclusivo e de propriedade da CME INTELIGENTE. Metodologia, lógica de dados, estrutura técnica e perguntas desenvolvidas por Klever Oliveira Lopes. Proibida a reprodução total ou parcial, replicação, adaptação, distribuição ou utilização sem autorização expressa.
          </p>
        </div>
      </div>
    </div>
  );
}
