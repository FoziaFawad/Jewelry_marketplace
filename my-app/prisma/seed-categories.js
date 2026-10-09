const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  {
    name: "Rings",
    slug: "rings",
    description: "Solitaires, bridal bands, eternity rings, and cocktail rings.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Bridal choker sets, royal haar sets, malas, and solitaire pendants.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Solid 21K & 22K gold bangles, kangans, cuffs, and tennis bracelets.",
    imageUrl: "https://images.unsplash.com/photo-1611591475819-bf91696b96b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Traditional cascading jhumkas, chandbalis, drops, and diamond studs.",
    imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bridal Sets",
    slug: "bridal-sets",
    description: "Complete bridal jewelry suites crafted in 22K gold and certified gems.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"
  }
];

async function seedCategories() {
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  const count = await prisma.category.count();
  console.log(`Categories initialized! Total categories in DB: ${count}`);
}

seedCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
