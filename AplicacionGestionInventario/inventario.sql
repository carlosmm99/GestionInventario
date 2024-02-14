-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-02-2024 a las 14:55:41
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
  `num_identificacion` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_compra` date NOT NULL,
  `fabricante` varchar(255) NOT NULL,
  `fecha_ultima_calibracion` date NOT NULL,
  `fecha_proxima_calibracion` date NOT NULL,
  `fecha_ultimo_mantenimiento` date NOT NULL,
  `fecha_proximo_mantenimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `num_identificacion`, `nombre`, `fecha_compra`, `fabricante`, `fecha_ultima_calibracion`, `fecha_proxima_calibracion`, `fecha_ultimo_mantenimiento`, `fecha_proximo_mantenimiento`) VALUES
(1, 123456, 'Equipo1', '2023-01-01', 'Fabricante1', '2023-01-01', '2024-01-01', '2022-10-01', '2024-01-01'),
(2, 789012, 'Equipo2', '2023-02-01', 'Fabricante2', '2023-02-01', '2024-02-01', '2022-11-01', '2024-02-01'),
(3, 798124, 'Equipo3', '2024-02-13', 'HP', '2024-02-06', '2024-11-30', '2022-12-01', '2024-03-01');

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
(2, 1),
(2, 2),
(2, 3),
(3, 1);

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
(3, 1)

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fungibles`
--

CREATE TABLE `fungibles` (
  `id` int(11) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `tamanyo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fungibles`
--

INSERT INTO `fungibles` (`id`, `marca`, `modelo`, `tamanyo`, `cantidad`) VALUES
(1, 'Marca1', 'Modelo1', 'Tamano1', 10),
(2, 'Marca2', 'Modelo2', 'Tamano2', 20),
(3, 'Marca3', 'Modelo3', 'Tamano3', 30);

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
(1, 2),
(1, 3)
(2, 2),
(2, 3),
(3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientas`
--

CREATE TABLE `herramientas` (
  `id` int(11) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `fabricante` varchar(255) NOT NULL,
  `fecha_compra` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `herramientas`
--

INSERT INTO `herramientas` (`id`, `marca`, `modelo`, `fabricante`, `fecha_compra`) VALUES
(1, 'Marca1', 'Modelo1', 'Fabricante1', '2023-01-01'),
(2, 'Marca2', 'Modelo2', 'Fabricante2', '2023-02-01'),
(3, 'Marca3', 'Modelo3', 'Fabricante3', '2023-03-01');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `num_identificacion` (`num_identificacion`);

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `fungibles`
--
ALTER TABLE `fungibles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
