# 🚀 Guia de Publicação Online (Vercel & Netlify)
### Hospital Ordem Terceira — Sistema de Prescrição Médica Inteligente & SADT

Este projeto já está **100% configurado** com todos os arquivos de roteamento e build necessários:
- `vercel.json` configurado (SPA rewrites, cache de service worker, headers de segurança)
- `netlify.toml` e `public/_redirects` configurados
- PWA habilitado para instalação em qualquer computador (Windows, Mac, Linux) ou celular (Android, iOS) com suporte offline completo.
- **Privacidade Total:** Os dados clínicos, médicos e rascunhos são armazenados localmente no navegador do usuário (`localStorage`), em estrita conformidade com a LGPD e o sigilo médico.

---

## ⚡ Opção 1: Vercel (Mais Rápida e Recomendada)

### Método A: Pelo Terminal / Linha de Comando (Sem precisar de GitHub)
Abra o terminal na pasta do projeto e execute:
```bash
npx vercel
```
1. Se for o primeiro acesso, ele pedirá para você fazer login no navegador (pode usar Google ou GitHub).
2. Responda às perguntas:
   - *Set up and deploy?* Digite **Y** e aperte Enter.
   - *Which scope?* Aperte Enter no seu nome/conta.
   - *Link to existing project?* Digite **N** e aperte Enter.
   - *What's your project's name?* Digite `prescricao-ordem-terceira` (ou o nome que desejar) e aperte Enter.
   - *In which directory is your code located?* Aperte Enter (`./`).
   - *Want to modify settings?* Digite **N** e aperte Enter (as configurações já foram detectadas pelo `vercel.json`).
3. Em menos de 1 minuto, a Vercel gerará o link oficial do seu aplicativo (ex: `https://prescricao-ordem-terceira.vercel.app`)!

Para publicar futuras atualizações em produção:
```bash
npx vercel --prod
```
*(ou `npm run deploy:vercel`)*

---

### Método B: Conectando com GitHub (Deploy Automático)
1. Crie um repositório no seu [GitHub](https://github.com) (ex: `prescricao-ordem-terceira`).
2. No terminal deste projeto, inicialize o git e envie o código:
   ```bash
   git init
   git add .
   git commit -m "feat: configuracao completa ordem terceira e SADT"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/prescricao-ordem-terceira.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e faça login.
4. Clique em **"Add New..."** -> **"Project"**.
5. Selecione o repositório que acabou de criar e clique em **"Deploy"**.
6. Pronto! A Vercel constrói tudo sozinha e gera o link HTTPS seguro. A cada alteração que você fizer no código, o site atualiza sozinho.

---

## 🌐 Opção 2: Netlify

### Método A: Arrastar e Soltar a Pasta `dist` (Sem Código / 100% Visual)
O Netlify possui um recurso chamado **Netlify Drop**:
1. No terminal do projeto, gere os arquivos de produção:
   ```bash
   npm run build
   ```
   *(Isso criará/atualizará a pasta `dist`)*.
2. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
3. Arraste a pasta `dist` de dentro deste projeto diretamente para dentro do navegador.
4. O Netlify publicará o aplicativo instantaneamente e gerará uma URL segura (ex: `https://ordem-terceira.netlify.app`).

---

### Método B: Pelo Terminal / Linha de Comando
```bash
npx netlify deploy --prod --dir=dist
```
1. Siga as instruções na tela para autorizar no navegador.
2. Escolha **"Create & configure a new project"**.
3. O link de produção será exibido diretamente no terminal.

*(ou utilize o atalho: `npm run deploy:netlify`)*

---

## 💻 Como Acessar e Usar em Qualquer Outro Computador

Após publicar na Vercel ou no Netlify:
1. **Acesso Direto:** No consultório, ambulatório ou no notebook de casa, basta abrir o link gerado (ex: `https://prescricao-ordem-terceira.vercel.app`) no Google Chrome, Microsoft Edge ou Safari.
2. **Instalação como Aplicativo Nativo (PWA):**
   - Na barra de endereços do Chrome ou Edge, clique no ícone **"Instalar Aplicativo"** (computadorzinho com seta para baixo ao lado da estrela de favoritos).
   - O aplicativo criará um ícone na área de trabalho e abrirá em uma janela limpa, em tela cheia, como um programa nativo instalado.
3. **Modo Offline:** O Service Worker armazena em cache todos os formulários, CID-10 e tabelas SIGTAP. Mesmo se a internet do hospital oscilar ou cair, você continuará gerando prescrições e guias SADT normalmente.
