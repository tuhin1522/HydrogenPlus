#!/usr/bin/env node

/**
 * Merge all Prisma schema files from /prisma/schemas into /prisma/schema.prisma
 * Run this before 'npx prisma migrate' or 'npx prisma generate'
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(__dirname, "../prisma/schemas");
const outputFile = path.join(__dirname, "../prisma/schema.prisma");

// Read generator and datasource from a base file or hardcode it
const baseSchema = `// Prisma Schema - Auto-generated from schemas directory
// Run 'npm run merge-schemas' to regenerate this file from individual schema files

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

`;

try {
  // Read all .prisma files from schemas directory
  const schemaFiles = fs
    .readdirSync(schemasDir)
    .filter((file) => file.endsWith(".prisma") && file !== "schema.prisma")
    .sort();

  console.log(`Found ${schemaFiles.length} schema files to merge...`);

  // Read content of each file
  let mergedContent = baseSchema;

  schemaFiles.forEach((file) => {
    const filePath = path.join(schemasDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    mergedContent += `\n// ============================================\n`;
    mergedContent += `// From: ${file}\n`;
    mergedContent += `// ============================================\n\n`;
    mergedContent += content;
    mergedContent += "\n";
  });

  // Write to schema.prisma
  fs.writeFileSync(outputFile, mergedContent);
  console.log(`✓ Successfully merged schemas into ${outputFile}`);
  process.exit(0);
} catch (error) {
  console.error("Error merging schemas:", error.message);
  process.exit(1);
}
