// Quick test script to verify MongoDB connection
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    // Try a simple query
    const userCount = await prisma.user.count();
    console.log("✅ MongoDB connection successful!");
    console.log(`Current user count: ${userCount}`);

    // Try creating a test user
    console.log("\nAttempting to create a test creator...");
    const testUser = await prisma.user.create({
      data: {
        username: `test_creator_${Date.now()}`,
        password: "hashed_password_here",
        userType: "creator",
      },
    });
    console.log("✅ User created successfully:");
    console.log(testUser);

    // Clean up - delete test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log("✅ Test user deleted");
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
