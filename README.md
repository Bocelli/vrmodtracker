# 🥽 VR Mods Tracker (Flat2VR & PCVR/Standalone)

Un tracker moderno, elegante e sempre aggiornato di tutti i repository GitHub per mod e porting in **Realtà Virtuale (VR)**, ispirato alla dashboard di tracciamento release per progetti open source.

![VR Mods Tracker Preview](public/favicon.svg)

---

## 🌟 Caratteristiche Principali

- 🗂️ **Database Completo (200+ Mod VR)**:
  - **Universal Frameworks & Injectors**: *UEVR (Universal Unreal Engine VR)*, *REFramework (Resident Evil 2/3/4/7/8, Monster Hunter, DMC5)*, *VRPerfKit (FSR, NIS, FFR)*.
  - **AAA & RPG**: *Cyberpunk 2077, Baldur's Gate 3, The Witcher 3, Ghost of Tsushima, Halo 2, Metal Gear Solid V, Alien Isolation (MotherVR), Watch Dogs*.
  - **Source & Classici**: *Half-Life 2 VR Mod, Portal 2 VR, Amnesia, Penumbra, Doom, Quake, Unreal Tournament, Wipeout*.
  - **Indie & Spaziali / Survival**: *Outer Wilds (NomaiVR), Valheim VR, Firewatch (Two Forks VR), The Stanley Parable, Deep Rock Galactic, Risk of Rain 2, Minecraft (Visor)*.
  - **Standalone (Meta Quest / Android)**: Port completi 6DOF di Team Beef e della community.
  - **Profili UEVR & Fix**: Configurazioni HUD e controlli per centinaia di giochi Unreal Engine.

- 🔔 **Stile Fedele allo Screenshot con Notifica "NEW!"**:
  - Bordo **verde neon pulsante** e badge `📢 NEW!` attorno alle card con nuove versioni disponibili.
  - Tag versione evidenziato in verde smeraldo, data formato `DD/MM/YYYY`.
  - Tasto interattivo `+ ✨ NEW!` / `+ 👁️ Visto`: clicca per segnare una release come letta/vista o non letta.
  - Stato persistito nel `localStorage` del browser.
  - Contatore `NEW X` dinamico nell'intestazione di ciascuna categoria (`▾ · Categoria  🟢 NEW 1  (X repo)  [A-Z]`).
  - Tasto globale **"Segna tutti come visti"** e filtro rapido **"Solo Nuove Release"**.

- 🔄 **Aggiornato in Tempo Reale**:
  - **Sincronizzazione Live con `awesome-flat2vr`**: recupera gli ultimi port aggiunti dalla community.
  - **GitHub API Releases**: controlla tag, date di pubblicazione, file `.zip` e changelog ufficiali.
  - **GitHub VR Explorer**: scopri in diretta nuovi repository creati su GitHub tramite topic `vr-mod`, `uevr`, `flat2vr`.
  - **Aggiunta Repository Personalizzati**: incolla qualsiasi URL GitHub (`owner/repo`) per iniziare subito a monitorarlo.

- ⚙️ **Strumenti Avanzati**:
  - Supporto per **GitHub Personal Access Token** opzionale (per aumentare il limite API da 60 a 5.000 chiamate/ora).
  - Modalità vista flessibile: scorrimento orizzontale a righe (come lo screenshot) oppure griglia responsive.
  - Esportazione & Importazione backup (JSON).
  - Ordinamento: Alfabetico (A-Z), Più recenti prima, Nuovi (NEW!) prima, Più popolari (⭐).

---

## 🚀 Come Avviare il Sito

### 1. Requisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore)

### 2. Installazione ed Avvio in Sviluppo
```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\vr-mods-tracker
npm install
npm run dev
```
Il sito sarà attivo all'indirizzo locale: **`http://localhost:5173/`**

### 3. Compilazione Statica per la Pubblicazione (GitHub Pages / Vercel / Netlify)
```bash
npm run build
```
I file compilati statici si trovano nella cartella `dist/` e possono essere caricati ovunque senza necessità di un server backend!

---

## 🔄 Aggiornamento dei Dati Pre-caricati

Per rigenerare il file di seed `src/data/seedData.json` sincronizzando l'intero catalogo di *awesome-flat2vr*:
```bash
node scripts/buildSeed.js
```
