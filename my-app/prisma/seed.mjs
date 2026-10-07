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
    name: "Aurora Haute Gems",
    slug: "aurora-gems",
    description: "Specializing in conflict-free high-carat diamonds, bespoke bridal settings, and rare royal sapphires crafted in Geneva.",
    logoUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_aurora_connect_991",
    vendorEmail: "elena@aurorafine.com",
    vendorName: "Elena Rostova",
  },
  {
    id: "shop_valerio_02",
    name: "Valerio Milano",
    slug: "valerio-milano",
    description: "Master Italian goldsmiths blending 18K recycled yellow gold with Colombian emeralds and geometric art deco heritage.",
    logoUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_valerio_connect_772",
    vendorEmail: "marco@valeriomilano.it",
    vendorName: "Marco Valerio",
  },
  {
    id: "shop_celestial_03",
    name: "Celestial Carats",
    slug: "celestial-carats",
    description: "Ethically lab-grown diamonds of extraordinary color and VS1+ clarity set in recycled 950 Platinum.",
    logoUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1600&q=80",
    status: "ACTIVE",
    stripeAccountId: "acct_celestial_connect_331",
    vendorEmail: "sarah@celestialcarats.be",
    vendorName: "Sarah De Smet",
  },
  {
    id: "shop_solitaire_04",
    name: "Solitaire Guild",
    slug: "solitaire-guild",
    description: "Bespoke signet rings and handcrafted solid 925 sterling silver chains adorned with Australian black opals.",
    logoUrl: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=300&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
    status: "PENDING_VERIFICATION",
    stripeAccountId: null,
    vendorEmail: "liam@solitaireguild.com.au",
    vendorName: "Liam O'Connor",
  },
];

const PRODUCTS = [
  {
    id: "prod_01",
    title: "The Empress 3.2ct Oval Solitaire Diamond Ring",
    slug: "empress-oval-solitaire-diamond-ring",
    description: "A breathtaking 3.20 carat Oval Cut Brilliant Diamond nestled in a tapered 18K White Gold band with hidden diamond halo and claw prongs.",
    price: 18450,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Rings",
    metalType: "White Gold",
    metalPurity: "18K",
    gemstoneType: "Diamond",
    caratWeight: 3.2,
    certifiedBy: "GIA",
    shopId: "shop_aurora_01",
  },
  {
    id: "prod_02",
    title: "Verona Royal Emerald & Diamond Choker",
    slug: "verona-royal-emerald-diamond-choker",
    description: "Hexagonal deep green Colombian emerald center stone framed by 4.50 carats of brilliant baguette diamonds in 18K Yellow Gold.",
    price: 24800,
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Necklaces",
    metalType: "Gold",
    metalPurity: "18K",
    gemstoneType: "Emerald",
    caratWeight: 5.8,
    certifiedBy: "IGI",
    shopId: "shop_valerio_02",
  },
  {
    id: "prod_03",
    title: "Celestial Supernova 2.5ct Platinum Studs",
    slug: "celestial-supernova-platinum-studs",
    description: "Pair of D-color, VVS1 clarity ideal cut lab-grown diamonds set in pure 950 Platinum 4-prong martini settings.",
    price: 4950,
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Earrings",
    metalType: "Platinum",
    metalPurity: "950 Plat",
    gemstoneType: "Diamond",
    caratWeight: 2.5,
    certifiedBy: "IGI",
    shopId: "shop_celestial_03",
  },
  {
    id: "prod_04",
    title: "Nocturne Australian Black Opal Signet",
    slug: "nocturne-black-opal-signet",
    description: "Lightning Ridge solid natural black opal showing vivid electric blue and green flashes, set into heavyweight 925 sterling silver.",
    price: 3200,
    stock: 3,
    images: [
      "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Rings",
    metalType: "Silver",
    metalPurity: "925 Sterling",
    gemstoneType: "Opal",
    caratWeight: 1.9,
    certifiedBy: "AGS",
    shopId: "shop_solitaire_04",
  },
  {
    id: "prod_05",
    title: "Serpentina 18K Yellow Gold Tennis Bracelet",
    slug: "serpentina-gold-tennis-bracelet",
    description: "Timeless 7-inch tennis bracelet showcasing 5.0 carats of DEF round brilliant diamonds set in fluid 18K solid yellow gold links.",
    price: 11200,
    stock: 2,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Bracelets",
    metalType: "Gold",
    metalPurity: "18K",
    gemstoneType: "Diamond",
    caratWeight: 5.0,
    certifiedBy: "GIA",
    shopId: "shop_valerio_02",
  },
  {
    id: "prod_06",
    title: "Kashmir Royal Sapphire Halo Pendant",
    slug: "kashmir-royal-sapphire-halo-pendant",
    description: "Rare 4.10 carat unheated royal blue cushion sapphire encircled by a double micro-pavé halo of round diamonds in platinum.",
    price: 36500,
    stock: 1,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
    ],
    category: "Necklaces",
    metalType: "Platinum",
    metalPurity: "950 Plat",
    gemstoneType: "Sapphire",
    caratWeight: 4.1,
    certifiedBy: "GIA",
    shopId: "shop_aurora_01",
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
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        logoUrl: s.logoUrl,
        bannerUrl: s.bannerUrl,
        status: s.status,
        stripeAccountId: s.stripeAccountId,
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
    update: { name: "Alexander Sterling", role: "ADMIN", passwordHash: defaultPasswordHash },
    create: {
      name: "Alexander Sterling",
      email: "admin@eternelle.com",
      role: "ADMIN",
      passwordHash: defaultPasswordHash,
    },
  });
  console.log("Ingested Admin: Alexander Sterling (admin@eternelle.com)");

  // Ingest Buyer User
  await prisma.user.upsert({
    where: { email: "buyer@eternelle.com" },
    update: { name: "Genevieve Vance", role: "BUYER", passwordHash: defaultPasswordHash },
    create: {
      name: "Genevieve Vance",
      email: "buyer@eternelle.com",
      role: "BUYER",
      passwordHash: defaultPasswordHash,
    },
  });
  console.log("Ingested Buyer: Genevieve Vance (buyer@eternelle.com)");

  // 3. Ingest Jewelry Products
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({
      where: { slug: p.slug },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
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
      console.log(`Ingested Product: ${p.title}`);
    } else {
      console.log(`Product already exists: ${p.title}`);
    }
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
