# CobWEB AI 🕸️

> Your AI-powered digital setup assistant. CobWEB guides entrepreneurs through building their perfect WordPress or Shopify presence — right theme, plugins, CRM, and automations — through a conversational AI interface.

---

## Deploy to Vercel Tonight

### Step 1 — Get your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Push to GitHub
```bash
# In this project folder:
git init
git add .
git commit -m "Initial CobWEB launch"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/cobweb-ai.git
git branch -M main
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Before clicking Deploy, go to **Environment Variables**
4. Add: `ANTHROPIC_API_KEY` = your key from Step 1
5. Click **Deploy**

That's it. Your app will be live at `https://cobweb-ai.vercel.app` (or similar) in ~2 minutes.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 3. Run the dev server
npm run dev

# Open http://localhost:3000
```

---

## Project Structure

```
cobweb/
├── app/
│   ├── api/chat/route.ts    # Streaming API endpoint (Claude)
│   ├── layout.tsx           # Root layout + fonts + metadata
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles + markdown styles
├── components/
│   ├── ChatInterface.tsx    # Full chat UI with streaming
│   ├── CobwebLogo.tsx       # SVG spider web logo
│   ├── Markdown.tsx         # Markdown renderer for AI responses
│   └── WebBackground.tsx    # Decorative web background
├── lib/
│   ├── prompt.ts            # CobWEB system prompt + welcome message
│   └── types.ts             # TypeScript interfaces
├── .env.example             # Environment variable template
├── vercel.json              # Vercel config
└── README.md
```

---

## Customising CobWEB

### Change the AI personality or knowledge
Edit `lib/prompt.ts` — the `COBWEB_SYSTEM_PROMPT` is the brain. Add your specific packages, pricing, or expertise here.

### Change the welcome message
Also in `lib/prompt.ts` — edit `WELCOME_MESSAGE.content`.

### Add your own suggested prompts
In `components/ChatInterface.tsx`, edit the `suggestedPrompts` array.

### Change colors/branding
Edit `tailwind.config.js` — the `web` color palette controls everything.

---

## Stage 2 Roadmap (coming next)

- [ ] WordPress REST API integration (auto-install plugins)
- [ ] Shopify Admin API integration (auto-configure store)
- [ ] n8n webhook triggers for automations
- [ ] Setup progress dashboard
- [ ] Customer accounts + saved configurations
- [ ] Stripe payments for packaged setups

---

Built with Next.js 14 · Claude Sonnet · Tailwind CSS · Deployed on Vercel
