import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const defaultPasswordHash = hashPassword("password123");

const SHOPS = [
  {
    id: "shop_aurora_01",
    name: "Naurattan Heritage Jewelers",
    slug: "naurattan-jewelers",
    description: "Specializing in 22K gold bridal jewellery, certified diamond solitaires, and royal handcrafted polki sets in Lahore.",
    logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_naurattan_connect_991",
    vendorEmail: "tariq@naurattanjewelers.com",
    vendorName: "Tariq Mehmood",
  },
  {
    id: "shop_valerio_02",
    name: "Zaveri Fine Diamonds",
    slug: "zaveri-diamonds",
    description: "Master goldsmiths crafting 21K & 22K pure gold bangles, precious emerald choker sets, and contemporary bridal rings.",
    logoUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_zaveri_connect_772",
    vendorEmail: "kamran@zaveridiamonds.com",
    vendorName: "Kamran Zaveri",
  },
  {
    id: "shop_celestial_03",
    name: "Kohinoor Gold Studio",
    slug: "kohinoor-jewelers",
    description: "Certified solitaire diamond engagement rings, platinum bridal bands, and pure 24K gold investment chains.",
    logoUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_kohinoor_connect_331",
    vendorEmail: "shahmir@kohinoorgold.pk",
    vendorName: "Shahmir Khan",
  },
  {
    id: "shop_solitaire_04",
    name: "Deewan Bridal Atelier",
    slug: "deewan-bridal",
    description: "Traditional handcrafted 22K gold bridal sets, kangan pairs, and antique royal haar sets for Pakistani weddings.",
    logoUrl: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
    status: "PENDING_VERIFICATION",
    stripeAccountId: null,
    vendorEmail: "bilal@deewanbridal.com",
    vendorName: "Bilal Deewan",
  },
];

const PRODUCTS = [
  {
    id: "prod_01",
    title: "Royal Solitaire 2.5ct Diamond Engagement Ring",
    slug: "royal-solitaire-diamond-engagement-ring",
    description: "A stunning 2.50 carat Brilliant Cut Certified Diamond set on a tapered 18K White Gold band with hidden halo detailing.",
    price: 485000,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Rings",
    metalType: "White Gold",
    metalPurity: "18K",
    gemstoneType: "Diamond",
    caratWeight: 2.5,
    certifiedBy: "GIA",
    shopId: "shop_aurora_01",
  },
  {
    id: "prod_02",
    title: "Heritage 22K Gold Bridal Choker & Emerald Haar Set",
    slug: "heritage-22k-gold-bridal-choker-set",
    description: "Handcrafted 22K yellow gold bridal choker set embellished with natural emerald droplets and lustrous seed pearls.",
    price: 720000,
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Necklaces",
    metalType: "Gold",
    metalPurity: "22K",
    gemstoneType: "Emerald",
    caratWeight: 5.8,
    certifiedBy: "IGI",
    shopId: "shop_valerio_02",
  },
  {
    id: "prod_03",
    title: "Classic 21K Solid Gold Filigree Bangles (Pair)",
    slug: "classic-21k-gold-filigree-bangles-pair",
    description: "Pair of solid 21K yellow gold bangles with intricate laser-cut filigree work, screw clasp closure, and high-shine finish.",
    price: 360000,
    stock: 4,
    images: [
      "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Bracelets",
    metalType: "Gold",
    metalPurity: "21K",
    gemstoneType: "None",
    caratWeight: null,
    certifiedBy: "Certified 21K",
    shopId: "shop_celestial_03",
  },
  {
    id: "prod_04",
    title: "Royal Sapphire & Diamond Drop Jhumkas in 22K Gold",
    slug: "royal-sapphire-diamond-drop-jhumkas",
    description: "Traditional cascading bell jhumkas crafted in 22K yellow gold with unheated royal blue sapphires and brilliant diamond accents.",
    price: 215000,
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Earrings",
    metalType: "Gold",
    metalPurity: "22K",
    gemstoneType: "Sapphire",
    caratWeight: 3.5,
    certifiedBy: "GIA",
    shopId: "shop_aurora_01",
  },
  {
    id: "prod_05",
    title: "South Sea Pearl & Diamond Mala Pendant in 22K Gold",
    slug: "south-sea-pearl-diamond-mala-pendant",
    description: "Flawless natural Golden South Sea cultured pearl set in 22K solid yellow gold with delicate diamond floral motifs.",
    price: 185000,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Necklaces",
    metalType: "Gold",
    metalPurity: "22K",
    gemstoneType: "Pearl",
    caratWeight: 1.2,
    certifiedBy: "GIA",
    shopId: "shop_valerio_02",
  },
  {
    id: "prod_06",
    title: "24K Solid Gold Heavy Link Chain (5 Tola)",
    slug: "24k-solid-gold-heavy-link-chain-5-tola",
    description: "Substantial 58.3-gram (5 Tola) investment-grade 24K pure bullion gold chain with high-polish finish and traditional S-hook clasp.",
    price: 890000,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Necklaces",
    metalType: "Gold",
    metalPurity: "24K",
    gemstoneType: "None",
    caratWeight: null,
    certifiedBy: "24K Purity Tested",
    shopId: "shop_valerio_02",
  },
];

async function main() {
  console.log("Ingesting initial real data into Neon PostgreSQL...");

  for (const s of SHOPS) {
    // 1. Ingest Vendor User
    const user = await prisma.user.upsert({
      where: { email: s.vendorEmail },
      update: { name: s.vendorName, role: "VENDOR", passwordHash: defaultPasswordHash },
      create: {
        name: s.vendorName,
        email: s.vendorEmail,
        role: "VENDOR",
        passwordHash: defaultPasswordHash,
      },
    });

    // 2. Ingest Boutique Shop
    await prisma.shop.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        logoUrl: s.logoUrl,
        bannerUrl: s.bannerUrl,
        status: s.status,
        stripeAccountId: s.stripeAccountId,
        ownerId: user.id,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        logoUrl: s.logoUrl,
        bannerUrl: s.bannerUrl,
        status: s.status,
        stripeAccountId: s.stripeAccountId,
        ownerId: user.id,
      },
    });

    console.log(`Ingested Shop: ${s.name} (Owner: ${s.vendorName})`);
  }

  // Ingest Admin User
  await prisma.user.upsert({
    where: { email: "admin@eternelle.com" },
    update: { name: "Hamza Malik", role: "ADMIN", passwordHash: defaultPasswordHash },
    create: {
      name: "Hamza Malik",
      email: "admin@eternelle.com",
      role: "ADMIN",
      passwordHash: defaultPasswordHash,
    },
  });
  console.log("Ingested Admin: Hamza Malik (admin@eternelle.com)");

  // Ingest Buyer User
  await prisma.user.upsert({
    where: { email: "buyer@eternelle.com" },
    update: { name: "Ayla Zahra", role: "BUYER", passwordHash: defaultPasswordHash },
    create: {
      name: "Ayla Zahra",
      email: "buyer@eternelle.com",
      role: "BUYER",
      passwordHash: defaultPasswordHash,
    },
  });
  console.log("Ingested Buyer: Ayla Zahra (buyer@eternelle.com)");

  // 3. Ingest Jewelry Products
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: p.images,
        category: p.category,
        metalType: p.metalType,
        metalPurity: p.metalPurity,
        gemstoneType: p.gemstoneType,
        caratWeight: p.caratWeight,
        certifiedBy: p.certifiedBy,
        shopId: p.shopId,
      },
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: p.images,
        category: p.category,
        metalType: p.metalType,
        metalPurity: p.metalPurity,
        gemstoneType: p.gemstoneType,
        caratWeight: p.caratWeight,
        certifiedBy: p.certifiedBy,
        shopId: p.shopId,
      },
    });
    console.log(`Ingested Product: ${p.title} (Rs. ${p.price.toLocaleString()})`);
  }

  console.log("Data ingestion completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
