import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  Utensils,
  Dumbbell,
  History,
  Droplet,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Flame,
  Target,
  LogOut,
  TrendingUp,
  Clock,
  AlertCircle,
  Award,
  Search,
  Building2,
  Settings,
  ChevronDown,
  Layers,
  Sparkles,
  Zap,
  Info,
  Calendar,
  X,
  Check,
} from 'lucide-react';

// --- CONFIGURAÇÃO FIREBASE ---
// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
  apiKey: 'AIzaSyCIqqOvZ1dQHIwBwp_PD6a4D08f6pjfUOg',
  authDomain: 'app-fitness-77f8e.firebaseapp.com',
  projectId: 'app-fitness-77f8e',
  storageBucket: 'app-fitness-77f8e.firebasestorage.app',
  messagingSenderId: '156807141527',
  appId: '1:156807141527:web:d35428d628fb9e83a971d2',
  measurementId: 'G-GNF229LNNZ',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// BANCO BASE DE ALIMENTOS (MACROS POR 100G)
// =========================================================================
const BASE_FOOD_DATABASE = [
  // Suínos
  {
    category: 'Suínos',
    name: 'Filé de pernil suíno grelhado',
    p: 26.0,
    c: 0.0,
    f: 7.0,
    kcal: 170,
  },
  {
    category: 'Suínos',
    name: 'Filé de pernil assado',
    p: 27.0,
    c: 0.0,
    f: 8.5,
    kcal: 185,
  },
  {
    category: 'Suínos',
    name: 'Lombo suíno grelhado',
    p: 28.0,
    c: 0.0,
    f: 5.5,
    kcal: 165,
  },
  {
    category: 'Suínos',
    name: 'Bisteca suína grelhada',
    p: 25.0,
    c: 0.0,
    f: 10.0,
    kcal: 195,
  },

  // Ovos
  {
    category: 'Ovos',
    name: 'Ovo mexido simples',
    p: 13.0,
    c: 1.2,
    f: 11.0,
    kcal: 156,
  },
  {
    category: 'Ovos',
    name: 'Ovo mexido com manteiga/azeite',
    p: 12.5,
    c: 1.2,
    f: 15.0,
    kcal: 190,
  },
  { category: 'Ovos', name: 'Ovo cozido', p: 13.0, c: 1.1, f: 10.5, kcal: 155 },
  { category: 'Ovos', name: 'Ovo frito', p: 13.5, c: 1.2, f: 16.0, kcal: 205 },
  {
    category: 'Ovos',
    name: 'Clara cozida / pasteurizada',
    p: 11.0,
    c: 0.7,
    f: 0.2,
    kcal: 52,
  },
  {
    category: 'Ovos',
    name: 'Omelete simples',
    p: 13.0,
    c: 1.5,
    f: 12.0,
    kcal: 168,
  },

  // Aves
  {
    category: 'Aves',
    name: 'Peito de frango grelhado',
    p: 31.0,
    c: 0.0,
    f: 3.5,
    kcal: 160,
  },
  {
    category: 'Aves',
    name: 'Sassami de frango grelhado',
    p: 30.0,
    c: 0.0,
    f: 2.5,
    kcal: 150,
  },
  {
    category: 'Aves',
    name: 'Peito de frango cozido / desfiado',
    p: 30.0,
    c: 0.0,
    f: 3.0,
    kcal: 155,
  },
  {
    category: 'Aves',
    name: 'Sobrecoxa de frango sem pele',
    p: 25.0,
    c: 0.0,
    f: 9.0,
    kcal: 185,
  },

  // Bovinos
  {
    category: 'Bovinos',
    name: 'Patinho moído / grelhado',
    p: 28.0,
    c: 0.0,
    f: 6.5,
    kcal: 180,
  },
  {
    category: 'Bovinos',
    name: 'Contrafilé grelhado',
    p: 27.0,
    c: 0.0,
    f: 10.0,
    kcal: 210,
  },
  {
    category: 'Bovinos',
    name: 'Alcatra grelhada',
    p: 29.0,
    c: 0.0,
    f: 7.5,
    kcal: 190,
  },
  {
    category: 'Bovinos',
    name: 'Acém moído refogado',
    p: 26.0,
    c: 0.0,
    f: 12.0,
    kcal: 220,
  },
  {
    category: 'Bovinos',
    name: 'Coxão mole grelhado',
    p: 28.5,
    c: 0.0,
    f: 6.0,
    kcal: 175,
  },

  // Pescados
  {
    category: 'Pescados',
    name: 'Tilápia grelhada',
    p: 26.0,
    c: 0.0,
    f: 2.0,
    kcal: 125,
  },
  {
    category: 'Pescados',
    name: 'Salmão grelhado',
    p: 24.0,
    c: 0.0,
    f: 12.0,
    kcal: 208,
  },
  {
    category: 'Pescados',
    name: 'Atum em lata (em água)',
    p: 25.0,
    c: 0.0,
    f: 1.0,
    kcal: 116,
  },
  {
    category: 'Pescados',
    name: 'Sardinha em lata / fresca',
    p: 21.0,
    c: 0.0,
    f: 10.0,
    kcal: 178,
  },

  // Carboidratos
  {
    category: 'Carboidratos',
    name: 'Arroz branco cozido',
    p: 2.5,
    c: 28.0,
    f: 0.2,
    kcal: 130,
  },
  {
    category: 'Carboidratos',
    name: 'Arroz integral cozido',
    p: 2.6,
    c: 25.5,
    f: 1.0,
    kcal: 124,
  },
  {
    category: 'Carboidratos',
    name: 'Mandioca cozida',
    p: 1.2,
    c: 38.0,
    f: 0.3,
    kcal: 160,
  },
  {
    category: 'Carboidratos',
    name: 'Batata doce cozida / airfryer',
    p: 1.5,
    c: 20.0,
    f: 0.1,
    kcal: 86,
  },
  {
    category: 'Carboidratos',
    name: 'Batata inglesa cozida / purê',
    p: 2.0,
    c: 17.5,
    f: 0.1,
    kcal: 77,
  },
  {
    category: 'Carboidratos',
    name: 'Aveia em flocos',
    p: 14.0,
    c: 66.0,
    f: 7.0,
    kcal: 370,
  },
  {
    category: 'Carboidratos',
    name: 'Pão francês de padaria',
    p: 8.0,
    c: 58.0,
    f: 3.0,
    kcal: 290,
  },
  {
    category: 'Carboidratos',
    name: 'Pão de forma integral',
    p: 9.5,
    c: 45.0,
    f: 3.0,
    kcal: 245,
  },
  {
    category: 'Carboidratos',
    name: 'Macarrão cozido',
    p: 4.5,
    c: 30.0,
    f: 0.9,
    kcal: 150,
  },
  {
    category: 'Carboidratos',
    name: 'Cuscuz de milho cozido',
    p: 2.3,
    c: 23.0,
    f: 0.7,
    kcal: 110,
  },
  {
    category: 'Carboidratos',
    name: 'Tapioca (goma hidratada)',
    p: 0.0,
    c: 54.0,
    f: 0.0,
    kcal: 220,
  },

  // Frutas
  {
    category: 'Frutas',
    name: 'Banana prata / nanica',
    p: 1.3,
    c: 23.0,
    f: 0.3,
    kcal: 89,
  },
  {
    category: 'Frutas',
    name: 'Maçã fresca',
    p: 0.3,
    c: 14.0,
    f: 0.2,
    kcal: 52,
  },
  {
    category: 'Frutas',
    name: 'Morango fresco',
    p: 0.8,
    c: 7.5,
    f: 0.3,
    kcal: 33,
  },
  {
    category: 'Frutas',
    name: 'Abacaxi fresco',
    p: 0.5,
    c: 13.0,
    f: 0.1,
    kcal: 50,
  },
  {
    category: 'Frutas',
    name: 'Mamão papaia',
    p: 0.5,
    c: 11.0,
    f: 0.1,
    kcal: 43,
  },
  { category: 'Frutas', name: 'Uva fresca', p: 0.6, c: 17.0, f: 0.2, kcal: 67 },
  {
    category: 'Frutas',
    name: 'Laranja pera',
    p: 1.0,
    c: 11.5,
    f: 0.1,
    kcal: 47,
  },

  // Laticínios & Suplementos
  {
    category: 'Laticínios & Suplementos',
    name: 'Whey Protein Concentrado (80%)',
    p: 80.0,
    c: 6.0,
    f: 5.5,
    kcal: 395,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Whey Protein Isolado',
    p: 90.0,
    c: 1.5,
    f: 1.0,
    kcal: 375,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Leite desnatado',
    p: 3.3,
    c: 5.0,
    f: 0.2,
    kcal: 35,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Leite integral',
    p: 3.2,
    c: 4.8,
    f: 3.3,
    kcal: 62,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Leite zero lactose',
    p: 3.3,
    c: 5.0,
    f: 0.2,
    kcal: 35,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Queijo cottage',
    p: 12.0,
    c: 3.0,
    f: 4.0,
    kcal: 98,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Queijo minas frescal',
    p: 16.0,
    c: 2.5,
    f: 18.0,
    kcal: 240,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Queijo muçarela',
    p: 25.0,
    c: 2.0,
    f: 23.0,
    kcal: 315,
  },
  {
    category: 'Laticínios & Suplementos',
    name: 'Iogurte natural desnatado',
    p: 8.5,
    c: 4.5,
    f: 0.5,
    kcal: 58,
  },

  // Gorduras
  {
    category: 'Gorduras',
    name: 'Azeite de oliva extra virgem',
    p: 0.0,
    c: 0.0,
    f: 100.0,
    kcal: 884,
  },
  {
    category: 'Gorduras',
    name: 'Manteiga tradicional',
    p: 0.8,
    c: 0.1,
    f: 82.0,
    kcal: 730,
  },
  {
    category: 'Gorduras',
    name: 'Pasta de amendoim integral',
    p: 26.0,
    c: 18.0,
    f: 50.0,
    kcal: 590,
  },
  {
    category: 'Gorduras',
    name: 'Castanha-do-pará',
    p: 14.3,
    c: 12.0,
    f: 66.0,
    kcal: 656,
  },
];

// =========================================================================
// ACADEMIAS E MÉTODOS FECHADOS
// =========================================================================
const GYM_OPTIONS = [
  'Ultra Vila Branca',
  'Smartfit Vila Branca',
  'Fabrica CT Jacareí',
  'Compass fit CT Jacareí',
  'John Boy SJC',
];

const TRAINING_METHODS = [
  '1x 5-9 + 1x 9-15 (Back-off)',
  '1x Muscle Round',
  '1x DC Style Rest-Pause',
  '3x 9-15',
  '4x 12',
  'Biset 3x12',
  'Biset 4x12',
  '3x RM',
  '5+5+5 isometria',
  '3x 12-15',
];

// =========================================================================
// CATÁLOGO OFICIAL DE EXERCÍCIOS DESDUPLICADOS POR GRUPO MUSCULAR
// =========================================================================
const OFFICIAL_EXERCISE_CATALOG = [
  // Dorsal
  { name: 'Pulldown com corda', muscle: 'Dorsal', defaultMethod: '3x 9-15' },
  {
    name: 'Pulldown com triângulo',
    muscle: 'Dorsal',
    defaultMethod: '3x 9-15',
  },
  { name: 'Puxada alta em X', muscle: 'Dorsal', defaultMethod: '3x 9-15' },
  {
    name: 'Puxada alta máquina',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Puxada frente',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Puxada supinada',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Puxada triângulo',
    muscle: 'Dorsal',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Remada articulada pegada neutra',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Remada articulada pegada pronada',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Remada baixa triângulo',
    muscle: 'Dorsal',
    defaultMethod: '1x DC Style Rest-Pause',
  },
  {
    name: 'Remada baixa triângulo fábrica de monstros',
    muscle: 'Dorsal',
    defaultMethod: '1x DC Style Rest-Pause',
  },
  {
    name: 'Remada curvada pronada',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Remada curvada pronada smith',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Remada serrote',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Levantamento terra',
    muscle: 'Dorsal',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },

  // Peitoral
  {
    name: 'Crucifixo com halteres',
    muscle: 'Peitoral',
    defaultMethod: '1x DC Style Rest-Pause',
  },
  {
    name: 'Crucifixo inclinado máquina',
    muscle: 'Peitoral',
    defaultMethod: '1x DC Style Rest-Pause',
  },
  {
    name: 'Crucifixo polia alta',
    muscle: 'Peitoral',
    defaultMethod: '3x 9-15',
  },
  {
    name: 'Supino declinado sentado máquina',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino fechado Smith',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino inclinado halteres',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino inclinado máquina',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino inclinado máquina anilhas',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino inclinado máquina cimerian',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino inclinado Smith',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino levemente inclinado com halteres',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto com halteres',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto deitado máquina compass',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto máquina articulada c/ anilhas',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto máquina deitado',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto máquina sentado',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Supino reto smith',
    muscle: 'Peitoral',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  { name: 'Voador', muscle: 'Peitoral', defaultMethod: '1x Muscle Round' },

  // Deltóides / Ombros
  {
    name: 'Desenvolvimento máquina',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Desenvolvimento máquina c/ anilhas',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Desenvolvimento Smith',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Elevação lateral com halteres',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Elevação lateral na polia',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '3x 9-15',
  },
  { name: 'Face pull', muscle: 'Deltóides / Ombros', defaultMethod: '3x 9-15' },
  {
    name: 'Remada alta barra w polia',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '3x 9-15',
  },
  {
    name: 'Voador inverso',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '3x 9-15',
  },
  {
    name: 'Y raise',
    muscle: 'Deltóides / Ombros',
    defaultMethod: '1x Muscle Round',
  },

  // Tríceps
  {
    name: 'Extensão de tríceps máquina',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps francês com halter',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps francês na polia com corda',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps na corda',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps na polia barra reta',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps testa com barra w',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps testa com halteres',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Tríceps triângulo polia',
    muscle: 'Tríceps',
    defaultMethod: '1x Muscle Round',
  },

  // Bíceps & Antebraço
  {
    name: 'Bíceps sentado na máquina',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca 45 graus',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca alternada',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca alternada + rosca martelo',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca barra w',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Rosca barra w polia',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca inversa barra w',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Rosca inversa na polia',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Rosca martelo barra romana',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca martelo na polia com corda',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Rosca scott máquina',
    muscle: 'Bíceps & Antebraço',
    defaultMethod: '1x Muscle Round',
  },

  // Quadríceps
  {
    name: 'Agachamento búlgaro Smith',
    muscle: 'Quadríceps',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Agachamento hack',
    muscle: 'Quadríceps',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Agachamento hack Cimerian',
    muscle: 'Quadríceps',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Cadeira extensora',
    muscle: 'Quadríceps',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Leg press 45°',
    muscle: 'Quadríceps',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Leg press unilateral máquina',
    muscle: 'Quadríceps',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },

  // Posterior de Coxa / Isquiotibiais
  {
    name: 'Cadeira flexora',
    muscle: 'Posterior de Coxa',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Stiff com barra grande',
    muscle: 'Posterior de Coxa',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Stiff com barra pequena',
    muscle: 'Posterior de Coxa',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },
  {
    name: 'Stiff máquina',
    muscle: 'Posterior de Coxa',
    defaultMethod: '1x 5-9 + 1x 9-15 (Back-off)',
  },

  // Glúteos
  {
    name: 'Cadeira abdutora',
    muscle: 'Glúteos',
    defaultMethod: '1x DC Style Rest-Pause',
  },
  {
    name: 'Elevação de quadril',
    muscle: 'Glúteos',
    defaultMethod: '1x Muscle Round',
  },

  // Panturrilha
  {
    name: 'Panturrilha no leg horizontal',
    muscle: 'Panturrilha',
    defaultMethod: '1x Muscle Round',
  },
  {
    name: 'Panturrilha sentado',
    muscle: 'Panturrilha',
    defaultMethod: '1x Muscle Round',
  },

  // Abdômen
  {
    name: 'Abdominal crunch na polia',
    muscle: 'Abdômen',
    defaultMethod: '3x 12-15',
  },
  {
    name: 'Abdominal infra declinado',
    muscle: 'Abdômen',
    defaultMethod: '3x RM',
  },
];

const DEFAULT_TARGETS = {
  waterMl: 3000,
  calories: 2400,
  proteinGrams: 160,
};

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dieta'); // 'dieta' | 'treino' | 'historico'
  const [toast, setToast] = useState(null);

  // Estados com persistência isolada no Firestore
  const [waterRecords, setWaterRecords] = useState([]);
  const [meals, setMeals] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);
  const [workoutSets, setWorkoutSets] = useState([]);
  const [userSettings, setUserSettings] = useState({
    waterGoal: DEFAULT_TARGETS.waterMl,
    defaultGym: 'Ultra Vila Branca',
  });

  const todayStr = useMemo(() => getTodayDateStr(), []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // 1. Autenticação Firebase
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== 'undefined' &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.error('Erro na autenticação inicial:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sincronização em Tempo Real no Firestore com coleções desacopladas
  // Path: /artifacts/{appId}/users/{userId}/{collectionName}
  useEffect(() => {
    if (!user) {
      setWaterRecords([]);
      setMeals([]);
      setCustomFoods([]);
      setWorkoutSets([]);
      return;
    }

    const waterCol = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'hidratacao'
    );
    const mealsCol = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'refeicoes'
    );
    const customFoodsCol = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'alimentos_customizados'
    );
    const setsCol = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'treinos_series'
    );
    const settingsDocRef = doc(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'configuracoes',
      'perfil'
    );

    const unsubWater = onSnapshot(
      waterCol,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWaterRecords(data);
      },
      (err) => console.error('Erro hidratação:', err)
    );

    const unsubMeals = onSnapshot(
      mealsCol,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMeals(data);
      },
      (err) => console.error('Erro refeições:', err)
    );

    const unsubCustomFoods = onSnapshot(
      customFoodsCol,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCustomFoods(data);
      },
      (err) => console.error('Erro alimentos customizados:', err)
    );

    const unsubSets = onSnapshot(
      setsCol,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWorkoutSets(data);
      },
      (err) => console.error('Erro séries de treino:', err)
    );

    const unsubSettings = onSnapshot(
      settingsDocRef,
      (snap) => {
        if (snap.exists()) {
          setUserSettings(snap.data());
        }
      },
      (err) => console.error('Erro configurações:', err)
    );

    return () => {
      unsubWater();
      unsubMeals();
      unsubCustomFoods();
      unsubSets();
      unsubSettings();
    };
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Conectado com sucesso com Conta Google!');
    } catch (error) {
      console.warn(
        'Popup do Google indisponível no ambiente. Entrando via sessão segura:',
        error
      );
      try {
        await signInAnonymously(auth);
        showToast('Sessão segura ativa!', 'success');
      } catch (err) {
        showToast('Falha no login: ' + error.message, 'error');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showToast('Você desconectou da sessão.');
  };

  const handleUpdateProfile = async (newProfile) => {
    if (!user) return;
    try {
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'configuracoes',
        'perfil'
      );
      await setDoc(docRef, { ...userSettings, ...newProfile }, { merge: true });
      showToast('Configuração salva na nuvem!');
    } catch (e) {
      showToast('Erro ao sincronizar configurações', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
            Sincronizando Daily Performance...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen bg-neutral-950 text-neutral-100 p-6 selection:bg-emerald-500 selection:text-neutral-950">
        <div className="w-full max-w-sm my-auto text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-1 ring-white/20">
            <Zap className="w-10 h-10 text-neutral-950 fill-neutral-950" />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Mobile-First SPA / PWA
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white mt-3">
              Daily{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Performance
              </span>
            </h1>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Controle flexível em tempo real de Dieta, Hidratação e Treinos de
              Força com histórico por categoria.
            </p>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-3xl p-5 text-left space-y-3.5 shadow-xl">
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Base Nutricional Ampla + Cadastro Permanente de Novos Alimentos
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>
                Catálogo Oficial Desduplicado com Métodos e Academias Fixas
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Histórico Imediato por Aquecimento, Preparatória e Válida
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 px-4 bg-white hover:bg-neutral-100 active:scale-98 transition text-neutral-950 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Entrar com Conta Google
          </button>
        </div>

        <p className="text-[11px] text-neutral-500 text-center pb-2">
          Persistência segura em nuvem isolada sob seu identificador pessoal.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-24 select-none">
      {/* Toast flutuante */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold backdrop-blur-md transition-all border ${
            toast.type === 'error'
              ? 'bg-rose-500/95 text-white border-rose-400/50'
              : 'bg-emerald-500 text-neutral-950 border-emerald-400/80 shadow-emerald-500/30'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Sticky Mobile */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-neutral-950 text-xs shadow-md shadow-emerald-500/20">
            DP
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              Daily Performance
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                title="Sincronização em tempo real ativa"
              ></span>
            </h1>
            <p className="text-[10px] text-neutral-400 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">Sincronizado</span>{' '}
              •{' '}
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-300 font-medium max-w-[110px] truncate hidden sm:inline">
            {user.displayName || 'Atleta'}
          </span>
          <button
            onClick={handleLogout}
            title="Sair da conta"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Telas Principais */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 space-y-6">
        {activeTab === 'dieta' && (
          <DietAndWaterModule
            user={user}
            todayStr={todayStr}
            waterRecords={waterRecords}
            meals={meals}
            customFoods={customFoods}
            userSettings={userSettings}
            handleUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        )}

        {activeTab === 'treino' && (
          <FlexibleWorkoutModule
            user={user}
            todayStr={todayStr}
            workoutSets={workoutSets}
            userSettings={userSettings}
            handleUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        )}

        {activeTab === 'historico' && (
          <AnalyticsAndHistoryModule
            workoutSets={workoutSets}
            meals={meals}
            waterRecords={waterRecords}
            userSettings={userSettings}
          />
        )}
      </main>

      {/* Barra de Navegação Inferior Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 max-w-lg mx-auto pb-safe">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => setActiveTab('dieta')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'dieta'
                ? 'text-emerald-400 font-bold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeTab === 'dieta' ? 'bg-emerald-500/10' : ''
              }`}
            >
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Dieta & Água</span>
          </button>

          <button
            onClick={() => setActiveTab('treino')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'treino'
                ? 'text-cyan-400 font-bold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeTab === 'treino' ? 'bg-cyan-500/10' : ''
              }`}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Log Treino</span>
          </button>

          <button
            onClick={() => setActiveTab('historico')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === 'historico'
                ? 'text-indigo-400 font-bold'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                activeTab === 'historico' ? 'bg-indigo-500/10' : ''
              }`}
            >
              <History className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Histórico</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// =========================================================================
// MÓDULO 1: DIETA & HIDRATAÇÃO (COM BANCO COMPLETO + NOVO ALIMENTO FIRESTORE)
// =========================================================================
function DietAndWaterModule({
  user,
  todayStr,
  waterRecords,
  meals,
  customFoods,
  userSettings,
  handleUpdateProfile,
  showToast,
}) {
  const waterTarget = userSettings.waterGoal || DEFAULT_TARGETS.waterMl;
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(waterTarget);

  // Água de hoje
  const todayWaterDoc = useMemo(() => {
    return waterRecords.find((w) => w.date === todayStr) || { amountMl: 0 };
  }, [waterRecords, todayStr]);

  const currentWater = todayWaterDoc.amountMl || 0;
  const waterPercent = Math.min(
    100,
    Math.round((currentWater / waterTarget) * 100)
  );

  // Refeições de hoje
  const todayMeals = useMemo(() => {
    return meals.filter((m) => m.date === todayStr);
  }, [meals, todayStr]);

  const totalProteinToday = todayMeals.reduce(
    (acc, m) => acc + (Number(m.protein) || 0),
    0
  );
  const totalCaloriesToday = todayMeals.reduce(
    (acc, m) => acc + (Number(m.calories) || 0),
    0
  );

  const proteinPercent = Math.min(
    100,
    Math.round((totalProteinToday / DEFAULT_TARGETS.proteinGrams) * 100)
  );
  const calPercent = Math.min(
    100,
    Math.round((totalCaloriesToday / DEFAULT_TARGETS.calories) * 100)
  );

  // Formulário de Refeição
  const mealTypes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar/Pós', 'Ceia'];
  const [selectedMealType, setSelectedMealType] = useState('Almoço');
  const [portionGrams, setPortionGrams] = useState(150);

  // Autocomplete
  const [inputFoodQuery, setInputFoodQuery] = useState('');
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  // Modal "+ Novo Alimento" (Persistência Permanente)
  const [isNewFoodModalOpen, setIsNewFoodModalOpen] = useState(false);
  const [modalFoodName, setModalFoodName] = useState('');
  const [modalBasePortion, setModalBasePortion] = useState('100');
  const [modalProtein, setModalProtein] = useState('');
  const [modalCarbs, setModalCarbs] = useState('');
  const [modalFats, setModalFats] = useState('');
  const [modalCalories, setModalCalories] = useState('');

  // Unificação da Base Estática + Alimentos Customizados Salvos no Firestore
  const allAvailableFoods = useMemo(() => {
    const combined = [...BASE_FOOD_DATABASE];
    customFoods.forEach((cf) => {
      combined.unshift({
        category: 'Personalizado',
        name: cf.name,
        p: Number(cf.p) || 0,
        c: Number(cf.c) || 0,
        f: Number(cf.f) || 0,
        kcal: Number(cf.kcal) || 0,
        isCustom: true,
      });
    });
    return combined;
  }, [customFoods]);

  // Sugestões de autocomplete reativas
  const autocompleteSuggestions = useMemo(() => {
    if (!inputFoodQuery.trim()) {
      return allAvailableFoods.slice(0, 8);
    }
    const q = inputFoodQuery.toLowerCase().trim();
    return allAvailableFoods
      .filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [inputFoodQuery, allAvailableFoods]);

  // Manipulação de Água
  const handleAddWater = async (amount) => {
    try {
      const docId = `water_${todayStr}`;
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'hidratacao',
        docId
      );
      const newAmount = Math.max(0, currentWater + amount);
      await setDoc(docRef, {
        date: todayStr,
        amountMl: newAmount,
        updatedAt: Date.now(),
      });
      showToast(`+${amount}ml registrados!`);
    } catch (err) {
      showToast('Erro ao registrar água', 'error');
    }
  };

  const handleResetWater = async () => {
    try {
      const docId = `water_${todayStr}`;
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'hidratacao',
        docId
      );
      await setDoc(docRef, {
        date: todayStr,
        amountMl: 0,
        updatedAt: Date.now(),
      });
      showToast('Contador de água zerado!');
    } catch (err) {
      showToast('Erro ao zerar água', 'error');
    }
  };

  const handleSaveWaterTarget = () => {
    const val = Number(targetInput);
    if (val >= 500 && val <= 10000) {
      handleUpdateProfile({ waterGoal: val });
      setEditingTarget(false);
    } else {
      showToast('Meta deve estar entre 500ml e 10000ml', 'error');
    }
  };

  // Cálculo Dinâmico de Macros
  const previewMacros = useMemo(() => {
    const grams = Number(portionGrams) || 0;
    if (!selectedFoodItem)
      return { protein: 0, carbs: 0, fats: 0, calories: 0 };
    return {
      protein: Math.round(selectedFoodItem.p * (grams / 100)),
      carbs: Math.round(selectedFoodItem.c * (grams / 100)),
      fats: Math.round(selectedFoodItem.f * (grams / 100)),
      calories: Math.round(selectedFoodItem.kcal * (grams / 100)),
    };
  }, [selectedFoodItem, portionGrams]);

  const handleSelectAutocompleteFood = (food) => {
    setSelectedFoodItem(food);
    setInputFoodQuery(food.name);
    setIsAutocompleteOpen(false);
  };

  // Gravar Novo Alimento no Firestore
  const handleSaveCustomFood = async (e) => {
    e.preventDefault();
    if (!modalFoodName.trim()) {
      showToast('Informe o nome do alimento', 'error');
      return;
    }
    const basePortionNum = Number(modalBasePortion) || 100;
    const p100 = ((Number(modalProtein) || 0) / basePortionNum) * 100;
    const c100 = ((Number(modalCarbs) || 0) / basePortionNum) * 100;
    const f100 = ((Number(modalFats) || 0) / basePortionNum) * 100;
    const kcal100 = modalCalories
      ? ((Number(modalCalories) || 0) / basePortionNum) * 100
      : p100 * 4 + c100 * 4 + f100 * 9;

    const newFoodObj = {
      name: modalFoodName.trim(),
      p: Math.round(p100 * 10) / 10,
      c: Math.round(c100 * 10) / 10,
      f: Math.round(f100 * 10) / 10,
      kcal: Math.round(kcal100),
      createdAt: Date.now(),
    };

    try {
      const customCol = collection(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'alimentos_customizados'
      );
      await addDoc(customCol, newFoodObj);

      showToast(`Alimento "${newFoodObj.name}" salvo permanentemente!`);
      setSelectedFoodItem({ ...newFoodObj, category: 'Personalizado' });
      setInputFoodQuery(newFoodObj.name);

      // Limpar formulário
      setModalFoodName('');
      setModalProtein('');
      setModalCarbs('');
      setModalFats('');
      setModalCalories('');
      setIsNewFoodModalOpen(false);
    } catch (err) {
      showToast('Erro ao salvar novo alimento', 'error');
    }
  };

  // Gravar Refeição
  const handleSaveMeal = async (e) => {
    e.preventDefault();
    const finalName = selectedFoodItem
      ? selectedFoodItem.name
      : inputFoodQuery.trim();
    if (!finalName) {
      showToast('Selecione ou digite um alimento', 'error');
      return;
    }
    if (!portionGrams || portionGrams <= 0) {
      showToast('Informe o peso em gramas', 'error');
      return;
    }

    try {
      const mealsCol = collection(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'refeicoes'
      );
      await addDoc(mealsCol, {
        date: todayStr,
        mealType: selectedMealType,
        foodName: finalName,
        grams: Number(portionGrams),
        protein: previewMacros.protein,
        carbs: previewMacros.carbs,
        fats: previewMacros.fats,
        calories: previewMacros.calories,
        createdAt: Date.now(),
      });

      showToast('Refeição registrada com sucesso!');
      setInputFoodQuery('');
      setSelectedFoodItem(null);
    } catch (err) {
      showToast('Erro ao gravar refeição', 'error');
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'refeicoes',
        mealId
      );
      await deleteDoc(docRef);
      showToast('Item excluído');
    } catch (err) {
      showToast('Erro ao excluir', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Totalizadores Diários de Macros */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Metas Diárias de Nutrição
            </h2>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Hoje
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/80">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-neutral-400">
                Proteína
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {totalProteinToday}{' '}
                <span className="text-[10px] text-neutral-500 font-normal">
                  / {DEFAULT_TARGETS.proteinGrams}g
                </span>
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-500 block text-right">
              {proteinPercent}% da meta
            </span>
          </div>

          <div className="space-y-1.5 bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/80">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-semibold text-neutral-400">
                Calorias
              </span>
              <span className="text-sm font-bold text-amber-400">
                {totalCaloriesToday}{' '}
                <span className="text-[10px] text-neutral-500 font-normal">
                  / {DEFAULT_TARGETS.calories}
                </span>
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-500 block text-right">
              {calPercent}% da meta
            </span>
          </div>
        </div>
      </div>

      {/* 2. Rastreador de Hidratação Rápido */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Hidratação
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingTarget(!editingTarget)}
              className="text-[11px] text-neutral-400 hover:text-cyan-400 flex items-center gap-1 transition"
            >
              <Settings className="w-3.5 h-3.5" /> Meta
            </button>
            <button
              onClick={handleResetWater}
              className="text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition ml-1"
            >
              <RotateCcw className="w-3 h-3" /> Zerar
            </button>
          </div>
        </div>

        {editingTarget && (
          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Meta em ml (ex: 3500)"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSaveWaterTarget}
              className="px-3.5 py-1.5 bg-cyan-500 text-neutral-950 font-bold text-xs rounded-xl"
            >
              Salvar
            </button>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {(currentWater / 1000).toFixed(2)}{' '}
              <span className="text-base font-normal text-neutral-400">L</span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Meta: {(waterTarget / 1000).toFixed(1)} L ({currentWater} /{' '}
              {waterTarget} ml)
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-cyan-400">
              {waterPercent}%
            </span>
          </div>
        </div>

        <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden p-0.5 border border-neutral-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleAddWater(250)}
            className="py-2.5 bg-neutral-950 hover:bg-neutral-800 active:scale-95 border border-neutral-800 rounded-xl text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> 250ml
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="py-2.5 bg-neutral-950 hover:bg-neutral-800 active:scale-95 border border-neutral-800 rounded-xl text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> 500ml
          </button>
          <button
            onClick={() => handleAddWater(1000)}
            className="py-2.5 bg-neutral-950 hover:bg-neutral-800 active:scale-95 border border-neutral-800 rounded-xl text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> 1000ml
          </button>
        </div>
      </div>

      {/* 3. Registro de Refeições com Autocomplete + Botão Obrigatório "+ Novo Alimento" */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Adicionar Refeição
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsNewFoodModalOpen(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Novo Alimento
          </button>
        </div>

        {/* Seletor do Tipo de Refeição */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {mealTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedMealType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition font-medium ${
                selectedMealType === t
                  ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveMeal} className="space-y-3.5 pt-1">
          <div className="space-y-1 relative">
            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Alimento (Busca reativa instantânea)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
              <input
                type="text"
                placeholder="Busque por Pernil, Frango, Ovos, Arroz, Whey, etc."
                value={inputFoodQuery}
                onFocus={() => setIsAutocompleteOpen(true)}
                onChange={(e) => {
                  setInputFoodQuery(e.target.value);
                  setSelectedFoodItem(null);
                  setIsAutocompleteOpen(true);
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            {/* Dropdown Reativo de Sugestões */}
            {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-neutral-900">
                {autocompleteSuggestions.map((food, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAutocompleteFood(food)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-neutral-900 transition flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        {food.name}
                        {food.isCustom && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded font-mono">
                            meu
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {food.category} • {food.p}g P | {food.c}g C | {food.f}g
                        G
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 whitespace-nowrap bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {food.kcal} kcal/100g
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Quantidade Consumida (em gramas ou ml)
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min="1"
                placeholder="150"
                value={portionGrams}
                onChange={(e) => setPortionGrams(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-neutral-500 font-semibold">
                g
              </span>
            </div>
          </div>

          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total desta porção:</span>
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-emerald-400">
                {previewMacros.protein}g{' '}
                <span className="text-[10px] text-neutral-500">P</span>
              </span>
              <span className="font-bold text-cyan-400">
                {previewMacros.carbs}g{' '}
                <span className="text-[10px] text-neutral-500">C</span>
              </span>
              <span className="font-bold text-amber-400">
                {previewMacros.calories}{' '}
                <span className="text-[10px] text-neutral-500">kcal</span>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 transition text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Registrar Refeição
          </button>
        </form>
      </div>

      {/* Modal Rápido: "+ Novo Alimento" */}
      {isNewFoodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Cadastrar Novo Alimento
                </h3>
              </div>
              <button
                onClick={() => setIsNewFoodModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomFood} className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                  Nome do Alimento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pão de queijo da tia, Iogurte Yopro..."
                  value={modalFoodName}
                  onChange={(e) => setModalFoodName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                  Porção de Referência (em g ou ml)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="100"
                  value={modalBasePortion}
                  onChange={(e) => setModalBasePortion(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-semibold text-neutral-400 block mb-1">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="25"
                    value={modalProtein}
                    onChange={(e) => setModalProtein(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-neutral-400 block mb-1">
                    Carboidrato (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="10"
                    value={modalCarbs}
                    onChange={(e) => setModalCarbs(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-neutral-400 block mb-1">
                    Gorduras (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    placeholder="5"
                    value={modalFats}
                    onChange={(e) => setModalFats(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                  Calorias (kcal - Opcional, cálculo automático se vazio)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex: 185"
                  value={modalCalories}
                  onChange={(e) => setModalCalories(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFoodModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-semibold text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20"
                >
                  Salvar na Nuvem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Lista do que já foi consumido hoje */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          Consumido Hoje ({todayMeals.length} registros)
        </h3>

        {todayMeals.length === 0 ? (
          <div className="text-center py-8 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 text-neutral-500 text-xs">
            Nenhuma refeição registrada hoje. Inicie com um registro rápido
            acima!
          </div>
        ) : (
          <div className="space-y-2">
            {todayMeals
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .map((m) => (
                <div
                  key={m.id}
                  className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md">
                        {m.mealType}
                      </span>
                      <h4 className="text-xs font-semibold text-white">
                        {m.foodName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {m.grams}g consumidos
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">
                        +{m.protein}g prot
                      </div>
                      <div className="text-[11px] text-amber-400 font-medium">
                        +{m.calories} kcal
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMeal(m.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// MÓDULO 2: LOG DE TREINO FLEXÍVEL (CATÁLOGO OFICIAL DESDUPLICADO)
// =========================================================================
function FlexibleWorkoutModule({
  user,
  todayStr,
  workoutSets,
  userSettings,
  handleUpdateProfile,
  showToast,
}) {
  // Configurações do Treino Atual
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [gymName, setGymName] = useState(
    userSettings.defaultGym || 'Ultra Vila Branca'
  );
  const [splitTag, setSplitTag] = useState('Treino A'); // Treino A, B, C, D ou Livre

  // Seleção de Exercício a partir do Catálogo Desduplicado
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('Dorsal');
  const [selectedExerciseName, setSelectedExerciseName] =
    useState('Pulldown com corda');
  const [activeMethod, setActiveMethod] = useState('3x 9-15');

  // Input de Série Rápida
  const [selectedSetCategory, setSelectedSetCategory] = useState('Válida'); // 'Aquecimento' | 'Preparatória' | 'Válida'
  const [inputWeight, setInputWeight] = useState('');
  const [inputReps, setInputReps] = useState('');

  // Cronômetro de descanso
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const muscleList = [
    'Dorsal',
    'Peitoral',
    'Deltóides / Ombros',
    'Tríceps',
    'Bíceps & Antebraço',
    'Quadríceps',
    'Posterior de Coxa',
    'Glúteos',
    'Panturrilha',
    'Abdômen',
  ];

  // Atualizar método padrão quando o exercício muda
  useEffect(() => {
    const catalogItem = OFFICIAL_EXERCISE_CATALOG.find(
      (e) => e.name.toLowerCase() === selectedExerciseName.toLowerCase()
    );
    if (catalogItem) {
      setActiveMethod(catalogItem.defaultMethod);
    }
  }, [selectedExerciseName]);

  // Cronômetro
  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            showToast('Tempo de descanso encerrado! Próxima série!', 'success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerSeconds]);

  const startTimer = (sec) => {
    setTimerSeconds(sec);
    setTimerRunning(true);
  };

  // Exercícios filtrados por grupo muscular
  const availableExercisesForMuscle = useMemo(() => {
    return OFFICIAL_EXERCISE_CATALOG.filter(
      (e) => e.muscle === selectedMuscleFilter
    );
  }, [selectedMuscleFilter]);

  // =========================================================================
  // CARD DE HISTÓRICO: BUSCA NO FIRESTORE O ÚLTIMO REGISTRO POR CATEGORIA
  // =========================================================================
  const exerciseHistoricalPerformance = useMemo(() => {
    const targetName = selectedExerciseName.trim().toLowerCase();
    if (!targetName) return null;

    const matchingSets = workoutSets.filter(
      (s) => s.exerciseName && s.exerciseName.toLowerCase() === targetName
    );

    if (matchingSets.length === 0) return null;

    // Encontrar a última data em que o exercício foi executado
    const sortedByDate = [...matchingSets].sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    const lastDate = sortedByDate[0].date;
    const lastSessionSets = sortedByDate.filter((s) => s.date === lastDate);

    const getBestFromCategory = (cat) => {
      const catSets = lastSessionSets.filter((s) => s.category === cat);
      if (catSets.length === 0) return null;
      return catSets.reduce(
        (best, cur) => (Number(cur.weight) > Number(best.weight) ? cur : best),
        catSets[0]
      );
    };

    return {
      lastDate,
      gymName: lastSessionSets[0]?.gymName || 'Academia',
      method: lastSessionSets[0]?.method || activeMethod,
      aquecimento: getBestFromCategory('Aquecimento'),
      preparatoria: getBestFromCategory('Preparatória'),
      valida: getBestFromCategory('Válida'),
    };
  }, [workoutSets, selectedExerciseName, activeMethod]);

  // Gravar Série Individual no Firestore
  const handleRecordSet = async (e) => {
    e.preventDefault();
    if (!selectedExerciseName) {
      showToast('Selecione o exercício', 'error');
      return;
    }
    if (!inputWeight || Number(inputWeight) < 0) {
      showToast('Informe a carga em kg', 'error');
      return;
    }
    if (!inputReps || Number(inputReps) <= 0) {
      showToast('Informe a quantidade de repetições', 'error');
      return;
    }

    try {
      const setsCol = collection(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'treinos_series'
      );
      await addDoc(setsCol, {
        date: sessionDate,
        gymName: gymName,
        splitTag: splitTag,
        exerciseName: selectedExerciseName,
        muscleGroup: selectedMuscleFilter,
        method: activeMethod,
        category: selectedSetCategory,
        weight: Number(inputWeight),
        reps: Number(inputReps),
        createdAt: Date.now(),
      });

      if (gymName && gymName !== userSettings.defaultGym) {
        handleUpdateProfile({ defaultGym: gymName });
      }

      showToast(`Série gravada: ${inputWeight}kg × ${inputReps} reps!`);
      if (selectedSetCategory === 'Válida') {
        startTimer(90);
      }
      setInputReps('');
    } catch (err) {
      showToast('Erro ao gravar série', 'error');
    }
  };

  // Séries registradas nesta sessão hoje
  const currentSessionSets = useMemo(() => {
    return workoutSets
      .filter((s) => s.date === sessionDate)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [workoutSets, sessionDate]);

  const handleDeleteSet = async (setId) => {
    try {
      const docRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        user.uid,
        'treinos_series',
        setId
      );
      await deleteDoc(docRef);
      showToast('Série excluída com sucesso');
    } catch (err) {
      showToast('Erro ao excluir série', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho da Sessão: Data, Dropdown de Academias & Divisão */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Sessão de Força
            </h2>
          </div>
          <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            Tempo Real
          </span>
        </div>

        {/* Divisão de Treino */}
        <div className="grid grid-cols-5 gap-1.5">
          {['Treino A', 'Treino B', 'Treino C', 'Treino D', 'Livre'].map(
            (tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSplitTag(tag)}
                className={`py-2 text-[11px] font-black rounded-xl transition ${
                  splitTag === tag
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {tag}
              </button>
            )
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
              Data da Sessão
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-neutral-400 block mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" /> Academia
            </label>
            <select
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              {GYM_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Cronômetro de Descanso Integrado */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-neutral-900 border border-neutral-800 rounded-3xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-950 rounded-2xl border border-neutral-800 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Descanso
            </div>
            <div className="text-2xl font-black font-mono tracking-wider text-white">
              {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
              {String(timerSeconds % 60).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => startTimer(60)}
            className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300"
          >
            60s
          </button>
          <button
            onClick={() => startTimer(90)}
            className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300"
          >
            90s
          </button>
          <button
            onClick={() => startTimer(120)}
            className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300"
          >
            120s
          </button>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className={`p-2 rounded-xl text-neutral-950 font-bold transition ml-0.5 ${
              timerRunning ? 'bg-amber-400' : 'bg-cyan-400'
            }`}
          >
            {timerRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Seleção do Exercício do Catálogo Desduplicado & Dropdown de Métodos */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Escolha do Exercício
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {/* Seletor de Grupo Muscular */}
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
              Grupo Muscular:
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {muscleList.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMuscleFilter(m);
                    const firstEx = OFFICIAL_EXERCISE_CATALOG.find(
                      (e) => e.muscle === m
                    );
                    if (firstEx) setSelectedExerciseName(firstEx.name);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-medium transition ${
                    selectedMuscleFilter === m
                      ? 'bg-neutral-100 text-neutral-950 font-bold'
                      : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Select do Exercício */}
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
              Exercício ({availableExercisesForMuscle.length} disponíveis):
            </label>
            <select
              value={selectedExerciseName}
              onChange={(e) => setSelectedExerciseName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-500"
            >
              {availableExercisesForMuscle.map((ex) => (
                <option key={ex.name} value={ex.name}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown com as opções exatas de métodos */}
          <div>
            <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
              Método de Treino:
            </label>
            <select
              value={activeMethod}
              onChange={(e) => setActiveMethod(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400"
            >
              {TRAINING_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. CARD DE HISTÓRICO DO EXERCÍCIO SELECIONADO (SEPARADO POR CATEGORIA) */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-cyan-800/40 rounded-3xl p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Último Histórico Salvo
            </h4>
          </div>
          {exerciseHistoricalPerformance && (
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {exerciseHistoricalPerformance.lastDate} •{' '}
              {exerciseHistoricalPerformance.gymName}
            </span>
          )}
        </div>

        {exerciseHistoricalPerformance ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {/* Aquecimento */}
              <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800/80 text-center">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Aquecimento
                </span>
                {exerciseHistoricalPerformance.aquecimento ? (
                  <div>
                    <div className="text-xs font-black text-white">
                      {exerciseHistoricalPerformance.aquecimento.weight} kg
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {exerciseHistoricalPerformance.aquecimento.reps} reps
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-600 italic">-</span>
                )}
              </div>

              {/* Preparatória */}
              <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-neutral-800/80 text-center">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Preparatória
                </span>
                {exerciseHistoricalPerformance.preparatoria ? (
                  <div>
                    <div className="text-xs font-black text-amber-400">
                      {exerciseHistoricalPerformance.preparatoria.weight} kg
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {exerciseHistoricalPerformance.preparatoria.reps} reps
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-600 italic">-</span>
                )}
              </div>

              {/* Válida */}
              <div className="bg-neutral-950/80 p-2.5 rounded-2xl border border-emerald-500/30 text-center shadow-inner">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Válida
                </span>
                {exerciseHistoricalPerformance.valida ? (
                  <div>
                    <div className="text-xs font-black text-emerald-400">
                      {exerciseHistoricalPerformance.valida.weight} kg
                    </div>
                    <div className="text-[10px] text-neutral-300 font-bold">
                      {exerciseHistoricalPerformance.valida.reps} reps
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-600 italic">-</span>
                )}
              </div>
            </div>

            <p className="text-[10px] text-neutral-400 text-center pt-0.5">
              Método registrado na sessão anterior:{' '}
              <span className="text-amber-300 font-medium">
                "{exerciseHistoricalPerformance.method}"
              </span>
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-neutral-800/50">
            Nenhum histórico anterior localizado para este exercício. Registre
            sua primeira carga hoje!
          </div>
        )}
      </div>

      {/* 5. LOG RÁPIDO DE SÉRIES COM BOTÕES DE 1 CLIQUE */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Gravar Nova Série
            </h4>
          </div>
          <span className="text-[11px] font-bold text-white max-w-[180px] truncate">
            {selectedExerciseName}
          </span>
        </div>

        {/* Seletor de Categoria da Série */}
        <div className="grid grid-cols-3 gap-2">
          {['Aquecimento', 'Preparatória', 'Válida'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSetCategory(cat)}
              className={`py-2 text-xs font-black rounded-xl transition ${
                selectedSetCategory === cat
                  ? cat === 'Válida'
                    ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : cat === 'Preparatória'
                    ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-200 text-neutral-950'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleRecordSet} className="space-y-3.5 pt-1">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Carga em KG (aceita decimal)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                placeholder="Ex: 51.8"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neutral-400 block mb-1">
                Repetições (inteiro)
              </label>
              <input
                type="number"
                step="1"
                inputMode="numeric"
                placeholder="Ex: 8"
                value={inputReps}
                onChange={(e) => setInputReps(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-center text-sm font-black text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 active:scale-98 transition text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Salvar Série no Firestore
          </button>
        </form>
      </div>

      {/* 6. Lista de Séries Gravadas na Sessão Selecionada */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          Séries Desta Sessão ({currentSessionSets.length})
        </h4>

        {currentSessionSets.length === 0 ? (
          <div className="text-center py-6 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 text-neutral-500 text-xs">
            Nenhuma série gravada nesta data. Grave a primeira série acima!
          </div>
        ) : (
          <div className="space-y-2">
            {currentSessionSets.map((s) => (
              <div
                key={s.id}
                className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-3 flex items-center justify-between shadow-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        s.category === 'Válida'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : s.category === 'Preparatória'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {s.category}
                    </span>
                    <strong className="text-xs font-bold text-white">
                      {s.exerciseName}
                    </strong>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {s.method} • {s.gymName}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-cyan-400">
                      {s.weight} kg
                    </span>
                    <span className="text-xs text-neutral-400 ml-1">
                      × {s.reps} reps
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSet(s.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                    title="Remover série"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// MÓDULO 3: HISTÓRICO & FILTROS ANALÍTICOS
// =========================================================================
function AnalyticsAndHistoryModule({
  workoutSets,
  meals,
  waterRecords,
  userSettings,
}) {
  const [periodFilter, setPeriodFilter] = useState('30d');
  const [gymFilter, setGymFilter] = useState('all');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [searchExercise, setSearchExercise] = useState('');

  const musclesList = [
    'all',
    'Dorsal',
    'Peitoral',
    'Deltóides / Ombros',
    'Tríceps',
    'Bíceps & Antebraço',
    'Quadríceps',
    'Posterior de Coxa',
    'Glúteos',
    'Panturrilha',
    'Abdômen',
  ];

  const filterDateLimit = useMemo(() => {
    const now = new Date();
    if (periodFilter === '7d') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      return past.toISOString().split('T')[0];
    }
    if (periodFilter === '30d') {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      return past.toISOString().split('T')[0];
    }
    return '1970-01-01';
  }, [periodFilter]);

  // Séries filtradas
  const filteredSets = useMemo(() => {
    return workoutSets.filter((s) => {
      const passDate = s.date >= filterDateLimit;
      const passGym = gymFilter === 'all' || s.gymName === gymFilter;
      const passMuscle =
        muscleFilter === 'all' || s.muscleGroup === muscleFilter;
      const passSearch =
        !searchExercise.trim() ||
        (s.exerciseName &&
          s.exerciseName.toLowerCase().includes(searchExercise.toLowerCase()));

      return passDate && passGym && passMuscle && passSearch;
    });
  }, [workoutSets, filterDateLimit, gymFilter, muscleFilter, searchExercise]);

  // Agrupamento por Sessões (Data + Academia)
  const groupedSessions = useMemo(() => {
    const map = {};
    filteredSets.forEach((s) => {
      const key = `${s.date}_${s.gymName || 'Academia'}`;
      if (!map[key]) {
        map[key] = {
          date: s.date,
          gymName: s.gymName || 'Academia',
          splitTag: s.splitTag || 'Treino',
          sets: [],
        };
      }
      map[key].sets.push(s);
    });

    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredSets]);

  return (
    <div className="space-y-6">
      {/* 1. Barra de Filtros Rápidos */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 shadow-lg space-y-3">
        {/* Busca por Exercício */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            value={searchExercise}
            onChange={(e) => setSearchExercise(e.target.value)}
            placeholder="Buscar exercício no histórico..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        {/* Filtro por Período */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: '7d', label: '7 Dias' },
            { id: '30d', label: '30 Dias' },
            { id: 'all', label: 'Todos' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodFilter(p.id)}
              className={`py-1.5 text-xs rounded-xl font-bold transition ${
                periodFilter === p.id
                  ? 'bg-cyan-500 text-neutral-950'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Filtro por Academia */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setGymFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-bold transition ${
              gymFilter === 'all'
                ? 'bg-neutral-100 text-neutral-950'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            Todas Academias
          </button>
          {GYM_OPTIONS.map((gym) => (
            <button
              key={gym}
              onClick={() => setGymFilter(gym)}
              className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap font-bold transition ${
                gymFilter === gym
                  ? 'bg-neutral-100 text-neutral-950'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {gym}
            </button>
          ))}
        </div>

        {/* Filtro por Grupo Muscular */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {musclesList.map((m) => (
            <button
              key={m}
              onClick={() => setMuscleFilter(m)}
              className={`px-2.5 py-1 text-[11px] rounded-lg whitespace-nowrap font-medium transition ${
                muscleFilter === m
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-neutral-950 text-neutral-500 border border-neutral-800 hover:text-neutral-300'
              }`}
            >
              {m === 'all' ? 'Músculo: Todos' : m}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Lista Cronológica de Sessões com Detalhamento de Séries */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-wider px-1">
          Sessões Registradas ({groupedSessions.length})
        </h3>

        {groupedSessions.length === 0 ? (
          <div className="text-center py-10 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 text-neutral-500 text-xs">
            Nenhuma sessão de treino encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {groupedSessions.map((session, sIdx) => {
              const totalVolume = session.sets.reduce(
                (acc, cur) => acc + cur.weight * cur.reps,
                0
              );
              return (
                <div
                  key={sIdx}
                  className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <strong className="text-cyan-400 font-bold">
                        {session.splitTag}
                      </strong>
                      <span className="text-neutral-500">• {session.date}</span>
                    </div>
                    <span className="text-[11px] font-bold text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-xl border border-neutral-800">
                      {session.gymName}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-neutral-800/80">
                    {session.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        className="bg-neutral-950/70 p-2.5 rounded-2xl border border-neutral-800/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                set.category === 'Válida'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : set.category === 'Preparatória'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {set.category[0]}
                            </span>
                            <span className="font-bold text-white">
                              {set.exerciseName}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-500 ml-5">
                            {set.muscleGroup} • {set.method}
                          </span>
                        </div>

                        <div className="font-mono text-neutral-200">
                          <strong className="text-cyan-300">
                            {set.weight}kg
                          </strong>{' '}
                          × {set.reps}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-right pt-1">
                    <span className="text-xs text-neutral-400 font-medium">
                      Volume total da sessão:{' '}
                      <strong className="text-cyan-400 font-mono">
                        {Math.round(totalVolume).toLocaleString('pt-BR')} kg
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
