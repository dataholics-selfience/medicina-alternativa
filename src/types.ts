import { DivideIcon as LucideIcon } from 'lucide-react';

export interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hidden?: boolean;
}

export interface UserType {
  uid: string;
  name: string;
  email: string;
  cpf: string;
  crm: string;
  company: string;
  phone: string;
  plan?: string;
  createdAt: string;
}

export interface TokenUsageType {
  uid: string;
  email: string;
  plan: string;
  totalTokens: number;
  usedTokens: number;
  lastUpdated: string;
  expirationDate: string;
}

export interface TreatmentResultType {
  fitoterapia: Array<{
    planta: string;
    descricao: string;
  }>;
  medicina_oriental: {
    diagnostico: string;
    acupuntura: Array<{
      ponto: string;
      descricao: string;
    }>;
    praticas: string[];
  };
  medicina_ortomolecular: Array<{
    suplemento: string;
    descricao: string;
  }>;
  medicina_antroposofica: Array<{
    pratica: string;
    descricao: string;
  }>;
  homeopatia: Array<{
    medicamento: string;
    descricao: string;
  }>;
  medicina_ayurvedica: {
    diagnostico: string;
    tratamentos: string[];
  };
  cura_xamanica: Array<{
    pratica: string;
    descricao: string;
  }>;
  medicina_biofisica: Array<{
    tecnologia: string;
    descricao: string;
  }>;
  aparelhos_frequencia: Array<{
    tecnologia: string;
    descricao: string;
  }>;
  cromoterapia: Array<{
    cor: string;
    descricao: string;
  }>;
  aromaterapia: Array<{
    oleo: string;
    descricao: string;
  }>;
  acupuntura: string[];
  saberes_ancestrais: string[];
  alimentacao: {
    indicada: string[];
    contraindicada: string[];
  };
  mudancas_rotina: string[];
  mensagem_final: string;
}

export interface ConsultationType {
  id: string;
  userId: string;
  userEmail: string;
  caso: string;
  sessionId: string;
  resultado: TreatmentResultType;
  consultedAt: string;
}

export interface PlanType {
  id: string;
  name: string;
  description: string;
  tokens: number;
  price: number;
  icon: LucideIcon;
  highlight: boolean;
  stripeLink: string;
}

export interface ChallengeType {
  id: string;
  userId: string;
  userEmail: string;
  company: string;
  businessArea: string;
  title: string;
  description: string;
  sessionId: string;
  createdAt: string;
}