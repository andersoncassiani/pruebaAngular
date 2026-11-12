-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 12-11-2026 a las 16:14:24
-- Versión del servidor: 5.7.33
-- Versión de PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reportemos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

CREATE TABLE `reportes` (
  `id` varchar(36) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `reportes`
--

INSERT INTO `reportes` (`id`, `titulo`, `descripcion`, `direccion`, `foto`, `estado`, `creado_en`, `usuario_id`) VALUES
('87062ba8-e969-4fa9-9ee6-2ffa5a3a11d4', 'Barrio Libano Cra. 49A ', 'El residuo se encuentra en toda la avenida principal en la Pedro Romero.', 'Calle 36', '/uploads/reportes/abeb17ef-6321-464e-b9c7-bb7972ba262c.png', 'pendiente', '2026-11-12 10:38:11', 'b9698fe2-7f40-49b8-8d3d-ffaef8d6bc36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` varchar(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `creado_en` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `clave`, `rol`, `activo`, `creado_en`) VALUES
('5a0e7bb9-0cee-43b1-9a21-f09e7faf467d', 'admin-app', 'admin@admin.com', '$2b$12$ZrUUjGl7LPl6Ipqd0DxGAub6Hq79hi6CZI8V16u6sWlBPu2FnCH76', 'admin', 1, '2026-11-11 21:07:57'),
('b9698fe2-7f40-49b8-8d3d-ffaef8d6bc36', 'Anderson Cassiani', 'anderson@gmail.com', '$2b$12$cNkM5qASyuOB71Gfr1PJk.2OtsZ/14rbICHbIoaE8ldCFCRedWA0m', 'usuario', 1, '2026-11-11 21:10:21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_usuarios_correo` (`correo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
