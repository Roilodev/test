import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as never);

const products = [
  // Sofás
  {
    name: "Sofá Esquinero Oslo",
    slug: "sofa-esquinero-oslo",
    description: "Sofá esquinero de tela de alta resistencia con relleno de espuma de alta densidad. Perfecto para espacios amplios. Disponible en gris y beige.",
    price: 1299.99,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format",
    category: "Sofás",
    stock: 8,
    featured: true,
  },
  {
    name: "Sofá de 3 Cuerpos Milano",
    slug: "sofa-3-cuerpos-milano",
    description: "Sofá clásico de 3 asientos con estructura de madera maciza y tapizado en cuero sintético. Elegante y duradero.",
    price: 849.99,
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format",
    category: "Sofás",
    stock: 12,
    featured: true,
  },
  {
    name: "Sofá Cama Convertible Nova",
    slug: "sofa-cama-convertible-nova",
    description: "Sofá que se convierte en cama de 2 plazas en segundos. Ideal para estudios y habitaciones de huéspedes.",
    price: 699.99,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format",
    category: "Sofás",
    stock: 5,
    featured: false,
  },
  // Camas
  {
    name: "Cama King Poseidón",
    slug: "cama-king-poseidon",
    description: "Cama king size con cabecera tapizada y estructura de madera de pino. Incluye cajones integrados para almacenamiento extra.",
    price: 1549.99,
    imageUrl: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&auto=format",
    category: "Camas",
    stock: 4,
    featured: true,
  },
  {
    name: "Cama Matrimonial Zen",
    slug: "cama-matrimonial-zen",
    description: "Diseño minimalista japonés en madera de roble. Base de plataforma baja con acabado natural mate.",
    price: 899.99,
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format",
    category: "Camas",
    stock: 6,
    featured: false,
  },
  {
    name: "Camarote Infantil Adventure",
    slug: "camarote-infantil-adventure",
    description: "Camarote de madera sólida con escalera y barandas de seguridad. Incluye cajones y espacio de juego.",
    price: 749.99,
    imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format",
    category: "Camas",
    stock: 3,
    featured: false,
  },
  // Mesas
  {
    name: "Mesa de Comedor Roble Rústico",
    slug: "mesa-comedor-roble-rustico",
    description: "Mesa de comedor para 6 personas en madera de roble maciza con acabado rústico envejecido. Medidas: 180x90cm.",
    price: 1149.99,
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&auto=format",
    category: "Mesas",
    stock: 7,
    featured: true,
  },
  {
    name: "Mesa de Centro Float",
    slug: "mesa-centro-float",
    description: "Mesa de centro con tapa de vidrio templado y estructura de acero inoxidable. Diseño contemporáneo.",
    price: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&auto=format",
    category: "Mesas",
    stock: 15,
    featured: false,
  },
  {
    name: "Mesa Extensible Nordic",
    slug: "mesa-extensible-nordic",
    description: "Mesa extensible de 120 a 200cm. Diseño escandinavo en madera lacada blanca. Perfecta para familias.",
    price: 789.99,
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format",
    category: "Mesas",
    stock: 9,
    featured: false,
  },
  // Sillas
  {
    name: "Silla Comedor Set x4",
    slug: "silla-comedor-set-x4",
    description: "Set de 4 sillas de comedor con asiento acolchado en tela y patas de madera maciza. Disponibles en negro y blanco.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1561677843-39dee7a319ca?w=800&auto=format",
    category: "Sillas",
    stock: 20,
    featured: false,
  },
  {
    name: "Sillón Lectura Comfort Plus",
    slug: "sillon-lectura-comfort-plus",
    description: "Sillón individual de alto confort con apoyabrazos acolchados y estructura giratoria. Ideal para lectura.",
    price: 459.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format",
    category: "Sillas",
    stock: 10,
    featured: true,
  },
  {
    name: "Silla de Oficina Ergonómica Pro",
    slug: "silla-oficina-ergonomica-pro",
    description: "Silla ergonómica con soporte lumbar ajustable, reposacabezas y apoyabrazos 3D. Certificación ergonómica.",
    price: 549.99,
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format",
    category: "Sillas",
    stock: 14,
    featured: false,
  },
  // Almacenamiento
  {
    name: "Biblioteca Modular Scandic",
    slug: "biblioteca-modular-scandic",
    description: "Sistema de estantes modular de madera de pino blanca. 5 niveles de altura regulable. Capacidad 80kg.",
    price: 399.99,
    imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&auto=format",
    category: "Almacenamiento",
    stock: 11,
    featured: false,
  },
  {
    name: "Cómoda de 6 Cajones Elegance",
    slug: "comoda-6-cajones-elegance",
    description: "Cómoda de dormitorio con 6 cajones de madera MDF lacada en blanco mate. Tiradores nórdicos.",
    price: 479.99,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format",
    category: "Almacenamiento",
    stock: 8,
    featured: false,
  },
  // Escritorios
  {
    name: "Escritorio Home Office Slim",
    slug: "escritorio-home-office-slim",
    description: "Escritorio compacto con gestión de cables integrada y superficie anti-rasguño. Ideal para trabajo en casa.",
    price: 329.99,
    imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format",
    category: "Escritorios",
    stock: 16,
    featured: false,
  },
  {
    name: "Escritorio con Estantería Brooklyn",
    slug: "escritorio-estanteria-brooklyn",
    description: "Escritorio industrial con estantería superior de madera y acero. Estilo loft urbano. 140x60cm.",
    price: 589.99,
    imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&auto=format",
    category: "Escritorios",
    stock: 7,
    featured: true,
  },
];

async function main() {
  console.log("Seeding database...");
  await (prisma as any).product.deleteMany();
  for (const product of products) {
    await (prisma as any).product.create({ data: product });
  }
  console.log(`Created ${products.length} products`);
}

main()
  .catch(console.error)
  .finally(() => (prisma as any).$disconnect());
