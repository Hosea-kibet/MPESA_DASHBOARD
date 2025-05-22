import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create payment channels if they don't exist
  const channels = [
    { name: "Till", description: "Payments made through M-Pesa Till numbers" },
    { name: "Paybill", description: "Payments made through M-Pesa Paybill numbers" },
    { name: "USSD", description: "Payments initiated through USSD codes" },
  ]

  for (const channel of channels) {
    await prisma.paymentChannel.upsert({
      where: { name: channel.name },
      update: {},
      create: channel,
    })
  }

  // Get channel IDs
  const tillChannel = await prisma.paymentChannel.findUnique({ where: { name: "Till" } })
  const paybillChannel = await prisma.paymentChannel.findUnique({ where: { name: "Paybill" } })
  const ussdChannel = await prisma.paymentChannel.findUnique({ where: { name: "USSD" } })

  if (!tillChannel || !paybillChannel || !ussdChannel) {
    throw new Error("Failed to create payment channels")
  }

  // Create customers
  const customerCount = 50
  console.log(`Creating ${customerCount} customers...`)

  for (let i = 0; i < customerCount; i++) {
    const name = faker.person.fullName()
    const phone = `+254${faker.string.numeric(9)}`

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: faker.internet.email({ firstName: name.split(" ")[0], lastName: name.split(" ")[1] }),
      },
    })

    // Create transactions for each customer
    const transactionCount = faker.number.int({ min: 1, max: 20 })

    for (let j = 0; j < transactionCount; j++) {
      const channelId = faker.helpers.arrayElement([tillChannel.id, paybillChannel.id, ussdChannel.id])

      const amount = faker.number.float({ min: 100, max: 5000, precision: 0.01 })
      const status = faker.helpers.arrayElement(["completed", "failed", "pending"])
      const mpesaReceiptNumber = status === "completed" ? `M${faker.string.alphanumeric(9).toUpperCase()}` : null

      const transactionDate = faker.date.recent({ days: 90 })

      await prisma.transaction.create({
        data: {
          customerId: customer.id,
          channelId,
          amount,
          status,
          mpesaReceiptNumber,
          transactionDate,
        },
      })
    }
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
