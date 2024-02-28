-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2024 a las 13:11:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `num_inventario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_compra` date NOT NULL,
  `fabricante` varchar(255) NOT NULL,
  `fecha_ultima_calibracion` date NOT NULL,
  `fecha_proxima_calibracion` date NOT NULL,
  `fecha_ultimo_mantenimiento` date NOT NULL,
  `fecha_proximo_mantenimiento` date NOT NULL,
  `imagen` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `num_inventario`, `nombre`, `fecha_compra`, `fabricante`, `fecha_ultima_calibracion`, `fecha_proxima_calibracion`, `fecha_ultimo_mantenimiento`, `fecha_proximo_mantenimiento`, `imagen`) VALUES
(1, 123456, 'Equipo1', '2023-01-01', 'Fabricante1', '2023-01-01', '2024-01-01', '2022-10-01', '2024-01-01', NULL),
(2, 789012, 'Equipo2', '2023-02-01', 'Fabricante2', '2023-02-01', '2024-02-01', '2022-11-01', '2024-02-01', NULL),
(3, 798124, 'Equipo3', '2024-02-13', 'HP', '2024-02-06', '2024-11-30', '2022-12-01', '2024-03-01', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_fungibles`
--

CREATE TABLE `equipos_fungibles` (
  `equipo_id` int(11) NOT NULL,
  `fungible_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos_fungibles`
--

INSERT INTO `equipos_fungibles` (`equipo_id`, `fungible_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(3, 1),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_herramientas`
--

CREATE TABLE `equipos_herramientas` (
  `equipo_id` int(11) NOT NULL,
  `herramienta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos_herramientas`
--

INSERT INTO `equipos_herramientas` (`equipo_id`, `herramienta_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fungibles`
--

CREATE TABLE `fungibles` (
  `id` int(11) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `tamanyo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `imagen` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fungibles`
--

INSERT INTO `fungibles` (`id`, `marca`, `modelo`, `tamanyo`, `cantidad`, `imagen`) VALUES
(1, 'Marca1', 'Modelo1', 'Tamano1', 25, NULL),
(2, 'Marca2', 'Modelo2', 'Tamano2', 8, NULL),
(3, 'Marca3', 'Modelo3', 'Tamano3', 4, NULL),
(4, 'Prueba', 'Prueba', '250x250', 3, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fungibles_herramientas`
--

CREATE TABLE `fungibles_herramientas` (
  `fungible_id` int(11) NOT NULL,
  `herramienta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fungibles_herramientas`
--

INSERT INTO `fungibles_herramientas` (`fungible_id`, `herramienta_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 2),
(4, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientas`
--

CREATE TABLE `herramientas` (
  `id` int(11) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `fabricante` varchar(255) NOT NULL,
  `fecha_compra` date NOT NULL,
  `imagen` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `herramientas`
--

INSERT INTO `herramientas` (`id`, `marca`, `modelo`, `fabricante`, `fecha_compra`, `imagen`) VALUES
(1, 'Marca1', 'Modelo1', 'Fabricante1', '2023-01-01', NULL),
(2, 'Marca2', 'Modelo2', 'Fabricante2', '2023-02-01', NULL),
(3, 'Marca3', 'Modelo3', 'Fabricante3', '2023-03-01', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `cod_rol` int(11) NOT NULL,
  `rol` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`cod_rol`, `rol`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario`, `contrasenia`, `rol`) VALUES
('admin', 'admin', 1),
('usuario', 'usuario', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_identificacion` (`num_inventario`);

--
-- Indices de la tabla `equipos_fungibles`
--
ALTER TABLE `equipos_fungibles`
  ADD PRIMARY KEY (`equipo_id`,`fungible_id`),
  ADD KEY `fk_equipo_id` (`equipo_id`),
  ADD KEY `fk_fungible_id` (`fungible_id`);

--
-- Indices de la tabla `equipos_herramientas`
--
ALTER TABLE `equipos_herramientas`
  ADD PRIMARY KEY (`equipo_id`,`herramienta_id`),
  ADD KEY `fk_equipo_id` (`equipo_id`),
  ADD KEY `fk_herramienta_id` (`herramienta_id`) USING BTREE;

--
-- Indices de la tabla `fungibles`
--
ALTER TABLE `fungibles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `fungibles_herramientas`
--
ALTER TABLE `fungibles_herramientas`
  ADD PRIMARY KEY (`fungible_id`,`herramienta_id`),
  ADD KEY `fk_fungible_id` (`fungible_id`),
  ADD KEY `fungibles_herramientas_ibfk_2` (`herramienta_id`);

--
-- Indices de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`cod_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario`),
  ADD KEY `fk_rol` (`rol`) USING BTREE;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `fungibles`
--
ALTER TABLE `fungibles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipos_fungibles`
--
ALTER TABLE `equipos_fungibles`
  ADD CONSTRAINT `equipos_fungibles_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipos_fungibles_ibfk_2` FOREIGN KEY (`fungible_id`) REFERENCES `fungibles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipos_herramientas`
--
ALTER TABLE `equipos_herramientas`
  ADD CONSTRAINT `equipos_herramientas_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equipos_herramientas_ibfk_2` FOREIGN KEY (`herramienta_id`) REFERENCES `herramientas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `fungibles_herramientas`
--
ALTER TABLE `fungibles_herramientas`
  ADD CONSTRAINT `fungibles_herramientas_ibfk_1` FOREIGN KEY (`fungible_id`) REFERENCES `fungibles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fungibles_herramientas_ibfk_2` FOREIGN KEY (`herramienta_id`) REFERENCES `herramientas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`cod_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
