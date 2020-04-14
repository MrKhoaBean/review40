-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2020 at 09:58 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `kiemtien40`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint(20) NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `permission` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'member',
  `money` int(11) NOT NULL DEFAULT '0',
  `madonhang` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `verify` tinyint(1) NOT NULL DEFAULT '0',
  `confirm_email` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `cmt` text COLLATE utf8_unicode_ci NOT NULL,
  `video` text COLLATE utf8_unicode_ci NOT NULL,
  `invited` text COLLATE utf8_unicode_ci NOT NULL,
  `money_average` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `name`, `username`, `password`, `email`, `permission`, `money`, `madonhang`, `verify`, `confirm_email`, `cmt`, `video`, `invited`, `money_average`) VALUES
(40, 'hoa 1', 'asdaaa2222232323', '5d793fc5b00a2348c3fb9ab59e5ca98a', 'visualpa2323scalc@gmail.com', 'member', 0, '1', 0, '', '[]', '', '', ''),
(45, 'hoa 2', 'test', '5d793fc5b00a2348c3fb9ab59e5ca98a', 'dvisualpa2323scalc@gmail.com', 'member', 0, '2', 1, '', '[]', '', '', ''),
(47, 'khoa đậu', 'Khoa Bean', 'b26986ceee60f744534aaab928cc12df', 'dauvanhuyhoang@yahoo.com', 'member', 0, '4', 0, '', '[]', '', '', ''),
(50, 'hoa 5', 'ccáđasadsd', '3702c7c5b8cb893c27717e13431c02ac', 'bi@2', 'member', 0, '6', 0, '', '[]', '', '', ''),
(51, 'hoa 6', 'binhle', '4350c5076959a0896d2b7eb3853d30f6', 'pass.hatest@gmail.com', 'member', 0, '7', 0, '', '[]', '', '', ''),
(52, 'hoa 7', 'khoadau', '13ed00b0a838f0d8e75b4b105c9377ff', 'cc@d', 'member', 10024, '8', 1, '', '["https://www.fshare.vn/file/N5HQYCH5Y5L8?token=1579884241","https://www.fshare.vn/file/N5HQYCH5Y5L8?token=15798842341"]', '["http://google.com"]', '["testaccount"]', ''),
(54, 'wqwqwqewqqwas', 'aassaasd', '', '', 'admin', 0, '9', 0, '', '[]', '', '', ''),
(66, 'khoa ko mlem vip ', 'khoabean', 'b4390fc7f6811d9dea87087b83b842c8', 'visualasd@gasdasdasdsad', 'admin', 0, '', 1, '', '[]', '', '', ''),
(70, 'admin thứ 2 để test', 'idk', 'qweqweqwe', 'visualasd@gasdqweqwe', 'admin', 0, 'weqw', 0, '', '[]', '', '', ''),
(71, 'Trong Nhan BRVT', 'testaccount', '0efffc51d5e228e69bec75545457b977', 'dauvanhuyh2oang@yahoo.com', 'member', 0, '2edc8100-7d50-11ea-99e7-b5901648c1e5', 1, '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `username` varchar(33) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(33) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duyetcmt`
--

CREATE TABLE IF NOT EXISTS `duyetcmt` (
  `id` bigint(20) NOT NULL,
  `url` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `bonus` int(11) NOT NULL,
  `noidung` text COLLATE utf8_unicode_ci NOT NULL,
  `verify` tinyint(4) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `duyetcmt`
--

INSERT INTO `duyetcmt` (`id`, `url`, `username`, `bonus`, `noidung`, `verify`) VALUES
(1, 'http://localhost/phpmyadmin/tbl_structure.php?db=kiemtien40&table=linkcmt', 'khoadau', 10000, 'awdasdasdasd', 1),
(2, 'http://localhost:7777/checkcmt/', 'khoadau', 123123, '1231233\r\n123\r\n1231\r\n2sad', 0),
(25, 'https://www.fshare.vn/file/N5HQYCH5Y5L8?token=1579884234', 'khoadau', 10000, 'qweqwe', 1),
(30, 'https://www.fshare.vn/file/N5HQYCH5Y5L8?token=15798842342', 'khoadau', 12, 'ẳ', 1),
(32, 'https://www.fshare.vn/file/N5HQYCH5Y5L8?token=157988423455', 'khoadau', 12, 'ẳ', 1),
(33, 'http://google.com2w21312', 'khoadau', 10000, 'qweqwe', 1);

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE IF NOT EXISTS `features` (
  `membersByMonth` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`membersByMonth`) VALUES
('[0,0,0,9,0,0,0,0,0,0,0,0]');

-- --------------------------------------------------------

--
-- Table structure for table `giaodich`
--

CREATE TABLE IF NOT EXISTS `giaodich` (
  `id` int(11) NOT NULL,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `thongtin` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `verify` tinyint(4) NOT NULL DEFAULT '-1',
  `thongdiep` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `giaodich`
--

INSERT INTO `giaodich` (`id`, `username`, `thongtin`, `amount`, `verify`, `thongdiep`, `time`) VALUES
(1, 'khoadau', '3e,12 3,12312 dong nai, bien hoa', 10000, 1, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 10:01:45'),
(2, 'khoadau', 'khoa khoa khoa khoa khoa khoa kh', 100, 0, 'thiếu thông tin chuyển khoản', '2020-04-14 16:06:28'),
(3, 'khoadau', 'qweqweqweqweqweqwe', 52, 1, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 16:32:39'),
(4, 'khoadau', 'qweqweqweqweqweqwe', 10000, 1, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 16:34:21'),
(5, 'khoadau', 'qweqweqweqweqweqwe', 10000, 1, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 16:35:39'),
(6, 'khoadau', 'asdasdasdasdasdasdasdasdasdasdas', 10000, 0, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 17:10:04'),
(7, 'khoadau', 'asdasdasdasdasdasdasdasdasdasdas', 20000, 0, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 17:10:16'),
(8, 'khoadau', 'asdasdasdasdasdasdasdasdasdasdas', 20000, 0, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 17:10:20'),
(9, 'khoadau', 'asdasdasdasdasdasdasdasdasdasdas', 20000, 0, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-14 17:10:23'),
(10, 'khoadau', 'qweqweqweqweqweqwe', 20000, 1, 'Cảm ơn bạn đã tin dùng sản phẩm của chúng tôi!', '2020-04-15 02:15:58'),
(11, 'khoadau', 'qweqweqweqweqweqwe', 12, 0, 'Quá ít', '2020-04-15 02:16:39'),
(12, 'khoadau', 'qweqweqweqweqweqwe', 10024, 0, 'Xin lỗi, thông tin chuyển khoản không hợp lệ!', '2020-04-15 02:21:17');

-- --------------------------------------------------------

--
-- Table structure for table `linkcmt`
--

CREATE TABLE IF NOT EXISTS `linkcmt` (
  `id` bigint(20) NOT NULL,
  `url` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `noidung` text COLLATE utf8_unicode_ci NOT NULL,
  `bonus` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `linkcmt`
--

INSERT INTO `linkcmt` (`id`, `url`, `noidung`, `bonus`) VALUES
(3, 'https://www.fshare.vn/file/N5HQYCH5Y5L8?token=1579884241', '["ể","ẳ","3"]', 12),
(5, 'https://www.fshare.vn/file/N5HQYCH5Y5L8?token=15798842341', '["qweqwe","s"]', 10000);

-- --------------------------------------------------------

--
-- Table structure for table `linkvideo`
--

CREATE TABLE IF NOT EXISTS `linkvideo` (
  `id` bigint(20) NOT NULL,
  `url` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `minutes` int(11) NOT NULL DEFAULT '1',
  `bonus` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `linkvideo`
--

INSERT INTO `linkvideo` (`id`, `url`, `minutes`, `bonus`) VALUES
(8, 'http://google.com', 1, 10000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`), ADD UNIQUE KEY `email` (`email`), ADD UNIQUE KEY `madonhang` (`madonhang`);

--
-- Indexes for table `duyetcmt`
--
ALTER TABLE `duyetcmt`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `url` (`url`);

--
-- Indexes for table `giaodich`
--
ALTER TABLE `giaodich`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `linkcmt`
--
ALTER TABLE `linkcmt`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `url` (`url`);

--
-- Indexes for table `linkvideo`
--
ALTER TABLE `linkvideo`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `url` (`url`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=72;
--
-- AUTO_INCREMENT for table `duyetcmt`
--
ALTER TABLE `duyetcmt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `giaodich`
--
ALTER TABLE `giaodich`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `linkcmt`
--
ALTER TABLE `linkcmt`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `linkvideo`
--
ALTER TABLE `linkvideo`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
