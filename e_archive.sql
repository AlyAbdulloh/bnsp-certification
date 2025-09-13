-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 13 Sep 2025 pada 13.43
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_archive`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `document_number` varchar(255) DEFAULT NULL,
  `doc_category_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `documents`
--

INSERT INTO `documents` (`id`, `document_number`, `doc_category_id`, `title`, `file_path`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(11, 'gasdgiwyrasfaaa', 4, 'Pengumuman Besok Libur', '/documents/1757750927257-pernyataan.pdf', '2025-09-13 15:02:03', '2025-09-13 15:08:59', '2141720039', '2141720039'),
(12, 'ertyuivbnmvbnm', 5, 'Surat Nota Dinas', '/documents/1757762616379-Prosedur_Sidang_Akhir_Skripsi_2025-Rev1.1__1_.pdf', '2025-09-13 18:23:36', '2025-09-13 18:23:36', '2141720039', '2141720039');

-- --------------------------------------------------------

--
-- Struktur dari tabel `doc_categories`
--

CREATE TABLE `doc_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `doc_categories`
--

INSERT INTO `doc_categories` (`id`, `name`, `description`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(3, 'Undangan', '-', '2025-09-07 12:27:45', '2025-09-07 12:27:45', 'DB', 'DB'),
(4, 'Pengumuman', '-', '2025-09-07 12:28:01', '2025-09-07 12:28:01', 'DB', 'DB'),
(5, 'Nota Dinas', '-', '2025-09-07 12:28:11', '2025-09-07 12:28:11', 'DB', 'DB'),
(6, 'Pemberitahuan', '-', '2025-09-07 12:28:19', '2025-09-10 09:53:22', 'DB', 'DB');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `nim` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `fullname`, `nim`, `password`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Achmad Aly Abdulloh', '2141720039', 'f23c19eb8934867d86f0d0d63a9d801a', NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_documents_category` (`doc_category_id`);

--
-- Indeks untuk tabel `doc_categories`
--
ALTER TABLE `doc_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `doc_categories`
--
ALTER TABLE `doc_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_documents_category` FOREIGN KEY (`doc_category_id`) REFERENCES `doc_categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
