import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Award, 
  Settings, 
  DollarSign, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  PlusCircle, 
  Zap,
  Sparkles
} from 'lucide-react';

// --- SISTEMA DE ÁUDIO SINTETIZADO (Web Audio API) ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
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

  playFlap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCashout() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Maior alegre

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    });
  }

  playCrash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playBetStart() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }
}

const sfx = new SoundEffects();

export default function App() {
  // Saldo persistido localmente ou padrão R$ 1000
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('redbird_balance');
    return saved ? parseFloat(saved) : 1000.00;
  });

  const [bet, setBet] = useState(10.00);
  const [autoCashout, setAutoCashout] = useState(2.00);
  const [enableAutoCashout, setEnableAutoCashout] = useState(false);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, FLYING, CRASHED, CASHOUT
  const [multiplier, setMultiplier] = useState(1.00);
  const [winAmount, setWinAmount] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Histórico de Multiplicadores Recentes (estilo Aviator)
  const [history, setHistory] = useState([
    { mult: 1.15, crashed: true },
    { mult: 2.45, crashed: false },
    { mult: 1.08, crashed: true },
    { mult: 4.20, crashed: false },
    { mult: 1.25, crashed: true },
    { mult: 12.8, crashed: false },
  ]);

  // Jogadores simulados ao vivo na rodada
  const [livePlayers, setLivePlayers] = useState([
    { name: 'Lucas_SP', bet: 25, cashedOut: false, win: 0, mult: 0 },
    { name: 'GamerBR99', bet: 50, cashedOut: false, win: 0, mult: 0 },
    { name: 'Beatriz_R', bet: 10, cashedOut: false, win: 0, mult: 0 },
    { name: 'FelipeM', bet: 100, cashedOut: false, win: 0, mult: 0 },
    { name: 'Carol_Win', bet: 20, cashedOut: false, win: 0, mult: 0 },
  ]);

  // Regra de Retenção da Casa
  const [houseRigor, setHouseRigor] = useState('NORMAL'); // 'EASY' (70% crash), 'NORMAL' (90% crash), 'HARD' (95% crash)
  const [targetMaxMultiplier, setTargetMaxMultiplier] = useState(1.00);
  const [forceCrash, setForceCrash] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [houseStats, setHouseStats] = useState(() => {
    const saved = localStorage.getItem('redbird_housestats');
    return saved ? JSON.parse(saved) : { totalBets: 0, totalPaid: 0 };
  });

  const canvasRef = useRef(null);
  const reqIdRef = useRef(null);

  // Física do Jogo
  const birdRef = useRef({ y: 150, vy: 0, wingAngle: 0 });
  const pipesRef = useRef([]);
  const multRef = useRef(1.00);
  const cloudsRef = useRef([
    { x: 50, y: 35, scale: 0.8 },
    { x: 190, y: 75, scale: 1.2 },
    { x: 330, y: 40, scale: 0.9 },
    { x: 440, y: 85, scale: 1.0 }
  ]);
  const particlesRef = useRef([]);

  // Salvar saldo
  useEffect(() => {
    localStorage.setItem('redbird_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('redbird_housestats', JSON.stringify(houseStats));
  }, [houseStats]);

  // Controle de som mudo
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sfx.muted = next;
  };

  // Sorteio de Retenção da Casa
  const startRound = () => {
    if (balance < bet || bet <= 0) {
      setShowDepositModal(true);
      return;
    }

    sfx.playBetStart();
    setBalance(prev => prev - bet);
    setHouseStats(prev => ({ ...prev, totalBets: prev.totalBets + bet }));

    const rand = Math.random();
    let maxMult = 1.00;
    let willForce = true;

    // Ajuste de retenção com base no modo
    const threshold1 = houseRigor === 'EASY' ? 0.65 : houseRigor === 'HARD' ? 0.95 : 0.88;
    const threshold2 = houseRigor === 'EASY' ? 0.88 : houseRigor === 'HARD' ? 0.98 : 0.95;

    if (rand < threshold1) {
      maxMult = parseFloat((Math.random() * 0.28 + 1.02).toFixed(2));
      willForce = true;
    } else if (rand < threshold2) {
      maxMult = parseFloat((Math.random() * 0.90 + 1.30).toFixed(2));
      willForce = true;
    } else {
      maxMult = parseFloat((Math.random() * 12.00 + 2.20).toFixed(2));
      willForce = false;
    }

    setTargetMaxMultiplier(maxMult);
    setForceCrash(willForce);

    // Reset de bots simulados
    setLivePlayers([
      { name: 'Lucas_SP', bet: Math.floor(Math.random() * 30 + 10), cashedOut: false, win: 0, target: 1.15 + Math.random() * 0.6 },
      { name: 'GamerBR99', bet: Math.floor(Math.random() * 50 + 20), cashedOut: false, win: 0, target: 1.25 + Math.random() * 1.5 },
      { name: 'Beatriz_R', bet: 10, cashedOut: false, win: 0, target: 1.10 + Math.random() * 0.4 },
      { name: 'FelipeM', bet: Math.floor(Math.random() * 100 + 30), cashedOut: false, win: 0, target: 1.40 + Math.random() * 2.0 },
      { name: 'Carol_Win', bet: Math.floor(Math.random() * 40 + 15), cashedOut: false, win: 0, target: 1.30 + Math.random() * 0.8 },
    ]);

    // Reset da física
    birdRef.current = { y: 150, vy: -2, wingAngle: 0 };
    pipesRef.current = [
      { x: 320, top: 80, bottom: 110 },
      { x: 500, top: 120, bottom: 80 }
    ];
    particlesRef.current = [];
    multRef.current = 1.00;
    setMultiplier(1.00);
    setGameState('FLYING');
  };

  const jump = () => {
    if (gameState === 'FLYING') {
      birdRef.current.vy = -5.5;
      sfx.playFlap();

      // Gerar partículas suaves de penas/vento
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: 70 - 10,
          y: birdRef.current.y + (Math.random() * 10 - 5),
          vx: -(Math.random() * 2 + 1),
          vy: Math.random() * 2 - 1,
          size: Math.random() * 3 + 2,
          alpha: 0.8,
          color: '#ffffff'
        });
      }
    }
  };

  const cashOut = () => {
    if (gameState !== 'FLYING') return;
    const finalMult = multRef.current;
    const win = bet * finalMult;
    setWinAmount(win);
    setBalance(prev => prev + win);
    setHouseStats(prev => ({ ...prev, totalPaid: prev.totalPaid + win }));
    sfx.playCashout();

    // Adiciona ao histórico
    setHistory(prev => [{ mult: parseFloat(finalMult.toFixed(2)), crashed: false }, ...prev.slice(0, 9)]);

    setGameState('CASHOUT');
  };

  // Suporte a Teclado (Espaço para pular / Enter para ação)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'FLYING') {
          jump();
        } else if (gameState === 'IDLE') {
          startRound();
        }
      } else if (e.code === 'Enter') {
        if (gameState === 'FLYING') {
          cashOut();
        } else if (gameState === 'CRASHED' || gameState === 'CASHOUT') {
          setGameState('IDLE');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, bet, balance]);

  // Loop de Animação e Renderização Canvas
  useEffect(() => {
    if (gameState !== 'FLYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      // Atualiza multiplicador progressivamente
      multRef.current += 0.008;
      const currentMult = multRef.current;
      setMultiplier(currentMult);

      // Checa Auto Cash Out configurado
      if (enableAutoCashout && currentMult >= autoCashout) {
        cashOut();
        return;
      }

      // Atualiza simulação de bots sacando
      setLivePlayers(prev => prev.map(p => {
        if (!p.cashedOut && currentMult >= p.target) {
          return { ...p, cashedOut: true, win: p.bet * currentMult, mult: currentMult };
        }
        return p;
      }));

      // Verificação de Crash Programado pela Casa
      if (currentMult >= targetMaxMultiplier && forceCrash) {
        birdRef.current.vy += 2.5; // Força queda abrupta no cano
      }

      // Física do Pássaro
      birdRef.current.vy += 0.38;
      birdRef.current.y += birdRef.current.vy;
      birdRef.current.wingAngle += 0.35;

      // Nuvens no fundo
      cloudsRef.current.forEach(c => {
        c.x -= 0.6;
        if (c.x < -70) c.x = 440;
      });

      // Movimento dos Tubos
      pipesRef.current.forEach(p => { p.x -= 2.7; });

      if (pipesRef.current.length && pipesRef.current[0].x < -60) {
        pipesRef.current.shift();
        const lastX = pipesRef.current[pipesRef.current.length - 1]?.x || 300;
        const topH = Math.floor(Math.random() * 100) + 45;
        pipesRef.current.push({ x: lastX + 180, top: topH, bottom: 260 - topH - 95 });
      }

      // Colisão
      const birdY = birdRef.current.y;
      const birdX = 70;
      const r = 18;
      let hit = false;

      // Colisão com teto e chão
      if (birdY - r <= 0 || birdY + r >= 300) hit = true;

      // Colisão com canos
      pipesRef.current.forEach(p => {
        if (birdX + r > p.x && birdX - r < p.x + 48) {
          if (birdY - r < p.top || birdY + r > 300 - p.bottom) {
            hit = true;
          }
        }
      });

      // Atualiza partículas
      particlesRef.current.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.03;
      });
      particlesRef.current = particlesRef.current.filter(pt => pt.alpha > 0);

      // --- DESENHO NO CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Céu com Gradiente Vivo
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.6, '#38bdf8');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sol no canto
      ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.beginPath();
      ctx.arc(360, 40, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(360, 40, 24, 0, Math.PI * 2);
      ctx.fill();

      // Nuvens
      cloudsRef.current.forEach(c => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 15 * c.scale, c.y - 8 * c.scale, 20 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 32 * c.scale, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Desenho dos Tubos Cartoon
      pipesRef.current.forEach(p => {
        // Tubo Superior
        const gradTop = ctx.createLinearGradient(p.x, 0, p.x + 48, 0);
        gradTop.addColorStop(0, '#15803d');
        gradTop.addColorStop(0.3, '#22c55e');
        gradTop.addColorStop(1, '#166534');
        ctx.fillStyle = gradTop;
        ctx.fillRect(p.x, 0, 48, p.top);
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, 0, 48, p.top);

        // Borda do topo
        ctx.fillRect(p.x - 4, p.top - 18, 56, 18);
        ctx.strokeRect(p.x - 4, p.top - 18, 56, 18);

        // Tubo Inferior
        const gradBot = ctx.createLinearGradient(p.x, 0, p.x + 48, 0);
        gradBot.addColorStop(0, '#15803d');
        gradBot.addColorStop(0.3, '#22c55e');
        gradBot.addColorStop(1, '#166534');
        ctx.fillStyle = gradBot;
        ctx.fillRect(p.x, 300 - p.bottom, 48, p.bottom);
        ctx.strokeRect(p.x, 300 - p.bottom, 48, p.bottom);

        // Borda inferior
        ctx.fillRect(p.x - 4, 300 - p.bottom, 56, 18);
        ctx.strokeRect(p.x - 4, 300 - p.bottom, 56, 18);
      });

      // Renderiza Partículas
      particlesRef.current.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Desenho do Personagem Red Bird
      ctx.save();
      ctx.translate(birdX, birdY);
      ctx.rotate(Math.min(Math.max(birdRef.current.vy * 0.07, -0.5), 0.7));

      // Asas Brancas Animadas
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-7, Math.sin(birdRef.current.wingAngle) * 6, 13, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Corpo Red Bird
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Olho Cartoon
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -5, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      // Brilho do olho
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(9, -7, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Bico Rosado
      ctx.fillStyle = '#fb7185';
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(15, 3, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crista Amarela
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -16);
      ctx.lineTo(2, -26);
      ctx.lineTo(8, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      if (hit) {
        sfx.playCrash();
        setHistory(prev => [{ mult: parseFloat(currentMult.toFixed(2)), crashed: true }, ...prev.slice(0, 9)]);
        setGameState('CRASHED');
      } else {
        reqIdRef.current = requestAnimationFrame(loop);
      }
    };

    reqIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqIdRef.current);
  }, [gameState, targetMaxMultiplier, forceCrash, enableAutoCashout, autoCashout]);

  const ggr = houseStats.totalBets - houseStats.totalPaid;
  const isPlaying = gameState === 'FLYING';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans flex flex-col items-center justify-start p-3 sm:p-5 select-none">
      
      {/* Top Header com Marca e Saldo */}
      <header className="w-full max-w-md flex justify-between items-center mb-3 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-3xl border border-slate-800 shadow-xl shadow-black/40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-rose-500 flex items-center gap-1.5 leading-tight">
              RED BIRD <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full border border-rose-500/30">CRASH</span>
            </h1>
            <p className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">GET MONEY BETS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Saldo / Depósito */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="group bg-slate-950/90 hover:bg-slate-800/90 px-3 py-1.5 rounded-2xl border border-emerald-500/40 hover:border-emerald-500 transition flex items-center gap-1.5 shadow-inner"
            title="Recarregar Saldo Demo"
          >
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
            <span className="font-mono font-bold text-emerald-400 text-sm">
              R$ {balance.toFixed(2)}
            </span>
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-emerald-300" />
          </button>

          {/* Som */}
          <button 
            onClick={toggleSound}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-2xl border border-slate-700/50 text-slate-300 transition"
            title={soundMuted ? 'Ativar Som' : 'Mutar Som'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Painel Admin */}
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className={`p-2.5 rounded-2xl border transition ${showAdmin ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/50 text-slate-400 hover:text-white'}`}
            title="Painel do Dono da Banca (Admin)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Histórico de Rodadas (Badges estilo Aviator) */}
      <div className="w-full max-w-md mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 px-1">
          <TrendingUp className="w-3 h-3" /> Histórico:
        </span>
        {history.map((h, i) => (
          <span 
            key={i} 
            className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-lg border shrink-0 transition-transform ${
              h.mult >= 2.0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : h.crashed 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            {h.mult.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Painel Admin Discreto */}
      {showAdmin && (
        <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-rose-500/40 mb-3 text-xs space-y-3 shadow-2xl animate-in fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Controle da Casa (Admin)
            </span>
            <span className="text-[10px] text-slate-400">Apenas você vê</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Apostado</span>
              <span className="font-mono font-bold text-white text-sm">R$ {houseStats.totalBets.toFixed(2)}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Lucro Líquido (GGR)</span>
              <span className={`font-mono font-bold text-sm ${ggr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {ggr.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
              Rigor do Crash da Casa:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'EASY', label: 'Suave (65% crash)', color: 'border-emerald-500/50' },
                { id: 'NORMAL', label: 'Padrão (88% crash)', color: 'border-amber-500/50' },
                { id: 'HARD', label: 'Triturador (95%)', color: 'border-rose-500/50' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setHouseRigor(opt.id)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition border ${
                    houseRigor === opt.id 
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md' 
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canvas / Arena do Jogo */}
      <div 
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        className="relative w-full max-w-md h-[300px] rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl cursor-pointer select-none group"
      >
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {/* Indicador de Toque / Tecla durante o voo */}
        {isPlaying && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-950/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 pointer-events-none">
            <span className="text-[11px] text-white/90 font-medium">
              Toque ou <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono border border-slate-700">Espaço</kbd> para Bater Asas 🪽
            </span>
          </div>
        )}

        {/* Multiplicador Dinâmico no Topo do Jogo */}
        {isPlaying && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/85 backdrop-blur-md px-5 py-2 rounded-2xl border border-amber-500/40 shadow-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
            <span className="font-black text-3xl font-mono text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* Crash Overlay */}
        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="bg-rose-500 text-white font-black text-[11px] px-3.5 py-1 rounded-full mb-2 uppercase tracking-widest shadow-lg shadow-rose-950">
              O Pássaro Bateu! 💥
            </div>
            <h2 className="text-4xl font-black text-white mb-1 tracking-tight">CRASHOU!</h2>
            <p className="text-slate-300 text-sm mb-4">
              Multiplicador final: <span className="font-mono text-amber-400 font-extrabold text-base">{multiplier.toFixed(2)}x</span>
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGameState('IDLE');
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Jogar Novamente
            </button>
          </div>
        )}

        {/* Cash Out Overlay */}
        {gameState === 'CASHOUT' && (
          <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3">
              <Award className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-emerald-400 mb-1 tracking-tight">CASH OUT COM SUCESSO!</h2>
            <p className="text-slate-200 text-base mb-1">
              Multiplicador: <span className="font-mono font-bold text-amber-300">{multiplier.toFixed(2)}x</span>
            </p>
            <p className="text-xl font-black text-white mb-4">
              Você Ganhou: <span className="font-mono text-emerald-400">R$ {winAmount.toFixed(2)}</span>
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGameState('IDLE');
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
            >
              Continuar Faturando
            </button>
          </div>
        )}

        {/* Tela Inicial / Espera */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-slate-900/90 border border-slate-700/80 px-5 py-3 rounded-2xl shadow-xl flex flex-col items-center gap-1.5">
              <p className="text-white font-extrabold text-sm">
                Defina o valor e clique em <span className="text-emerald-400">APOSTAR</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Pule os canos e dê Cash Out antes que ele colida!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controles de Aposta e Painel Principal */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-xl mt-3 space-y-3.5">
        
        {/* Input de Valor + Botões Rápidos */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Valor da Aposta (R$)
            </label>
            <span className="text-[10px] text-slate-500 font-mono">Mín: R$ 1,00</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                value={bet}
                disabled={isPlaying}
                onChange={(e) => setBet(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 font-mono font-bold text-emerald-400 text-lg focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div className="flex gap-1">
              <button
                disabled={isPlaying}
                onClick={() => setBet(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="bg-slate-800 hover:bg-slate-700 px-2.5 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 text-slate-300"
              >
                ½
              </button>
              <button
                disabled={isPlaying}
                onClick={() => setBet(prev => parseFloat((prev * 2).toFixed(2)))}
                className="bg-slate-800 hover:bg-slate-700 px-2.5 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 text-slate-300"
              >
                2x
              </button>
              <button
                disabled={isPlaying}
                onClick={() => setBet(Math.floor(balance))}
                className="bg-slate-800 hover:bg-slate-700 px-2.5 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50 text-slate-300"
              >
                Max
              </button>
            </div>
          </div>

          {/* Atalhos de Valores Prontos */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[5, 10, 20, 50].map((val) => (
              <button
                key={val}
                disabled={isPlaying}
                onClick={() => setBet(val)}
                className={`py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50 border ${
                  bet === val 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-800'
                }`}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Cash Out (Opcional) */}
        <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="autocash"
              checked={enableAutoCashout}
              disabled={isPlaying}
              onChange={(e) => setEnableAutoCashout(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="autocash" className="text-slate-300 font-bold text-xs cursor-pointer">
              Auto Cash Out:
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <input 
              type="number"
              step="0.1"
              min="1.1"
              value={autoCashout}
              disabled={!enableAutoCashout || isPlaying}
              onChange={(e) => setAutoCashout(Math.max(1.1, parseFloat(e.target.value) || 1.1))}
              className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-center font-mono font-bold text-amber-400 disabled:opacity-40"
            />
            <span className="text-slate-400 font-mono font-bold">x</span>
          </div>
        </div>

        {/* Botão de Ação Gigante (Apostar / Cashout) */}
        {!isPlaying ? (
          <button
            onClick={startRound}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-4 rounded-2xl text-lg shadow-xl shadow-emerald-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Play className="w-6 h-6 fill-current" /> Apostar & Decolar
          </button>
        ) : (
          <button
            onClick={cashOut}
            className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black py-4 rounded-2xl text-lg shadow-xl shadow-amber-950/60 transition active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider animate-pulse"
          >
            <Award className="w-6 h-6" /> Cash Out R$ {(bet * multiplier).toFixed(2)}
          </button>
        )}
      </div>

      {/* Apostadores ao Vivo (Simulação Multiplayer) */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm p-3.5 rounded-3xl border border-slate-800 mt-3">
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-400" /> Apostas na Rodada
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Ao Vivo
          </span>
        </div>

        <div className="space-y-1.5">
          {livePlayers.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-950/60 px-3 py-1.5 rounded-xl text-xs border border-slate-800/80">
              <span className="font-medium text-slate-300">{p.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400">R$ {p.bet.toFixed(2)}</span>
                {p.cashedOut ? (
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                    +{p.mult.toFixed(2)}x (R$ {p.win.toFixed(2)})
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">No jogo...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Depósito Fictício / Recarga de Saldo */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-emerald-400 flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Adicionar Saldo Demo
              </h3>
              <button 
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Escolha um valor para recarregar sua carteira e continuar testando o jogo:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setBalance(prev => prev + val);
                    setShowDepositModal(false);
                  }}
                  className="bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500 py-3 rounded-2xl font-mono font-bold text-emerald-400 hover:text-white transition text-sm"
                >
                  +R$ {val}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setBalance(1000);
                setShowDepositModal(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition"
            >
              Resetar para R$ 1.000,00
            </button>
          </div>
        </div>
      )}

      {/* Footer com instruções */}
      <footer className="mt-5 text-[11px] text-slate-500 text-center">
        Pressione <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">Espaço</kbd> para Voar • <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700">Enter</kbd> para Ação
      </footer>
    </div>
  );
}
