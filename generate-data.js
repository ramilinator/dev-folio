const fs = require("fs");
const path = require("path");

const rootFolder = path.join(__dirname, "portfolio-images");
const outputFile = path.join(__dirname, "data.json");

// Helper to recursively get all image files
function getImagesFromFolder(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recurse into subfolder
      results = results.concat(getImagesFromFolder(filePath));
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      results.push(filePath);
    }
  });

  return results;
}

// Collect all image files recursively
const imageFiles = getImagesFromFolder(rootFolder);

// Convert to structured JSON
const data = imageFiles.map(filePath => {
  const relativePath = path.relative(__dirname, filePath);
  const parsed = path.parse(filePath);

  // Tag = immediate subfolder name (e.g., "design" from "portfolio-images/design/img1.jpg")
  const parts = filePath.split(path.sep);
  const tag = parts[parts.length - 2] === "portfolio-images"
    ? "uncategorized"
    : parts[parts.length - 2];

  // Title = filename without extension
  const title = parsed.name.replace(/[-_]/g, " ");

  return {
    image: relativePath.replace(/\\/g, "/"), // normalize path for web
    title,
    tag
  };
});

// Write to data.json
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log(`✅ Generated ${data.length} items from ${rootFolder}`);
