import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if we already have products
  const count = await prisma.product.count()
  
  if (count === 0) {
    console.log("Seeding initial products...")
    
    await prisma.product.createMany({
      data: [
        {
          title: "Amigurumi Bunny",
          description: "A cute, soft, hand-crocheted bunny. Perfect for gifts!",
          price: 1500,
          category: "Amigurumi",
          imageUrl: "/amigurumi_bunny.jpg"
        },
        {
          title: "Chunky Crochet Blanket",
          description: "Warm and cozy chunky blanket. Various colors available.",
          price: 5000,
          category: "Blankets",
          imageUrl: "/crochet_blanket.jpg"
        },
        {
          title: "Floral Tote Bag",
          description: "Stylish everyday tote bag with intricate floral patterns.",
          price: 2500,
          category: "Bags",
          imageUrl: "/crochet_tote_bag.jpg"
        }
      ]
    })
    
    console.log("Seeding complete!")
  } else {
    console.log("Products already exist, skipping seed.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
