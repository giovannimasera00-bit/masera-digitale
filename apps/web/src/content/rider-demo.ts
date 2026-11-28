// Ordini FINTI per provare /staff/consegne prima che arrivino gli ordini veri da Shopify.
// Nomi e numeri inventati; le vie sono vie di Seregno, con civici di prova.
import type { RiderOrder } from "@masera/core";

export function demoRiderOrders(date: string): RiderOrder[] {
  const at = (h: number) => `${date}T${String(h - 1).padStart(2, "0")}:15:00Z`; // ora italiana d'inverno (UTC+1)
  const base = { zip: "20831", notes: null, status: "pronto" as const, sealed: false, phone: "+39 333 000 0000" };
  return [
    { ...base, id: "d1", number: "M-1001", customerName: "Cliente di prova 1", street: "Via Garibaldi", houseNumber: "40", placedAt: at(9), payment: "contanti", totalEur: 23.4 },
    { ...base, id: "d2", number: "M-1002", customerName: "Cliente di prova 2", street: "Via Ballerini", houseNumber: "3", placedAt: at(10), payment: "pos", totalEur: 41.9, notes: "Citofono 2, terzo piano" },
    { ...base, id: "d3", number: "M-1003", customerName: "Cliente di prova 3", street: "Via Fratelli Cairoli", houseNumber: "12", placedAt: at(11), payment: "online_pagato", totalEur: 18, sealed: true },
    { ...base, id: "d4", number: "M-1004", customerName: "Cliente di prova 4", street: "Via Garibaldi", houseNumber: "8", placedAt: at(14), payment: "contanti", totalEur: 9.9, status: "da_preparare" },
    { ...base, id: "d5", number: "M-1005", customerName: "Cliente di prova 5", street: "Via Garibaldi", houseNumber: "120", placedAt: at(15), payment: "pos", totalEur: 64.5 },
  ];
}
