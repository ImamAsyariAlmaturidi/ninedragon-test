// lib/sequelize.js
import { Sequelize } from "sequelize";
import config from "../config/config"; // Mengimpor konfigurasi dari config.json

// Inisialisasi koneksi Sequelize dengan menggunakan konfigurasi
const sequelize = new Sequelize(
  config.development.database, // Nama database
  config.development.username, // Username
  config.development.password, // Password
  config.development // Konfigurasi lainnya
);

// Mengekspor sequelize agar bisa digunakan di file lain
export { sequelize };
