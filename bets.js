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
  Heart, 
  Smile, 
  ShieldAlert, 
  PlusCircle, 
  Zap,
  Star
} from 'lucide-react';

// --- SISTEMA DE ÁUDIO SINTETIZADO INFANTIL & MÚSICA DE FUNDO (Web Audio API) ---
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

  // Som de Mola Cartunesca (Boing!) quando o passarinho pula
  playBoing() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Glissando ascendente característico de mola cartoon
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  // Som de Vitória Infantil Festiva (Ta-Dah! ✨)
  playTaDah() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Fanfarra de brinquedo C-E-G-C alegre
    const notes = [
      { f: 523.25, d: 0.1, delay: 0 },
      { f: 659.25, d: 0.1, delay: 0.1 },
      { f: 783.99, d: 0.12, delay: 0.2 },
      { f: 1046.50, d: 0.45, delay: 0.32 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + n.delay;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.d + 0.05);
    });
  }

  // Som de Trompete Cômico de Desenho Animado (Womp Womp Womp Woooomp...)
  playWompWomp() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Notas cômicas descendentes
    const pitches = [311.13, 293.66, 277.18, 246.94]; // Eb4 -> D4 -> Db4 -> B3

    pitches.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.18;
      const dur = idx === 3 ? 0.45 : 0.15;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      // Pitch drop no final
      if (idx === 3) {
        osc.frequency.exponentialRampToValueAtTime(140, t + dur);
      }

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  }

  // Moedinha Plim!
  playCoin() {
    if (this.sfxMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Trilha Sonora Chiptune / Caixinha de Brinquedos Infantil em Loop
  startMusic() {
    this.init();
    if (this.bgmPlaying || this.bgmMuted || !this.ctx) return;
    this.bgmPlaying = true;

    // Melodia animada infantil estilo Mario / Fazendinha (Marimba fofa)
    // Escala: C4, D4, E4, F4, G4, A4, B4, C5
    const melody = [
      { f: 523.25, dur: 0.18 }, // C5
      { f: 523.25, dur: 0.18 }, // C5
      { f: 659.25, dur: 0.18 }, // E5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 659.25, dur: 0.18 }, // E5
      { f: 783.99, dur: 0.28 }, // G5
      { f: 880.00, dur: 0.35 }, // A5
      { f: 783.99, dur: 0.35 }, // G5

      { f: 698.46, dur: 0.18 }, // F5
      { f: 659.25, dur: 0.18 }, // E5
      { f: 587.33, dur: 0.28 }, // D5
      { f: 523.25, dur: 0.18 }, // C5
      { f: 587.33, dur: 0.18 }, // D5
      { f: 659.25, dur: 0.28 }, // E5
      { f: 523.25, dur: 0.45 }, // C5
      { f: 0,      dur: 0.15 }  // pausa
    ];

    const stepInterval = 210; // ms por tempo

    const tick = () => {
      if (!this.bgmPlaying || this.bgmMuted) return;

      const note = melody[this.currentStep % melody.length];
      this.currentStep++;

      if (note.f > 0 && this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Timbre de marimba/xilofone suave de brinquedo
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        // Volume bem suave para ficar no fundo
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + note.dur + 0.05);

        // Baixo fofo de acompanhamento a cada 2 tempos
        if (this.currentStep % 2 === 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(note.f / 4, now);
          bassGain.gain.setValueAtTime(0.08, now);
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

export default function App() {
  // Saldo Infantil "Moedinhas Mágicas"
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('redbird_balance_v2');
    return saved ? parseFloat(saved) : 1000.00;
  });

  const [bet, setBet] = useState(10.00);
  const [autoCashout, setAutoCashout] = useState(2.00);
  const [enableAutoCashout, setEnableAutoCashout] = useState(false);
  const [gameState, setGameState] = useState('IDLE'); // IDLE, FLYING, CRASHED, CASHOUT
  const [multiplier, setMultiplier] = useState(1.00);
  const [winAmount, setWinAmount] = useState(0);

  // Estados de áudio e modal
  const [musicActive, setMusicActive] = useState(false);
  const [sfxActive, setSfxActive] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Histórico estilo Docinho & Estrelas
  const [history, setHistory] = useState([
    { mult: 1.25, crashed: true },
    { mult: 2.10, crashed: false },
    { mult: 1.05, crashed: true },
    { mult: 3.50, crashed: false },
    { mult: 1.12, crashed: true },
    { mult: 7.80, crashed: false },
  ]);

  // Jogadores simulados com nomes fofos de bichinhos e crianças
  const [livePlayers, setLivePlayers] = useState([
    { name: 'Ursinho_Pimpão 🧸', bet: 20, cashedOut: false, win: 0, mult: 0 },
    { name: 'Joaninha_Feliz 🐞', bet: 50, cashedOut: false, win: 0, mult: 0 },
    { name: 'Pipoca_Doce 🍿', bet: 10, cashedOut: false, win: 0, mult: 0 },
    { name: 'Dino_Baby 🦖', bet: 100, cashedOut: false, win: 0, mult: 0 },
    { name: 'Coelhinho_Saltador 🐰', bet: 25, cashedOut: false, win: 0, mult: 0 },
  ]);

  // Regra de Retenção da Casa de Doces
  const [houseRigor, setHouseRigor] = useState('NORMAL');
  const [targetMaxMultiplier, setTargetMaxMultiplier] = useState(1.00);
  const [forceCrash, setForceCrash] = useState(false);
  const [houseStats, setHouseStats] = useState(() => {
    const saved = localStorage.getItem('redbird_housestats_v2');
    return saved ? JSON.parse(saved) : { totalBets: 0, totalPaid: 0 };
  });

  const canvasRef = useRef(null);
  const reqIdRef = useRef(null);

  // Física do Piu-Piu
  const birdRef = useRef({ y: 140, vy: 0, wingAngle: 0, blushScale: 1 });
  const pipesRef = useRef([]);
  const multRef = useRef(1.00);
  const cloudsRef = useRef([
    { x: 40, y: 35, scale: 0.9, eyeBlink: 0 },
    { x: 190, y: 70, scale: 1.2, eyeBlink: 0 },
    { x: 340, y: 30, scale: 1.0, eyeBlink: 0 },
    { x: 460, y: 80, scale: 1.1, eyeBlink: 0 }
  ]);
  const starsRef = useRef([]);
  const hillsRef = useRef([
    { x: 0, h: 55, color: '#86efac' },
    { x: 200, h: 70, color: '#4ade80' },
    { x: 400, h: 60, color: '#86efac' }
  ]);

  // Salvar saldo
  useEffect(() => {
    localStorage.setItem('redbird_balance_v2', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('redbird_housestats_v2', JSON.stringify(houseStats));
  }, [houseStats]);

  // Ativar música infantil no primeiro clique geral
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

  // Iniciar Rodada
  const startRound = () => {
    handleUserGestureAudio();

    if (balance < bet || bet <= 0) {
      setShowDepositModal(true);
      return;
    }

    audio.playCoin();
    setBalance(prev => prev - bet);
    setHouseStats(prev => ({ ...prev, totalBets: prev.totalBets + bet }));

    const rand = Math.random();
    let maxMult = 1.00;
    let willForce = true;

    const threshold1 = houseRigor === 'EASY' ? 0.60 : houseRigor === 'HARD' ? 0.94 : 0.86;
    const threshold2 = houseRigor === 'EASY' ? 0.85 : houseRigor === 'HARD' ? 0.98 : 0.95;

    if (rand < threshold1) {
      maxMult = parseFloat((Math.random() * 0.28 + 1.03).toFixed(2));
      willForce = true;
    } else if (rand < threshold2) {
      maxMult = parseFloat((Math.random() * 0.95 + 1.32).toFixed(2));
      willForce = true;
    } else {
      maxMult = parseFloat((Math.random() * 12.00 + 2.30).toFixed(2));
      willForce = false;
    }

    setTargetMaxMultiplier(maxMult);
    setForceCrash(willForce);

    // Reset de amiguinhos da rodada
    setLivePlayers([
      { name: 'Ursinho_Pimpão 🧸', bet: Math.floor(Math.random() * 25 + 10), cashedOut: false, win: 0, target: 1.15 + Math.random() * 0.5 },
      { name: 'Joaninha_Feliz 🐞', bet: Math.floor(Math.random() * 50 + 20), cashedOut: false, win: 0, target: 1.25 + Math.random() * 1.2 },
      { name: 'Pipoca_Doce 🍿', bet: 10, cashedOut: false, win: 0, target: 1.10 + Math.random() * 0.3 },
      { name: 'Dino_Baby 🦖', bet: Math.floor(Math.random() * 80 + 30), cashedOut: false, win: 0, target: 1.40 + Math.random() * 1.8 },
      { name: 'Coelhinho_Saltador 🐰', bet: Math.floor(Math.random() * 30 + 15), cashedOut: false, win: 0, target: 1.30 + Math.random() * 0.7 },
    ]);

    // Reset da física do Piu-Piu
    birdRef.current = { y: 140, vy: -2, wingAngle: 0, blushScale: 1 };
    pipesRef.current = [
      { x: 340, top: 80, bottom: 110, stripeOffset: 0 },
      { x: 530, top: 120, bottom: 80, stripeOffset: 0 }
    ];
    starsRef.current = [];
    multRef.current = 1.00;
    setMultiplier(1.00);
    setGameState('FLYING');
  };

  const jump = () => {
    handleUserGestureAudio();
    if (gameState === 'FLYING') {
      birdRef.current.vy = -5.4;
      audio.playBoing();

      // Gerar estrelinhas e coraçõezinhos brilhantes no pulo
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

  const cashOut = () => {
    if (gameState !== 'FLYING') return;
    const finalMult = multRef.current;
    const win = bet * finalMult;
    setWinAmount(win);
    setBalance(prev => prev + win);
    setHouseStats(prev => ({ ...prev, totalPaid: prev.totalPaid + win }));
    audio.playTaDah();

    setHistory(prev => [{ mult: parseFloat(finalMult.toFixed(2)), crashed: false }, ...prev.slice(0, 7)]);
    setGameState('CASHOUT');
  };

  // Atalhos de teclado infantis
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

  // Loop de Animação e Renderização Infantil
  useEffect(() => {
    if (gameState !== 'FLYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      multRef.current += 0.008;
      const currentMult = multRef.current;
      setMultiplier(currentMult);

      if (enableAutoCashout && currentMult >= autoCashout) {
        cashOut();
        return;
      }

      // Amiguinhos bots sacando
      setLivePlayers(prev => prev.map(p => {
        if (!p.cashedOut && currentMult >= p.target) {
          return { ...p, cashedOut: true, win: p.bet * currentMult, mult: currentMult };
        }
        return p;
      }));

      // Crash da casa
      if (currentMult >= targetMaxMultiplier && forceCrash) {
        birdRef.current.vy += 2.6;
      }

      // Física do Piu-Piu
      birdRef.current.vy += 0.36;
      birdRef.current.y += birdRef.current.vy;
      birdRef.current.wingAngle += 0.38;

      // Nuvens fofas flutuando
      cloudsRef.current.forEach(c => {
        c.x -= 0.6;
        if (c.x < -80) c.x = 440;
      });

      // Movimento das Colinas Verdes
      hillsRef.current.forEach(h => {
        h.x -= 0.8;
        if (h.x < -200) h.x = 400;
      });

      // Movimento dos Tubos de Pirulito/Brinquedo
      pipesRef.current.forEach(p => { p.x -= 2.6; });

      if (pipesRef.current.length && pipesRef.current[0].x < -60) {
        pipesRef.current.shift();
        const lastX = pipesRef.current[pipesRef.current.length - 1]?.x || 300;
        const topH = Math.floor(Math.random() * 95) + 50;
        pipesRef.current.push({ x: lastX + 180, top: topH, bottom: 260 - topH - 95 });
      }

      // Colisão
      const birdY = birdRef.current.y;
      const birdX = 70;
      const r = 18;
      let hit = false;

      // Teto e chão
      if (birdY - r <= 0 || birdY + r >= 285) hit = true;

      // Canos
      pipesRef.current.forEach(p => {
        if (birdX + r > p.x && birdX - r < p.x + 52) {
          if (birdY - r < p.top || birdY + r > 300 - p.bottom) {
            hit = true;
          }
        }
      });

      // Atualiza estrelinhas
      starsRef.current.forEach(st => {
        st.x += st.vx;
        st.y += st.vy;
        st.rot += 0.1;
        st.alpha -= 0.025;
      });
      starsRef.current = starsRef.current.filter(st => st.alpha > 0);

      // --- DESENHO NO CANVAS INFANTIL ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Céu Azul Claro Ensolarado
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
      skyGrad.addColorStop(0, '#67e8f9'); // Ciano clarinho
      skyGrad.addColorStop(0.5, '#bae6fd');
      skyGrad.addColorStop(1, '#fef08a'); // Amarelinho ensolarado no horizonte
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Arco-Íris Mágico Fofo ao Fundo
      ctx.save();
      ctx.globalAlpha = 0.35;
      const rainbowColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];
      rainbowColors.forEach((color, i) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(200, 320, 180 - i * 6, Math.PI, 0);
        ctx.stroke();
      });
      ctx.restore();

      // Sol Sorridente
      ctx.save();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(355, 45, 24, 0, Math.PI * 2);
      ctx.fill();
      // Raios do sol
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(355 + Math.cos(angle) * 28, 45 + Math.sin(angle) * 28);
        ctx.lineTo(355 + Math.cos(angle) * 36, 45 + Math.sin(angle) * 36);
        ctx.stroke();
      }
      // Carinha do sol
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(350, 42, 2.5, 0, Math.PI * 2); // olho esquerdo
      ctx.arc(362, 42, 2.5, 0, Math.PI * 2); // olho direito
      ctx.fill();
      // Sorriso do sol
      ctx.beginPath();
      ctx.arc(356, 46, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.restore();

      // Nuvens Fofas com Bochechas Rosadas
      cloudsRef.current.forEach(c => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 16 * c.scale, c.y - 8 * c.scale, 20 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 34 * c.scale, c.y, 16 * c.scale, 0, Math.PI * 2);
        ctx.fill();

        // Bochechas rosadas na nuvem
        ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
        ctx.beginPath();
        ctx.arc(c.x + 8 * c.scale, c.y + 2 * c.scale, 4 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 24 * c.scale, c.y + 2 * c.scale, 4 * c.scale, 0, Math.PI * 2);
        ctx.fill();

        // Olhinhos felizes da nuvem
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(c.x + 11 * c.scale, c.y - 1 * c.scale, 2.5 * c.scale, Math.PI, 0);
        ctx.arc(c.x + 21 * c.scale, c.y - 1 * c.scale, 2.5 * c.scale, Math.PI, 0);
        ctx.stroke();
      });

      // Colinas Verdes Ensolaradas no Chão
      hillsRef.current.forEach(h => {
        ctx.fillStyle = h.color;
        ctx.beginPath();
        ctx.ellipse(h.x + 100, 310, 140, h.h, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gramado Verde fofinho no fundo
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, 285, canvas.width, 15);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 296, canvas.width, 4);

      // Florzinhas balançando na grama
      for (let fx = 20; fx < canvas.width; fx += 55) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(fx, 286, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(fx - 3, 286, 2, 0, Math.PI * 2);
        ctx.arc(fx + 3, 286, 2, 0, Math.PI * 2);
        ctx.arc(fx, 283, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tubos de Pirulito / Brinquedo Cartoon (Cores Doces & Listras)
      pipesRef.current.forEach(p => {
        // Tubo Superior (Estilo Pirulito Verde Limão com listras)
        ctx.save();
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.x, 0, 52, p.top);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(p.x, 0, 52, p.top);

        // Listras diagonais de doce
        ctx.fillStyle = '#86efac';
        for (let y = 0; y < p.top; y += 22) {
          ctx.beginPath();
          ctx.moveTo(p.x + 2, y);
          ctx.lineTo(p.x + 50, y + 14);
          ctx.lineTo(p.x + 50, y + 22);
          ctx.lineTo(p.x + 2, y + 8);
          ctx.fill();
        }

        // Tampa arredondada fofa do tubo superior
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.top - 20, 60, 20, 8);
        ctx.fill();
        ctx.stroke();

        // Tubo Inferior
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.x, 300 - p.bottom, 52, p.bottom);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(p.x, 300 - p.bottom, 52, p.bottom);

        // Listras no tubo inferior
        ctx.fillStyle = '#86efac';
        for (let y = 300 - p.bottom; y < 300; y += 22) {
          ctx.beginPath();
          ctx.moveTo(p.x + 2, y);
          ctx.lineTo(p.x + 50, y + 14);
          ctx.lineTo(p.x + 50, y + 22);
          ctx.lineTo(p.x + 2, y + 8);
          ctx.fill();
        }

        // Tampa arredondada fofa do tubo inferior
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(p.x - 4, 300 - p.bottom, 60, 20, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Estrelinhas e Corações flutuantes do Piu-Piu
      starsRef.current.forEach(st => {
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.rotate(st.rot);
        ctx.globalAlpha = Math.max(0, st.alpha);
        ctx.fillStyle = st.color;

        if (st.type === 'star') {
          // Desenha estrelinha
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos((18 + s * 72) * 0.0174) * st.size, -Math.sin((18 + s * 72) * 0.0174) * st.size);
            ctx.lineTo(Math.cos((54 + s * 72) * 0.0174) * (st.size / 2), -Math.sin((54 + s * 72) * 0.0174) * (st.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Desenha coraçãozinho
          ctx.beginPath();
          ctx.arc(-st.size / 3, 0, st.size / 3, Math.PI, 0, false);
          ctx.arc(st.size / 3, 0, st.size / 3, Math.PI, 0, false);
          ctx.lineTo(0, st.size * 0.7);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      // Desenho do Pássaro Vermelho Gorducho & Fofo (Piu-Piu)
      ctx.save();
      ctx.translate(birdX, birdY);
      ctx.rotate(Math.min(Math.max(birdRef.current.vy * 0.07, -0.4), 0.6));

      // Asinhas Brancas Redondinhas
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-7, Math.sin(birdRef.current.wingAngle) * 6, 12, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Corpo Redondo Fofo (Vermelho Cereja Vivo)
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Barriguinha Branca Fofinha
      ctx.fillStyle = '#fee2e2';
      ctx.beginPath();
      ctx.arc(-2, 5, 11, 0.2, Math.PI - 0.2);
      ctx.fill();

      // Bochecha Rosada Kawaii (Blush)
      ctx.fillStyle = 'rgba(251, 113, 133, 0.8)';
      ctx.beginPath();
      ctx.arc(2, 4, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Olhos Grandes e Fofos de Desenho Animado
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -5, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pupila Brilhante
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(10, -5, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Dois Brilhos no Olhinho (Efeito Anime Fofo)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(9, -7, 1.8, 0, Math.PI * 2);
      ctx.arc(12, -4, 1.0, 0, Math.PI * 2);
      ctx.fill();

      // Bico Fofo de Patinho/Passarinho (Laranja/Amarelo Doce)
      ctx.fillStyle = '#f97316';
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(15, 3, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crista Amarela Fofa de Peninha
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

      if (hit) {
        audio.playWompWomp();
        setHistory(prev => [{ mult: parseFloat(currentMult.toFixed(2)), crashed: true }, ...prev.slice(0, 7)]);
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
    <div 
      onClick={handleUserGestureAudio}
      className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200 text-slate-800 font-fredoka flex flex-col items-center justify-start p-3 sm:p-5 select-none"
    >
      
      {/* Top Header Infantil: Cores Vivas, Nuvem e Balões */}
      <header className="w-full max-w-md flex justify-between items-center mb-3 bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border-4 border-amber-300 shadow-pop-amber">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center border-2 border-white shadow-md animate-float-wiggle">
            <span className="text-2xl">🐤</span>
          </div>
          <div>
            <h1 className="text-xl font-cartoon tracking-wider text-rose-500 flex items-center gap-1 leading-none drop-shadow-sm">
              PIU-PIU <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-fredoka font-black border-2 border-amber-500">BETS</span>
            </h1>
            <p className="text-[11px] font-bold text-sky-600 tracking-wide">O PASSARINHO DO TESOURO 🎈</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Moedinhas Mágicas */}
          <button 
            onClick={() => setShowDepositModal(true)}
            className="group btn-pop bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-2xl border-2 border-amber-400 flex items-center gap-1.5 shadow-sm"
            title="Pegar mais Moedinhas Mágicas"
          >
            <Coins className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-extrabold text-amber-700 text-sm">
              R$ {balance.toFixed(2)}
            </span>
            <PlusCircle className="w-3.5 h-3.5 text-amber-600 group-hover:scale-125 transition-transform" />
          </button>

          {/* Música Infantil On/Off */}
          <button 
            onClick={toggleMusicButton}
            className={`btn-pop p-2 rounded-2xl border-2 transition ${
              musicActive 
                ? 'bg-rose-400 text-white border-rose-500 shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-400'
            }`}
            title={musicActive ? 'Pausar Musiquinha Infantil' : 'Tocar Musiquinha Infantil 🎵'}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Efeitos Sonoros */}
          <button 
            onClick={toggleSfxButton}
            className={`btn-pop p-2 rounded-2xl border-2 transition ${
              sfxActive 
                ? 'bg-emerald-400 text-emerald-950 border-emerald-500 shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-400'
            }`}
            title={sfxActive ? 'Silenciar Efeitos' : 'Ativar Efeitos'}
          >
            {sfxActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Painel Secreto do Dono da Banca */}
          <button 
            onClick={() => setShowAdmin(!showAdmin)}
            className={`btn-pop p-2 rounded-2xl border-2 transition ${
              showAdmin 
                ? 'bg-purple-500 text-white border-purple-600' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500'
            }`}
            title="Painel Secreto da Fazenda"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Histórico Estilo Docinhos / Balões */}
      <div className="w-full max-w-md mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black text-sky-800 uppercase flex items-center gap-1 shrink-0 px-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Histórico:
        </span>
        {history.map((h, i) => (
          <span 
            key={i} 
            className={`text-xs font-black px-2.5 py-1 rounded-2xl border-2 shrink-0 shadow-sm ${
              h.mult >= 2.0
                ? 'bg-amber-300 text-amber-950 border-amber-400 animate-bounce'
                : h.crashed 
                  ? 'bg-rose-200 text-rose-800 border-rose-300'
                  : 'bg-emerald-200 text-emerald-900 border-emerald-300'
            }`}
          >
            {h.mult.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Painel Admin Divertido */}
      {showAdmin && (
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-3xl border-4 border-purple-300 mb-3 text-xs space-y-3 shadow-pop-indigo animate-in fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-purple-100">
            <span className="font-black text-purple-700 uppercase tracking-wider flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-purple-600" /> Painel Secreto da Banca 🏰
            </span>
            <span className="text-[10px] text-purple-400 font-bold">Modo Administrador</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 p-2.5 rounded-2xl border-2 border-purple-200">
              <span className="text-[10px] text-purple-600 font-bold block">Moedas Apostadas</span>
              <span className="font-extrabold text-purple-900 text-sm">R$ {houseStats.totalBets.toFixed(2)}</span>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-2xl border-2 border-purple-200">
              <span className="text-[10px] text-purple-600 font-bold block">Tesouro da Casa (GGR)</span>
              <span className={`font-extrabold text-sm ${ggr >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {ggr.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-purple-700 uppercase block mb-1.5">
              Frequência de Queda do Pássaro:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'EASY', label: 'Amigável (60%)', color: 'border-emerald-400' },
                { id: 'NORMAL', label: 'Normal (86%)', color: 'border-amber-400' },
                { id: 'HARD', label: 'Desafiador (94%)', color: 'border-rose-400' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setHouseRigor(opt.id)}
                  className={`btn-pop py-2 px-2 rounded-2xl text-[10px] font-black border-2 transition ${
                    houseRigor === opt.id 
                      ? 'bg-purple-500 text-white border-purple-600 shadow-sm' 
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

      {/* Arena do Jogo Estilo Desenho Animado */}
      <div 
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        className="relative w-full max-w-md h-[300px] rounded-3xl overflow-hidden border-4 border-amber-400 shadow-cartoon-lg cursor-pointer select-none group bg-sky-200"
      >
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full block" />

        {/* Dica de Toque Infantil */}
        {isPlaying && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-amber-300 shadow-md pointer-events-none flex items-center gap-1.5">
            <span className="text-xs text-amber-900 font-black">
              Toque na tela ou aperte <kbd className="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded-lg border border-amber-400">Espaço</kbd> para Bater Asinhas! 🪽
            </span>
          </div>
        )}

        {/* Multiplicador Balão Gigante */}
        {isPlaying && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-300 border-4 border-amber-500 px-5 py-1.5 rounded-3xl shadow-pop-amber flex items-center gap-2 animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-700 animate-spin" />
            <span className="font-cartoon text-3xl text-amber-950 drop-shadow-sm">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* Crash Overlay - Infantil e Divertido */}
        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 bg-rose-500/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-2 animate-bounce">🙈💫</div>
            <div className="bg-yellow-300 text-amber-950 font-black text-xs px-4 py-1.5 rounded-full mb-2 uppercase tracking-widest border-2 border-yellow-400 shadow-md">
              Bateu o Biquinho!
            </div>
            <h2 className="text-3xl font-cartoon text-white mb-1 drop-shadow-md">OPS! CAIU!</h2>
            <p className="text-rose-100 text-sm font-bold mb-4">
              Multiplicador: <span className="bg-white/30 px-2 py-0.5 rounded-lg text-white font-black">{multiplier.toFixed(2)}x</span>
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGameState('IDLE');
              }}
              className="btn-pop bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black px-6 py-3 rounded-2xl text-sm border-2 border-yellow-500 shadow-pop-amber transition flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Tentar de Novo!
            </button>
          </div>
        )}

        {/* Cash Out Overlay - Festa de Doces */}
        {gameState === 'CASHOUT' && (
          <div className="absolute inset-0 bg-emerald-500/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="text-6xl mb-1 animate-bounce">🎉🍬</div>
            <h2 className="text-3xl font-cartoon text-amber-300 mb-1 drop-shadow-md">
              EBAAA! GANHOU!
            </h2>
            <p className="text-emerald-100 text-sm font-bold mb-1">
              Multiplicador: <span className="font-black text-white">{multiplier.toFixed(2)}x</span>
            </p>
            <div className="bg-white/95 px-5 py-2.5 rounded-2xl border-2 border-emerald-300 shadow-lg mb-4">
              <span className="text-xs text-emerald-800 font-bold block">Você Faturou:</span>
              <span className="font-cartoon text-2xl text-emerald-600">R$ {winAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGameState('IDLE');
              }}
              className="btn-pop bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-7 py-3 rounded-2xl text-sm border-2 border-amber-500 shadow-pop-amber uppercase tracking-wider transition"
            >
              Pegar Mais Docinhos!
            </button>
          </div>
        )}

        {/* Tela Inicial */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-sky-900/30 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white/95 border-4 border-amber-300 px-6 py-4 rounded-3xl shadow-pop-amber flex flex-col items-center gap-2">
              <span className="text-3xl animate-bounce">🎈🐤✨</span>
              <p className="text-slate-800 font-black text-sm">
                Escolha suas moedinhas e clique em <span className="text-emerald-600">DECOLAR</span>!
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Pule os tubinhos de pirulito e resgate seus docinhos a tempo!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Painel de Apostas 3D Estilo Brinquedo */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-4 rounded-3xl border-4 border-sky-300 shadow-cartoon-lg mt-3 space-y-3.5">
        
        {/* Controle da Aposta */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" /> Moedas da Aposta:
            </label>
            <span className="text-xs text-sky-600 font-bold">Mínimo: R$ 1,00</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 font-black text-sm">R$</span>
              <input 
                type="number"
                step="any"
                min="1"
                value={bet}
                disabled={isPlaying}
                onChange={(e) => setBet(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-sky-50 border-2 border-sky-300 rounded-2xl pl-10 pr-3 py-2.5 font-fredoka font-black text-sky-900 text-lg focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>

            <div className="flex gap-1.5">
              <button
                disabled={isPlaying}
                onClick={() => setBet(prev => Math.max(1, parseFloat((prev / 2).toFixed(2))))}
                className="btn-pop bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 px-3 py-2.5 rounded-2xl text-xs font-black transition disabled:opacity-50 text-sky-800"
              >
                ½
              </button>
              <button
                disabled={isPlaying}
                onClick={() => setBet(prev => parseFloat((prev * 2).toFixed(2)))}
                className="btn-pop bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 px-3 py-2.5 rounded-2xl text-xs font-black transition disabled:opacity-50 text-sky-800"
              >
                2x
              </button>
              <button
                disabled={isPlaying}
                onClick={() => setBet(Math.floor(balance))}
                className="btn-pop bg-sky-200 hover:bg-sky-300 border-2 border-sky-400 px-3 py-2.5 rounded-2xl text-xs font-black transition disabled:opacity-50 text-sky-900"
              >
                Tudo!
              </button>
            </div>
          </div>

          {/* Botões Rápidos Doces */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[5, 10, 20, 50].map((val) => (
              <button
                key={val}
                disabled={isPlaying}
                onClick={() => setBet(val)}
                className={`btn-pop py-2 rounded-2xl text-xs font-black transition disabled:opacity-50 border-2 ${
                  bet === val 
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm' 
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                +{val} Moedas
              </button>
            ))}
          </div>
        </div>

        {/* Resgate Automático Fofo (Auto Cash Out) */}
        <div className="bg-sky-50 p-2.5 rounded-2xl border-2 border-sky-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="autocash"
              checked={enableAutoCashout}
              disabled={isPlaying}
              onChange={(e) => setEnableAutoCashout(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-white border-2 border-sky-300 cursor-pointer"
            />
            <label htmlFor="autocash" className="text-sky-900 font-black text-xs cursor-pointer flex items-center gap-1">
              Resgate Automático:
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
              className="w-20 bg-white border-2 border-sky-300 rounded-xl px-2 py-1 text-center font-fredoka font-black text-sky-900 disabled:opacity-40"
            />
            <span className="text-sky-700 font-black">x</span>
          </div>
        </div>

        {/* Botão de Decolar / Resgatar 3D Pop Gigante */}
        {!isPlaying ? (
          <button
            onClick={startRound}
            className="w-full btn-pop bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-emerald-950 font-cartoon text-xl py-4 rounded-3xl border-4 border-emerald-600 shadow-pop-emerald flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Play className="w-6 h-6 fill-current" /> DECOLAR PIU-PIU! 🚀
          </button>
        ) : (
          <button
            onClick={cashOut}
            className="w-full btn-pop bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-amber-950 font-cartoon text-xl py-4 rounded-3xl border-4 border-amber-600 shadow-pop-amber flex items-center justify-center gap-2 uppercase tracking-wider animate-pulse"
          >
            <Award className="w-6 h-6" /> RESGATAR R$ {(bet * multiplier).toFixed(2)} ✨
          </button>
        )}
      </div>

      {/* Amiguinhos da Rodada (Simulação Ao Vivo Infantil) */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-3.5 rounded-3xl border-4 border-emerald-300 shadow-cartoon mt-3">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-600" /> Amiguinhos Jogando Juntos
          </span>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Na Fazendinha
          </span>
        </div>

        <div className="space-y-1.5">
          {livePlayers.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center bg-emerald-50/70 px-3 py-1.5 rounded-2xl text-xs border border-emerald-200">
              <span className="font-bold text-emerald-950">{p.name}</span>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-slate-500">R$ {p.bet.toFixed(2)}</span>
                {p.cashedOut ? (
                  <span className="font-black text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-xl border border-emerald-300 text-[11px]">
                    +{p.mult.toFixed(2)}x (R$ {p.win.toFixed(2)})
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold text-[11px] animate-pulse">Voando... 🪽</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Fofo de Moedinhas Mágicas */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-sky-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-400 w-full max-w-sm rounded-3xl p-5 shadow-cartoon-lg space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-cartoon text-xl text-amber-600 flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-500" /> Mais Moedinhas!
              </h3>
              <button 
                onClick={() => setShowDepositModal(false)}
                className="btn-pop bg-rose-100 hover:bg-rose-200 text-rose-700 w-8 h-8 rounded-full border border-rose-300 font-black flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-bold">
              Pegue mais moedinhas mágicas para continuar brincando com o Piu-Piu:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500, 1000, 2500, 5000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    audio.playCoin();
                    setBalance(prev => prev + val);
                    setShowDepositModal(false);
                  }}
                  className="btn-pop bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 py-3 rounded-2xl font-black text-amber-800 transition text-sm shadow-sm"
                >
                  +R$ {val}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                audio.playCoin();
                setBalance(1000);
                setShowDepositModal(false);
              }}
              className="w-full btn-pop bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-black py-2.5 rounded-2xl border-2 border-sky-300 transition"
            >
              Recarregar R$ 1.000,00 Padrão
            </button>
          </div>
        </div>
      )}

      {/* Rodapé Fofinho */}
      <footer className="mt-4 text-xs text-sky-900 font-bold text-center">
        Dica: Aperte <kbd className="bg-white px-2 py-0.5 rounded-xl text-sky-950 border-2 border-sky-300 shadow-sm">Espaço</kbd> para Voar • <kbd className="bg-white px-2 py-0.5 rounded-xl text-sky-950 border-2 border-sky-300 shadow-sm">Enter</kbd> para Resgatar
      </footer>
    </div>
  );
}
