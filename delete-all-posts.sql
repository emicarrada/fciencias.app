-- Script para eliminar todas las publicaciones de la base de datos
-- Ejecutar este script cuando tengas acceso a la base de datos

-- Eliminar todas las publicaciones
DELETE FROM "posts";

-- Opcional: Resetear el contador de secuencia si lo hubiera
-- (En este caso usamos UUID, así que no es necesario)

-- Verificar que se eliminaron todos los posts
SELECT COUNT(*) as total_posts FROM "posts";
