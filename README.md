
# Markt-shop — Demo (Markt-shop)

Acesta este un proiect demo pentru **Markt-shop**:
- Frontend simplu + backend (Express)
- Bază de date SQLite (`data.db`)
- Panou admin (login): **admin / demo1234**
- Integrare Stripe (mod test) pentru plăți cu cardul

---

## Ce primești în arhivă
- `server.js` — server Express
- `db.js` — inițializare SQLite + seed (5 produse electronice)
- `views/` — fișiere EJS (frontend + admin)
- `public/` — CSS și logo (logo generat)
- `package.json` — dependențe
- `data.db` — fișier SQLite creat automat după prima pornire (dacă nu există, va fi creat)
- `README.md` — acest fișier

---

## Credentiale demo
- **Admin:** `admin`
- **Parolă:** `demo1234`

### Card test Stripe
- **Număr card:** `4242 4242 4242 4242`
- **Expirare:** orice dată viitoare (ex. `12/34`)
- **CVC:** orice 3 cifre (ex. `123`)

---

## Setări ENV (în producție / pe host)
Pe platforma de hosting (Render, Railway sau Vercel), setează variabilele de mediu:
- `STRIPE_SECRET_KEY` = cheia secretă Stripe (mode test)
- `STRIPE_PUBLISHABLE_KEY` = cheia publicabilă Stripe (opțional)
- `ADMIN_USER` = utilizator admin (opțional)
- `ADMIN_PASS` = parolă admin (opțional)
- `SESSION_SECRET` = secret pentru sesiunile Express (opțional)
- `SUCCESS_URL` = URL redirecționare după checkout (ex. https://your-site.com/success)
- `CANCEL_URL` = URL redirecționare după anulare (ex. https://your-site.com/cancel)

---

## Recomandare hosting (pentru demo complet cu DB scris)
**Render** (https://render.com) sau **Railway** suportă aplicații Node cu fișiere persistente/migrări mai ușor. Vercel este optim pentru Next.js/static — pentru un server Express complet, Render este mai potrivit.

### Pași rapizi pentru deploy pe Render (recomandat)
1. Creează un cont pe Render (sau conectează GitHub).
2. Creează un repository GitHub (poți încărca arhiva sau folosi GitHub din browser pe iPhone).
   - În GitHub web: `Add file` → `Upload files` → încarci conținutul din zip (sau creezi repo și folosești aplicația GitHub).
3. Pe Render → New → Web Service → Connect to GitHub repo (selectezi repo).
   - Build command: `npm install`
   - Start command: `npm start`
4. În Render, la Environment → Add Environment Variables, setezi `STRIPE_SECRET_KEY` și `STRIPE_PUBLISHABLE_KEY` (folosește cheile **test** din contul Stripe).
5. La `SUCCESS_URL` și `CANCEL_URL` setează adresele returnate (ex.: `https://your-render-url.onrender.com/success`).
6. Deploy — așteaptă să pornească. URL-ul public va fi afișat (ex.: `https://markt-shop-demo.onrender.com`).

### Pași rapizi pentru deploy pe Vercel (dacă vrei doar frontend sau Next.js)
- Recomand folosirea Render pentru acest repo. Dacă vrei neapărat Vercel, transformăm rapid proiectul într-un Next.js app (îți pot face asta la cerere).

---

## Cum testezi plata pe iPhone
1. Deschide URL-ul public (după deploy).
2. Adaugă produse în coș.
3. Apasă `Plătește cu card (Stripe)` — vei fi redirecționat către Stripe Checkout în modul test.
4. Folosește cardul test: `4242 4242 4242 4242`, expirare `12/34`, CVC `123`.
5. După plata (mod test) vei fi redirecționat la pagina de succes.

---

## Admin — adaugă/editează produse
1. Accesează `/admin`, loghează-te cu `admin/demo1234`.
2. În panoul admin poți:
   - Adăuga produs nou (nume, descriere, preț în EUR, categorie, URL imagine)
   - Editează produs
   - Șterge produs

> Notă: SQLite (`data.db`) este folosit local. Pe platforme cloud, asigură-te că folosești un serviciu de baze de date external (ex: Supabase/Postgres) dacă vrei persistență robustă. Pentru demo rapid, Render păstrează fișierul `data.db` între deploy-uri (verifică politica platformei).

---

## Linkuri utile
- Stripe testing: https://stripe.com/docs/testing
- Render quickstart for Node: https://render.com/docs/deploy-node
- Railway: https://railway.app

---

## Dacă vrei ca eu să îl public pentru tine
Pot să te ghidez pas-cu-pas să îl urci din iPhone (te pot scrie exact ce apeși în GitHub web + Render). Dacă preferi, îmi poți da acces temporar la un repo GitHub sau la contul Render — dar nu trimite parole prin chat. Mai sigur: îmi dai permisiune **doar** la repo (collaborator), eu pot trimite un PR și-ți explic cum să deploy-ezi.

---

## Observații finale
- Proiectul e pregătit pentru demo. Trebuie doar să setezi cheile Stripe pe host și să dai `npm install && npm start`.
- Dacă vrei, pot transforma proiectul în Next.js + serverless (pentru Vercel) sau pot crea un repo GitHub pentru tine direct (am nevoie de acces sau să-ți trimit fișiere).

Succes! Dacă vrei, îți ofer și instrucțiuni **pas-cu-pas, pasă-pas** pentru a crea repo în GitHub **folosind numai iPhone** și apoi deploy pe Render — vreau să îți trimit pasii concreți (click/tap) pentru Safari pe iPhone. Spune «Da, pași iPhone» dacă vrei acești pași expliciți.
