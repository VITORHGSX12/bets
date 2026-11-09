import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Award, 
  Settings, 
  Coins, 
  Volume2, 
  VolumeX, 
  Music, 
  RotateCcw, 
  Users, 
  Sparkles, 
  ShieldAlert, 
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
  QrCode
} from 'lucide-react';

// CHAVE PIX OFICIAL DO DONO DA BANCA
const OWNER_PIX_KEY = '99985280205';

// --- MOTOR DE ÁUDIO SINTETIZADO INFANTIL (Web Audio API) ---
class CartoonAudioEngine {
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
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBoing() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  playTaDah() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.1, delay: 0 },
      { f: 659.25, d: 0.1, delay: 0.08 },
      { f: 783.99, d: 0.12, delay: 0.16 },
      { f: 1046.50, d: 0.45, delay: 0.26 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + n.delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.d + 0.05);
    });
  }

  playWompWomp() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const pitches = [311.13, 293.66, 277.18, 246.94];

    pitches.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.16;
      const dur = idx === 3 ? 0.4 : 0.14;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      if (idx === 3) {
        osc.frequency.exponentialRampToValueAtTime(140, t + dur);
      }

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }

  playCoin() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.07);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playTick() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  startMusic() {
    this.init();
    if (this.bgmPlaying || this.bgmMuted || !this.ctx) return;
    this.bgmPlaying = true;

    const melody = [
      { f: 523.25, dur: 0.18 },
      { f: 523.25, dur: 0.18 },
      { f: 659.25, dur: 0.18 },
      { f: 783.99, dur: 0.28 },
      { f: 659.25, dur: 0.18 },
      { f: 783.99, dur: 0.28 },
      { f: 880.00, dur: 0.35 },
      { f: 783.99, dur: 0.35 },
      { f: 698.46, dur: 0.18 },
      { f: 659.25, dur: 0.18 },
      { f: 587.33, dur: 0.28 },
      { f: 523.25, dur: 0.18 },
      { f: 587.33, dur: 0.18 },
      { f: 659.25, dur: 0.28 },
      { f: 523.25, dur: 0.45 },
      { f: 0,      dur: 0.15 }
    ];

    const stepInterval = 210;

    const tick = () => {
      if (!this.bgmPlaying || this.bgmMuted) return;
      const note = melody[this.currentStep % melody.length];
      this.currentStep++;

      if (note.f > 0 && this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + note.dur + 0.05);

        if (this.currentStep % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(note.f / 4, now);
          bassGain.gain.setValueAtTime(0.06, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.2);
        }
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

const audio = new CartoonAudioEngine();

const generateRoundHash = () => {
  const chars = 'abcdef0123456789';
  let hash = 'redbird_';
  for (let i = 0; i < 28; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

export default function App() {
  // --- PERFIL DO JOGADOR ---
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('redbird_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPixKey, setRegisterPixKey] = useState('');
  const [registerPixType, setRegisterPixType] = useState('Celular');
  const [registerError, setRegisterError] = useState('');

  // --- CARTEIRA SEPARADA (SALDO REAL SACÁVEL VS SALDO BÔNUS) ---
  const [realBalance, setRealBalance] = useState(() => {
    const saved = localStorage.getItem('redbird_real_balance');
    return saved ? parseFloat(saved) : 0.00; // Saldo real sacável vem de depósitos e lucros
  });

  const [bonusBalance, setBonusBalance] = useState(() => {
    const saved = localStorage.getItem('redbird_bonus_balance');
    return saved ? parseFloat(saved) : 0.00; // Bônus não pode ser sacado, apenas jogado
  });

  // CRITÉRIO DE SAQUE / METAS:
  const [hasDeposited, setHasDeposited] = useState(() => {
    const saved = localStorage.getItem('redbird_has_deposited');
    return saved === 'true';
  });

  const [totalDeposited, setTotalDeposited] = useState(() => {
    const saved = localStorage.getItem('redbird_total_deposited');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [friendsInvited, setFriendsInvited] = useState(() => {
    const saved = localStorage.getItem('redbird_friends_invited');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Saldo Total Disponível para Apostar (Real + Bônus)
  const totalBalance = realBalance + bonusBalance;

  // --- CONTROLE DE RODADA GLOBAL ---
  const [roundPhase, setRoundPhase] = useState('WAITING');
  const [countdown, setCountdown] = useState(5.0);
  const [roundMultiplier, setRoundMultiplier] = useState(1.00);
  const [roundHash, setRoundHash] = useState(generateRoundHash());
  const [roundCrashTarget, setRoundCrashTarget] = useState(1.85);

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

  // --- MODAIS E TELAS ---
  const [musicActive, setMusicActive] = useState(false);
  const [sfxActive, setSfxActive] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  // Histórico
  const [history, setHistory] = useState([
    { mult: 1.25, crashed: true },
    { mult: 2.10, crashed: false },
    { mult: 1.05, crashed: true },
    { mult: 4.80, crashed: false },
    { mult: 1.15, crashed: true },
    { mult: 11.2, crashed: false },
  ]);

  const [myBetsHistory, setMyBetsHistory] = useState([]);

  // Jogadores da Mesa
  const [livePlayers, setLivePlayers] = useState([
    { name: 'Ursinho_Pimpão 🧸', bet: 25, cashedOut: false, win: 0, mult: 0, target: 1.45 },
    { name: 'Joaninha_Feliz 🐞', bet: 50, cashedOut: false, win: 0, mult: 0, target: 2.20 },
    { name: 'Pipoca_Doce 🍿', bet: 10, cashedOut: false, win: 0, mult: 0, target: 1.18 },
    { name: 'Dino_Baby 🦖', bet: 100, cashedOut: false, win: 0, mult: 0, target: 1.80 },
    { name: 'Coelhinho_Saltador 🐰', bet: 30, cashedOut: false, win: 0, mult: 0, target: 3.50 },
  ]);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { user: 'Ursinho_Pimpão', msg: 'Depositei R$ 20 e ganhei R$ 120 de bônus! 🚀', time: '22:30' },
    { user: 'Dino_Baby', msg: 'Convidei um amigo e ganhei +R$ 20! 🎉', time: '22:35' },
    { user: 'Pipoca_Doce', msg: 'Piu-Piu tá voando alto hoje! 🍿', time: '22:40' },
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  // Admin
  const [houseRigor, setHouseRigor] = useState('NORMAL');
  const [houseStats, setHouseStats] = useState(() => {
    const saved = localStorage.getItem('redbird_housestats_v5');
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
  const birdRef = useRef({ y: 140, vy: 0, wingAngle: 0 });
  const pipesRef = useRef([]);
  const starsRef = useRef([]);
  const cloudsRef = useRef([
    { x: 30, y: 35, scale: 0.9 },
    { x: 180, y: 65, scale: 1.2 },
    { x: 330, y: 30, scale: 1.0 },
    { x: 450, y: 75, scale: 1.1 }
  ]);
  const hillsRef = useRef([
    { x: 0, h: 55, color: '#86efac' },
    { x: 200, h: 70, color: '#4ade80' },
    { x: 400, h: 60, color: '#86efac' }
  ]);

  // Persistências
  useEffect(() => {
    localStorage.setItem('redbird_real_balance', realBalance.toString());
  }, [realBalance]);

  useEffect(() => {
    localStorage.setItem('redbird_bonus_balance', bonusBalance.toString());
  }, [bonusBalance]);

  useEffect(() => {
    localStorage.setItem('redbird_has_deposited', hasDeposited.toString());
    localStorage.setItem('redbird_total_deposited', totalDeposited.toString());
    localStorage.setItem('redbird_friends_invited', friendsInvited.toString());
  }, [hasDeposited, totalDeposited, friendsInvited]);

  useEffect(() => {
    localStorage.setItem('redbird_housestats_v5', JSON.stringify(houseStats));
  }, [houseStats]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('redbird_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('redbird_user_profile');
    }
  }, [userProfile]);

  // Cadastro Inicial
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerName.trim() || registerName.trim().length < 3) {
      setRegisterError('Por favor, informe seu nome completo.');
      return;
    }
    if (!registerPhone.trim() || registerPhone.replace(/\D/g, '').length < 10) {
      setRegisterError('Por favor, informe um número de celular válido com DDD.');
      return;
    }
    if (!registerPixKey.trim() || registerPixKey.trim().length < 4) {
      setRegisterError('Por favor, informe sua chave Pix para receber seus saques.');
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
    // Bônus inicial de cadastro: R$ 10 de bônus cortesia
    setBonusBalance(prev => prev + 10.00);
    audio.playTaDah();
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

  // Descontar aposta (gasta saldo bônus primeiro, depois saldo real)
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

  // Adicionar ganho (lucro sempre entra como SALDO REAL SACÁVEL!)
  const addWin = (amount) => {
    setRealBalance(prev => prev + amount);
  };

  // Preparar Próxima Rodada
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

    birdRef.current = { y: 140, vy: -1.5, wingAngle: 0 };
    pipesRef.current = [
      { x: 340, top: 80, bottom: 110 },
      { x: 530, top: 120, bottom: 80 }
    ];
    starsRef.current = [];

    setLivePlayers([
      { name: 'Ursinho_Pimpão 🧸', bet: Math.floor(Math.random() * 30 + 10), cashedOut: false, win: 0, mult: 0, target: 1.15 + Math.random() * 0.5 },
      { name: 'Joaninha_Feliz 🐞', bet: Math.floor(Math.random() * 50 + 20), cashedOut: false, win: 0, mult: 0, target: 1.25 + Math.random() * 1.3 },
      { name: 'Pipoca_Doce 🍿', bet: 10, cashedOut: false, win: 0, mult: 0, target: 1.10 + Math.random() * 0.4 },
      { name: 'Dino_Baby 🦖', bet: Math.floor(Math.random() * 80 + 30), cashedOut: false, win: 0, mult: 0, target: 1.40 + Math.random() * 2.0 },
      { name: 'Coelhinho_Saltador 🐰', bet: Math.floor(Math.random() * 40 + 15), cashedOut: false, win: 0, mult: 0, target: 1.30 + Math.random() * 0.8 },
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
          if (Math.floor(prev) !== Math.floor(prev - 0.1)) {
            audio.playTick();
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
    addWin(win); // Entra como saldo real
    setHouseStats(prev => ({ ...prev, totalPaid: prev.totalPaid + win }));
    audio.playTaDah();

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
    audio.playTaDah();

    setMyBetsHistory(prev => [
      { id: Date.now(), panel: 'Aposta 2', bet: bet2, mult: currentMult, win: win, profit: win - bet2, status: 'WIN' },
      ...prev.slice(0, 15)
    ]);
  };

  // Pulo
  const jump = () => {
    handleUserGestureAudio();
    if (roundPhase === 'FLYING') {
      birdRef.current.vy = -5.4;
      audio.playBoing();

      for (let i = 0; i < 4; i++) {
        starsRef.current.push({
          x: 65 - Math.random() * 10,
          y: birdRef.current.y + (Math.random() * 14 - 7),
          vx: -(Math.random() * 2.5 + 1),
          vy: (Math.random() * 2 - 1),
          size: Math.random() * 6 + 4,
          rot: Math.random() * Math.PI,
          type: Math.random() > 0.4 ? 'star' : 'heart',
          color: ['#fde047', '#f472b6', '#38bdf8', '#a78bfa'][Math.floor(Math.random() * 4)],
          alpha: 1.0
        });
      }
    }
  };

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (roundPhase === 'FLYING') {
          jump();
        }
      } else if (e.code === 'KeyZ') {
        if (roundPhase === 'FLYING' && bet1Placed && !bet1CashedOut) {
          cashOut1();
        }
      } else if (e.code === 'KeyX') {
        if (roundPhase === 'FLYING' && bet2Placed && !bet2CashedOut) {
          cashOut2();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [roundPhase, bet1Placed, bet1CashedOut, bet2Placed, bet2CashedOut]);

  // Loop de Animação
  useEffect(() => {
    if (roundPhase !== 'FLYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      multRef.current += 0.0078;
      const currentMult = multRef.current;
      setRoundMultiplier(currentMult);

      if (bet1Placed && !bet1CashedOut && enableAutoCashout1 && currentMult >= autoCashout1) {
        cashOut1();
      }

      if (bet2Placed && !bet2CashedOut && enableAutoCashout2 && currentMult >= autoCashout2) {
        cashOut2();
      }

      setLivePlayers(prev => prev.map(p => {
        if (!p.cashedOut && currentMult >= p.target) {
          return { ...p, cashedOut: true, win: p.bet * currentMult, mult: currentMult };
        }
        return p;
      }));

      if (currentMult >= roundCrashTarget) {
        audio.playWompWomp();
        setHistory(prev => [{ mult: parseFloat(currentMult.toFixed(2)), crashed: true }, ...prev.slice(0, 9)]);

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

      birdRef.current.vy += 0.35;
      birdRef.current.y += birdRef.current.vy;
      birdRef.current.wingAngle += 0.36;

      if (birdRef.current.y > 220) {
        birdRef.current.vy = -3.8;
      } else if (birdRef.current.y < 50) {
        birdRef.current.vy = 2.0;
      }

      cloudsRef.current.forEach(c => {
        c.x -= 0.6;
        if (c.x < -80) c.x = 440;
      });

      hillsRef.current.forEach(h => {
        h.x -= 0.8;
        if (h.x < -200) h.x = 400;
      });

      pipesRef.current.forEach(p => { p.x -= 2.6; });
      if (pipesRef.current.length && pipesRef.current[0].x < -60) {
        pipesRef.current.shift();
        const lastX = pipesRef.current[pipesRef.current.length - 1]?.x || 300;
        const topH = Math.floor(Math.random() * 90) + 50;
        pipesRef.current.push({ x: lastX + 180, top: topH, bottom: 260 - topH - 95 });
      }

      starsRef.current.forEach(st => {
        st.x += st.vx;
        st.y += st.vy;
        st.rot += 0.1;
        st.alpha -= 0.025;
      });
      starsRef.current = starsRef.current.filter(st => st.alpha > 0);

      // Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
      skyGrad.addColorStop(0, '#67e8f9');
      skyGrad.addColorStop(0.5, '#bae6fd');
      skyGrad.addColorStop(1, '#fef08a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = 0.32;
      const rainbowColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];
      rainbowColors.forEach((color, i) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(200, 320, 180 - i * 6, Math.PI, 0);
        ctx.stroke();
      });
      ctx.restore();

      ctx.save();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(355, 45, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(355 + Math.cos(angle) * 28, 45 + Math.sin(angle) * 28);
        ctx.lineTo(355 + Math.cos(angle) * 36, 45 + Math.sin(angle) * 36);
        ctx.stroke();
      }
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(350, 42, 2.5, 0, Math.PI * 2);
      ctx.arc(362, 42, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(356, 46, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.restore();

      cloudsRef.current.forEach(c => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 16 * c.scale, c.y - 8 * c.scale, 20 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 34 * c.scale, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
        ctx.beginPath();
        ctx.arc(c.x + 8 * c.scale, c.y + 2 * c.scale, 4 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 24 * c.scale, c.y + 2 * c.scale, 4 * c.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      hillsRef.current.forEach(h => {
        ctx.fillStyle = h.color;
        ctx.beginPath();
        ctx.ellipse(h.x + 100, 310, 140, h.h, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 285, canvas.width, 15);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 296, canvas.width, 4);

      pipesRef.current.forEach(p => {
        ctx.save();
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.x, 0, 52, p.top);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(p.x, 0, 52, p.top);

        ctx.fillStyle = '#86efac';
        for (let y = 0; y < p.top; y += 22) {
          ctx.beginPath();
          ctx.moveTo(p.x + 2, y);
          ctx.lineTo(p.x + 50, y + 14);
          ctx.lineTo(p.x + 50, y + 22);
          ctx.lineTo(p.x + 2, y + 8);
          ctx.fill();
        }

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.top - 20, 60, 20, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.x, 300 - p.bottom, 52, p.bottom);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(p.x, 300 - p.bottom, 52, p.bottom);

        ctx.fillStyle = '#86efac';
        for (let y = 300 - p.bottom; y < 300; y += 22) {
          ctx.beginPath();
          ctx.moveTo(p.x + 2, y);
          ctx.lineTo(p.x + 50, y + 14);
          ctx.lineTo(p.x + 50, y + 22);
          ctx.lineTo(p.x + 2, y + 8);
          ctx.fill();
        }

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(p.x - 4, 300 - p.bottom, 60, 20, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      starsRef.current.forEach(st => {
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.rotate(st.rot);
        ctx.globalAlpha = Math.max(0, st.alpha);
        ctx.fillStyle = st.color;
        if (st.type === 'star') {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos((18 + s * 72) * 0.0174) * st.size, -Math.sin((18 + s * 72) * 0.0174) * st.size);
            ctx.lineTo(Math.cos((54 + s * 72) * 0.0174) * (st.size / 2), -Math.sin((54 + s * 72) * 0.0174) * (st.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(-st.size / 3, 0, st.size / 3, Math.PI, 0, false);
          ctx.arc(st.size / 3, 0, st.size / 3, Math.PI, 0, false);
          ctx.lineTo(0, st.size * 0.7);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      const birdX = 70;
      const birdY = birdRef.current.y;
      const r = 18;

      ctx.save();
      ctx.translate(birdX, birdY);
      ctx.rotate(Math.min(Math.max(birdRef.current.vy * 0.07, -0.4), 0.6));

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-7, Math.sin(birdRef.current.wingAngle) * 6, 12, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fee2e2';
      ctx.beginPath();
      ctx.arc(-2, 5, 11, 0.2, Math.PI - 0.2);
      ctx.fill();

      ctx.fillStyle = 'rgba(251, 113, 133, 0.8)';
      ctx.beginPath();
      ctx.arc(2, 4, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -5, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, -5, 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(9, -7, 1.8, 0, Math.PI * 2);
      ctx.arc(12, -4, 1.0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(15, 3, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-5, -16);
      ctx.lineTo(2, -26);
      ctx.lineTo(7, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

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

  // EXECUÇÃO DO DEPÓSITO COM REGRA: MÍNIMO R$ 20 GANHA +R$ 120 DE BÔNUS
  const handleApproveDeposit = () => {
    if (depositAmount < 20) return;

    // Credita o valor real
    setRealBalance(prev => prev + depositAmount);
    setTotalDeposited(prev => prev + depositAmount);
    setHasDeposited(true);

    // Se depositou R$ 20 ou mais, ganha R$ 120 de bônus!
    const bonusGiven = 120.00;
    setBonusBalance(prev => prev + bonusGiven);

    audio.playCoin();
    setPixSimulateSuccess(true);
    setTimeout(() => {
      setShowDepositModal(false);
      setPixSimulateSuccess(false);
    }, 1500);
  };

  // EXECUÇÃO DO SAQUE COM CRITÉRIOS DE META
  const handleRequestWithdraw = () => {
    setWithdrawError('');

    // CRITÉRIO 1: Precisa ter feito depósito mínimo de R$ 20
    if (!hasDeposited || totalDeposited < 20) {
      setWithdrawError('Meta não atingida: É necessário fazer pelo menos 1 depósito de no mínimo R$ 20,00 para desbloquear a conta de saque.');
      return;
    }

    // CRITÉRIO 2: Saldo Bônus NÃO pode ser sacado, apenas o saldo REAL!
    if (withdrawAmount > realBalance) {
      setWithdrawError(`Saldo bônus não pode ser sacado. Seu saldo real disponível para saque é de R$ ${realBalance.toFixed(2)}.`);
      return;
    }

    if (withdrawAmount <= 0) {
      setWithdrawError('Informe um valor de saque válido.');
      return;
    }

    // Sucesso!
    setRealBalance(prev => prev - withdrawAmount);
    audio.playTaDah();
    setWithdrawSuccessAlert(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSuccessAlert(false);
    }, 1600);
  };

  // Simular convite de amigo (+R$ 20 de bônus)
  const handleSimulateInviteFriend = () => {
    setFriendsInvited(prev => prev + 1);
    setBonusBalance(prev => prev + 20.00); // Bônus não sacável
    audio.playTaDah();
    setInviteCopied(true);
  };

  const ggr = houseStats.totalBets - houseStats.totalPaid;

  return (
    <div 
      onClick={handleUserGestureAudio}
      className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 text-slate-800 font-fredoka flex flex-col items-center justify-start p-2 sm:p-4 select-none"
    >
      
      {/* HEADER PRINCIPAL */}
      <header className="w-full max-w-xl flex justify-between items-center mb-2 bg-white/95 backdrop-blur-md p-3 rounded-3xl border-4 border-amber-300 shadow-pop-amber">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center border-2 border-white shadow-md animate-float-wiggle">
            <span className="text-2xl">🐤</span>
          </div>
          <div>
            <h1 className="text-xl font-cartoon tracking-wider text-rose-500 flex items-center gap-1 leading-none drop-shadow-sm">
              RED BIRD <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-fredoka font-black border-2 border-amber-500">GET MONEY</span>
            </h1>
            {userProfile ? (
              <button 
                onClick={() => setShowProfileModal(true)}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-left"
              >
                <User className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[120px] font-black">{userProfile.name}</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded">Perfil</span>
              </button>
            ) : (
              <p className="text-[10px] font-bold text-sky-600">CADASTRE-SE PARA JOGAR 🎈</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Depositar Pix */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="btn-pop bg-emerald-500 hover:bg-emerald-400 text-white px-2.5 py-1.5 rounded-2xl border-2 border-emerald-600 font-black text-xs flex items-center gap-1 shadow-sm"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" /> Pix
          </button>

          {/* Sacar Pix */}
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="btn-pop bg-sky-500 hover:bg-sky-400 text-white px-2.5 py-1.5 rounded-2xl border-2 border-sky-600 font-black text-xs flex items-center gap-1 shadow-sm"
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" /> Sacar
          </button>

          {/* Botão Metas */}
          <button 
            onClick={() => setShowGoalsModal(true)}
            className="btn-pop p-1.5 rounded-2xl border-2 bg-amber-100 border-amber-300 text-amber-800"
            title="Metas de Saque e Bônus"
          >
            <Target className="w-4 h-4 text-amber-600" />
          </button>

          {/* Música */}
          <button 
            onClick={toggleMusicButton}
            className={`btn-pop p-1.5 rounded-2xl border-2 transition ${
              musicActive ? 'bg-rose-400 text-white border-rose-500' : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Efeitos */}
          <button 
            onClick={toggleSfxButton}
            className={`btn-pop p-1.5 rounded-2xl border-2 transition ${
              sfxActive ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
          >
            {sfxActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Admin */}
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className="btn-pop p-1.5 rounded-2xl border-2 bg-purple-100 border-purple-300 text-purple-700"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BARRA DE SALDO DETALHADA (REAL SACÁVEL VS BÔNUS CONTA) */}
      <div className="w-full max-w-xl mb-2 grid grid-cols-2 gap-2">
        <div className="bg-emerald-500 text-white p-2.5 rounded-2xl border-2 border-emerald-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-100 block">Saldo Real Sacável:</span>
            <span className="font-cartoon text-xl leading-none">R$ {realBalance.toFixed(2)}</span>
          </div>
          <Coins className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="bg-amber-400 text-amber-950 p-2.5 rounded-2xl border-2 border-amber-500 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-900 block flex items-center gap-1">
              Bônus Conta: <Gift className="w-3 h-3" />
            </span>
            <span className="font-cartoon text-xl leading-none">R$ {bonusBalance.toFixed(2)}</span>
          </div>
          <span className="text-[9px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.5 rounded-md border border-amber-400">
            Apenas Jogo
          </span>
        </div>
      </div>

      {/* BANNER DE METAS E BÔNUS (DEPÓSITO MIN 20 + R$120 BÔNUS / CONVIDE AMIGO + R$20) */}
      <div className="w-full max-w-xl mb-2 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 text-white p-2.5 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-yellow-200 shrink-0 animate-bounce" />
          <span className="text-[11px] leading-tight">
            Deposite mín R$ 20 e ganhe <strong>+R$ 120 de Bônus</strong>! Convide amigos e ganhe <strong>+R$ 20</strong>!
          </span>
        </div>
        <div className="flex gap-1 shrink-0 ml-1">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="btn-pop bg-white text-rose-600 px-2 py-1 rounded-xl text-[10px] font-black border border-rose-300 flex items-center gap-1 shadow-sm"
          >
            <Share2 className="w-3 h-3" /> +R$ 20
          </button>
          <button 
            onClick={() => setShowGoalsModal(true)}
            className="btn-pop bg-yellow-300 text-amber-950 px-2 py-1 rounded-xl text-[10px] font-black border border-yellow-400 flex items-center gap-1 shadow-sm"
          >
            <Target className="w-3 h-3" /> Metas
          </button>
        </div>
      </div>

      {/* HISTÓRICO DE MULTIPLICADORES */}
      <div className="w-full max-w-xl mb-2 flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-black text-sky-800 uppercase flex items-center gap-1 px-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-400" /> Histórico:
          </span>
          {history.map((h, i) => (
            <span 
              key={i} 
              className={`text-xs font-black px-2.5 py-0.5 rounded-xl border-2 shrink-0 ${
                h.mult >= 2.0
                  ? 'bg-amber-300 text-amber-950 border-amber-400 shadow-sm'
                  : h.crashed 
                    ? 'bg-rose-200 text-rose-800 border-rose-300'
                    : 'bg-emerald-200 text-emerald-900 border-emerald-300'
              }`}
            >
              {h.mult.toFixed(2)}x
            </span>
          ))}
        </div>

        <div className="text-[10px] bg-white/80 text-slate-600 font-bold px-2 py-0.5 rounded-lg border border-slate-300 shrink-0 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-emerald-600" /> SHA-256
        </div>
      </div>

      {/* PAINEL ADMIN GGR */}
      {showAdmin && (
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border-4 border-purple-300 mb-2.5 text-xs space-y-2.5 shadow-pop-indigo">
          <div className="flex justify-between items-center pb-1 border-b border-purple-100">
            <span className="font-black text-purple-700 uppercase tracking-wider flex items-center gap-1 text-sm">
              <ShieldAlert className="w-4 h-4 text-purple-600" /> Painel da Banca (GGR) 🏰
            </span>
            <span className="text-[10px] text-purple-500 font-bold">Chave Pix: {OWNER_PIX_KEY}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-purple-50 p-2 rounded-2xl border border-purple-200">
              <span className="text-[10px] text-purple-600 font-bold block">Apostas Totais</span>
              <span className="font-extrabold text-purple-900">R$ {houseStats.totalBets.toFixed(2)}</span>
            </div>
            <div className="bg-purple-50 p-2 rounded-2xl border border-purple-200">
              <span className="text-[10px] text-purple-600 font-bold block">Total Pago</span>
              <span className="font-extrabold text-purple-900">R$ {houseStats.totalPaid.toFixed(2)}</span>
            </div>
            <div className="bg-purple-50 p-2 rounded-2xl border border-purple-200">
              <span className="text-[10px] text-purple-600 font-bold block">Lucro da Casa (GGR)</span>
              <span className={`font-black ${ggr >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {ggr.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-bold text-purple-800">Rigor da Casa:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'EASY', label: 'Suave (60%)' },
                { id: 'NORMAL', label: 'Padrão (86%)' },
                { id: 'HARD', label: 'Triturador (94%)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setHouseRigor(opt.id)}
                  className={`btn-pop py-1 px-2.5 rounded-xl text-[10px] font-black border-2 transition ${
                    houseRigor === opt.id 
                      ? 'bg-purple-500 text-white border-purple-600' 
                      : 'bg-purple-100 text-purple-700 border-purple-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ARENA DO JOGO / CANVAS */}
      <div 
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        className="relative w-full max-w-xl h-[280px] sm:h-[300px] rounded-3xl overflow-hidden border-4 border-amber-400 shadow-cartoon-lg cursor-pointer select-none bg-sky-200"
      >
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {/* FASE 1: CONTAGEM REGRESSIVA */}
        {roundPhase === 'WAITING' && (
          <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white/95 border-4 border-amber-400 px-6 py-4 rounded-3xl shadow-pop-amber flex flex-col items-center gap-1.5 animate-in zoom-in-95">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-4 h-4 animate-spin text-amber-600" /> Próxima Decolagem:
              </span>
              <span className="font-cartoon text-5xl text-rose-500 drop-shadow-sm">
                {countdown.toFixed(1)}s
              </span>
              <div className="w-40 bg-amber-100 h-2.5 rounded-full overflow-hidden border border-amber-300 mt-1">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${(countdown / 5.0) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-1">
                Aposte para decolar com o Red Bird! 🎈
              </p>
            </div>
          </div>
        )}

        {/* FASE 2: VOO DO RED BIRD */}
        {roundPhase === 'FLYING' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-300 border-4 border-amber-500 px-6 py-1.5 rounded-3xl shadow-pop-amber flex items-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-700 animate-spin" />
            <span className="font-cartoon text-3xl sm:text-4xl text-amber-950 drop-shadow-sm">
              {roundMultiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* DICA DE PULO */}
        {roundPhase === 'FLYING' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-amber-300 shadow-md pointer-events-none flex items-center gap-1.5">
            <span className="text-[11px] text-amber-900 font-black">
              Toque ou <kbd className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded border border-amber-400">Espaço</kbd> para bater asas! 🪽
            </span>
          </div>
        )}

        {/* FASE 3: CRASHED */}
        {roundPhase === 'CRASHED' && (
          <div className="absolute inset-0 bg-rose-500/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-1 animate-bounce">💥🙈💫</div>
            <h2 className="text-3xl font-cartoon text-white mb-1 drop-shadow-md">RED BIRD CRACHOU!</h2>
            <p className="text-yellow-200 text-sm font-black mb-3">
              Multiplicador Final: <span className="text-white text-lg bg-black/20 px-2 py-0.5 rounded-xl">{roundMultiplier.toFixed(2)}x</span>
            </p>
            <span className="bg-yellow-300 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full border-2 border-yellow-400 shadow-md animate-pulse">
              Preparando a próxima rodada...
            </span>
          </div>
        )}
      </div>

      {/* DUPLO PAINEL DE APOSTAS */}
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
        
        {/* PAINEL 1 */}
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border-4 border-sky-300 shadow-cartoon flex flex-col justify-between space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-sky-800 uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-500" /> Aposta 1
            </span>
            <label className="text-[11px] font-bold text-sky-700 flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={autoBet1}
                onChange={(e) => setAutoBet1(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
              /> Auto Aposta
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-600 font-black text-xs">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                value={bet1}
                onChange={(e) => setBet1(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-sky-50 border-2 border-sky-300 rounded-2xl pl-8 pr-2 py-2 font-black text-sky-900 text-sm focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>
            <div className="flex gap-1">
              <button
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet1(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="btn-pop bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 px-2 py-2 rounded-xl text-xs font-black disabled:opacity-50 text-sky-800"
              >½</button>
              <button
                disabled={bet1Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet1(prev => parseFloat((prev * 2).toFixed(2)))}
                className="btn-pop bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 px-2 py-2 rounded-xl text-xs font-black disabled:opacity-50 text-sky-800"
              >2x</button>
            </div>
          </div>

          <div className="bg-sky-50 p-1.5 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
            <label className="text-[11px] font-bold text-sky-800 flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={enableAutoCashout1}
                onChange={(e) => setEnableAutoCashout1(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500 cursor-pointer"
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
                className="w-14 bg-white border border-sky-300 rounded-lg px-1.5 py-0.5 text-center font-black text-sky-900 text-xs disabled:opacity-40"
              />
              <span className="font-black text-sky-700 text-xs">x</span>
            </div>
          </div>

          {roundPhase === 'FLYING' && bet1Placed && !bet1CashedOut ? (
            <button
              onClick={cashOut1}
              className="w-full btn-pop bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-cartoon text-lg py-3 rounded-2xl border-4 border-amber-600 shadow-pop-amber flex items-center justify-center gap-1.5 uppercase animate-pulse"
            >
              <Award className="w-5 h-5" /> SACAR R$ {(bet1 * roundMultiplier).toFixed(2)}
            </button>
          ) : bet1CashedOut ? (
            <div className="w-full bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-center py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ganhou R$ {bet1Win.toFixed(2)}!
            </div>
          ) : bet1Placed ? (
            <button
              onClick={() => {
                setBet1Placed(false);
                setRealBalance(prev => prev + bet1);
              }}
              className="w-full btn-pop bg-rose-400 hover:bg-rose-300 text-white font-black py-2.5 rounded-2xl border-2 border-rose-500 text-xs"
            >
              Cancelar (R$ {bet1.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={placeBet1}
              className="w-full btn-pop bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-emerald-950 font-cartoon text-base py-3 rounded-2xl border-4 border-emerald-600 shadow-pop-emerald flex items-center justify-center gap-1 uppercase"
            >
              <Play className="w-4 h-4 fill-current" /> APOSTAR R$ {bet1.toFixed(2)}
            </button>
          )}
        </div>

        {/* PAINEL 2 */}
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border-4 border-amber-300 shadow-cartoon flex flex-col justify-between space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Aposta 2
            </span>
            <label className="text-[11px] font-bold text-amber-700 flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={autoBet2}
                onChange={(e) => setAutoBet2(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-amber-600 cursor-pointer"
              /> Auto Aposta
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-black text-xs">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                value={bet2}
                onChange={(e) => setBet2(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl pl-8 pr-2 py-2 font-black text-amber-900 text-sm focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
            </div>
            <div className="flex gap-1">
              <button
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet2(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="btn-pop bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 px-2 py-2 rounded-xl text-xs font-black disabled:opacity-50 text-amber-800"
              >½</button>
              <button
                disabled={bet2Placed && roundPhase !== 'WAITING'}
                onClick={() => setBet2(prev => parseFloat((prev * 2).toFixed(2)))}
                className="btn-pop bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 px-2 py-2 rounded-xl text-xs font-black disabled:opacity-50 text-amber-800"
              >2x</button>
            </div>
          </div>

          <div className="bg-amber-50 p-1.5 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
            <label className="text-[11px] font-bold text-amber-800 flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox"
                checked={enableAutoCashout2}
                onChange={(e) => setEnableAutoCashout2(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500 cursor-pointer"
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
                className="w-14 bg-white border border-amber-300 rounded-lg px-1.5 py-0.5 text-center font-black text-amber-900 text-xs disabled:opacity-40"
              />
              <span className="font-black text-amber-700 text-xs">x</span>
            </div>
          </div>

          {roundPhase === 'FLYING' && bet2Placed && !bet2CashedOut ? (
            <button
              onClick={cashOut2}
              className="w-full btn-pop bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-cartoon text-lg py-3 rounded-2xl border-4 border-amber-600 shadow-pop-amber flex items-center justify-center gap-1.5 uppercase animate-pulse"
            >
              <Award className="w-5 h-5" /> SACAR R$ {(bet2 * roundMultiplier).toFixed(2)}
            </button>
          ) : bet2CashedOut ? (
            <div className="w-full bg-emerald-100 border-2 border-emerald-400 text-emerald-900 font-black text-center py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ganhou R$ {bet2Win.toFixed(2)}!
            </div>
          ) : bet2Placed ? (
            <button
              onClick={() => {
                setBet2Placed(false);
                setRealBalance(prev => prev + bet2);
              }}
              className="w-full btn-pop bg-rose-400 hover:bg-rose-300 text-white font-black py-2.5 rounded-2xl border-2 border-rose-500 text-xs"
            >
              Cancelar (R$ {bet2.toFixed(2)})
            </button>
          ) : (
            <button
              onClick={placeBet2}
              className="w-full btn-pop bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-emerald-950 font-cartoon text-base py-3 rounded-2xl border-4 border-emerald-600 shadow-pop-emerald flex items-center justify-center gap-1 uppercase"
            >
              <Play className="w-4 h-4 fill-current" /> APOSTAR R$ {bet2.toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {/* ABAS SOCIAIS */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-sm p-3.5 rounded-3xl border-4 border-emerald-300 shadow-cartoon mt-2.5">
        <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2 mb-2.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'live', label: 'Apostas ao Vivo 👥' },
            { id: 'chat', label: 'Chat da Galera 💬' },
            { id: 'history', label: 'Minhas Apostas 📜' },
            { id: 'top', label: 'Maiores Ganhos 🏆' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-pop px-3 py-1.5 rounded-2xl text-xs font-black transition border-2 shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'live' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {livePlayers.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center bg-emerald-50/70 px-3 py-1.5 rounded-2xl text-xs border border-emerald-200">
                <span className="font-bold text-emerald-950">{p.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-500">R$ {p.bet.toFixed(2)}</span>
                  {p.cashedOut ? (
                    <span className="font-black text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-xl border border-emerald-300 text-[11px]">
                      +{p.mult.toFixed(2)}x (R$ {p.win.toFixed(2)})
                    </span>
                  ) : roundPhase === 'FLYING' ? (
                    <span className="text-amber-700 font-bold text-[11px] animate-pulse">Voando... 🪽</span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Apostou</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-2">
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="bg-sky-50 px-3 py-1.5 rounded-2xl text-xs border border-sky-200 flex justify-between items-center">
                  <div>
                    <span className="font-black text-sky-800 mr-1.5">{msg.user}:</span>
                    <span className="text-slate-700 font-medium">{msg.msg}</span>
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
                className="flex-1 bg-sky-50 border-2 border-sky-200 rounded-2xl px-3 py-1.5 text-xs font-bold text-sky-900 focus:outline-none focus:border-sky-400"
              />
              <button 
                type="submit"
                className="btn-pop bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-2xl font-black text-xs border border-sky-600 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {myBetsHistory.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4 font-bold">
                Você ainda não fez apostas recentes.
              </p>
            ) : (
              myBetsHistory.map(b => (
                <div key={b.id} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-2xl text-xs border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${b.status === 'WIN' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className="font-bold text-slate-700">{b.panel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500">R$ {b.bet.toFixed(2)}</span>
                    <span className="font-black text-amber-700">{b.mult.toFixed(2)}x</span>
                    <span className={`font-black ${b.status === 'WIN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {b.profit >= 0 ? `+R$ ${b.profit.toFixed(2)}` : `-R$ ${Math.abs(b.profit).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'top' && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {[
              { rank: '🥇 1º', name: 'SuperDino_99', mult: 28.5, win: 2850.00 },
              { rank: '🥈 2º', name: 'Joaninha_Rainha', mult: 16.4, win: 1640.00 },
              { rank: '🥉 3º', name: 'RedBird_Master', mult: 12.0, win: 1200.00 },
            ].map((t, idx) => (
              <div key={idx} className="flex justify-between items-center bg-amber-50/60 px-3 py-1.5 rounded-2xl text-xs border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-900">{t.rank}</span>
                  <span className="font-bold text-slate-800">{t.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded-lg text-[11px]">{t.mult.toFixed(1)}x</span>
                  <span className="font-black text-emerald-600">R$ {t.win.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL 1: CADASTRO INICIAL OBRIGATÓRIO --- */}
      {!userProfile && (
        <div className="fixed inset-0 bg-sky-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-400 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-cartoon-lg space-y-4 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                <span className="text-3xl">🐤</span>
              </div>
              <h2 className="text-2xl font-cartoon text-rose-500">RED BIRD GET MONEY!</h2>
              <p className="text-xs text-slate-600 font-bold">
                Cadastre seus dados para receber seus depósitos e sacar seus lucros via Pix!
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {registerError && (
                <div className="bg-rose-100 text-rose-800 border-2 border-rose-300 p-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{registerError}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-black text-slate-700 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-sky-600" /> Nome Completo:
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: João Vitor da Silva"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-sky-300 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-700 flex items-center gap-1 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Celular / WhatsApp:
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="Ex: (99) 98528-0205"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-sky-300 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-black text-slate-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-600" /> Sua Chave Pix de Recebimento:
                  </label>
                  <select 
                    value={registerPixType}
                    onChange={(e) => setRegisterPixType(e.target.value)}
                    className="text-[10px] bg-slate-100 border border-slate-300 rounded-lg px-1.5 py-0.5 font-bold text-slate-700"
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
                  placeholder="Informe sua chave Pix para receber seus saques"
                  value={registerPixKey}
                  onChange={(e) => setRegisterPixKey(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-sky-300 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-bold flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bônus de Cadastro: <strong>R$ 10,00</strong> em conta para começar a se divertir!</span>
              </div>

              <button
                type="submit"
                className="w-full btn-pop bg-emerald-500 hover:bg-emerald-400 text-white font-cartoon text-lg py-3.5 rounded-2xl border-4 border-emerald-700 shadow-pop-emerald uppercase tracking-wider"
              >
                Cadastrar e Decolar 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: METAS E CRITÉRIOS DE SAQUE --- */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-sky-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-400 w-full max-w-md rounded-3xl p-5 shadow-cartoon-lg space-y-3.5 animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-amber-600 flex items-center gap-1.5">
                <Target className="w-5 h-5" /> Metas de Saque & Bônus
              </h3>
              <button 
                onClick={() => setShowGoalsModal(false)}
                className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full border border-slate-300 font-black flex items-center justify-center"
              >✕</button>
            </div>

            <p className="text-slate-600 font-bold leading-relaxed">
              Para garantir a segurança da plataforma e manter os bônus ativos, complete os critérios abaixo:
            </p>

            <div className="space-y-2">
              {/* Meta 1: Depósito Mínimo de R$ 20 */}
              <div className={`p-3 rounded-2xl border-2 transition ${hasDeposited && totalDeposited >= 20 ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm flex items-center gap-1.5">
                    {hasDeposited && totalDeposited >= 20 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                    1. Fazer 1 Depósito Mínimo de R$ 20
                  </span>
                  <span className="font-black text-[10px] bg-white px-2 py-0.5 rounded-lg border">
                    {hasDeposited ? `R$ ${totalDeposited.toFixed(2)} / R$ 20,00` : 'Pendente'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">
                  🎁 Ao depositar R$ 20 ou mais, você ganha <strong>+R$ 120,00 de BÔNUS</strong> automático na sua conta!
                </p>
              </div>

              {/* Meta 2: Convidar Amigos */}
              <div className="p-3 rounded-2xl border-2 bg-amber-50 border-amber-300 text-amber-950">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                    2. Convide Amigos (+R$ 20 Bônus)
                  </span>
                  <span className="font-black text-[10px] bg-white px-2 py-0.5 rounded-lg border border-amber-300">
                    {friendsInvited} convidados
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1 font-medium">
                  Ganhe <strong>R$ 20,00 de bônus</strong> por cada amigo cadastrado com seu link!
                </p>
              </div>

              {/* Regra do Saldo Bônus */}
              <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200 text-rose-900 text-[11px] font-bold">
                ⚠️ <strong>Atenção:</strong> O saldo de bônus <u>não pode ser sacado diretamente</u>. Ele deve ser utilizado para jogar e apostar. Todo o lucro gerado pelas apostas cai diretamente no seu <strong>Saldo Real</strong> e pode ser sacado para seu Pix!
              </div>
            </div>

            <button
              onClick={() => {
                setShowGoalsModal(false);
                setShowDepositModal(true);
              }}
              className="w-full btn-pop bg-emerald-500 hover:bg-emerald-400 text-white font-cartoon text-sm py-3 rounded-2xl border-4 border-emerald-700 shadow-pop-emerald uppercase"
            >
              Fazer Depósito de R$ 20 & Ganhar R$ 120 Bônus 🚀
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CONVIDAR AMIGOS (+R$ 20 BÔNUS) --- */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-sky-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rose-400 w-full max-w-sm rounded-3xl p-5 shadow-cartoon-lg space-y-3.5 animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-rose-600 flex items-center gap-1.5">
                <Share2 className="w-5 h-5" /> Convide e Ganhe R$ 20
              </h3>
              <button 
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteCopied(false);
                }}
                className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full border border-slate-300 font-black flex items-center justify-center"
              >✕</button>
            </div>

            <p className="text-slate-600 font-bold">
              Compartilhe seu link exclusivo com amigos. Assim que eles entrarem, você ganha <strong>+R$ 20,00 de bônus</strong> para jogar!
            </p>

            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 space-y-1.5">
              <span className="text-[10px] font-black text-rose-800 uppercase block">Seu Link de Convite:</span>
              <div className="flex items-center gap-1">
                <input 
                  readOnly 
                  value="https://redbirdgetmoney.loca.lt/?ref=99985280205"
                  className="w-full bg-white px-2 py-1.5 rounded-xl border text-[10px] font-mono font-bold text-slate-700 truncate"
                />
                <button 
                  onClick={handleSimulateInviteFriend}
                  className="btn-pop bg-rose-500 hover:bg-rose-400 text-white p-2 rounded-xl border border-rose-600 shrink-0"
                  title="Copiar Link e Simular Bônus"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {inviteCopied && (
                <span className="text-[11px] text-emerald-600 font-black block text-center animate-bounce">
                  🎉 Link copiado e +R$ 20 de Bônus creditados!
                </span>
              )}
            </div>

            <button
              onClick={handleSimulateInviteFriend}
              className="w-full btn-pop bg-rose-500 hover:bg-rose-400 text-white font-cartoon text-sm py-3 rounded-2xl border-4 border-rose-700 shadow-pop-rose uppercase"
            >
              Simular Novo Amigo Cadastrado (+R$ 20) 🎁
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 4: DEPÓSITO PIX COM A CHAVE DO DONO (99 985280205) --- */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-emerald-400 w-full max-w-sm rounded-3xl p-5 shadow-cartoon-lg space-y-3 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-emerald-600 flex items-center gap-2">
                <ArrowDownToLine className="w-6 h-6 text-emerald-500" /> Depositar via Pix
              </h3>
              <button 
                onClick={() => {
                  setShowDepositModal(false);
                  setPixSimulateSuccess(false);
                }}
                className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full border border-slate-300 font-black flex items-center justify-center"
              >✕</button>
            </div>

            <div className="bg-amber-50 p-2 rounded-2xl border border-amber-300 text-[11px] text-amber-950 font-black flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Deposite <strong>R$ 20 ou mais</strong> e ganhe <strong>+R$ 120,00 de Bônus</strong> na hora!</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[20, 30, 50, 100, 200, 500].map(val => (
                <button
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className={`btn-pop py-2 rounded-2xl font-black text-xs border-2 transition ${
                    depositAmount === val 
                      ? 'bg-emerald-500 text-white border-emerald-600' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  R$ {val}
                </button>
              ))}
            </div>

            {/* Chave Pix do Dono da Banca */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-[10px] text-slate-600 font-black uppercase block">Chave Pix Oficial da Banca:</span>
              <div className="bg-emerald-100 text-emerald-950 font-mono font-black text-base py-1.5 px-3 rounded-xl border-2 border-emerald-400 flex items-center justify-center gap-2">
                <span>{OWNER_PIX_KEY}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard?.writeText(OWNER_PIX_KEY);
                    setPixCopied(true);
                    setTimeout(() => setPixCopied(false), 2000);
                  }}
                  className="btn-pop bg-white p-1 rounded-lg border border-emerald-300 text-emerald-800"
                  title="Copiar Chave Pix"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-bold">Tipo: Telefone • Destinatário: Dono da Banca</p>
            </div>

            {pixSimulateSuccess && (
              <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2 rounded-2xl text-xs font-black text-center animate-bounce">
                ✅ Depósito de R$ {depositAmount.toFixed(2)} aprovado + R$ 120,00 de Bônus creditados!
              </div>
            )}

            <button
              onClick={handleApproveDeposit}
              className="w-full btn-pop bg-emerald-500 hover:bg-emerald-400 text-white font-cartoon text-base py-3 rounded-2xl border-4 border-emerald-700 shadow-pop-emerald uppercase tracking-wider"
            >
              Confirmar Pagamento R$ {depositAmount.toFixed(2)} 🚀
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 5: SAQUE COM CRITÉRIOS DE META --- */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-sky-400 w-full max-w-sm rounded-3xl p-5 shadow-cartoon-lg space-y-3 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-sky-600 flex items-center gap-2">
                <ArrowUpFromLine className="w-6 h-6 text-sky-500" /> Sacar Lucros via Pix
              </h3>
              <button 
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawError('');
                  setWithdrawSuccessAlert(false);
                }}
                className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full border border-slate-300 font-black flex items-center justify-center"
              >✕</button>
            </div>

            {/* Status da Meta */}
            <div className={`p-2.5 rounded-2xl border-2 text-xs ${hasDeposited && totalDeposited >= 20 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
              <div className="flex items-center justify-between font-black">
                <span>Meta de Depósito (mín R$ 20):</span>
                <span>{hasDeposited && totalDeposited >= 20 ? '✅ Desbloqueado' : '🔒 Bloqueado'}</span>
              </div>
              <p className="text-[10px] mt-0.5">
                {hasDeposited && totalDeposited >= 20 ? 'Você atingiu o critério de depósito para sacar!' : 'Faça pelo menos 1 depósito de R$ 20 para liberar seus saques.'}
              </p>
            </div>

            <div className="bg-sky-50 p-2.5 rounded-2xl border border-sky-200 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">Saldo Real Sacável:</span>
                <span className="font-cartoon text-sm text-emerald-600">R$ {realBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px] font-bold">Saldo Bônus (Não Sacável):</span>
                <span className="font-cartoon text-xs text-amber-700">R$ {bonusBalance.toFixed(2)}</span>
              </div>
              <div className="pt-1 border-t border-sky-200">
                <span className="text-[10px] text-slate-500 font-bold block">Chave Pix Cadastrada:</span>
                <span className="font-mono font-bold text-sky-950 block truncate">{userProfile?.pixKey || OWNER_PIX_KEY}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-700 block mb-1">Valor do Saque (R$):</label>
              <input 
                type="number"
                min="5"
                max={realBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-50 border-2 border-sky-300 rounded-2xl px-3 py-2 text-sm font-black text-emerald-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            {withdrawError && (
              <div className="bg-rose-100 text-rose-800 border-2 border-rose-300 p-2 rounded-2xl text-[11px] font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{withdrawError}</span>
              </div>
            )}

            {withdrawSuccessAlert && (
              <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2 rounded-2xl text-xs font-black text-center animate-bounce">
                🎉 Saque de R$ {withdrawAmount.toFixed(2)} enviado para sua chave Pix com sucesso!
              </div>
            )}

            <button
              onClick={handleRequestWithdraw}
              className="w-full btn-pop bg-sky-500 hover:bg-sky-400 text-white font-cartoon text-base py-3 rounded-2xl border-4 border-sky-700 shadow-pop-sky uppercase tracking-wider"
            >
              Transferir para meu Pix R$ {withdrawAmount.toFixed(2)} 💸
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 6: PERFIL DO USUÁRIO --- */}
      {showProfileModal && userProfile && (
        <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-emerald-400 w-full max-w-sm rounded-3xl p-5 shadow-cartoon-lg space-y-3.5 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-emerald-600 flex items-center gap-2">
                <User className="w-5 h-5" /> Meu Perfil
              </h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="btn-pop bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full border border-slate-300 font-black flex items-center justify-center"
              >✕</button>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block">Nome Completo:</span>
                <span className="font-black text-slate-800 text-sm">{userProfile.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block">Celular Cadastrado:</span>
                <span className="font-black text-slate-800">{userProfile.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block">Chave Pix de Saque ({userProfile.pixType}):</span>
                <span className="font-mono font-black text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200 block truncate">
                  {userProfile.pixKey}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full btn-pop bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black py-2.5 rounded-2xl border border-rose-300 flex items-center justify-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Alterar Dados / Trocar Conta
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-3 text-[11px] text-sky-950 font-bold text-center">
        RED BIRD GET MONEY 🐤 • Chave Pix Oficial da Banca: <strong className="font-mono">{OWNER_PIX_KEY}</strong> • <kbd className="bg-white px-1.5 py-0.5 rounded border border-sky-300 text-sky-900">Espaço</kbd> Pular • <kbd className="bg-white px-1.5 py-0.5 rounded border border-sky-300 text-sky-900">Z</kbd> Sacar 1 • <kbd className="bg-white px-1.5 py-0.5 rounded border border-sky-300 text-sky-900">X</kbd> Sacar 2
      </footer>
    </div>
  );
}
