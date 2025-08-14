# Automasi End-to-End OrangeHRM dengan Playwright & TypeScript

Repositori ini berisi serangkaian *test script* otomasi *end-to-end* untuk aplikasi **OrangeHRM Demo**, yang dibangun menggunakan framework [Playwright](https://playwright.dev/) dan bahasa [TypeScript](https://www.typescriptlang.org/).

## ✨ Fitur Utama

* **Framework Modern**: Dibangun di atas Playwright untuk pengujian yang cepat, andal, dan *cross-browser*.
* **Type Safety**: Menggunakan TypeScript untuk kode yang lebih bersih, mudah dipelihara, dan mengurangi *runtime error*.
* **Page Object Model (POM)**: Mengimplementasikan *design pattern* POM untuk memisahkan logika *test script* dari *UI locators*, sehingga lebih mudah dikelola.
* **Reporting**: Menghasilkan laporan HTML yang detail setelah eksekusi tes selesai untuk memudahkan analisis.

## 🛠️ Teknologi yang Digunakan

* **Framework & Test Runner**: [Playwright](https://playwright.dev/)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Panduan Memulai

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut.

### Prasyarat

* [Node.js](https://nodejs.org/) (versi 18 atau lebih baru direkomendasikan).
* NPM atau Yarn.

### 1. Kloning Repositori

```bash
git clone [https://github.com/alandrmasaputra/Automation_OrangeHRM_TypeScript.git](https://github.com/alandrmasaputra/Automation_OrangeHRM_TypeScript.git)
cd Automation_OrangeHRM_TypeScript
```

### 2. Instalasi Dependensi

Proyek ini menggunakan pnpm sebagai package manager. Jika Anda belum memilikinya, instal terlebih dahulu:

```bash
npm install -g pnpm
```

Kemudian, instal semua dependensi proyek:

```bash
pnpm install
```

### 3. Instalasi Browser Playwright

Playwright membutuhkan browser khusus untuk berjalan. Instal dengan perintah berikut:

```bash
npx playwright install
```

## 🧪 Menjalankan Tes

Anda bisa menjalankan tes dengan beberapa cara berbeda sesuai kebutuhan.

### Menjalankan Semua Tes (Headless Mode)

```bash
npx playwright test
```






