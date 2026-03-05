/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  ChevronRight, 
  Scissors, 
  Sparkles, 
  Camera, 
  CreditCard,
  Menu,
  X,
  ArrowLeft,
  CheckCircle2,
  Phone,
  LayoutDashboard,
  History,
  Settings,
  TrendingUp,
  ShieldCheck,
  Plus,
  Bell,
  LogOut,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type AppView = 'onboarding' | 'auth' | 'home' | 'pro-profile' | 'client-bookings' | 'pro-dashboard' | 'admin-dashboard' | 'database-schema' | 'design-system';
type ServiceCategory = 'Tresses' | 'Perruque' | 'Maquillage' | 'Coiffure' | 'Soins';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  distance: string;
  portfolio: string[];
}

interface UserData {
  id: string;
  phone: string;
  full_name: string;
  role: string;
}

interface Booking {
  id: string;
  client_id: string;
  pro_id: string;
  service_name: string;
  status: string;
  scheduled_at: string;
  total_price: number;
}

// --- Mock Data ---
const CATEGORIES: { name: ServiceCategory; icon: React.ReactNode }[] = [
  { name: 'Tresses', icon: <Scissors className="w-5 h-5" /> },
  { name: 'Maquillage', icon: <Sparkles className="w-5 h-5" /> },
  { name: 'Perruque', icon: <User className="w-5 h-5" /> },
  { name: 'Coiffure', icon: <Camera className="w-5 h-5" /> },
  { name: 'Soins', icon: <Heart className="w-5 h-5" /> },
];

const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Sarah Kalala',
    specialty: 'Experte Tresses & Perruques',
    rating: 4.9,
    reviews: 124,
    price: 25000,
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200',
    portfolio: [
      'https://images.unsplash.com/photo-1620331311520-246422ff82f9?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?auto=format&fit=crop&q=80&w=400',
    ]
  },
  {
    id: '2',
    name: 'Divine Mbala',
    specialty: 'Make-up Artist Professionnelle',
    rating: 4.8,
    reviews: 89,
    price: 45000,
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200&h=200',
    portfolio: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
    ]
  }
];

// --- Sub-Components ---

const Navbar = ({ title, onBack, onMenu }: { title?: string, onBack?: () => void, onMenu?: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center border-b border-pink-50">
    <div className="flex items-center gap-3">
      {onBack ? (
        <button onClick={onBack} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
      ) : (
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
      )}
      <span className="text-xl font-bold text-gray-900 tracking-tight">{title || "GlowKin"}</span>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 hover:bg-pink-50 rounded-full transition-colors relative">
        <Bell className="w-5 h-5 text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
      </button>
      <button onClick={onMenu} className="p-2 hover:bg-pink-50 rounded-full transition-colors">
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  </nav>
);

const BottomNav = ({ activeTab, setView }: { activeTab: string, setView: (v: AppView) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-50 px-8 py-3 flex justify-between items-center z-50">
    {[
      { id: 'home', icon: <Search className="w-6 h-6" />, label: 'Découvrir' },
      { id: 'client-bookings', icon: <Calendar className="w-6 h-6" />, label: 'Rendez-vous' },
      { id: 'pro-dashboard', icon: <Briefcase className="w-6 h-6" />, label: 'Pro' },
    ].map((item) => (
      <button 
        key={item.id}
        onClick={() => setView(item.id as AppView)}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-pink-500' : 'text-gray-400'}`}
      >
        {item.icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
      </button>
    ))}
  </div>
);

// --- Screens ---

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="h-screen bg-pink-500 flex flex-col items-center justify-center p-8 text-white text-center space-y-8"
  >
    <motion.div 
      initial={{ scale: 0 }} 
      animate={{ scale: 1 }} 
      className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
    >
      <Sparkles className="w-12 h-12" />
    </motion.div>
    <div className="space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">GlowKin</h1>
      <p className="text-pink-100 text-lg">La beauté professionnelle s'invite chez vous, à Kinshasa.</p>
    </div>
    <div className="w-full space-y-4 pt-12">
      <button 
        onClick={onComplete}
        className="w-full bg-white text-pink-500 py-4 rounded-2xl font-bold shadow-xl"
      >
        Commencer
      </button>
      <p className="text-pink-200 text-sm">Déjà un compte ? <span className="underline font-bold">Se connecter</span></p>
    </div>
  </motion.div>
);

const AuthScreen = ({ onAuth, loading }: { onAuth: (phone: string) => void, loading: boolean }) => {
  const [phone, setPhone] = useState('');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-screen bg-white p-8 flex flex-col justify-center space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Bienvenue !</h2>
        <p className="text-gray-500">Entrez votre numéro de téléphone pour continuer.</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+243 000 000 000"
            className="w-full bg-gray-50 border border-gray-100 py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>
        <button 
          onClick={() => onAuth(phone)}
          disabled={loading}
          className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 disabled:opacity-50"
        >
          {loading ? "Chargement..." : "Recevoir le code OTP"}
        </button>
      </div>
      <div className="text-center space-y-4">
        <p className="text-xs text-gray-400">En continuant, vous acceptez nos conditions d'utilisation.</p>
        <div className="flex items-center gap-4">
          <div className="h-px bg-gray-100 flex-1"></div>
          <span className="text-xs text-gray-400">OU</span>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>
        <button className="w-full py-4 border border-gray-100 rounded-2xl font-medium text-gray-600 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" /> Devenir Partenaire Pro
        </button>
      </div>
    </motion.div>
  );
};

const ClientBookingsScreen = ({ bookings }: { bookings: Booking[] }) => (
  <div className="space-y-6 pt-4">
    <h2 className="text-2xl font-bold">Mes Rendez-vous</h2>
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Aucun rendez-vous pour le moment.</p>
        </div>
      ) : (
        bookings.map(booking => (
          <div key={booking.id} className="bg-white p-4 rounded-3xl shadow-sm border border-pink-50 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">{booking.service_name}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.scheduled_at).toLocaleString()}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                {booking.status === 'pending' ? 'En attente' : 'Confirmé'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <span className="text-sm font-bold text-primary">{booking.total_price.toLocaleString()} FC</span>
              <button className="text-pink-500 text-xs font-bold">Détails</button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const ProDashboardScreen = () => (
  <div className="space-y-6 pt-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Tableau de Bord Pro</h2>
      <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-bold">En ligne</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
        <TrendingUp className="w-6 h-6 text-pink-500 mb-2" />
        <p className="text-2xl font-bold">145k FC</p>
        <p className="text-[10px] text-gray-400 uppercase font-bold">Revenus (7j)</p>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
        <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
        <p className="text-2xl font-bold">12</p>
        <p className="text-[10px] text-gray-400 uppercase font-bold">Missions</p>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="font-bold text-lg">Nouvelles demandes</h3>
      <div className="bg-pink-500 p-6 rounded-3xl text-white space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg">Maquillage Mariage</p>
            <p className="text-pink-100 text-sm">Samedi, 10:00 • Gombe</p>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">60.000 FC</span>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-pink-500 py-3 rounded-xl font-bold text-sm">Accepter</button>
          <button className="px-4 bg-pink-600 rounded-xl font-bold text-sm">Refuser</button>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboardScreen = () => (
  <div className="space-y-6 pt-4">
    <h2 className="text-2xl font-bold">Administration</h2>
    
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Utilisateurs', value: '1.2k', icon: <User className="w-4 h-4" /> },
        { label: 'Pros', value: '84', icon: <Briefcase className="w-4 h-4" /> },
        { label: 'Litiges', value: '2', icon: <ShieldCheck className="w-4 h-4 text-red-500" /> },
      ].map((stat) => (
        <div key={stat.label} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-1 text-gray-400">{stat.icon}</div>
          <p className="text-lg font-bold">{stat.value}</p>
          <p className="text-[8px] uppercase font-bold text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-bold text-sm">Pros en attente de validation</h3>
        <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-1 rounded-full">5 Nouveaux</span>
      </div>
      <div className="divide-y divide-gray-50">
        {['Marie-Claire N.', 'Syntyche K.', 'Belinda M.'].map((name) => (
          <div key={name} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              <span className="text-sm font-medium">{name}</span>
            </div>
            <button className="text-pink-500 text-xs font-bold">Vérifier</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DatabaseSchemaScreen = () => {
  const tables = [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'UUID (PK)', desc: 'Identifiant unique' },
        { name: 'phone', type: 'VARCHAR', desc: 'Clé de connexion (Unique)' },
        { name: 'role', type: 'ENUM', desc: 'client, professional, admin' },
        { name: 'full_name', type: 'VARCHAR', desc: 'Nom complet' }
      ]
    },
    {
      name: 'professionals',
      columns: [
        { name: 'user_id', type: 'UUID (FK)', desc: 'Référence users.id' },
        { name: 'bio', type: 'TEXT', desc: 'Présentation pro' },
        { name: 'is_verified', type: 'BOOLEAN', desc: 'Statut validation admin' },
        { name: 'avg_rating', type: 'DECIMAL', desc: 'Note moyenne' }
      ]
    },
    {
      name: 'bookings',
      columns: [
        { name: 'id', type: 'UUID (PK)', desc: 'ID réservation' },
        { name: 'client_id', type: 'UUID (FK)', desc: 'Référence client' },
        { name: 'pro_id', type: 'UUID (FK)', desc: 'Référence pro' },
        { name: 'status', type: 'ENUM', desc: 'pending, confirmed, etc.' },
        { name: 'total_price', type: 'DECIMAL', desc: 'Prix en FC' }
      ]
    }
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Architecture de Données</h2>
        <p className="text-sm text-gray-500">Schéma relationnel optimisé pour GlowKin.</p>
      </div>
      
      <div className="space-y-4">
        {tables.map(table => (
          <div key={table.name} className="bg-white rounded-3xl shadow-premium border border-pink-50 overflow-hidden">
            <div className="bg-secondary text-white px-4 py-3 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold text-sm tracking-widest uppercase">{table.name}</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 font-bold text-gray-400 uppercase">Colonne</th>
                    <th className="px-4 py-2 font-bold text-gray-400 uppercase">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.columns.map(col => (
                    <tr key={col.name} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-4 py-2">
                        <p className="font-mono font-bold text-gray-700">{col.name}</p>
                        <p className="text-[10px] text-gray-400">{col.desc}</p>
                      </td>
                      <td className="px-4 py-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono">{col.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DesignSystemScreen = () => (
  <div className="space-y-8 pt-4">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold">Design System</h2>
      <p className="text-gray-500">Identité visuelle moderne pour GlowKin.</p>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Palette de Couleurs</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-20 bg-primary rounded-2xl shadow-lg shadow-primary/20"></div>
          <p className="text-xs font-bold">Rose Glow (#F43F5E)</p>
          <p className="text-[10px] text-gray-400">Couleur primaire, énergie & féminité.</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-secondary rounded-2xl shadow-lg shadow-secondary/20"></div>
          <p className="text-xs font-bold">Deep Ink (#1A1A1A)</p>
          <p className="text-[10px] text-gray-400">Typographie & contrastes forts.</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent rounded-2xl border border-pink-100"></div>
          <p className="text-xs font-bold">Champagne (#FDF2F8)</p>
          <p className="text-[10px] text-gray-400">Fonds & sections douces.</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-white rounded-2xl border border-gray-100 shadow-premium"></div>
          <p className="text-xs font-bold">Pure White</p>
          <p className="text-[10px] text-gray-400">Cartes & éléments flottants.</p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Typographie</h3>
      <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-premium">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Display (Outfit)</p>
          <p className="text-3xl font-bold leading-tight">Révélez votre éclat</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Editorial (Playfair)</p>
          <p className="text-2xl font-serif italic text-primary">La beauté à domicile</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Body (Inter)</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            GlowKin connecte les meilleures professionnelles de Kinshasa avec des clientes exigeantes.
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Style Visuel</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-3xl shadow-premium border border-pink-50 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase">Ombres Douces</span>
        </div>
        <div className="p-4 glass rounded-3xl border border-white/40 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
          </div>
          <span className="text-[10px] font-bold uppercase">Glassmorphism</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<AppView>('onboarding');
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [showAdmin, setShowAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/bookings/${userId}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings(user.id);
    }
  }, [user, fetchBookings]);

  const handleLogin = async (phone: string) => {
    if (!phone || phone.length < 8) {
      showToast("Numéro de téléphone invalide", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      setUser(data);
      setView('home');
      showToast("Connexion réussie !");
    } catch (err) {
      showToast("Erreur de connexion", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    setBookingStep(1);
    setIsBooking(true);
  };

  const confirmBooking = async () => {
    if (!user || !selectedPro) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: user.id,
          pro_id: selectedPro.id,
          service_name: selectedPro.specialty,
          scheduled_at: new Date().toISOString(),
          total_price: selectedPro.price
        })
      });
      if (res.ok) {
        showToast("Réservation confirmée !");
        fetchBookings(user.id);
        setIsBooking(false);
        setSelectedPro(null);
      }
    } catch (err) {
      showToast("Erreur lors de la réservation", "error");
    } finally {
      setLoading(false);
    }
  };

  const nextBookingStep = () => {
    if (bookingStep < 3) setBookingStep(bookingStep + 1);
    else confirmBooking();
  };

  const renderView = () => {
    switch (view) {
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setView('auth')} />;
      case 'auth':
        return <AuthScreen onAuth={handleLogin} loading={loading} />;
      case 'home':
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-secondary leading-tight">
                Révélez votre <span className="text-primary font-serif italic">éclat</span> à Kinshasa
              </h1>
              <p className="text-gray-500 text-sm">Réservez les meilleures professionnelles de la beauté chez vous.</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button key={cat.name} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 bg-white rounded-[24px] shadow-premium border border-pink-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-primary transition-colors">{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Rechercher une prestation..." className="w-full bg-white border border-pink-100 py-5 pl-12 pr-4 rounded-3xl shadow-premium outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold">À proximité</h2>
                  <p className="text-xs text-gray-400">Gombe, Kinshasa</p>
                </div>
                <button className="text-primary text-xs font-bold uppercase tracking-widest">Voir tout</button>
              </div>
              <div className="space-y-4">
                {PROFESSIONALS.map((pro) => (
                  <motion.div 
                    key={pro.id}
                    whileHover={{ y: -4 }}
                    onClick={() => { setSelectedPro(pro); setView('pro-profile'); }}
                    className="bg-white p-5 rounded-[32px] shadow-premium border border-pink-50 flex gap-5 cursor-pointer"
                  >
                    <div className="relative">
                      <img src={pro.image} className="w-24 h-24 rounded-[24px] object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
                        <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-lg text-secondary leading-tight">{pro.name}</h3>
                        <p className="text-xs text-gray-400 font-medium">{pro.specialty}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-bold text-yellow-700">{pro.rating}</span>
                        </div>
                        <span className="text-primary font-bold text-base">{pro.price.toLocaleString()} FC</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'pro-profile':
        if (!selectedPro) return null;
        return (
          <div className="space-y-8">
            <div className="relative h-80 rounded-[40px] overflow-hidden shadow-2xl">
              <img src={selectedPro.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Vérifiée</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{selectedPro.rating}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold">{selectedPro.name}</h2>
                <p className="text-pink-200 text-sm font-medium">{selectedPro.specialty}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Avis', value: selectedPro.reviews, icon: <Star className="w-4 h-4 text-yellow-500" /> },
                { label: 'Distance', value: selectedPro.distance, icon: <MapPin className="w-4 h-4 text-primary" /> },
                { label: 'Prix dès', value: `${selectedPro.price / 1000}k`, icon: <CreditCard className="w-4 h-4 text-green-500" /> },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-4 rounded-3xl text-center shadow-premium border border-pink-50">
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <span className="text-lg font-bold block">{stat.value}</span>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Réalisations</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedPro.portfolio.map((img, i) => (
                  <img key={i} src={img} className="w-full h-48 object-cover rounded-[32px] shadow-premium" referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>

            <button onClick={handleBooking} className="w-full bg-primary text-white py-5 rounded-[24px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform">
              Réserver maintenant
            </button>
          </div>
        );
      case 'client-bookings':
        return <ClientBookingsScreen bookings={bookings} />;
      case 'pro-dashboard':
        return <ProDashboardScreen />;
      case 'admin-dashboard':
        return <AdminDashboardScreen />;
      case 'database-schema':
        return <DatabaseSchemaScreen />;
      case 'design-system':
        return <DesignSystemScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-secondary">
      {view !== 'onboarding' && view !== 'auth' && (
        <Navbar 
          title={view === 'admin-dashboard' ? "Admin" : view === 'pro-dashboard' ? "Espace Pro" : view === 'database-schema' ? "Base de données" : view === 'design-system' ? "Design" : undefined}
          onBack={view === 'pro-profile' || view === 'database-schema' || view === 'design-system' ? () => setView('home') : undefined}
          onMenu={() => setShowAdmin(!showAdmin)}
        />
      )}

      <main className={`${view !== 'onboarding' && view !== 'auth' ? 'pt-24 pb-32 px-6' : ''} max-w-md mx-auto`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Admin Toggle (Hidden Menu) */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[100] flex justify-end"
            onClick={() => setShowAdmin(false)}
          >
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="bg-white w-72 h-full p-8 space-y-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">GlowKin</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Menu Principal</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'home', label: 'Mode Cliente', icon: <Search className="w-5 h-5" /> },
                  { id: 'pro-dashboard', label: 'Mode Professionnelle', icon: <Briefcase className="w-5 h-5" /> },
                  { id: 'admin-dashboard', label: 'Administration', icon: <ShieldCheck className="w-5 h-5" /> },
                  { id: 'database-schema', label: 'Schéma BDD', icon: <LayoutDashboard className="w-5 h-5" /> },
                  { id: 'design-system', label: 'Design System', icon: <Sparkles className="w-5 h-5 text-primary" /> },
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setView(item.id as AppView); setShowAdmin(false); }} 
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${view === item.id ? 'bg-primary/5 text-primary font-bold' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                
                <div className="pt-8 border-t border-gray-100 mt-8">
                  <button onClick={() => setView('onboarding')} className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all">
                    <LogOut className="w-5 h-5" /> Déconnexion
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-24 left-6 right-6 p-4 rounded-2xl text-white font-bold z-[200] shadow-2xl ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[110] flex items-end"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full rounded-t-[48px] p-10 space-y-8 max-w-md mx-auto shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Réservation</h3>
                <button onClick={() => setIsBooking(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${bookingStep >= s ? 'bg-primary' : 'bg-gray-100'}`} />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={bookingStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-h-[200px]"
                >
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <p className="font-bold text-lg">Date & Heure</p>
                      <div className="grid grid-cols-4 gap-3">
                        {['Lun 12', 'Mar 13', 'Mer 14', 'Jeu 15'].map(d => (
                          <button key={d} className="py-4 bg-primary/5 rounded-2xl text-xs font-bold text-primary border border-primary/10">{d}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {['09:00', '11:30', '14:00'].map(t => (
                          <button key={t} className="py-3 border border-gray-100 rounded-2xl text-xs font-medium text-gray-500">{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <p className="font-bold text-lg">Lieu de rendez-vous</p>
                      <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Ma position actuelle</p>
                          <p className="text-xs text-gray-400">Gombe, Avenue de la Justice</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <p className="font-bold text-lg">Paiement sécurisé</p>
                      <div className="space-y-3">
                        <button className="w-full p-5 border-2 border-primary bg-primary/5 rounded-[24px] flex items-center gap-4 font-bold">
                          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          Mobile Money (M-Pesa)
                        </button>
                        <button className="w-full p-5 border border-gray-100 rounded-[24px] flex items-center gap-4 font-medium text-gray-500">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <History className="w-5 h-5" />
                          </div>
                          Espèces après service
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <button onClick={nextBookingStep} className="w-full bg-primary text-white py-5 rounded-[24px] font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform">
                {bookingStep === 3 ? 'Confirmer le rendez-vous' : 'Continuer'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {view !== 'onboarding' && view !== 'auth' && (
        <BottomNav activeTab={view} setView={setView} />
      )}
    </div>
  );
}
