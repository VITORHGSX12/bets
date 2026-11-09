import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Award, 
  Coins, 
  Volume2, 
  VolumeX, 
  Music, 
  RotateCcw, 
  Users, 
  Sparkles, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  MessageSquare, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Send, 
  Zap, 
  Star, 
  User, 
  Phone, 
  Key, 
  LogOut, 
  AlertTriangle, 
  Copy, 
  Gift, 
  Share2, 
  Target,
  KeyRound,
  TrendingUp,
  Flame
} from 'lucide-react';

const OWNER_PIX_KEY = '99985280205';
const ADMIN_PASSWORD = '985280205';

// --- ÁUDIO RETRÔ 8-BIT ESTILO FLAPPY BIRD ---
class FlappyAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxMuted = false;
    this.bgmMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.currentStep = 0;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlap() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCoin() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playCrash() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  startMusic() {
    this.init();
    if (this.bgmPlaying || this.bgmMuted || !this.ctx) return;
    this.bgmPlaying = true;

    // Trilha chiptune 8-bit nostálgica
    const melody = [
      { f: 523.25, dur: 0.16 },
      { f: 659.25, dur: 0.16 },
      { f: 783.99, dur: 0.24 },
      { f: 659.25, dur: 0.16 },
      { f: 880.00, dur: 0.32 },
      { f: 783.99, dur: 0.32 },
      { f: 698.46, dur: 0.16 },
      { f: 659.25, dur: 0.16 },
      { f: 587.33, dur: 0.24 },
      { f: 523.25, dur: 0.35 },
      { f: 0,      dur: 0.12 }
    ];

    const stepInterval = 200;

    const tick = () => {
      if (!this.bgmPlaying || this.bgmMuted) return;
      const note = melody[this.currentStep % melody.length];
      this.currentStep++;

      if (note.f > 0 && this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + note.dur + 0.04);
      }
      this.bgmTimer = setTimeout(tick, stepInterval);
    };

    tick();
  }

  stopMusic() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMusic() {
    this.bgmMuted = !this.bgmMuted;
    if (this.bgmMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return !this.bgmMuted;
  }
}

const audio = new FlappyAudioEngine();

const generateRoundHash = () => {
  const chars = 'abcdef0123456789';
  let hash = 'flappy_';
  for (let i = 0; i < 28; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

// Frases de Incentivo Rotativas
const INCENTIVE_PHRASES = [
  '🔥 O Flappy Bird tá pagando alto agora! Aproveite a maré de sorte!',
  '💰 Deposite R$ 20 e libere +R$ 120 de BÔNUS instantâneo!',
  '🚀 Mais de R$ 14.850,00 pagos aos jogadores hoje!',
  '⚡ Dê Cash Out na hora certa e multiplique seu Pix!',
  '🎁 Convide seus amigos e ganhe R$ 20 de bônus por cada um!',
  '🏆 Novo recorde na mesa: 28.5x! Quem vai bater esse multiplicador?'
];

// --- COMPONENTE RETRÔ OFICIAL DO PÁSSARO FLAPPY BIRD COM ASINHAS ANIMADAS ---
export function FlappyBirdSprite({ size = 'md', className = '', onClick = null }) {
  const dims = size === 'lg' ? 'w-24 h-18 sm:w-28 sm:h-22' : size === 'xl' ? 'w-36 h-28' : 'w-12 h-9';
  return (
    <div 
      onClick={onClick}
      className={`relative ${dims} ${className} animate-flappy-bob select-none inline-block`}
    >
      <svg viewBox="0 0 46 36" className="w-full h-full drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Corpo Amarelo Oval com Contorno Preto Grosso */}
        <rect x="6" y="6" width="30" height="22" rx="10" fill="#f4c330" stroke="#000000" strokeWidth="3" />
        
        {/* Sombra inferior Laranja Flappy */}
        <path d="M10 24 C 16 29, 26 29, 32 24 Z" fill="#e86100" />
        
        {/* Olho Branco Redondo Grande */}
        <circle cx="27" cy="11" r="7" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
        {/* Pupila Preta Retrô */}
        <rect x="29" y="8" width="3.5" height="6.5" rx="1.5" fill="#000000" />
        
        {/* Bico Superior Laranja/Vermelho com Contorno */}
        <rect x="31" y="16" width="13" height="6" rx="3" fill="#f44336" stroke="#000000" strokeWidth="2.5" />
        {/* Bico Inferior */}
        <rect x="30" y="21" width="12" height="5" rx="2.5" fill="#e86100" stroke="#000000" strokeWidth="2.5" />
        {/* Linha divisória do bico */}
        <line x1="31" y1="21.5" x2="43" y2="21.5" stroke="#000000" strokeWidth="1.5" />
        
        {/* Asinha Branca que BATE com Animação CSS */}
        <g className="animate-wing origin-[14px_16px]">
          <ellipse cx="14" cy="18" rx="7.5" ry="5.5" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
        </g>
      </svg>
    </div>
  );
}

export default function App() {
  // --- PERFIL DO JOGADOR ---
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('flappy_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPixKey, setRegisterPixKey] = useState('');
  const [registerPixType, setRegisterPixType] = useState('Celular');
  const [registerError, setRegisterError] = useState('');

  // --- CARTEIRA SEPARADA (REAL SACÁVEL VS BÔNUS) ---
  const [realBalance, setRealBalance] = useState(() => {
    const saved = localStorage.getItem('flappy_real_balance');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [bonusBalance, setBonusBalance] = useState(() => {
    const saved = localStorage.getItem('flappy_bonus_balance');
    return saved ? parseFloat(saved) : 0.00;
  });

  // Metas de Saque
  const [hasDeposited, setHasDeposited] = useState(() => {
    const saved = localStorage.getItem('flappy_has_deposited');
    return saved === 'true';
  });

  const [totalDeposited, setTotalDeposited] = useState(() => {
    const saved = localStorage.getItem('flappy_total_deposited');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [friendsInvited, setFriendsInvited] = useState(() => {
    const saved = localStorage.getItem('flappy_friends_invited');
    return saved ? parseInt(saved, 10) : 0;
  });

  const totalBalance = realBalance + bonusBalance;

  // --- CONTROLE DE RODADA SÍNCRONA ---
  const [roundPhase, setRoundPhase] = useState('WAITING'); // 'WAITING', 'FLYING', 'CRASHED'
  const [countdown, setCountdown] = useState(5.0);
  const [roundMultiplier, setRoundMultiplier] = useState(1.00);
  const [roundHash, setRoundHash] = useState(generateRoundHash());
  const [roundCrashTarget, setRoundCrashTarget] = useState(2.10);

  // --- PAINEL DE APOSTA 1 ---
  const [bet1, setBet1] = useState(5.00);
  const [bet1Placed, setBet1Placed] = useState(false);
  const [bet1CashedOut, setBet1CashedOut] = useState(false);
  const [bet1Win, setBet1Win] = useState(0);
  const [autoCashout1, setAutoCashout1] = useState(2.00);
  const [enableAutoCashout1, setEnableAutoCashout1] = useState(false);
  const [autoBet1, setAutoBet1] = useState(false);

  // --- PAINEL DE APOSTA 2 ---
  const [bet2, setBet2] = useState(2.00);
  const [bet2Placed, setBet2Placed] = useState(false);
  const [bet2CashedOut, setBet2CashedOut] = useState(false);
  const [bet2Win, setBet2Win] = useState(0);
  const [autoCashout2, setAutoCashout2] = useState(5.00);
  const [enableAutoCashout2, setEnableAutoCashout2] = useState(false);
  const [autoBet2, setAutoBet2] = useState(false);

  // --- NOTIFICAÇÃO TOAST DE GANHO AO VIVO ---
  const [recentLiveWinner, setRecentLiveWinner] = useState(null);

  // --- FRASE DE INCENTIVO ATUAL ---
  const [phraseIndex, setPhraseIndex] = useState(0);

  // --- MODAIS ---
  const [musicActive, setMusicActive] = useState(false);
  const [sfxActive, setSfxActive] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  // --- CONTROLE SECRETO DO DONO (ADMIN) ---
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const logoClicksRef = useRef({ count: 0, lastTime: 0 });

  // Histórico
  const [history, setHistory] = useState([
    { mult: 1.45, crashed: true },
    { mult: 2.30, crashed: false },
    { mult: 1.10, crashed: true },
    { mult: 5.80, crashed: false },
    { mult: 1.18, crashed: true },
    { mult: 14.5, crashed: false },
  ]);

  const [myBetsHistory, setMyBetsHistory] = useState([]);

  // Jogadores da Mesa
  const [livePlayers, setLivePlayers] = useState([
    { name: 'Lucas_SP', bet: 25, cashedOut: false, win: 0, mult: 0, target: 1.45 },
    { name: 'Gamer_99', bet: 50, cashedOut: false, win: 0, mult: 0, target: 2.20 },
    { name: 'Ana_Paula', bet: 10, cashedOut: false, win: 0, mult: 0, target: 1.20 },
    { name: 'FelipeM', bet: 100, cashedOut: false, win: 0, mult: 0, target: 1.85 },
    { name: 'Carol_Win', bet: 30, cashedOut: false, win: 0, mult: 0, target: 3.50 },
  ]);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { user: 'Lucas_SP', msg: 'Flappy Bird tá pagando muito hoje! 🚀', time: '22:50' },
    { user: 'FelipeM', msg: 'Resgatei R$ 185 no 1.85x! 💸', time: '22:52' },
    { user: 'Gamer_99', msg: 'Depositei 20 e ganhei 120 de bônus kkk top!', time: '22:55' },
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  // Admin
  const [houseRigor, setHouseRigor] = useState('NORMAL');
  const [houseStats, setHouseStats] = useState(() => {
    const saved = localStorage.getItem('flappy_housestats_v6');
    return saved ? JSON.parse(saved) : { totalBets: 0, totalPaid: 0 };
  });

  // Modal Depósito Pix
  const [depositAmount, setDepositAmount] = useState(20);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixSimulateSuccess, setPixSimulateSuccess] = useState(false);

  // Modal Saque
  const [withdrawAmount, setWithdrawAmount] = useState(20);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccessAlert, setWithdrawSuccessAlert] = useState(false);

  // Modal Convidar
  const [inviteCopied, setInviteCopied] = useState(false);

  // Refs de Física e Canvas
  const canvasRef = useRef(null);
  const reqIdRef = useRef(null);
  const multRef = useRef(1.00);
  const birdRef = useRef({ 
    y: 130, 
    vy: 0, 
    wingFrame: 0, // 0: cima, 1: meio, 2: baixo
    wingTimer: 0,
    angle: 0 
  });
  const pipesRef = useRef([]);
  const cloudsRef = useRef([
    { x: 30, y: 150 },
    { x: 190, y: 160 },
    { x: 340, y: 145 },
    { x: 450, y: 155 }
  ]);
  const groundOffsetRef = useRef(0);

  // Persistências
  useEffect(() => {
    localStorage.setItem('flappy_real_balance', realBalance.toString());
  }, [realBalance]);

  useEffect(() => {
    localStorage.setItem('flappy_bonus_balance', bonusBalance.toString());
  }, [bonusBalance]);

  useEffect(() => {
    localStorage.setItem('flappy_has_deposited', hasDeposited.toString());
    localStorage.setItem('flappy_total_deposited', totalDeposited.toString());
    localStorage.setItem('flappy_friends_invited', friendsInvited.toString());
  }, [hasDeposited, totalDeposited, friendsInvited]);

  useEffect(() => {
    localStorage.setItem('flappy_housestats_v6', JSON.stringify(houseStats));
  }, [houseStats]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('flappy_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('flappy_user_profile');
    }
  }, [userProfile]);

  // Rotação de Frases de Incentivo a cada 4 segundos
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % INCENTIVE_PHRASES.length);
    }, 4500);
    return () => clearInterval(phraseInterval);
  }, []);

  // Notificações Fictícias de Ganhos de Outros Jogadores a cada 6 segundos
  useEffect(() => {
    const fakeWinners = [
      { name: 'Marcos_Vitor', win: 145.50, mult: 2.91 },
      { name: 'Camila_R', win: 88.00, mult: 1.76 },
      { name: 'Pedr0_Gamer', win: 230.00, mult: 4.60 },
      { name: 'Julia_Lima', win: 62.00, mult: 3.10 },
      { name: 'Renato_Silva', win: 410.00, mult: 8.20 },
    ];
    const winInterval = setInterval(() => {
      const winner = fakeWinners[Math.floor(Math.random() * fakeWinners.length)];
      setRecentLiveWinner(winner);
      setTimeout(() => setRecentLiveWinner(null), 3200);
    }, 6500);
    return () => clearInterval(winInterval);
  }, []);

  // Easter Egg do Dono
  const handleSecretLogoClick = () => {
    const now = Date.now();
    if (now - logoClicksRef.current.lastTime < 600) {
      logoClicksRef.current.count += 1;
    } else {
      logoClicksRef.current.count = 1;
    }
    logoClicksRef.current.lastTime = now;

    if (logoClicksRef.current.count >= 5) {
      logoClicksRef.current.count = 0;
      setShowAdminLoginModal(true);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'flappy' || urlParams.get('admin') === '99985280205') {
      setShowAdminModal(true);
    }
  }, []);

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === ADMIN_PASSWORD || adminPasswordInput.trim() === 'admin123') {
      setShowAdminLoginModal(false);
      setShowAdminModal(true);
      setAdminPasswordInput('');
      setAdminPasswordError(false);
    } else {
      setAdminPasswordError(true);
    }
  };

  // Cadastro do Jogador
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerName.trim() || registerName.trim().length < 3) {
      setRegisterError('Por favor, informe seu nome completo.');
      return;
    }
    if (!registerPhone.trim() || registerPhone.replace(/\D/g, '').length < 10) {
      setRegisterError('Por favor, informe seu celular com DDD.');
      return;
    }
    if (!registerPixKey.trim() || registerPixKey.trim().length < 4) {
      setRegisterError('Por favor, informe sua chave Pix de recebimento.');
      return;
    }

    const newProfile = {
      name: registerName.trim(),
      phone: registerPhone.trim(),
      pixKey: registerPixKey.trim(),
      pixType: registerPixType,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    setUserProfile(newProfile);
    setRegisterError('');
    setBonusBalance(prev => prev + 10.00); // R$ 10 de bônus inicial
    audio.playCoin();
  };

  const handleQuickGuestLogin = () => {
    const guestProfile = {
      name: 'Jogador_' + Math.floor(1000 + Math.random() * 9000),
      phone: '(99) 98528-0205',
      pixKey: OWNER_PIX_KEY,
      pixType: 'Celular',
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setUserProfile(guestProfile);
    setBonusBalance(prev => prev + 10.00);
    audio.playCoin();
  };

  const handleLogout = () => {
    setUserProfile(null);
    setShowProfileModal(false);
  };

  // Áudio
  const handleUserGestureAudio = () => {
    if (!musicActive && !audio.bgmMuted) {
      audio.startMusic();
      setMusicActive(true);
    }
  };

  const toggleMusicButton = () => {
    audio.init();
    const active = audio.toggleMusic();
    setMusicActive(active);
  };

  const toggleSfxButton = () => {
    const next = !sfxActive;
    setSfxActive(next);
    audio.sfxMuted = !next;
  };

  const deductBet = (amount) => {
    if (totalBalance < amount) return false;
    if (bonusBalance >= amount) {
      setBonusBalance(prev => prev - amount);
    } else {
      const remainder = amount - bonusBalance;
      setBonusBalance(0);
      setRealBalance(prev => prev - remainder);
    }
    return true;
  };

  const addWin = (amount) => {
    setRealBalance(prev => prev + amount);
  };

  // Rodadas
  const prepareNextRound = () => {
    const rand = Math.random();
    let maxMult = 1.00;

    const threshold1 = houseRigor === 'EASY' ? 0.60 : houseRigor === 'HARD' ? 0.94 : 0.86;
    const threshold2 = houseRigor === 'EASY' ? 0.85 : houseRigor === 'HARD' ? 0.98 : 0.95;

    if (rand < threshold1) {
      maxMult = parseFloat((Math.random() * 0.28 + 1.02).toFixed(2));
    } else if (rand < threshold2) {
      maxMult = parseFloat((Math.random() * 0.90 + 1.30).toFixed(2));
    } else {
      maxMult = parseFloat((Math.random() * 14.00 + 2.20).toFixed(2));
    }

    setRoundCrashTarget(maxMult);
    setRoundHash(generateRoundHash());
    setRoundMultiplier(1.00);
    multRef.current = 1.00;

    birdRef.current = { y: 130, vy: -1.5, wingFrame: 0, wingTimer: 0, angle: 0 };
    pipesRef.current = [
      { x: 340, top: 85, bottom: 95 },
      { x: 530, top: 115, bottom: 65 }
    ];

    setLivePlayers([
      { name: 'Lucas_SP', bet: Math.floor(Math.random() * 30 + 10), cashedOut: false, win: 0, mult: 0, target: 1.15 + Math.random() * 0.5 },
      { name: 'Gamer_99', bet: Math.floor(Math.random() * 50 + 20), cashedOut: false, win: 0, mult: 0, target: 1.25 + Math.random() * 1.3 },
      { name: 'Ana_Paula', bet: 10, cashedOut: false, win: 0, mult: 0, target: 1.10 + Math.random() * 0.4 },
      { name: 'FelipeM', bet: Math.floor(Math.random() * 80 + 30), cashedOut: false, win: 0, mult: 0, target: 1.40 + Math.random() * 2.0 },
      { name: 'Carol_Win', bet: Math.floor(Math.random() * 40 + 15), cashedOut: false, win: 0, mult: 0, target: 1.30 + Math.random() * 0.8 },
    ]);

    setBet1CashedOut(false);
    setBet2CashedOut(false);
    setBet1Win(0);
    setBet2Win(0);

    if (autoBet1) {
      placeBet1();
    } else {
      setBet1Placed(false);
    }

    if (autoBet2) {
      placeBet2();
    } else {
      setBet2Placed(false);
    }

    setCountdown(5.0);
    setRoundPhase('WAITING');
  };

  useEffect(() => {
    let timer = null;
    if (roundPhase === 'WAITING') {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0.2) {
            clearInterval(timer);
            setRoundPhase('FLYING');
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [roundPhase]);

  useEffect(() => {
    let timeout = null;
    if (roundPhase === 'CRASHED') {
      timeout = setTimeout(() => {
        prepareNextRound();
      }, 3500);
    }
    return () => clearTimeout(timeout);
  }, [roundPhase]);

  useEffect(() => {
    prepareNextRound();
  }, []);

  // Apostar 1
  const placeBet1 = () => {
    if (totalBalance < bet1 || bet1 <= 0) {
      setShowDepositModal(true);
      return;
    }
    if (deductBet(bet1)) {
      setHouseStats(prev => ({ ...prev, totalBets: prev.totalBets + bet1 }));
      setBet1Placed(true);
      audio.playCoin();
    }
  };

  const cashOut1 = () => {
    if (!bet1Placed || bet1CashedOut || roundPhase !== 'FLYING') return;
    const currentMult = multRef.current;
    const win = bet1 * currentMult;
    setBet1Win(win);
    setBet1CashedOut(true);
    addWin(win);
    setHouseStats(prev => ({ ...prev, totalPaid: prev.totalPaid + win }));
    audio.playCoin();

    setMyBetsHistory(prev => [
      { id: Date.now(), panel: 'Aposta 1', bet: bet1, mult: currentMult, win: win, profit: win - bet1, status: 'WIN' },
      ...prev.slice(0, 15)
    ]);
  };

  // Apostar 2
  const placeBet2 = () => {
    if (totalBalance < bet2 || bet2 <= 0) {
      setShowDepositModal(true);
      return;
    }
    if (deductBet(bet2)) {
      setHouseStats(prev => ({ ...prev, totalBets: prev.totalBets + bet2 }));
      setBet2Placed(true);
      audio.playCoin();
    }
  };

  const cashOut2 = () => {
    if (!bet2Placed || bet2CashedOut || roundPhase !== 'FLYING') return;
    const currentMult = multRef.current;
    const win = bet2 * currentMult;
    setBet2Win(win);
    setBet2CashedOut(true);
    addWin(win);
    setHouseStats(prev => ({ ...prev, totalPaid: prev.totalPaid + win }));
    audio.playCoin();

    setMyBetsHistory(prev => [
      { id: Date.now(), panel: 'Aposta 2', bet: bet2, mult: currentMult, win: win, profit: win - bet2, status: 'WIN' },
      ...prev.slice(0, 15)
    ]);
  };

  // Pulo do Pássaro
  const jump = () => {
    handleUserGestureAudio();
    if (roundPhase === 'FLYING') {
      birdRef.current.vy = -5.4;
      birdRef.current.wingFrame = 2; // bate as asas forte
      audio.playFlap();
    }
  };

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (roundPhase === 'FLYING') jump();
      } else if (e.code === 'KeyZ') {
        if (roundPhase === 'FLYING' && bet1Placed && !bet1CashedOut) cashOut1();
      } else if (e.code === 'KeyX') {
        if (roundPhase === 'FLYING' && bet2Placed && !bet2CashedOut) cashOut2();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roundPhase, bet1Placed, bet1CashedOut, bet2Placed, bet2CashedOut]);

  // --- MOTOR GRÁFICO OFICIAL PIXEL ART FLAPPY BIRD ---
  useEffect(() => {
    if (roundPhase !== 'FLYING' && roundPhase !== 'WAITING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // Garante estilo pixel art retrô nítido

    const loop = () => {
      if (roundPhase === 'FLYING') {
        multRef.current += 0.0078;
        const currentMult = multRef.current;
        setRoundMultiplier(currentMult);

        if (bet1Placed && !bet1CashedOut && enableAutoCashout1 && currentMult >= autoCashout1) cashOut1();
        if (bet2Placed && !bet2CashedOut && enableAutoCashout2 && currentMult >= autoCashout2) cashOut2();

        setLivePlayers(prev => prev.map(p => {
          if (!p.cashedOut && currentMult >= p.target) {
            return { ...p, cashedOut: true, win: p.bet * currentMult, mult: currentMult };
          }
          return p;
        }));

        // Crash da rodada
        if (currentMult >= roundCrashTarget) {
          audio.playCrash();
          setHistory(prev => [{ mult: parseFloat(currentMult.toFixed(2)), crashed: true }, ...prev.slice(0, 7)]);

          if (bet1Placed && !bet1CashedOut) {
            setMyBetsHistory(prev => [
              { id: Date.now(), panel: 'Aposta 1', bet: bet1, mult: currentMult, win: 0, profit: -bet1, status: 'LOSS' },
              ...prev.slice(0, 15)
            ]);
          }
          if (bet2Placed && !bet2CashedOut) {
            setMyBetsHistory(prev => [
              { id: Date.now() + 1, panel: 'Aposta 2', bet: bet2, mult: currentMult, win: 0, profit: -bet2, status: 'LOSS' },
              ...prev.slice(0, 15)
            ]);
          }

          setRoundPhase('CRASHED');
          return;
        }

        // Física do Flappy Bird Original
        birdRef.current.vy += 0.36;
        birdRef.current.y += birdRef.current.vy;
        
        // Ângulo de rotação pixel art (-25 graus subindo, até +70 graus caindo)
        if (birdRef.current.vy < 0) {
          birdRef.current.angle = -0.38;
        } else {
          birdRef.current.angle = Math.min(1.2, birdRef.current.angle + 0.05);
        }

        // Animação de bater asas (frame 0 -> 1 -> 2 -> 1 -> 0)
        birdRef.current.wingTimer += 1;
        if (birdRef.current.wingTimer % 5 === 0) {
          birdRef.current.wingFrame = (birdRef.current.wingFrame + 1) % 3;
        }

        // Estabilização suave
        if (birdRef.current.y > 215) birdRef.current.vy = -3.8;
        if (birdRef.current.y < 30) birdRef.current.vy = 1.8;

        // Scroll do Chão e Canos
        groundOffsetRef.current = (groundOffsetRef.current + 2.5) % 24;

        pipesRef.current.forEach(p => { p.x -= 2.5; });
        if (pipesRef.current.length && pipesRef.current[0].x < -60) {
          pipesRef.current.shift();
          const lastX = pipesRef.current[pipesRef.current.length - 1]?.x || 300;
          const topH = Math.floor(Math.random() * 80) + 50;
          pipesRef.current.push({ x: lastX + 175, top: topH, bottom: 250 - topH - 95 });
        }
      } else if (roundPhase === 'WAITING') {
        // Flutuação suave esperando a decolagem
        birdRef.current.y = 135 + Math.sin(Date.now() / 180) * 6;
        birdRef.current.angle = 0;
        birdRef.current.wingTimer += 1;
        if (birdRef.current.wingTimer % 6 === 0) {
          birdRef.current.wingFrame = (birdRef.current.wingFrame + 1) % 3;
        }
        groundOffsetRef.current = (groundOffsetRef.current + 1.2) % 24;
      }

      // --- RENDERIZAÇÃO IDÊNTICA AO FLAPPY BIRD DA FOTO ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Céu Azul Flappy Bird (#4ec0ca)
      ctx.fillStyle = '#4ec0ca';
      ctx.fillRect(0, 0, canvas.width, 250);

      // 2. Cidade / Prédios no Horizonte Pixel Art (#98dfa6 / #80cc8e)
      ctx.fillStyle = '#98dfa6';
      for (let bx = 0; bx < canvas.width; bx += 28) {
        const bh = (bx % 3 === 0) ? 42 : (bx % 2 === 0) ? 35 : 48;
        ctx.fillRect(bx, 250 - bh, 26, bh);
        // Janelinhas pixel art dos prédios
        ctx.fillStyle = '#c5f2ce';
        ctx.fillRect(bx + 4, 250 - bh + 6, 4, 4);
        ctx.fillRect(bx + 14, 250 - bh + 6, 4, 4);
        ctx.fillRect(bx + 4, 250 - bh + 16, 4, 4);
        ctx.fillRect(bx + 14, 250 - bh + 16, 4, 4);
        ctx.fillStyle = '#98dfa6';
      }

      // 3. Montanhas / Colinas Verdes Pixel Art com borda branca
      ctx.fillStyle = '#5ee270';
      for (let mx = -20; mx < canvas.width + 40; mx += 60) {
        ctx.beginPath();
        ctx.arc(mx, 250, 32, Math.PI, 0);
        ctx.fill();
      }

      // 4. Canos Verdes Retrô Clássicos com contorno preto 3px
      pipesRef.current.forEach(p => {
        const pipeW = 52;
        // Cano de Cima
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(p.x, 0, pipeW, p.top);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, 0, pipeW, p.top);

        // Brilho do cano
        ctx.fillStyle = '#9ce659';
        ctx.fillRect(p.x + 4, 0, 6, p.top);
        // Sombra do cano
        ctx.fillStyle = '#558022';
        ctx.fillRect(p.x + pipeW - 10, 0, 8, p.top);

        // Bocal Superior
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(p.x - 4, p.top - 24, pipeW + 8, 24);
        ctx.strokeRect(p.x - 4, p.top - 24, pipeW + 8, 24);
        ctx.fillStyle = '#9ce659';
        ctx.fillRect(p.x, p.top - 24, 6, 24);
        ctx.fillStyle = '#558022';
        ctx.fillRect(p.x + pipeW - 6, p.top - 24, 8, 24);

        // Cano de Baixo
        const botY = 250 - p.bottom;
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(p.x, botY, pipeW, p.bottom);
        ctx.strokeRect(p.x, botY, pipeW, p.bottom);

        ctx.fillStyle = '#9ce659';
        ctx.fillRect(p.x + 4, botY, 6, p.bottom);
        ctx.fillStyle = '#558022';
        ctx.fillRect(p.x + pipeW - 10, botY, 8, p.bottom);

        // Bocal Inferior
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(p.x - 4, botY, pipeW + 8, 24);
        ctx.strokeRect(p.x - 4, botY, pipeW + 8, 24);
        ctx.fillStyle = '#9ce659';
        ctx.fillRect(p.x, botY, 6, 24);
        ctx.fillStyle = '#558022';
        ctx.fillRect(p.x + pipeW - 6, botY, 8, 24);
      });

      // 5. Chão Amarelo Areia Flappy Bird com Listras (#ded895)
      ctx.fillStyle = '#ded895';
      ctx.fillRect(0, 250, canvas.width, 50);

      // Faixa de grama superior do chão (#558022 e #73bf2e)
      ctx.fillStyle = '#73bf2e';
      ctx.fillRect(0, 250, canvas.width, 10);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 250, canvas.width, 2);
      ctx.fillRect(0, 260, canvas.width, 2);

      // Listras diagonais do chão clássico
      ctx.fillStyle = '#558022';
      for (let lx = -24; lx < canvas.width + 24; lx += 14) {
        ctx.beginPath();
        ctx.moveTo(lx - groundOffsetRef.current, 252);
        ctx.lineTo(lx - groundOffsetRef.current + 8, 260);
        ctx.lineTo(lx - groundOffsetRef.current + 4, 260);
        ctx.lineTo(lx - groundOffsetRef.current - 4, 252);
        ctx.fill();
      }

      // 6. O PÁSSARO AMARELO ORIGINAL DO FLAPPY BIRD COM ASAS ANIMADAS!
      const bx = 75;
      const by = birdRef.current.y;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(birdRef.current.angle);

      // Contorno Preto do Corpo (Oval 34x24)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corpo Amarelo Flappy (#f4c330)
      ctx.fillStyle = '#f4c330';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bochecha / Sombra Inferior Laranja (#e86100)
      ctx.fillStyle = '#e86100';
      ctx.beginPath();
      ctx.ellipse(0, 5, 12, 5, 0, 0, Math.PI);
      ctx.fill();

      // Olho Grande Branco com Contorno Preto
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(8, -4, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -4, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupila Preta Grande do Flappy
      ctx.fillStyle = '#000000';
      ctx.fillRect(9, -7, 3.5, 6);

      // Bico Laranja Retrô com Linha de Divisão
      ctx.fillStyle = '#000000';
      ctx.fillRect(10, 1, 14, 10);
      ctx.fillStyle = '#f44336';
      ctx.fillRect(11, 2, 12, 4);
      ctx.fillStyle = '#ff7043';
      ctx.fillRect(11, 6, 12, 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(11, 5, 12, 1.5);

      // Asinha Branca com Borda Preta que BATE!
      const wingFrame = birdRef.current.wingFrame; // 0, 1 ou 2
      const wingYOffset = (wingFrame === 0) ? -4 : (wingFrame === 1) ? 0 : 4;
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(-8, wingYOffset, 9, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-8, wingYOffset, 7.5, 4.5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      reqIdRef.current = requestAnimationFrame(loop);
    };

    reqIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [roundPhase, roundCrashTarget, bet1Placed, bet1CashedOut, enableAutoCashout1, autoCashout1, bet2Placed, bet2CashedOut, enableAutoCashout2, autoCashout2]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const author = userProfile ? userProfile.name.split(' ')[0] : 'Você 🐤';
    setChatMessages(prev => [...prev, { user: author, msg: newChatInput.trim(), time: timeStr }]);
    setNewChatInput('');
  };

  const handleApproveDeposit = () => {
    if (depositAmount < 20) return;
    setRealBalance(prev => prev + depositAmount);
    setTotalDeposited(prev => prev + depositAmount);
    setHasDeposited(true);

    const bonusGiven = 120.00;
    setBonusBalance(prev => prev + bonusGiven);

    audio.playCoin();
    setPixSimulateSuccess(true);
    setTimeout(() => {
      setShowDepositModal(false);
      setPixSimulateSuccess(false);
    }, 1500);
  };

  const handleRequestWithdraw = () => {
    setWithdrawError('');
    if (!hasDeposited || totalDeposited < 20) {
      setWithdrawError('Meta não atingida: É necessário fazer pelo menos 1 depósito de no mínimo R$ 20,00 para desbloquear a conta de saque.');
      return;
    }
    if (withdrawAmount > realBalance) {
      setWithdrawError(`Saldo bônus não pode ser sacado. Seu saldo real disponível para saque é de R$ ${realBalance.toFixed(2)}.`);
      return;
    }
    if (withdrawAmount <= 0) {
      setWithdrawError('Informe um valor de saque válido.');
      return;
    }

    setRealBalance(prev => prev - withdrawAmount);
    audio.playCoin();
    setWithdrawSuccessAlert(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSuccessAlert(false);
    }, 1600);
  };

  const handleSimulateInviteFriend = () => {
    setFriendsInvited(prev => prev + 1);
    setBonusBalance(prev => prev + 20.00);
    audio.playCoin();
    setInviteCopied(true);
  };

  const ggr = houseStats.totalBets - houseStats.totalPaid;

  // --- TELA DE TÍTULO OFICIAL DO FLAPPY BIRD (QUANDO NÃO CADASTRADO / VISITANTE) ---
  if (!userProfile) {
    return (
      <div 
        onClick={handleUserGestureAudio}
        className="min-h-screen bg-[#4ec0ca] text-slate-900 font-fredoka flex flex-col justify-between items-center p-3 select-none relative overflow-x-hidden"
      >
        {/* TOAST FLUTUANTE DE GANHO AO VIVO */}
        {recentLiveWinner && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#ded895] border-4 border-black px-4 py-2 rounded-2xl shadow-pixel flex items-center gap-2 animate-bounce">
            <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
            <span className="text-xs font-black text-black">
              <strong>{recentLiveWinner.name}</strong> acabou de faturar <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-pixel text-[10px]">R$ {recentLiveWinner.win.toFixed(2)}</span> ({recentLiveWinner.mult.toFixed(2)}x)!
            </span>
          </div>
        )}

        {/* NUVENS PIXEL ART NO CÉU */}
        <div className="absolute top-8 left-6 w-16 h-8 bg-white/70 rounded-full blur-[1px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-14 right-10 w-24 h-10 bg-white/60 rounded-full blur-[1px] pointer-events-none"></div>

        {/* BARRA SUPERIOR DE GANHOS AO VIVO & INCENTIVOS (MARQUEE) */}
        <div className="w-full max-w-lg bg-[#ded895] border-3 border-black rounded-xl p-1.5 shadow-pixel overflow-hidden z-10 mt-1">
          <div className="animate-ticker text-xs font-black text-black flex items-center gap-6 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600 animate-bounce" /> 
              Marcos_Vitor sacou R$ 145,50 via Pix!
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Zap className="w-4 h-4 text-yellow-600" />
              Camila_R faturou R$ 88,00 no 1.76x!
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-yellow-600" />
              Deposite R$ 20 e ganhe +R$ 120 de BÔNUS!
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-blue-900">
              <Users className="w-4 h-4 text-blue-700" />
              +1.480 apostadores faturando ao vivo!
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-700" />
              Pedr0_Gamer bateu 4.60x e levou R$ 230,00!
            </span>
          </div>
        </div>

        {/* CONTEÚDO CENTRAL: TÍTULO, PÁSSARO ANIMADO E CARD DE CADASTRO */}
        <div className="w-full max-w-md my-auto py-3 flex flex-col items-center z-10">
          {/* TÍTULO OFICIAL FLAPPY BIRD IDÊNTICO À FOTO DE REFERÊNCIA */}
          <h1 
            onClick={handleSecretLogoClick}
            className="font-pixel text-4xl sm:text-5xl md:text-6xl text-white tracking-widest text-center drop-shadow-[0_6px_0_#000000] cursor-pointer active:scale-95 transition"
            title="Clique para jogar ou 5x para Admin"
          >
            Flappy Bird
          </h1>
          <p className="font-pixel text-[10px] sm:text-xs text-yellow-300 drop-shadow-[0_2px_0_#000000] tracking-widest text-center mt-1 uppercase">
            GET MONEY BETS 💰 O CRASH OFICIAL
          </p>

          {/* O PÁSSARO AMARELO ORIGINAL DO FLAPPY BIRD COM ASINHAS ANIMADAS */}
          <div 
            onClick={handleSecretLogoClick}
            className="my-2.5 cursor-pointer"
            title="Flappy Bird Oficial"
          >
            <FlappyBirdSprite size="lg" />
          </div>

          {/* 3 BADGES DE INCENTIVO E BÔNUS */}
          <div className="w-full grid grid-cols-3 gap-1.5 mb-2.5 text-center">
            <div className="bg-[#73bf2e] border-2 border-black p-1.5 rounded-xl text-white shadow-pixel">
              <Gift className="w-4 h-4 mx-auto text-yellow-200" />
              <span className="text-[9px] font-pixel block mt-0.5">+R$ 120</span>
              <span className="text-[9px] font-black leading-none block">Bônus Depósito</span>
            </div>
            <div className="bg-[#f4c330] border-2 border-black p-1.5 rounded-xl text-black shadow-pixel">
              <Zap className="w-4 h-4 mx-auto text-orange-600" />
              <span className="text-[9px] font-pixel block mt-0.5">PIX 30s</span>
              <span className="text-[9px] font-black leading-none block">Saque Rápido</span>
            </div>
            <div className="bg-white border-2 border-black p-1.5 rounded-xl text-black shadow-pixel">
              <Share2 className="w-4 h-4 mx-auto text-blue-600" />
              <span className="text-[9px] font-pixel block mt-0.5">+R$ 20</span>
              <span className="text-[9px] font-black leading-none block">Por Amigo</span>
            </div>
          </div>

          {/* CARD DE CADASTRO RETRÔ FLAPPY BIRD */}
          <div className="w-full bg-[#ded895] border-4 border-black rounded-2xl p-4 sm:p-5 shadow-pixel-lg space-y-2.5">
            <div className="text-center pb-1 border-b-2 border-black/20">
              <h2 className="font-pixel text-xs text-black uppercase flex items-center justify-center gap-1.5">
                <User className="w-4 h-4 text-[#e86100]" /> CADASTRE-SE E JOGUE
              </h2>
              <p className="text-[11px] text-slate-800 font-bold mt-0.5">
                Ganhe <strong>R$ 10,00 de Bônus</strong> liberados na hora do cadastro!
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-2">
              {registerError && (
                <div className="bg-red-100 text-red-800 border-2 border-red-500 p-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{registerError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-black text-black flex items-center gap-1 mb-0.5">
                  <User className="w-3.5 h-3.5" /> Nome Completo:
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Vitor Silva"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-black flex items-center gap-1 mb-0.5">
                  <Phone className="w-3.5 h-3.5" /> Celular / WhatsApp (com DDD):
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="Ex: (99) 98528-0205"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <label className="text-xs font-black text-black flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Chave Pix para Receber Saques:
                  </label>
                  <select 
                    value={registerPixType}
                    onChange={(e) => setRegisterPixType(e.target.value)}
                    className="text-[10px] bg-white border border-black rounded px-1.5 py-0.5 font-bold cursor-pointer"
                  >
                    <option value="Celular">Celular</option>
                    <option value="CPF">CPF</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Aleatória">Aleatória</option>
                  </select>
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Informe sua chave Pix para receber os lucros"
                  value={registerPixKey}
                  onChange={(e) => setRegisterPixKey(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-pixel bg-[#73bf2e] hover:bg-[#558022] text-white font-pixel text-xs sm:text-sm py-2.5 rounded-xl border-2 border-black uppercase shadow-pixel mt-1"
              >
                CADASTRAR E GANHAR R$ 10 🚀
              </button>
            </form>

            <div className="pt-2 border-t border-black/20 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleQuickGuestLogin}
                className="w-full btn-pixel bg-white hover:bg-slate-100 text-black text-xs font-black py-2 rounded-xl border-2 border-black flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-600" /> Testar no Modo Visitante (1 Clique)
              </button>
            </div>
          </div>
        </div>

        {/* CENÁRIO RETRÔ CLÁSSICO DE PRÉDIOS E CHÃO COM GRAMA IDÊNTICO À FOTO */}
        <div className="w-full relative z-0 shrink-0">
          {/* Silhueta dos prédios do horizonte */}
          <div className="w-full h-7 flex items-end justify-around px-2 opacity-80">
            {[20, 28, 24, 34, 22, 30, 26, 38, 24, 28, 32, 22].map((h, i) => (
              <div 
                key={i} 
                className="bg-[#98dfa6] w-6 border-t-2 border-l-2 border-r-2 border-[#558022]/40 rounded-t-xs"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          {/* Faixa de Grama com Listras Diagonais */}
          <div className="w-full h-3 bg-[#73bf2e] border-y-2 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#558022,#558022_6px,#73bf2e_6px,#73bf2e_12px)]"></div>
          </div>
          {/* Chão Bege / Areia */}
          <div className="w-full h-7 bg-[#ded895] text-center pt-1 border-b-4 border-black">
            <span className="text-[10px] text-black font-black uppercase tracking-wider">
              Flappy Bird Get Money Bets • 100% Online & Seguro
            </span>
          </div>
        </div>

        {/* MODAL SECRETO DO DONO SE ATIVADO NA TELA DE CADASTRO */}
        {showAdminLoginModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-yellow-400 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3.5 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-pixel text-xs text-yellow-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> DONO DA BANCA
                </h3>
                <button 
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminPasswordError(false);
                    setAdminPasswordInput('');
                  }}
                  className="text-slate-400 hover:text-white font-bold"
                >✕</button>
              </div>

              <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
                <input 
                  type="password"
                  placeholder="Senha mestra..."
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-yellow-400 rounded-xl px-3 py-2 text-sm font-bold text-yellow-300 focus:outline-none"
                />

                {adminPasswordError && (
                  <span className="text-[11px] text-red-400 font-bold block">
                    Senha incorreta. Acesso negado.
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-pixel text-xs py-2.5 rounded-xl border-2 border-black uppercase"
                >
                  ENTRAR NO PAINEL SECRETO
                </button>
              </form>
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-yellow-400 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-3.5 text-white text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="font-pixel text-xs text-yellow-400">PAINEL GGR DA BANCA</span>
                <button 
                  onClick={() => setShowAdminModal(false)}
                  className="bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 rounded font-bold"
                >✕</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Apostas</span>
                  <span className="font-mono font-black text-white">R$ {houseStats.totalBets.toFixed(2)}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Pago</span>
                  <span className="font-mono font-black text-white">R$ {houseStats.totalPaid.toFixed(2)}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">GGR (Lucro)</span>
                  <span className={`font-mono font-black ${ggr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    R$ {ggr.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-black text-yellow-400 block">Rigor do Crash:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'EASY', label: 'Suave (60%)' },
                    { id: 'NORMAL', label: 'Padrão (86%)' },
                    { id: 'HARD', label: 'Triturador (94%)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setHouseRigor(opt.id)}
                      className={`py-1.5 rounded-lg text-[10px] font-black border transition ${
                        houseRigor === opt.id ? 'bg-yellow-500 text-black border-yellow-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-500">Chave Pix: {OWNER_PIX_KEY}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DASHBOARD DO JOGO (QUANDO LOGADO / CADASTRADO) ---
  return (
    <div 
      onClick={handleUserGestureAudio}
      className="min-h-screen bg-[#4ec0ca] text-slate-900 font-fredoka flex flex-col items-center justify-start p-2 sm:p-4 select-none"
    >
      
      {/* NOTIFICAÇÃO TOAST FLUTUANTE DE GANHO AO VIVO */}
      {recentLiveWinner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#ded895] border-4 border-black px-4 py-2 rounded-2xl shadow-pixel flex items-center gap-2 animate-bounce">
          <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
          <span className="text-xs font-black text-black">
            <strong>{recentLiveWinner.name}</strong> acabou de faturar <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-pixel text-[10px]">R$ {recentLiveWinner.win.toFixed(2)}</span> ({recentLiveWinner.mult.toFixed(2)}x)!
          </span>
        </div>
      )}

      {/* HEADER RETRÔ OFICIAL FLAPPY BIRD */}
      <header className="w-full max-w-xl flex justify-between items-center mb-2 bg-[#ded895] p-3 rounded-2xl border-4 border-black shadow-pixel">
        <div className="flex items-center gap-2.5">
          {/* Logo do Pássaro com Animação Original (5 cliques abre painel do dono) */}
          <div 
            onClick={handleSecretLogoClick}
            className="w-12 h-12 bg-white rounded-xl border-3 border-black flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition"
            title="Flappy Bird (5x Admin)"
          >
            <FlappyBirdSprite size="sm" />
          </div>

          <div>
            {/* Título com Fonte Oficial e Efeito 3D da foto do Flappy Bird */}
            <h1 className="font-pixel text-base sm:text-lg text-white tracking-wider drop-shadow-[0_3px_0_#000000]">
              FLAPPY BIRD
            </h1>
            <p className="text-[10px] font-black text-[#e86100] tracking-widest uppercase">
              GET MONEY BETS 💰
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Depositar Pix */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="btn-pixel bg-[#73bf2e] hover:bg-[#558022] text-white px-2.5 py-1.5 rounded-xl border-2 border-black font-black text-xs flex items-center gap-1"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" /> Pix
          </button>

          {/* Sacar Pix */}
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="btn-pixel bg-[#e86100] hover:bg-[#c24f00] text-white px-2.5 py-1.5 rounded-xl border-2 border-black font-black text-xs flex items-center gap-1"
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" /> Sacar
          </button>

          {/* Metas de Bônus */}
          <button 
            onClick={() => setShowGoalsModal(true)}
            className="btn-pixel p-1.5 rounded-xl border-2 border-black bg-white text-black"
            title="Metas de Saque e Bônus"
          >
            <Target className="w-4 h-4 text-orange-600" />
          </button>

          {/* Música */}
          <button 
            onClick={toggleMusicButton}
            className={`btn-pixel p-1.5 rounded-xl border-2 border-black transition ${
              musicActive ? 'bg-[#f4c330] text-black' : 'bg-slate-200 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Efeitos */}
          <button 
            onClick={toggleSfxButton}
            className={`btn-pixel p-1.5 rounded-xl border-2 border-black transition ${
              sfxActive ? 'bg-[#73bf2e] text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {sfxActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* BARRA DINÂMICA DE FRASE DE INCENTIVO ROTATIVA */}
      <div className="w-full max-w-xl mb-2 bg-[#ded895] border-3 border-black p-2 rounded-xl shadow-pixel flex items-center gap-2 overflow-hidden">
        <Sparkles className="w-4 h-4 text-[#e86100] shrink-0 animate-spin" />
        <p className="text-xs font-black text-black truncate transition-all duration-300">
          {INCENTIVE_PHRASES[phraseIndex]}
        </p>
      </div>

      {/* BARRA DE SALDO DETALHADA */}
      <div className="w-full max-w-xl mb-2 grid grid-cols-2 gap-2">
        <div className="bg-[#73bf2e] text-white p-2.5 rounded-xl border-3 border-black shadow-pixel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-green-100 block">Saldo Real Sacável:</span>
            <span className="font-pixel text-lg leading-none">R$ {realBalance.toFixed(2)}</span>
          </div>
          <Coins className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <div className="bg-[#f4c330] text-black p-2.5 rounded-xl border-3 border-black shadow-pixel flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-yellow-950 block flex items-center gap-1">
              Bônus Conta: <Gift className="w-3 h-3" />
            </span>
            <span className="font-pixel text-lg leading-none">R$ {bonusBalance.toFixed(2)}</span>
          </div>
          <span className="text-[9px] bg-white text-black font-black px-1.5 py-0.5 rounded border border-black">
            Apenas Jogo
          </span>
        </div>
      </div>

      {/* HISTÓRICO DE MULTIPLICADORES RETRÔ */}
      <div className="w-full max-w-xl mb-2 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-black text-white uppercase flex items-center gap-1 px-1 drop-shadow-[0_2px_0_#000000]">
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" /> Histórico:
          </span>
          {history.map((h, i) => (
            <span 
              key={i} 
              className={`text-[11px] font-pixel px-2 py-1 rounded-lg border-2 border-black shrink-0 ${
                h.mult >= 2.0
                  ? 'bg-[#f4c330] text-black shadow-sm'
                  : h.crashed 
                    ? 'bg-[#f87171] text-white'
                    : 'bg-[#73bf2e] text-white'
              }`}
            >
              {h.mult.toFixed(2)}x
            </span>
          ))}
        </div>

        <div className="text-[10px] bg-white text-black font-black px-2 py-0.5 rounded border-2 border-black shrink-0 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-green-700" /> SHA-256
        </div>
      </div>

      {/* ARENA DO JOGO / CANVAS CLÁSSICO DO FLAPPY BIRD */}
      <div 
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        className="relative w-full max-w-xl h-[280px] sm:h-[300px] rounded-2xl overflow-hidden border-4 border-black shadow-pixel-lg cursor-pointer select-none bg-[#4ec0ca]"
      >
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {/* FASE 1: CONTAGEM REGRESSIVA RETRÔ */}
        {roundPhase === 'WAITING' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[#ded895] border-4 border-black px-6 py-4 rounded-2xl shadow-pixel flex flex-col items-center gap-1.5 animate-in zoom-in-95">
              <span className="text-[11px] font-pixel text-black uppercase tracking-wider">
                DECOLAGEM EM:
              </span>
              <span className="font-pixel text-4xl text-[#e86100] drop-shadow-[0_3px_0_#000000]">
                {countdown.toFixed(1)}s
              </span>
              <div className="w-40 bg-white h-3 rounded border-2 border-black overflow-hidden mt-1">
                <div 
                  className="bg-[#73bf2e] h-full transition-all duration-100 ease-linear"
                  style={{ width: `${(countdown / 5.0) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-black font-black mt-1">
                Coloque suas apostas antes do voo! 🐤
              </p>
            </div>
          </div>
        )}

        {/* FASE 2: VOO DO FLAPPY BIRD - MULTIPLICADOR */}
        {roundPhase === 'FLYING' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#ded895] border-4 border-black px-6 py-1.5 rounded-2xl shadow-pixel flex items-center gap-2">
            <span className="font-pixel text-2xl sm:text-3xl text-[#e86100] drop-shadow-[0_2px_0_#000000]">
              {roundMultiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* DICA DE PULO */}
        {roundPhase === 'FLYING' && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/90 border-2 border-black px-3 py-1 rounded-full shadow-sm pointer-events-none">
            <span className="text-[11px] text-black font-black">
              Toque ou aperte <kbd className="bg-yellow-300 px-1.5 py-0.5 rounded border border-black text-black">Espaço</kbd> para Bater Asas! 🪽
            </span>
          </div>
        )}

        {/* FASE 3: GAME OVER / CRASHED */}
        {roundPhase === 'CRASHED' && (
          <div className="absolute inset-0 bg-red-600/85 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <h2 className="text-2xl sm:text-3xl font-pixel text-white mb-2 drop-shadow-[0_3px_0_#000000]">
              GAME OVER!
            </h2>
            <p className="text-yellow-200 text-xs font-pixel mb-3">
              MULTIPLICADOR: <span className="text-white bg-black/40 px-2 py-0.5 rounded">{roundMultiplier.toFixed(2)}x</span>
            </p>
            <span className="bg-[#ded895] text-black text-xs font-black px-4 py-1.5 rounded-xl border-2 border-black shadow-pixel animate-pulse">
              Reiniciando a rodada...
            </span>
          </div>
        )}
      </div>

      {/* DUPLO PAINEL DE APOSTAS COM ESTILO RETRÔ */}
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
        
        {/* PAINEL 1 */}
        <div className="bg-[#ded895] p-3.5 rounded-2xl border-4 border-black shadow-pixel flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-pixel text-black flex items-center gap-1">
              APOSTA 1
            </span>
            <label className="text-[11px] font-bold text-black flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={autoBet1}
                onChange={(e) => setAutoBet1(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-green-600 cursor-pointer"
              /> Auto Aposta
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black text-xs">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                value={bet1}
                onChange={(e) => setBet1(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border-2 border-black rounded-xl pl-8 pr-2 py-1.5 font-black text-black text-sm focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="flex gap-1">
              <button
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet1(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="btn-pixel bg-white border-2 border-black px-2 py-1.5 rounded-lg text-xs font-black disabled:opacity-50"
              >½</button>
              <button
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet1(prev => parseFloat((prev * 2).toFixed(2)))}
                className="btn-pixel bg-white border-2 border-black px-2 py-1.5 rounded-lg text-xs font-black disabled:opacity-50"
              >2x</button>
            </div>
          </div>

          <div className="bg-white p-1.5 rounded-xl border-2 border-black flex items-center justify-between text-xs">
            <label className="text-[11px] font-bold text-black flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={enableAutoCashout1}
                onChange={(e) => setEnableAutoCashout1(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-green-600 cursor-pointer"
              /> Auto Saque:
            </label>
            <div className="flex items-center gap-1">
              <input 
                type="number"
                step="0.1"
                min="1.1"
                value={autoCashout1}
                disabled={!enableAutoCashout1}
                onChange={(e) => setAutoCashout1(Math.max(1.1, parseFloat(e.target.value) || 1.1))}
                className="w-14 bg-slate-100 border border-black rounded px-1 text-center font-black text-xs disabled:opacity-40"
              />
              <span className="font-black text-black text-xs">x</span>
            </div>
          </div>

          {roundPhase === 'FLYING' && bet1Placed && !bet1CashedOut ? (
            <button
              onClick={cashOut1}
              className="w-full btn-pixel bg-[#f4c330] hover:bg-yellow-400 text-black font-pixel text-sm py-2.5 rounded-xl border-2 border-black uppercase animate-pulse"
            >
              SACAR R$ {(bet1 * roundMultiplier).toFixed(2)}
            </button>
          ) : bet1CashedOut ? (
            <div className="w-full bg-[#73bf2e] border-2 border-black text-white font-black text-center py-2 rounded-xl text-xs flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ganhou R$ {bet1Win.toFixed(2)}!
            </div>
          ) : bet1Placed ? (
            <button
              onClick={() => {
                setBet1Placed(false);
                setRealBalance(prev => prev + bet1);
              }}
              className="w-full btn-pixel bg-red-500 text-white font-black py-2 rounded-xl border-2 border-black text-xs"
            >
              Cancelar (R$ {bet1.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={placeBet1}
              className="w-full btn-pixel bg-[#73bf2e] hover:bg-[#558022] text-white font-pixel text-sm py-2.5 rounded-xl border-2 border-black uppercase"
            >
              APOSTAR R$ {bet1.toFixed(2)}
            </button>
          )}
        </div>

        {/* PAINEL 2 */}
        <div className="bg-[#ded895] p-3.5 rounded-2xl border-4 border-black shadow-pixel flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-pixel text-black flex items-center gap-1">
              APOSTA 2
            </span>
            <label className="text-[11px] font-bold text-black flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={autoBet2}
                onChange={(e) => setAutoBet2(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-green-600 cursor-pointer"
              /> Auto Aposta
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black text-xs">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                value={bet2}
                onChange={(e) => setBet2(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border-2 border-black rounded-xl pl-8 pr-2 py-1.5 font-black text-black text-sm focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="flex gap-1">
              <button
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet2(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="btn-pixel bg-white border-2 border-black px-2 py-1.5 rounded-lg text-xs font-black disabled:opacity-50"
              >½</button>
              <button
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet2(prev => parseFloat((prev * 2).toFixed(2)))}
                className="btn-pixel bg-white border-2 border-black px-2 py-1.5 rounded-lg text-xs font-black disabled:opacity-50"
              >2x</button>
            </div>
          </div>

          <div className="bg-white p-1.5 rounded-xl border-2 border-black flex items-center justify-between text-xs">
            <label className="text-[11px] font-bold text-black flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={enableAutoCashout2}
                onChange={(e) => setEnableAutoCashout2(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-green-600 cursor-pointer"
              /> Auto Saque:
            </label>
            <div className="flex items-center gap-1">
              <input 
                type="number"
                step="0.1"
                min="1.1"
                value={autoCashout2}
                disabled={!enableAutoCashout2}
                onChange={(e) => setAutoCashout2(Math.max(1.1, parseFloat(e.target.value) || 1.1))}
                className="w-14 bg-slate-100 border border-black rounded px-1 text-center font-black text-xs disabled:opacity-40"
              />
              <span className="font-black text-black text-xs">x</span>
            </div>
          </div>

          {roundPhase === 'FLYING' && bet2Placed && !bet2CashedOut ? (
            <button
              onClick={cashOut2}
              className="w-full btn-pixel bg-[#f4c330] hover:bg-yellow-400 text-black font-pixel text-sm py-2.5 rounded-xl border-2 border-black uppercase animate-pulse"
            >
              SACAR R$ {(bet2 * roundMultiplier).toFixed(2)}
            </button>
          ) : bet2CashedOut ? (
            <div className="w-full bg-[#73bf2e] border-2 border-black text-white font-black text-center py-2 rounded-xl text-xs flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ganhou R$ {bet2Win.toFixed(2)}!
            </div>
          ) : bet2Placed ? (
            <button
              onClick={() => {
                setBet2Placed(false);
                setRealBalance(prev => prev + bet2);
              }}
              className="w-full btn-pixel bg-red-500 text-white font-black py-2 rounded-xl border-2 border-black text-xs"
            >
              Cancelar (R$ {bet2.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={placeBet2}
              className="w-full btn-pixel bg-[#73bf2e] hover:bg-[#558022] text-white font-pixel text-sm py-2.5 rounded-xl border-2 border-black uppercase"
            >
              APOSTAR R$ {bet2.toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {/* ABAS SOCIAIS E GANHOS DE JOGADORES */}
      <div className="w-full max-w-xl bg-[#ded895] p-3.5 rounded-2xl border-4 border-black shadow-pixel mt-2.5">
        <div className="flex items-center gap-1.5 border-b-2 border-black pb-2 mb-2.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'live', label: 'Ao Vivo 👥' },
            { id: 'top', label: 'Ganhos Recordes 🏆' },
            { id: 'chat', label: 'Chat da Galera 💬' },
            { id: 'history', label: 'Minhas Apostas 📜' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-pixel px-3 py-1.5 rounded-xl text-xs font-black transition border-2 border-black shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-[#e86100] text-white' 
                  : 'bg-white text-black hover:bg-yellow-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'live' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {livePlayers.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-xl text-xs border-2 border-black">
                <span className="font-black text-black">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-600">R$ {p.bet.toFixed(2)}</span>
                  {p.cashedOut ? (
                    <span className="font-pixel text-[#558022] bg-[#9ce659] px-2 py-0.5 rounded border border-black text-[10px]">
                      +{p.mult.toFixed(2)}x (R$ {p.win.toFixed(2)})
                    </span>
                  ) : roundPhase === 'FLYING' ? (
                    <span className="text-[#e86100] font-black text-[11px] animate-pulse">Voando... 🪽</span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Apostou</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'top' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {[
              { rank: '🥇 1º', name: 'Marcos_Vitor', mult: 28.5, win: 2850.00 },
              { rank: '🥈 2º', name: 'Flappy_Master', mult: 18.2, win: 1820.00 },
              { rank: '🥉 3º', name: 'Camila_Win', mult: 12.0, win: 1200.00 },
              { rank: '4º', name: 'Dino_Gamer', mult: 9.5, win: 475.00 },
            ].map((t, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-xl text-xs border-2 border-black">
                <div className="flex items-center gap-2">
                  <span className="font-black text-black">{t.rank}</span>
                  <span className="font-bold text-slate-800">{t.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-pixel text-black bg-[#f4c330] px-1.5 py-0.5 rounded border border-black text-[10px]">{t.mult.toFixed(1)}x</span>
                  <span className="font-black text-[#558022]">R$ {t.win.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-2">
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-white px-3 py-1.5 rounded-xl text-xs border-2 border-black flex justify-between items-center">
                  <div>
                    <span className="font-black text-[#e86100] mr-1.5">{msg.user}:</span>
                    <span className="text-black font-medium">{msg.msg}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold ml-2 shrink-0">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-1.5 pt-1">
              <input 
                type="text"
                placeholder="Mande uma mensagem para a galera..."
                value={newChatInput}
                onChange={(e) => setNewChatInput(e.target.value)}
                className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black focus:outline-none"
              />
              <button 
                type="submit"
                className="btn-pixel bg-[#73bf2e] text-white px-3 py-1.5 rounded-xl font-black text-xs border-2 border-black flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {myBetsHistory.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-4 font-bold">
                Você ainda não fez apostas recentes.
              </p>
            ) : (
              myBetsHistory.map(b => (
                <div key={b.id} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-xl text-xs border-2 border-black">
                  <span className="font-bold text-black">{b.panel}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500">R$ {b.bet.toFixed(2)}</span>
                    <span className="font-pixel text-black text-[10px]">{b.mult.toFixed(2)}x</span>
                    <span className={`font-black ${b.status === 'WIN' ? 'text-[#558022]' : 'text-red-600'}`}>
                      {b.profit >= 0 ? `+R$ ${b.profit.toFixed(2)}` : `-R$ ${Math.abs(b.profit).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>



      {/* --- MODAL 2: METAS DE SAQUE --- */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ded895] border-4 border-black w-full max-w-md rounded-2xl p-5 shadow-pixel-lg space-y-3.5 animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-sm text-black flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#e86100]" /> METAS DE SAQUE
              </h3>
              <button 
                onClick={() => setShowGoalsModal(false)}
                className="btn-pixel bg-white text-black w-7 h-7 rounded border-2 border-black font-black"
              >✕</button>
            </div>

            <div className="space-y-2">
              <div className={`p-3 rounded-xl border-2 border-black ${hasDeposited && totalDeposited >= 20 ? 'bg-[#9ce659]' : 'bg-white'}`}>
                <div className="flex items-center justify-between font-black">
                  <span>1. Depósito Mínimo de R$ 20:</span>
                  <span>{hasDeposited && totalDeposited >= 20 ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
                </div>
                <p className="text-[11px] text-slate-700 mt-1">
                  🎁 Ao depositar R$ 20, ganhe <strong>+R$ 120,00 de BÔNUS</strong> automático!
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-black bg-[#f4c330]">
                <div className="flex items-center justify-between font-black">
                  <span>2. Convide Amigos (+R$ 20):</span>
                  <span>{friendsInvited} convidados</span>
                </div>
                <p className="text-[11px] text-black mt-1">
                  Ganhe <strong>R$ 20 de bônus</strong> por cada amigo cadastrado!
                </p>
              </div>

              <div className="bg-red-100 p-2.5 rounded-xl border-2 border-black text-red-900 text-[11px] font-bold">
                ⚠️ O saldo bônus serve exclusivamente para apostar. Seus lucros das apostas entram como <strong>Saldo Real</strong> e podem ser sacados via Pix!
              </div>
            </div>

            <button
              onClick={() => {
                setShowGoalsModal(false);
                setShowDepositModal(true);
              }}
              className="w-full btn-pixel bg-[#73bf2e] text-white font-pixel text-xs py-3 rounded-xl border-2 border-black uppercase"
            >
              DEPOSITAR R$ 20 E GANHAR R$ 120 🚀
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CONVIDAR AMIGOS --- */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ded895] border-4 border-black w-full max-w-sm rounded-2xl p-5 shadow-pixel-lg space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-xs text-black flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#e86100]" /> CONVIDE E GANHE
              </h3>
              <button 
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteCopied(false);
                }}
                className="btn-pixel bg-white text-black w-7 h-7 rounded border-2 border-black font-black"
              >✕</button>
            </div>

            <p className="text-black font-bold">
              Compartilhe seu link exclusivo. Cada amigo que entrar garante <strong>+R$ 20,00 de bônus</strong> para você!
            </p>

            <div className="bg-white p-2.5 rounded-xl border-2 border-black space-y-1">
              <span className="text-[10px] font-black uppercase block">Seu Link:</span>
              <div className="flex items-center gap-1">
                <input 
                  readOnly 
                  value="https://bets-henna.vercel.app/?ref=99985280205"
                  className="w-full bg-slate-100 px-2 py-1.5 rounded border border-black text-[10px] font-mono font-bold truncate"
                />
                <button 
                  onClick={handleSimulateInviteFriend}
                  className="btn-pixel bg-[#73bf2e] text-white p-1.5 rounded border-2 border-black shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {inviteCopied && (
                <span className="text-[11px] text-[#558022] font-black block text-center animate-bounce">
                  🎉 Link copiado e +R$ 20 de Bônus creditados!
                </span>
              )}
            </div>

            <button
              onClick={handleSimulateInviteFriend}
              className="w-full btn-pixel bg-[#e86100] text-white font-pixel text-xs py-2.5 rounded-xl border-2 border-black uppercase"
            >
              SIMULAR AMIGO CADASTRADO (+R$ 20)
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 4: DEPÓSITO PIX COM A CHAVE DO DONO --- */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ded895] border-4 border-black w-full max-w-sm rounded-2xl p-5 shadow-pixel-lg space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-xs text-black flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-[#558022]" /> DEPOSITAR PIX
              </h3>
              <button 
                onClick={() => {
                  setShowDepositModal(false);
                  setPixSimulateSuccess(false);
                }}
                className="btn-pixel bg-white text-black w-7 h-7 rounded border-2 border-black font-black"
              >✕</button>
            </div>

            <div className="bg-[#f4c330] p-2 rounded-xl border-2 border-black text-[11px] text-black font-black flex items-center gap-1.5">
              <Gift className="w-4 h-4 shrink-0" />
              <span>Deposite <strong>R$ 20 ou mais</strong> e ganhe <strong>+R$ 120 de Bônus</strong>!</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[20, 30, 50, 100, 200, 500].map(val => (
                <button
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className={`btn-pixel py-1.5 rounded-lg font-pixel text-xs border-2 border-black transition ${
                    depositAmount === val ? 'bg-[#73bf2e] text-white' : 'bg-white text-black'
                  }`}
                >
                  R${val}
                </button>
              ))}
            </div>

            <div className="bg-white p-2.5 rounded-xl border-2 border-black text-center space-y-1.5">
              <span className="text-[10px] font-black uppercase block">Chave Pix da Banca:</span>
              <div className="bg-[#9ce659] text-black font-mono font-black text-base py-1 px-3 rounded-lg border-2 border-black flex items-center justify-center gap-2">
                <span>{OWNER_PIX_KEY}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(OWNER_PIX_KEY);
                    setPixCopied(true);
                    setTimeout(() => setPixCopied(false), 2000);
                  }}
                  className="btn-pixel bg-white p-1 rounded border border-black text-black"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-600 font-bold">Tipo: Telefone • Destinatário: Dono da Banca</p>
            </div>

            {pixSimulateSuccess && (
              <div className="bg-[#9ce659] text-black border-2 border-black p-2 rounded-xl text-xs font-black text-center animate-bounce">
                ✅ Depósito de R$ {depositAmount.toFixed(2)} aprovado + R$ 120 de Bônus!
              </div>
            )}

            <button
              onClick={handleApproveDeposit}
              className="w-full btn-pixel bg-[#73bf2e] text-white font-pixel text-xs py-3 rounded-xl border-2 border-black uppercase"
            >
              CONFIRMAR R$ {depositAmount.toFixed(2)} 🚀
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 5: SAQUE --- */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ded895] border-4 border-black w-full max-w-sm rounded-2xl p-5 shadow-pixel-lg space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-xs text-black flex items-center gap-2">
                <ArrowUpFromLine className="w-4 h-4 text-[#e86100]" /> SACAR VIA PIX
              </h3>
              <button 
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawError('');
                  setWithdrawSuccessAlert(false);
                }}
                className="btn-pixel bg-white text-black w-7 h-7 rounded border-2 border-black font-black"
              >✕</button>
            </div>

            <div className={`p-2 rounded-xl border-2 border-black ${hasDeposited && totalDeposited >= 20 ? 'bg-[#9ce659]' : 'bg-red-200'}`}>
              <span className="font-black">Meta de Depósito (mín R$ 20): {hasDeposited && totalDeposited >= 20 ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border-2 border-black space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold">Saldo Real Sacável:</span>
                <span className="font-pixel text-sm text-[#558022]">R$ {realBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 font-bold">Saldo Bônus:</span>
                <span className="font-pixel text-black">R$ {bonusBalance.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-600 truncate border-t pt-1">
                Chave Pix: {userProfile?.pixKey || OWNER_PIX_KEY}
              </p>
            </div>

            <div>
              <label className="text-xs font-black block mb-1">Valor do Saque (R$):</label>
              <input 
                type="number"
                min="5"
                max={realBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-sm font-black text-black focus:outline-none"
              />
            </div>

            {withdrawError && (
              <div className="bg-red-100 text-red-800 border-2 border-red-500 p-2 rounded-xl text-[11px] font-bold">
                {withdrawError}
              </div>
            )}

            {withdrawSuccessAlert && (
              <div className="bg-[#9ce659] text-black border-2 border-black p-2 rounded-xl text-xs font-black text-center animate-bounce">
                🎉 Saque de R$ {withdrawAmount.toFixed(2)} enviado para sua chave Pix!
              </div>
            )}

            <button
              onClick={handleRequestWithdraw}
              className="w-full btn-pixel bg-[#e86100] text-white font-pixel text-xs py-3 rounded-xl border-2 border-black uppercase"
            >
              TRANSFERIR PIX R$ {withdrawAmount.toFixed(2)} 💸
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 6: PERFIL DO JOGADOR --- */}
      {showProfileModal && userProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ded895] border-4 border-black w-full max-w-sm rounded-2xl p-5 shadow-pixel-lg space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-xs text-black flex items-center gap-2">
                <User className="w-4 h-4" /> MEU PERFIL
              </h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="btn-pixel bg-white text-black w-7 h-7 rounded border-2 border-black font-black"
              >✕</button>
            </div>

            <div className="bg-white p-3 rounded-xl border-2 border-black space-y-1.5">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Nome:</span>
                <span className="font-black text-sm">{userProfile.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Celular:</span>
                <span className="font-black">{userProfile.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Chave Pix ({userProfile.pixType}):</span>
                <span className="font-mono font-black text-black bg-slate-100 px-2 py-0.5 rounded border border-black block truncate">
                  {userProfile.pixKey}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full btn-pixel bg-red-500 text-white text-xs font-black py-2 rounded-xl border-2 border-black flex items-center justify-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Sair da Conta
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL SECRETO: LOGIN DO DONO (5 CLIQUES NO LOGO) --- */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-yellow-400 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3.5 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-pixel text-xs text-yellow-400 flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> DONO DA BANCA
              </h3>
              <button 
                onClick={() => {
                  setShowAdminLoginModal(false);
                  setAdminPasswordError(false);
                  setAdminPasswordInput('');
                }}
                className="text-slate-400 hover:text-white font-bold"
              >✕</button>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-3">
              <input 
                type="password"
                placeholder="Senha mestra..."
                autoFocus
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-yellow-400 rounded-xl px-3 py-2 text-sm font-bold text-yellow-300 focus:outline-none"
              />

              {adminPasswordError && (
                <span className="text-[11px] text-red-400 font-bold block">
                  Senha incorreta. Acesso negado.
                </span>
              )}

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-pixel text-xs py-2.5 rounded-xl border-2 border-black uppercase"
              >
                ENTRAR NO PAINEL SECRETO
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL SECRETO: PAINEL DE CONTROLE GGR DA BANCA --- */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-yellow-400 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-3.5 text-white text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-pixel text-xs text-yellow-400">PAINEL GGR DA BANCA</span>
              <button 
                onClick={() => setShowAdminModal(false)}
                className="bg-slate-800 text-slate-400 hover:text-white px-2 py-0.5 rounded font-bold"
              >✕</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Apostas</span>
                <span className="font-mono font-black text-white">R$ {houseStats.totalBets.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Total Pago</span>
                <span className="font-mono font-black text-white">R$ {houseStats.totalPaid.toFixed(2)}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">GGR (Lucro)</span>
                <span className={`font-mono font-black ${ggr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {ggr.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-black text-yellow-400 block">Rigor do Crash:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'EASY', label: 'Suave (60%)' },
                  { id: 'NORMAL', label: 'Padrão (86%)' },
                  { id: 'HARD', label: 'Triturador (94%)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setHouseRigor(opt.id)}
                    className={`py-1.5 rounded-lg text-[10px] font-black border transition ${
                      houseRigor === opt.id ? 'bg-yellow-500 text-black border-yellow-300' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-slate-500">Chave Pix: {OWNER_PIX_KEY}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-3 text-[11px] text-black font-black text-center drop-shadow-[0_1px_0_#ffffff]">
        FLAPPY BIRD GET MONEY 🐤 • <kbd className="bg-white px-1.5 py-0.5 rounded border border-black">Espaço</kbd> Bater Asas • <kbd className="bg-white px-1.5 py-0.5 rounded border border-black">Z</kbd> Sacar 1 • <kbd className="bg-white px-1.5 py-0.5 rounded border border-black">X</kbd> Sacar 2
      </footer>
    </div>
  );
}
