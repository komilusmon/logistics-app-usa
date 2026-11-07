# US Logistics States — Web App (Vercel)

AQSh logistika / dispetcher web ilovasi:

- **Real chegaralar xaritasi** (US Census GeoJSON + Albers USA)
- **Savol-javob (Quiz)** — kodlar, poytaxtlar, mintaqalar, max height
- **Fura yo'l qidiruv** — shahardan shaharga; yo'l kengligi, yuk balandligi, burilish radiusi va sifat bo'yicha

## Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local   # ixtiyoriy: VITE_GOOGLE_MAPS_API_KEY
npm run dev
```

## Vercel deploy

1. [vercel.com](https://vercel.com) da GitHub reposini import qiling (`komilusmon/logistics-app-usa`).
2. Framework Preset: **Vite** (yoki `vercel.json` avtomatik o'qiydi).
3. Build: `npm run build` · Output: `dist`.
4. Environment Variables (ixtiyoriy):
   - `VITE_GOOGLE_MAPS_API_KEY` — Google Maps rejimini yoqish uchun.
5. Deploy.

SPA marshrutlari `vercel.json` orqali `index.html` ga rewrite qilinadi; `/geo/states-10m.json` cache bilan xizmat qiladi.

## Fura yo'l qidiruv

`Fura Yo'l Qidiruv` tabida:

| Parametr | Ma'nosi |
|----------|---------|
| Yuk kengligi | Treyler / yuk eni (ft) — yo'l `usableWidth` bilan solishtiriladi |
| Yuk balandligi | Clearance (ft) — ko'prik/tunnel cheklovi |
| Uzunlik | Traktor + treyler — qiyin interchangelarda cheklov |
| Burilish radiusi | Tor rampalar uchun manevr talabi |

Algoritm mos bo'lmagan bo'laklarni bloklaydi, qolganlari bo'yicha **masofa / sifat + jarimalar** bilan eng yaxshi va muqobil marshrutlarni chiqaradi.

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | Dev server (`:3000`) |
| `npm run build` | Production build |
| `npm run preview` | Dist preview |
| `npm run lint` | TypeScript tekshiruv |
