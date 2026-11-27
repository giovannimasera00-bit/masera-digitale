import Link from "next/link";
import { availability, displayPrice, findLine, type ShopItem } from "@masera/core";

/** Segnaposto della foto: arco Masera e iniziale, finché non arrivano le foto vere. */
export function ProductImage({ item, large = false }: { item: Pick<ShopItem, "name" | "image">; large?: boolean }) {
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.image} alt="" className="h-full w-full object-contain" />;
  }
  return (
    <div aria-hidden className={`flex h-full w-full items-end justify-center bg-[radial-gradient(90%_100%_at_50%_100%,#DCE7E2_0%,#F6F4EE_70%)] ${large ? "pb-8" : "pb-4"}`}>
      <div className={`flex items-center justify-center rounded-[18px_18px_12px_12px] border border-[#E2DED2] bg-bianco text-center text-[12px] text-verde shadow-[0_16px_28px_rgba(31,43,30,.14)] ${large ? "h-52 w-28" : "h-28 w-16"}`}>
        foto
      </div>
    </div>
  );
}

export function ProductCard({ item }: { item: ShopItem }) {
  const p = displayPrice(item);
  const a = availability(item.stock);
  const line = item.line ? findLine(item.line) : null;
  return (
    <li className="min-w-0">
      <Link href={`/prodotto/${item.handle}`} className="fm-focus fm-press group flex h-full flex-col overflow-hidden rounded-3xl border border-verde-scuro/10 bg-bianco">
        <div className="relative h-44">
          <ProductImage item={item} />
          {p.badge && <span className="absolute left-3 top-3 rounded-full bg-verde-scuro px-2.5 py-1 text-[13px] font-bold text-carta">{p.badge}</span>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {line && <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-verde">Linea {line.name.split(" – ")[0]}</span>}
          <b className="text-[16px] leading-snug group-hover:underline">{item.name}</b>
          <span className="text-[14px] text-verde">{item.brand}</span>
          <span className="mt-auto flex items-baseline gap-2 pt-2">
            <b className="text-[18px]">{p.price}</b>
            {p.full && (
              <s className="text-[14px] text-verde">
                <span className="sr-only">invece di </span>
                {p.full}
              </s>
            )}
          </span>
          <span className={`text-[13px] font-semibold ${a.state === "esaurito" ? "text-[#9b2c1f]" : "text-verde"}`}>{a.label}</span>
        </div>
      </Link>
    </li>
  );
}

export function ProductGrid({ items }: { items: ShopItem[] }) {
  if (!items.length) return <p className="rounded-3xl bg-beige-chiaro/60 p-6 text-[17px]">Qui non ci sono ancora prodotti.</p>;
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {items.map((i) => (
        <ProductCard key={i.handle} item={i} />
      ))}
    </ul>
  );
}

/** Avviso fisso in tutto lo shop di prova. */
export function DemoNotice() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
      <p className="rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
        <b>Shop di prova.</b> Prodotti, prezzi e giacenze sono finti: servono a vedere come funziona. Non si compra niente.
      </p>
    </div>
  );
}
