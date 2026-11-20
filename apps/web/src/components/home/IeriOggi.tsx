import Image from "next/image";
import Link from "next/link";
import { links } from "@/content/home";

const items = [
  { tag: "Ieri", text: "Il laboratorio galenico, una tradizione di famiglia.", src: "/img/ieri-laboratorio.webp", w: 612, h: 362, alt: "Un farmacista nel laboratorio galenico della farmacia, in una foto d'epoca." },
  { tag: "Oggi", text: "Il nuovo robot, la farmacia che si rinnova.", src: "/img/oggi-robot.webp", w: 612, h: 284, alt: "Il braccio del nuovo robot tra gli scaffali." },
];

export function IeriOggi() {
  return (
    <section id="storia" aria-labelledby="storia-t" className="bg-beige-chiaro/50">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <h2 id="storia-t" className="fm-display text-[40px] leading-tight md:text-[56px]">
            Quattro generazioni, <span className="text-verde">una sola missione.</span>
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Dal bisnonno chirurgo al robot che oggi porta i farmaci al banco in pochi secondi. La tradizione resta, il modo di servirti cambia.
          </p>
          <Link href={links.famiglia} className="fm-focus mt-5 inline-block rounded text-[17px] font-semibold text-verde underline decoration-2 underline-offset-4">
            La storia della famiglia <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <figure key={it.tag} className="overflow-hidden rounded-t-[999px] rounded-b-3xl bg-verde-scuro text-carta">
              <Image src={it.src} alt={it.alt} width={it.w} height={it.h} sizes="(min-width: 768px) 600px, 100vw" className="aspect-[3/2] h-auto w-full object-cover" />
              <figcaption className="p-6 md:p-8">
                <span className="fm-display block text-[44px] leading-none">{it.tag}</span>
                <span className="mt-2 block text-[17px] text-beige-chiaro">{it.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
