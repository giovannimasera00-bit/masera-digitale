// Prodotti FINTI per provare lo shop prima che esista il negozio Shopify.
// Nomi, prezzi e giacenze sono inventati e segnati "di prova": nessun dato vero di prodotto.
import { productHandle, type ShopItem } from "@masera/core";

const SUMMARY = "Testo di prova: qui va la riga scritta dalle farmaciste su a cosa serve e per chi è.";

const raw: Omit<ShopItem, "handle" | "summary" | "image">[] = [
  { ean: "8001234000011", name: "Crema viso idratante 50 ml (prova)", brand: "Marca di prova", department: "dermocosmesi", line: null, price: 19.9, compareAtPrice: 25, stock: 7 },
  { ean: "8001234000059", name: "Shampoo delicato 200 ml (prova)", brand: "Marca di prova", department: "dermocosmesi", line: null, price: 9.9, compareAtPrice: null, stock: 3 },
  { ean: "8001234000066", name: "Siero viso 30 ml (prova)", brand: "Marca di prova", department: "dermocosmesi", line: "farmacisti-preparatori", price: 34, compareAtPrice: null, stock: 12 },
  { ean: "8001234000073", name: "Crema mani 75 ml (prova)", brand: "Marca di prova", department: "dermocosmesi", line: "ldf", price: 8.5, compareAtPrice: null, stock: 0 },
  { ean: "8001234000028", name: "Integratore di prova A, 30 bustine", brand: "Dottor Masera", department: "integratori", line: "dottor-masera", price: 18.9, compareAtPrice: null, stock: 20 },
  { ean: "8001234000080", name: "Integratore di prova B, 60 capsule", brand: "Dottor Masera", department: "integratori", line: "dottor-masera", price: 24.9, compareAtPrice: 29.9, stock: 9 },
  { ean: "8001234000097", name: "Integratore di prova C, 20 flaconcini", brand: "LDF", department: "integratori", line: "ldf", price: 15.5, compareAtPrice: null, stock: 2 },
  { ean: "8001234000103", name: "Biscotti proteici 250 g (prova)", brand: "Marca di prova", department: "alimenti-speciali", line: null, price: 6.9, compareAtPrice: null, stock: 15 },
  { ean: "8001234000110", name: "Pasta senza glutine 500 g (prova)", brand: "Marca di prova", department: "alimenti-speciali", line: null, price: 3.2, compareAtPrice: 3.9, stock: 30 },
  { ean: "8001234000127", name: "Shampoo per cani 250 ml (prova)", brand: "Marca di prova", department: "veterinaria", line: null, price: 11.5, compareAtPrice: null, stock: 4 },
  { ean: "80012344", name: "Cerotti assortiti 20 pezzi (prova)", brand: "Marca di prova", department: "sanitari", line: null, price: 3.5, compareAtPrice: null, stock: 12 },
  { ean: "8001234000134", name: "Termometro digitale (prova)", brand: "Marca di prova", department: "sanitari", line: null, price: 12.9, compareAtPrice: null, stock: 6 },
];

export const demoItems: ShopItem[] = raw.map((r) => ({ ...r, handle: productHandle(r.name, r.ean), summary: SUMMARY, image: null }));
