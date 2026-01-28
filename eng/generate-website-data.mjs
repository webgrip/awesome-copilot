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

  // Track all unique values for filters
  const allModels = new Set();
  const allTools = new Set();

  for (const file of files) {
    const filePath = path.join(AGENTS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    const model = frontmatter?.model || null;
    const tools = frontmatter?.tools || [];
    const handoffs = frontmatter?.handoffs || [];

    // Track unique values
    if (model) allModels.add(model);
    tools.forEach((t) => allTools.add(t));

    agents.push({
      id: file.replace(".agent.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      model: model,
      tools: tools,
      hasHandoffs: handoffs.length > 0,
      handoffs: handoffs.map((h) => ({
        label: h.label || "",
        agent: h.agent || "",
      })),
      mcpServers: frontmatter?.["mcp-servers"]
        ? Object.keys(frontmatter["mcp-servers"])
        : [],
      path: relativePath,
      filename: file,
    });
  }

  // Sort and return with filter metadata
  const sortedAgents = agents.sort((a, b) => a.title.localeCompare(b.title));
  
  return {
    items: sortedAgents,
    filters: {
      models: ["(none)", ...Array.from(allModels).sort()],
      tools: Array.from(allTools).sort(),
    },
  };
}

/**
 * Generate prompts metadata
 */
function generatePromptsData() {
  const prompts = [];
  const files = fs
    .readdirSync(PROMPTS_DIR)
    .filter((f) => f.endsWith(".prompt.md"));

  // Track all unique tools for filters
  const allTools = new Set();

  for (const file of files) {
    const filePath = path.join(PROMPTS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    const tools = frontmatter?.tools || [];
    tools.forEach((t) => allTools.add(t));

    prompts.push({
      id: file.replace(".prompt.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      agent: frontmatter?.agent || null,
      model: frontmatter?.model || null,
      tools: tools,
      path: relativePath,
      filename: file,
    });
  }

  const sortedPrompts = prompts.sort((a, b) => a.title.localeCompare(b.title));

  return {
    items: sortedPrompts,
    filters: {
      tools: Array.from(allTools).sort(),
    },
  };
}

/**
 * Parse applyTo field into an array of patterns
 */
function parseApplyToPatterns(applyTo) {
  if (!applyTo) return [];
  
  // Handle array format
  if (Array.isArray(applyTo)) {
    return applyTo.map(p => p.trim()).filter(p => p.length > 0);
  }
  
  // Handle string format (comma-separated)
  if (typeof applyTo === 'string') {
    return applyTo.split(',').map(p => p.trim()).filter(p => p.length > 0);
  }
  
  return [];
}

/**
 * Extract file extension from a glob pattern
 */
function extractExtensionFromPattern(pattern) {
  // Match patterns like **.ts, **/*.js, *.py, etc.
  const match = pattern.match(/\*\.(\w+)$/);
  if (match) return `.${match[1]}`;
  
  // Match patterns like **/*.{ts,tsx}
  const braceMatch = pattern.match(/\*\.\{([^}]+)\}$/);
  if (braceMatch) {
    return braceMatch[1].split(',').map(ext => `.${ext.trim()}`);
  }
  
  return null;
}

/**
 * Generate instructions metadata
 */
function generateInstructionsData() {
  const instructions = [];
  const files = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"));

  // Track all unique patterns and extensions for filters
  const allPatterns = new Set();
  const allExtensions = new Set();

  for (const file of files) {
    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const frontmatter = parseFrontmatter(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    const applyToRaw = frontmatter?.applyTo || null;
    const applyToPatterns = parseApplyToPatterns(applyToRaw);
    
    // Extract extensions from patterns
    const extensions = [];
    for (const pattern of applyToPatterns) {
      allPatterns.add(pattern);
      const ext = extractExtensionFromPattern(pattern);
      if (ext) {
        if (Array.isArray(ext)) {
          ext.forEach(e => {
            extensions.push(e);
            allExtensions.add(e);
          });
        } else {
          extensions.push(ext);
          allExtensions.add(ext);
        }
      }
    }

    instructions.push({
      id: file.replace(".instructions.md", ""),
      title: extractTitle(filePath, frontmatter),
      description: frontmatter?.description || "",
      applyTo: applyToRaw,
      applyToPatterns: applyToPatterns,
      extensions: [...new Set(extensions)],
      path: relativePath,
      filename: file,
    });
  }

  const sortedInstructions = instructions.sort((a, b) => a.title.localeCompare(b.title));

  return {
    items: sortedInstructions,
    filters: {
      patterns: Array.from(allPatterns).sort(),
      extensions: ["(none)", ...Array.from(allExtensions).sort()],
    },
  };
}

/**
 * Categorize a skill based on its name and description
 */
function categorizeSkill(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  if (text.includes('azure') || text.includes('appinsights')) return 'Azure';
  if (text.includes('github') || text.includes('gh-cli') || text.includes('git-commit') || text.includes('git ')) return 'Git & GitHub';
  if (text.includes('vscode') || text.includes('vs code')) return 'VS Code';
  if (text.includes('test') || text.includes('qa') || text.includes('playwright')) return 'Testing';
  if (text.includes('microsoft') || text.includes('m365') || text.includes('workiq')) return 'Microsoft';
  if (text.includes('cli') || text.includes('command')) return 'CLI Tools';
  if (text.includes('diagram') || text.includes('plantuml') || text.includes('visual')) return 'Diagrams';
  if (text.includes('nuget') || text.includes('dotnet') || text.includes('.net')) return '.NET';
  
  return 'Other';
}

/**
 * Generate skills metadata
 */
function generateSkillsData() {
  const skills = [];

  if (!fs.existsSync(SKILLS_DIR)) {
    return { items: [], filters: { categories: [], hasAssets: ['Yes', 'No'] } };
  }

  const folders = fs
    .readdirSync(SKILLS_DIR)
    .filter((f) => fs.statSync(path.join(SKILLS_DIR, f)).isDirectory());

  const allCategories = new Set();

  for (const folder of folders) {
    const skillPath = path.join(SKILLS_DIR, folder);
    const metadata = parseSkillMetadata(skillPath);

    if (metadata) {
      const relativePath = path.relative(ROOT_FOLDER, skillPath).replace(/\\/g, "/");
      const category = categorizeSkill(metadata.name, metadata.description);
      allCategories.add(category);

      // Get all files in the skill folder recursively
      const files = getSkillFiles(skillPath, relativePath);

      skills.push({
        id: folder,
        name: metadata.name,
        title: metadata.name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        description: metadata.description,
        assets: metadata.assets,
        hasAssets: metadata.assets.length > 0,
        assetCount: metadata.assets.length,
        category: category,
        path: relativePath,
        skillFile: `${relativePath}/SKILL.md`,
        files: files,
      });
    }
  }

  const sortedSkills = skills.sort((a, b) => a.title.localeCompare(b.title));

  return {
    items: sortedSkills,
    filters: {
      categories: Array.from(allCategories).sort(),
      hasAssets: ['Yes', 'No'],
    },
  };
}

/**
 * Get all files in a skill folder recursively
 */
function getSkillFiles(skillPath, relativePath) {
  const files = [];
  
  function walkDir(dir, relDir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        walkDir(fullPath, relPath);
      } else {
        // Get file size
        const stats = fs.statSync(fullPath);
        files.push({
          path: `${relativePath}/${relPath}`,
          name: relPath,
          size: stats.size,
        });
      }
    }
  }
  
  walkDir(skillPath, '');
  return files;
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

  // Track all unique tags
  const allTags = new Set();

  for (const file of files) {
    const filePath = path.join(COLLECTIONS_DIR, file);
    const data = parseCollectionYaml(filePath);
    const relativePath = path.relative(ROOT_FOLDER, filePath).replace(/\\/g, "/");

    if (data) {
      const tags = data.tags || [];
      tags.forEach((t) => allTags.add(t));

      collections.push({
        id: file.replace(".collection.yml", ""),
        name: data.name || file.replace(".collection.yml", ""),
        description: data.description || "",
        tags: tags,
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
  const sortedCollections = collections.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  return {
    items: sortedCollections,
    filters: {
      tags: Array.from(allTags).sort(),
    },
  };
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
  const agentsData = generateAgentsData();
  const agents = agentsData.items;
  console.log(`✓ Generated ${agents.length} agents (${agentsData.filters.models.length} models, ${agentsData.filters.tools.length} tools)`);

  const promptsData = generatePromptsData();
  const prompts = promptsData.items;
  console.log(`✓ Generated ${prompts.length} prompts (${promptsData.filters.tools.length} tools)`);

  const instructionsData = generateInstructionsData();
  const instructions = instructionsData.items;
  console.log(`✓ Generated ${instructions.length} instructions (${instructionsData.filters.extensions.length} extensions)`);

  const skillsData = generateSkillsData();
  const skills = skillsData.items;
  console.log(`✓ Generated ${skills.length} skills (${skillsData.filters.categories.length} categories)`);

  const collectionsData = generateCollectionsData();
  const collections = collectionsData.items;
  console.log(`✓ Generated ${collections.length} collections (${collectionsData.filters.tags.length} tags)`);

  const searchIndex = generateSearchIndex(agents, prompts, instructions, skills, collections);
  console.log(`✓ Generated search index with ${searchIndex.length} items`);

  // Write JSON files
  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "agents.json"),
    JSON.stringify(agentsData, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "prompts.json"),
    JSON.stringify(promptsData, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "instructions.json"),
    JSON.stringify(instructionsData, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "skills.json"),
    JSON.stringify(skillsData, null, 2)
  );

  fs.writeFileSync(
    path.join(WEBSITE_DATA_DIR, "collections.json"),
    JSON.stringify(collectionsData, null, 2)
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
