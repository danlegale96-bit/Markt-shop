
/*
  Simple SQLite helper and seeder
  - seeds 5 electronics products the first time
*/
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data.db');
const dbExists = fs.existsSync(DB_PATH);
const db = new sqlite3.Database(DB_PATH);

function run(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}
function get(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
function all(sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function setup() {
  await run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price_cents INTEGER,
    category TEXT,
    image TEXT
  )`);

  const count = await get("SELECT COUNT(*) as c FROM products");
  if (count && count.c === 0) {
    console.log('Seeding sample products...');
    const items = [
      {
        name: 'Wireless Headphones Pro',
        description: 'Căști wireless cu anulare a zgomotului și 30h autonomie',
        price_cents: 7999,
        category: 'Headphones',
        image: 'https://images.unsplash.com/photo-1518441902111-1782f5b7b0d3?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Smartphone Ultra X',
        description: 'Telefon 6.7\\\" OLED, 256GB, cameră 108MP',
        price_cents: 99900,
        category: 'Phones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Laptop Slim 14',
        description: 'Laptop 14\\\" ultra-subțire, 16GB RAM, 512GB SSD',
        price_cents: 129900,
        category: 'Laptops',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Smartwatch Fit',
        description: 'Smartwatch cu senzor puls, GPS și 7 zile autonomie',
        price_cents: 19999,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?q=80&w=600&auto=format&fit=crop'
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Boxă portabilă rezistentă la apă, sunet puternic',
        price_cents: 5999,
        category: 'Speakers',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
      }
    ];
    for (const it of items) {
      await run("INSERT INTO products (name, description, price_cents, category, image) VALUES (?, ?, ?, ?, ?)",
        [it.name, it.description, it.price_cents, it.category, it.image]);
    }
    console.log('Seed complete.');
  }
}

setup().catch(e => console.error(e));

module.exports = { run, get, all };
