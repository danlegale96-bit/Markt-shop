
/*
  Markt-shop demo server (Express + SQLite + Stripe)
  - Admin: admin / demo1234 (default, change via ENV ADMIN_USER / ADMIN_PASS)
  - Stripe: set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY as env vars in deployment
  - Success/Cancel URLs set via SUCCESS_URL / CANCEL_URL env vars
*/
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const Stripe = require('stripe');
const cors = require('cors');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_SECRET_KEY ? Stripe(STRIPE_SECRET_KEY) : null;

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'demo1234';

const SUCCESS_URL = process.env.SUCCESS_URL || 'http://localhost:3000/success';
const CANCEL_URL = process.env.CANCEL_URL || 'http://localhost:3000/cancel';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true
}));

// Helper: categories
async function getCategories() {
  const rows = await db.all("SELECT DISTINCT category FROM products");
  return rows.map(r => r.category).filter(Boolean);
}

app.get('/', async (req, res) => {
  const category = req.query.category || null;
  let products;
  if (category) {
    products = await db.all("SELECT * FROM products WHERE category = ? ORDER BY id", [category]);
  } else {
    products = await db.all("SELECT * FROM products ORDER BY id");
  }
  const categories = await getCategories();
  res.render('index', { products, categories });
});

app.get('/product/:id', async (req, res) => {
  const id = req.params.id;
  const product = await db.get("SELECT * FROM products WHERE id = ?", [id]);
  if (!product) return res.status(404).send("Produs negasit");
  res.render('product', { product });
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe nu este configurat. Seteaza STRIPE_SECRET_KEY.' });
  try {
    const items = req.body.items || [];
    // items: [{ id, qty }]
    const line_items = [];
    for (const it of items) {
      const p = await db.get("SELECT * FROM products WHERE id = ?", [it.id]);
      if (!p) continue;
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: p.name,
            description: p.description || ''
          },
          unit_amount: p.price_cents
        },
        quantity: it.qty || 1
      });
    }
    if (line_items.length === 0) return res.status(400).json({ error: 'Coșul este gol' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || ('http://localhost:3000/success'),
      cancel_url: process.env.CANCEL_URL || ('http://localhost:3000/cancel'),
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Eroare la Stripe: ' + (err.message || err) });
  }
});

app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/cancel', (req, res) => {
  res.render('cancel');
});

// Admin auth
app.get('/admin', (req, res) => {
  res.render('admin_login', { error: null });
});
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect('/admin/panel');
  }
  res.render('admin_login', { error: 'Credentiale incorecte' });
});
function ensureAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect('/admin');
}

app.get('/admin/panel', ensureAdmin, async (req, res) => {
  const products = await db.all("SELECT * FROM products ORDER BY id");
  res.render('admin_panel', { products });
});

app.get('/admin/add', ensureAdmin, (req, res) => {
  res.render('admin_edit', { product: null });
});
app.post('/admin/add', ensureAdmin, async (req, res) => {
  const { name, description, price, category, image } = req.body;
  const price_cents = Math.round(parseFloat(price || '0') * 100);
  await db.run("INSERT INTO products (name, description, price_cents, category, image) VALUES (?, ?, ?, ?, ?)",
    [name, description, price_cents, category, image]);
  res.redirect('/admin/panel');
});
app.get('/admin/edit/:id', ensureAdmin, async (req, res) => {
  const p = await db.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!p) return res.redirect('/admin/panel');
  res.render('admin_edit', { product: p });
});
app.post('/admin/edit/:id', ensureAdmin, async (req, res) => {
  const { name, description, price, category, image } = req.body;
  const price_cents = Math.round(parseFloat(price || '0') * 100);
  await db.run("UPDATE products SET name = ?, description = ?, price_cents = ?, category = ?, image = ? WHERE id = ?",
    [name, description, price_cents, category, image, req.params.id]);
  res.redirect('/admin/panel');
});
app.post('/admin/delete/:id', ensureAdmin, async (req, res) => {
  await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.redirect('/admin/panel');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Markt-shop demo running on port', PORT);
});


// Simple product JSON endpoint used by cart page
app.get('/product-json/:id', async (req, res) => {
  const p = await db.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!p) return res.status(404).json({error:'not found'});
  res.json(p);
});
