/**
 * seed.js — Database Seed Script
 *
 * WHAT: Safely seeds realistic sample users into MongoDB without
 *       deleting or overwriting existing data.
 *
 * HOW:  Run with:  node seed.js
 *
 * STEPS:
 *   1. Load .env and connect to MongoDB
 *   2. Insert any missing client users
 *   3. Insert any missing freelancer users
 *   4. Print summary report
 *   5. Disconnect
 *
 * IMPORTANT:
 *   - Password for ALL seed accounts is:  Password123
 *   - The User model's pre-save hook hashes the password automatically,
 *     so we pass plain text here and Mongoose does the rest.
 *   - Never run this script against a production database with real user data.
 */

require("dotenv").config(); // Load MONGO_URI and other env vars from .env

const mongoose = require("mongoose");

// Models — must be imported so Mongoose registers the schemas
const User = require("./models/User");
const clientsData = require("./seedData/clients");
const freelancersData = require("./seedData/freelancers");

// ─── Utility: coloured console output ───────────────────────────────────────
const log = {
  info: (msg) => console.log(`\x1b[36mℹ  ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m✓  ${msg}\x1b[0m`),
  warn: (msg) => console.log(`\x1b[33m⚠  ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m✗  ${msg}\x1b[0m`),
  header: (msg) => console.log(`\n\x1b[1m\x1b[35m${msg}\x1b[0m`),
  divider: () => console.log("\x1b[90m" + "─".repeat(50) + "\x1b[0m"),
};

// ─── Main seed function ──────────────────────────────────────────────────────
async function seed() {
  log.header("FreelanceHub Database Seeder");
  log.divider();

  // ── 1. Connect to MongoDB ──────────────────────────────────────────────────
  log.info("Connecting to MongoDB…");
  const uri = process.env.MONGO_URI;
  if (!uri) {
    log.error("MONGO_URI is not set in .env — aborting.");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  log.success(`Connected to: ${mongoose.connection.host}`);

  async function seedUsers(records, label) {
    const summary = { created: 0, skipped: 0 };

    for (const userData of records) {
      const existingUser = await User.findOne({ email: userData.email }).select(
        "_id role email",
      );

      if (existingUser) {
        summary.skipped += 1;
        if (existingUser.role !== userData.role) {
          log.warn(
            `Skipped ${label}: ${userData.email} already exists as ${existingUser.role}`,
          );
        } else {
          log.info(
            `Skipped ${label}: ${userData.name} (${userData.email}) already exists`,
          );
        }
        continue;
      }

      const user = await User.create(userData);
      summary.created += 1;
      if (label === "freelancer") {
        log.success(
          `Created freelancer: ${user.name} — $${user.hourlyRate}/hr (${user.location})`,
        );
      } else {
        log.success(`Created client: ${user.name} (${user.email})`);
      }
    }

    return summary;
  }

  // ── 2. Seed clients ────────────────────────────────────────────────────────
  log.header("Step 1 — Seeding clients");
  const clientSummary = await seedUsers(clientsData, "client");

  // ── 3. Seed freelancers ────────────────────────────────────────────────────
  log.header("Step 2 — Seeding freelancers");
  const freelancerSummary = await seedUsers(freelancersData, "freelancer");

  // ── 4. Summary report ──────────────────────────────────────────────────────
  log.header("Seed Complete — Summary");
  log.divider();

  console.log(`
  📊 Database updated without deleting existing records:
     👤  ${clientSummary.created} new clients created (${clientSummary.skipped} skipped)
     🧑‍💻  ${freelancerSummary.created} new freelancers created (${freelancerSummary.skipped} skipped)

  🔑  All accounts use password:  Password123

  👤  Sample client logins:
     sophia@novastartups.io     (Nova Startups)
     marcus@reidgrowthco.com   (Reid Growth Co)
     priya@finledger.tech       (FinLedger)
     daniel@createstudiogh.com (Create Studio)
     elena@shopblocks.eu       (ShopBlocks)

  🧑‍💻  Sample freelancer logins:
     james@jamesokafor.dev     (Full-stack JS — $85/hr)
     amara@amaradesigns.co     (UI/UX Design — $75/hr)
     kevin@kevintrandev.com    (React Native — $65/hr)
     fatima@fatimadata.com     (Data Science — $110/hr)
     arjun@arjunops.io         (DevOps/AWS — $90/hr)
     chloe@chloewritesco.com   (Copywriting — $70/hr)
     yusuf@yusufweb3.dev       (Blockchain — $120/hr)
     nikolai@secureniko.com    (Cybersecurity — $130/hr)
  `);

  log.divider();

  // ── 5. Disconnect ──────────────────────────────────────────────────────────
  await mongoose.disconnect();
  log.success("MongoDB disconnected. Done!");
  process.exit(0);
}

// ─── Run ────────────────────────────────────────────────────────────────────
seed().catch((err) => {
  log.error(`Seed failed: ${err.message}`);
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
