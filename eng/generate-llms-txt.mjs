#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {
  AGENTS_DIR,
  INSTRUCTIONS_DIR,
  PROMPTS_DIR,
  SKILLS_DIR,
  ROOT_FOLDER,
} from "./constants.mjs";
import { parseFrontmatter, parseSkillMetadata } from "./yaml-parser.mjs";

/**
 * Extracts the name from a file based on its frontmatter or filename
 * @param {string} filePath - Path to the file (or directory for skills)
 * @param {string} fileType - Type of file (agent, prompt, instruction, skill)
 * @returns {string} - The name of the resource
 */
function extractName(filePath, fileType) {
  try {
    if (fileType === "skill") {
      // For skills, filePath is the skill directory
      const skillMetadata = parseSkillMetadata(filePath);
      return skillMetadata?.name || path.basename(filePath);
    }

    const frontmatter = parseFrontmatter(filePath);
    if (frontmatter?.name) {
      return frontmatter.name;
    }

    // Fallback to filename
    const basename = path.basename(filePath, path.extname(filePath));
    return basename
      .replace(/\.(agent|prompt|instructions)$/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  } catch (error) {
    console.error(`Error extracting name from ${filePath}: ${error.message}`);
    const basename = path.basename(filePath, path.extname(filePath));
    return basename.replace(/[-_]/g, " ");
  }
}

/**
 * Extracts the description from a file's frontmatter
 * @param {string} filePath - Path to the file (or directory for skills)
 * @param {string} fileType - Type of file (agent, prompt, instruction, skill)
 * @returns {string} - The description of the resource
 */
function extractDescription(filePath, fileType) {
  try {
    if (fileType === "skill") {
      // For skills, filePath is the skill directory
      const skillMetadata = parseSkillMetadata(filePath);
      return skillMetadata?.description || "No description available";
    }

    const frontmatter = parseFrontmatter(filePath);
    return frontmatter?.description || "No description available";
  } catch (error) {
    console.error(
      `Error extracting description from ${filePath}: ${error.message}`
    );
    return "No description available";
  }
}

/**
 * Gets the relative URL path for a resource
 * @param {string} filePath - Full path to the file
 * @param {string} baseDir - Base directory to calculate relative path from
 * @returns {string} - Relative URL path
 */
function getRelativeUrl(filePath, baseDir) {
  const relativePath = path.relative(ROOT_FOLDER, filePath);
  return relativePath.replace(/\\/g, "/");
}

/**
 * Generates llms.txt content according to the llmstxt.org specification
 * @returns {string} - The llms.txt file content
 */
function generateLlmsTxt() {
  let content = "";

  // H1 header (required)
  content += "# Awesome GitHub Copilot\n\n";

  // Summary blockquote (optional but recommended)
  content +=
    "> A community-driven collection of custom agents, prompts, instructions, and skills to enhance GitHub Copilot experiences across various domains, languages, and use cases.\n\n";

  // Add overview section
  content += "## Overview\n\n";
  content +=
    "This repository provides resources to customize and enhance GitHub Copilot:\n\n";
  content +=
    "- **Agents**: Specialized GitHub Copilot agents that integrate with MCP servers\n";
  content +=
    "- **Prompts**: Task-specific prompts for code generation and problem-solving\n";
  content +=
    "- **Instructions**: Coding standards and best practices applied to specific file patterns\n";
  content +=
    "- **Skills**: Self-contained folders with instructions and bundled resources for specialized tasks\n\n";

  // Process Agents
  content += "## Agents\n\n";
  const agentFiles = fs
    .readdirSync(AGENTS_DIR)
    .filter((file) => file.endsWith(".agent.md"))
    .sort();

  agentFiles.forEach((file) => {
    const filePath = path.join(AGENTS_DIR, file);
    const name = extractName(filePath, "agent");
    const description = extractDescription(filePath, "agent");
    const url = getRelativeUrl(filePath, ROOT_FOLDER);

    content += `- [${name}](${url}): ${description}\n`;
  });

  content += "\n";

  // Process Prompts
  content += "## Prompts\n\n";
  const promptFiles = fs
    .readdirSync(PROMPTS_DIR)
    .filter((file) => file.endsWith(".prompt.md"))
    .sort();

  promptFiles.forEach((file) => {
    const filePath = path.join(PROMPTS_DIR, file);
    const name = extractName(filePath, "prompt");
    const description = extractDescription(filePath, "prompt");
    const url = getRelativeUrl(filePath, ROOT_FOLDER);

    content += `- [${name}](${url}): ${description}\n`;
  });

  content += "\n";

  // Process Instructions
  content += "## Instructions\n\n";
  const instructionFiles = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((file) => file.endsWith(".instructions.md"))
    .sort();

  instructionFiles.forEach((file) => {
    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const name = extractName(filePath, "instruction");
    const description = extractDescription(filePath, "instruction");
    const url = getRelativeUrl(filePath, ROOT_FOLDER);

    content += `- [${name}](${url}): ${description}\n`;
  });

  content += "\n";

  // Process Skills
  content += "## Skills\n\n";
  const skillDirs = fs
    .readdirSync(SKILLS_DIR)
    .filter((item) => {
      const itemPath = path.join(SKILLS_DIR, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort();

  skillDirs.forEach((dir) => {
    const skillDirPath = path.join(SKILLS_DIR, dir);
    const skillPath = path.join(skillDirPath, "SKILL.md");
    
    if (fs.existsSync(skillPath)) {
      const name = extractName(skillDirPath, "skill");
      const description = extractDescription(skillDirPath, "skill");
      const url = getRelativeUrl(skillDirPath, ROOT_FOLDER);

      content += `- [${name}](${url}): ${description}\n`;
    }
  });

  content += "\n";

  // Add documentation links
  content += "## Documentation\n\n";
  content +=
    "- [README.md](README.md): Main documentation and getting started guide\n";
  content +=
    "- [CONTRIBUTING.md](CONTRIBUTING.md): Guidelines for contributing to this repository\n";
  content +=
    "- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): Community standards and expectations\n";
  content += "- [SECURITY.md](SECURITY.md): Security policies and reporting\n";
  content += "- [AGENTS.md](AGENTS.md): Project overview and setup commands\n\n";

  // Add repository information
  content += "## Repository\n\n";
  content +=
    "- **GitHub**: https://github.com/github/awesome-copilot\n";
  content += "- **License**: MIT\n";
  content +=
    "- **Website**: https://github.github.io/awesome-copilot\n";

  return content;
}

/**
 * Main function to generate and write the llms.txt file
 */
function main() {
  console.log("Generating llms.txt file...");

  try {
    const content = generateLlmsTxt();
    const outputPath = path.join(ROOT_FOLDER, "llms.txt");

    fs.writeFileSync(outputPath, content, "utf8");

    console.log(`✓ llms.txt generated successfully at ${outputPath}`);

    // Count resources
    const lines = content.split("\n");
    const agentCount = lines.filter((l) =>
      l.startsWith("- [") && l.includes("agents/")
    ).length;
    const promptCount = lines.filter((l) =>
      l.startsWith("- [") && l.includes("prompts/")
    ).length;
    const instructionCount = lines.filter((l) =>
      l.startsWith("- [") && l.includes("instructions/")
    ).length;
    const skillCount = lines.filter((l) =>
      l.startsWith("- [") && l.includes("skills/")
    ).length;

    console.log(`  - ${agentCount} agents`);
    console.log(`  - ${promptCount} prompts`);
    console.log(`  - ${instructionCount} instructions`);
    console.log(`  - ${skillCount} skills`);
  } catch (error) {
    console.error(`Error generating llms.txt: ${error.message}`);
    process.exit(1);
  }
}

main();
