# Hospital Ordem Terceira — Prescrição Médica Inteligente & SADT

Sistema completo de prescrição hospitalar, receituário pediátrico com cálculo automático por peso, formulários oficiais SUS (APAC e AIH), atestados médicos com dias por extenso, solicitação de exames laboratoriais (guia SADT A4 1 página) e catálogo completo CID-10 e SIGTAP com travas anti-glosa.

---

## 🚀 Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```
2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

3. **Executar a bateria de testes automatizados:**
   ```bash
   npm test
   ```

---

## 🌐 Publicação Online (Vercel ou Netlify)

O projeto está totalmente configurado para publicação em nuvem com 1 comando.

Consulte o passo a passo completo no arquivo [DEPLOY.md](DEPLOY.md).

### Atalhos rápidos:

- **Publicar na Vercel:**
  ```bash
  npx vercel
  ```
  *(ou `npm run deploy:vercel`)*

- **Publicar no Netlify:**
  ```bash
  npx netlify deploy --prod --dir=dist
  ```
  *(ou `npm run deploy:netlify`)*

- **Arrastar e Soltar (Sem código):**
  Execute `npm run build` e arraste a pasta `dist` gerada em [app.netlify.com/drop](https://app.netlify.com/drop).
