import Image from "next/image";
import { gql } from "@/lib/saleorClient";

async function getShop() {
  const data = await gql<{ shop: { name: string } }>({
    query: `query ShopName { shop { name } }`,
  });
  return data.shop;
}

export default async function Home() {
  const shop = await getShop();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-semibold">{shop?.name ?? "Saleor"}</h1>
        <p className="text-sm opacity-80">Conectado a la API de Maxwell’s Electrónica</p>
      </main>
    </div>
  );
}
