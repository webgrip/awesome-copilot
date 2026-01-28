#!/usr/bin/env node

/**
 * Generate JSON metadata files for the GitHub Pages website.
 * This script extracts metadata from agents, prompts, instructions, skills, and collections
 * and writes them to website/data/ for client-side search and display.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  AGENTS_DIR,
  INSTRUCTIONS_DIR,
  PROMPTS_DIR,
  SKILLS_DIR,
  COLLECTIONS_DIR,
  ROOT_FOLDER,
} from "./constants.mjs";
import {
  parseFrontmatter,
  parseCollectionYaml,
  parseSkillMetadata,
} from "./yaml-parser.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEBSITE_DATA_DIR = path.join(ROOT_FOLDER, "website", "data");

/**
 * Ensure the output directory exists
 */
function ensureDataDir() {
  if (!fs.existsSync(WEBSITE_DATA_DIR)) {
    fs.mkdirSync(WEBSITE_DATA_DIR, { recursive: true });
  }
}

/**
 * Extract title from filename or frontmatter
 */
function extractTitle(filePath, frontmatter) {
  if (frontmatter?.title) return frontmatter.title;
  if (frontmatter?.name) {
    return frontmatter.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  // Fallback to filename
  const basename = path.basename(filePath);
  const name = basename
    .replace(/\.(agent|prompt|instructions)\.md$/, "")
    .replace(/\.md$/, "");
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get file content (for preview/full content)
 */
function getFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return null;
  }
}

/**
 * Generate agents metadata
 */
function generateAgentsData() {
  const agents = [];
  const files = fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".agent.md"));

  for (const file of files) {
    const filePath = path.join(AGENTS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    agents.push({
      id: file.replace(".agent.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      model: frontmatter?.model || null,
      tools: frontmatter?.tools || [],
      mcpServers: frontmatter?.["mcp-servers"]
        ? Object.keys(frontmatter["mcp-servers"])
        : [],
      path: relativePath,
      filename: file,
    });
  }

  return agents.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Generate prompts metadata
 */
function generatePromptsData() {
  const prompts = [];
  const files = fs
    .readdirSync(PROMPTS_DIR)
    .filter((f) => f.endsWith(".prompt.md"));

  for (const file of files) {
    const filePath = path.join(PROMPTS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    prompts.push({
      id: file.replace(".prompt.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      agent: frontmatter?.agent || null,
      model: frontmatter?.model || null,
      tools: frontmatter?.tools || [],
      path: relativePath,
      filename: file,
    });
  }

  return prompts.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Generate instructions metadata
 */
function generateInstructionsData() {
  const instructions = [];
  const files = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"));

  for (const file of files) {
    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    instructions.push({
      id: file.replace(".instructions.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      applyTo: frontmatter?.applyTo || null,
      path: relativePath,
      filename: file,
    });
  }

  return instructions.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Generate skills metadata
 */
function generateSkillsData() {
  const skills = [];

  if (!fs.existsSync(SKILLS_DIR)) {
    return skills;
  }

  const folders = fs
    .readdirSync(SKILLS_DIR)
    .filter((f) => fs.statSync(path.join(SKILLS_DIR, f)).isDirectory());

  for (const folder of folders) {
    const skillPath = path.join(SKILLS_DIR, folder);
    const metadata = parseSkillMetadata(skillPath);

    if (metadata) {
      const relativePath = path.relative(ROOT_FOLDER, skillPath).replace(/\\/g, "/");

      skills.push({
        id: folder,
        name: metadata.name,
        title: metadata.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: metadata.description,
        assets: metadata.assets,
        path: relativePath,
        skillFile: `${relativePath}/SKILL.md`,
      });
    }
  }

  return skills.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Generate collections metadata
 */
function generateCollectionsData() {
  const collections = [];

  if (!fs.existsSync(COLLECTIONS_DIR)) {
    return collections;
  }

  const files = fs
    .readdirSync(COLLECTIONS_DIR)
    .filter((f) => f.endsWith(".collection.yml"));

  for (const file of files) {
    const filePath = path.join(COLLECTIONS_DIR, file);
    const data = parseCollectionYaml(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    if (data) {
      collections.push({
        id: file.replace(".collection.yml", ""),
        name: data.name || file.replace(".collection.yml", ""),
        description: data.description || "",
        tags: data.tags || [],
        featured: data.featured || false,
        items: (data.items || []).map((item) => ({
          path: item.path,
          kind: item.kind,
          usage: item.usage || null,
        })),
        path: relativePath,
        filename: file,
      });
    }
  }

  // Sort with featured first, then alphabetically
  return collections.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Generate a combined index for search
 */
function generateSearchIndex(agents, prompts, instructions, skills, collections) {
  const index = [];

  for (const agent of agents) {
    index.push({
      type: "agent",
      id: agent.id,
      title: agent.title,
      description: agent.description,
      path: agent.path,
      searchText: `${agent.title} ${agent.description} ${agent.tools.join(" ")}`.toLowerCase(),
    });
  }

  for (const prompt of prompts) {
    index.push({
      type: "prompt",
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      path: prompt.path,
      searchText: `${prompt.title} ${prompt.description}`.toLowerCase(),
    });
  }

  for (const instruction of instructions) {
    index.push({
      type: "instruction",
      id: instruction.id,
      title: instruction.title,
      description: instruction.description,
      path: instruction.path,
      searchText: `${instruction.title} ${instruction.description} ${instruction.applyTo || ""}`.toLowerCase(),
    });
  }

  for (const skill of skills) {
    index.push({
      type: "skill",
      id: skill.id,
      title: skill.title,
      description: skill.description,
      path: skill.path,
      searchText: `${skill.title} ${skill.description}`.toLowerCase(),
    });
  }

  for (const collection of collections) {
    index.push({
      type: "collection",
      id: collection.id,
      title: collection.name,
      description: collection.description,
      path: collection.path,
      tags: collection.tags,
      searchText: `${collection.name} ${collection.description} ${collection.tags.join(" ")}`.toLowerCase(),
    });
  }

  return index;
}

/**
 * Main function
 */
async function main() {
  console.log("Generating website data...\n");

  ensureDataDir();

  // Generate all data
  const agents = generateAgentsData();
  console.log(`✓ Generated ${agents.length} agents`);

  const prompts = generatePromptsData();
  console.log(`✓ Generated ${prompts.length} prompts`);

  const instructions = generateInstructionsData();
  console.log(`✓ Generated ${instructions.length} instructions`);

  const skills = generateSkillsData();
  console.log(`✓ Generated ${skills.length} skills`);

  const collections = generateCollectionsData();
  console.log(`✓ Generated ${collections.length} collections`);

  const searchIndex = generateSearchIndex(agents, prompts, instructions, skills, collections);
  console.log(`✓ Generated search index with ${searchIndex.length} items`);

  // Write JSON files
  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "agents.json"),
    JSON.stringify(agents, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "prompts.json"),
    JSON.stringify(prompts, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "instructions.json"),
    JSON.stringify(instructions, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "skills.json"),
    JSON.stringify(skills, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "collections.json"),
    JSON.stringify(collections, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "search-index.json"),
    JSON.stringify(searchIndex, null, 2)
  );

  // Generate a manifest with counts and timestamps
  const manifest = {
    generated: new Date().toISOString(),
    counts: {
      agents: agents.length,
      prompts: prompts.length,
      instructions: instructions.length,
      skills: skills.length,
      collections: collections.length,
      total: searchIndex.length,
    },
  };

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✓ All data written to website/data/`);
}

main().catch((err) => {
  console.error("Error generating website data:", err);
  process.exit(1);
});
