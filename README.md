# GFAC Service User

## Preparing

Pastikan database postgres dan node.js runtime telah terinstall di komputer kamu. Buat terlebih dahulu database yang akan digunakan.

Kemudian clone repository ini, lalu install terlebih dahulu dependency nya:

```
yarn install
```

## Setup Configuration

Copy dan paste file ./config/.env.sample ke file konfigurasi baru di ./config/.env.development
Ubah variabel **PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE** sesuai dengan konfigurasi postgres di komputer kamu

## Running

Untuk menjalankan service program ketik di terminal:

```
yarn start
```

## Deployment

### Build

Untuk melakukan build ketik di terminal:

```
yarn build
```

akan muncul folder dist dan directory ini yang nanti akan digunakan nanti di production

### Production

Pada tahap deployment untuk pertama kali, perlu mengenerate file package.json dan pm2.config.js (jika nanti menggunakan pm2) pada directory ./dist, untuk itu jalankan:

```
yarn prod
```

Maka akan muncul file package.json beserta dengan pm2.config.js, kemudian ubah konfigurasi pm2.config.json sesuai dengan konfigurasi disisi server production. Pastikan semua dependency postgres dan node.js runtime sudah terinstall di server.

### Install PM2

Untuk menginstall pm2:

```
yarn add -g pm2
```

### Run Instance

Atur terlebih dahulu konfigurasi pada file ./pm2.config.js. Kemudian untuk menjalankan instance ketik:

```
pm2 start ./pm2.config.json
```
