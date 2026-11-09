# 🐦 RED BIRD - O Jogo do Pássaro Valioso (Crash Bets)

Um jogo de apostas e crash dinâmico em tempo real inspirado em mecânicas clássicas de *Flappy Bird* com apostas multiplicadoras (*Crash/Aviator/JetX*).

---

## 🎮 Como Funciona o Jogo

1. **Defina a Aposta**: Escolha o valor da aposta (R$ 5, R$ 10, R$ 50 ou digite qualquer valor a partir de R$ 1,00). Use os atalhos `½`, `2x` e `Max`.
2. **Apostar & Decolar**: Clique para iniciar a rodada.
3. **Controle de Voo**:
   - Toque na tela, clique no canvas ou aperte <kbd>Espaço</kbd> para bater as asas e desviar dos canos!
4. **Multiplicador Progressivo**: O multiplicador sobe em tempo real enquanto o pássaro estiver voando.
5. **Cash Out**: Saque seus lucros a qualquer momento antes que ele colida!
6. **Auto Cash Out**: Configure um multiplicador automático para sacar sem risco de distração.

---

## ✨ Recursos Implementados

- 🔊 **Efeitos Sonoros Sintetizados**: Sons de flap (asas), cash out (vitória), crash e clique usando Web Audio API nativa.
- 👥 **Apostas ao Vivo**: Simulação de apostadores simultâneos na mesma rodada.
- 📈 **Histórico de Rodadas**: Badges com os multiplicadores das últimas partidas.
- 💳 **Recarga Fictícia / Pix Demo**: Modal para repor créditos quando quiser.
- ⚙️ **Painel Administrativo do Dono da Banca**:
  - GGR (Lucro líquido da casa em tempo real).
  - Controle de rigor do crash: *Suave (65%)*, *Padrão (88%)*, *Triturador (95%)*.
- 💾 **Persistência de Saldo**: Saldo e lucros salvos automaticamente no `localStorage`.

---

## 🚀 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build

# 4. Pré-visualizar build
npm run preview
```

---

## 📤 Como Subir para o seu GitHub

```bash
# Adicionar todos os arquivos
git add .

# Criar o primeiro commit
git commit -m "feat: Jogo Red Bird Crash completo e operacional"

# Vincular ao seu repositório remoto (substitua com a URL do seu GitHub)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

