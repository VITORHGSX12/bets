# 🐤 PIU-PIU BETS - O Joguinho do Passarinho Valioso

Plataforma completa de apostas no formato **Crash/Multiplayer Síncrono** com tema infantil de desenho animado, física de voo inspirada em *Flappy Bird*, sistema de **dupla aposta independente (estilo Aviator/Spaceman)**, verificação criptográfica **Provably Fair**, carteira integrada com **Depósito e Saque Pix simulados** e **Chat Social ao Vivo**.

---

## 📋 Auditoria de Funcionalidades do Jogo de Apostas

| Funcionalidade | Status | Descrição |
| :--- | :---: | :--- |
| **Ciclo Contínuo de Rodadas** | ✅ 100% | Contagem regressiva (5s para apostar) + Decolagem/Voo + Crash + Intervalo de 3.5s |
| **Painel de Dupla Aposta** | ✅ 100% | 2 painéis independentes (Aposta 1 e Aposta 2) com controles de ½, 2x e Auto Bet |
| **Auto Cash Out Independente** | ✅ 100% | Saque automático programado por multiplicador em cada painel (ex: 1.50x e 5.00x) |
| **Sistema Provably Fair** | ✅ 100% | Hash SHA-256 gerado previamente para garantir integridade e transparência da rodada |
| **Depósito Pix Instantâneo** | ✅ 100% | Modal com QR Code simulado e chave Pix fictícia gerando saldo imediato |
| **Saque Pix Instantâneo** | ✅ 100% | Transferência simulada para chave Pix (CPF/E-mail) com comprovante de recibo |
| **Apostadores ao Vivo (Social)** | ✅ 100% | Feed dinâmico de amiguinhos apostando e sacando na mesma rodada com você |
| **Chat da Comunidade** | ✅ 100% | Aba com bate-papo em tempo real com envio e recepção de mensagens |
| **Histórico Pessoal** | ✅ 100% | Lista de apostas recentes com cálculo automático de lucros e prejuízos |
| **Maiores Ganhos (Top Winners)**| ✅ 100% | Tabela de classificação com troféus para os maiores multiplicadores do dia |
| **Áudio Sintetizado Nativo** | ✅ 100% | Web Audio API: Música infantil em loop, som de mola, trompete triste e fanfarra |
| **Painel do Dono da Banca** | ✅ 100% | Acesso Admin com cálculo de GGR e controle do rigor de crash da casa |

---

## 🎮 Controles e Atalhos

- **Toque ou Espaço**: Bater as asas do Piu-Piu durante o voo
- **Tecla Z**: Sacar / Cash Out da **Aposta 1**
- **Tecla X**: Sacar / Cash Out da **Aposta 2**

---

## 🚀 Como Rodar Localmente

```bash
# 1. Instalar pacotes
npm install

# 2. Iniciar servidor
npm run dev

# 3. Compilar para produção
npm run build

# 4. Pré-visualizar versão final
npm run preview
```
