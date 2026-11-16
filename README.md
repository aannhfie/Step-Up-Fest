# Step Up Fest – Ular Tangga Entrepreneur (versi hosting sendiri)

Peserta cukup buka link di HP, tanpa login apa pun. Host membuka `/host`.

## Jalankan di komputer sendiri
    npm install
    HOST_KEY=rahasiaku npm start
Buka http://localhost:3000/host (host) dan http://localhost:3000 (peserta).
Supaya HP peserta bisa masuk, pakai alamat IP laptop di WiFi yang sama
(misal http://192.168.1.5:3000), atau tunnel gratis: `npx cloudflared tunnel --url http://localhost:3000`.

## Deploy gratis ke Render.com (disarankan untuk acara)
1. Upload folder ini ke repo GitHub.
2. Render → New → Web Service → pilih repo.
3. Build Command: `npm install`  |  Start Command: `npm start`
4. Environment Variable: `HOST_KEY` = kunci rahasia kamu.
5. Setelah jadi, host buka `https://NAMA-APP.onrender.com/host`, masukkan kunci, klik Buat Room Baru.
Railway, Fly.io, atau VPS apa pun yang bisa menjalankan Node.js 18+ juga bisa.

Catatan: data room disimpan di memori server. Kalau server restart, game hilang.
Paket gratis Render "tidur" saat sepi; buka halaman 1 menit sebelum acara agar bangun.
