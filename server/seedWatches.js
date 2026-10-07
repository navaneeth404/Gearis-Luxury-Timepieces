import mongoose from "mongoose";
import dotenv from "dotenv";
import Brand from "./models/Brand.js";
import Watch from "./models/Watch.js";

dotenv.config();

// Price tiers kept under Razorpay's ₹5,00,000 test-mode transaction limit,
// while preserving realistic relative pricing between brands
const brandData = {
  "Tag Heuer": { models: ["Carrera", "Monaco", "Aquaracer", "Formula 1", "Link"], minPrice: 80000, maxPrice: 180000 },
  "Omega": { models: ["Speedmaster", "Seamaster Diver 300M", "Seamaster Aqua Terra", "Constellation", "De Ville Prestige"], minPrice: 150000, maxPrice: 260000 },
  "Cartier": { models: ["Tank Must", "Santos de Cartier", "Ballon Bleu", "Panthère de Cartier", "Pasha de Cartier"], minPrice: 200000, maxPrice: 320000 },
  "Rolex": { models: ["Submariner", "Daytona", "Datejust", "GMT-Master II", "Day-Date", "Explorer", "Sky-Dweller", "Yacht-Master", "Air-King", "Oyster Perpetual"], minPrice: 280000, maxPrice: 400000 },
  "Patek Philippe": { models: ["Nautilus", "Calatrava", "Aquanaut", "Twenty~4"], minPrice: 350000, maxPrice: 450000 },
  "Audemars Piguet": { models: ["Royal Oak", "Royal Oak Offshore", "Code 11.59"], minPrice: 380000, maxPrice: 480000 },
};

const movementTypes = ["automatic", "quartz"];
const straps = ["leather", "metal", "rubber"];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Watch.deleteMany({});
    await Brand.deleteMany({});
    console.log("Cleared existing watches and brands");

    const brandNames = Object.keys(brandData);
    const brands = await Brand.insertMany(
      brandNames.map((name) => ({ name, description: `${name} — Swiss-made luxury watches.` }))
    );
    console.log(`Created ${brands.length} brands`);

    const watches = [];
    let i = 0;
    while (watches.length < 60) {
      const brand = brands[i % brands.length];
      const { models, minPrice, maxPrice } = brandData[brand.name];
      const modelName = models[i % models.length];

      const isWomens = i % 3 === 0;
      const gender = isWomens ? "women" : i % 5 === 0 ? "unisex" : "men";
      const caseSize = isWomens ? (i % 2 === 0 ? 34 : 36) : i % 2 === 0 ? 40 : 42;

      const price = Math.round((minPrice + Math.random() * (maxPrice - minPrice)) / 1000) * 1000;

      watches.push({
        name: `${modelName} ${caseSize}mm`,
        brand: brand._id,
        gender,
        caseSize,
        strapMaterial: straps[i % straps.length],
        movementType: movementTypes[i % movementTypes.length],
        price,
        images: [],
        stock: 3 + (i % 8),
        description: `The ${brand.name} ${modelName} — a refined addition to the collection.`,
        isFeatured: i % 7 === 0,
      });
      i++;
    }

    await Watch.insertMany(watches);
    console.log(`Created ${watches.length} watches`);

    console.log("\nSeed complete.");
  } catch (err) {
    console.error("Error seeding data:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

seed();