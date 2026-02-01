# Project Planning Plugin

Tools and guidance for software project planning, feature breakdown, epic management, implementation planning, and task organization for development teams.

## Installation

```bash
# Using Copilot CLI
copilot plugin install github/awesome-copilot/plugins/project-planning
```

## What's Included

### Commands (Slash Commands)

| Command | Description |
|---------|-------------|
| `/project-planning:breakdown-feature-implementation` | Create detailed feature implementation plans |
| `/project-planning:breakdown-feature-prd` | Break down features into PRD format |
| `/project-planning:breakdown-epic-arch` | Architecture breakdown for epics |
| `/project-planning:breakdown-epic-pm` | Product management breakdown for epics |
| `/project-planning:create-implementation-plan` | Generate implementation plans |
| `/project-planning:update-implementation-plan` | Update existing implementation plans |
| `/project-planning:create-github-issues-feature-from-implementation-plan` | Create GitHub issues from plans |
| `/project-planning:create-technical-spike` | Create technical spike documents |

### Agents

| Agent | Description |
|-------|-------------|
| `task-planner` | Plan and organize development tasks |
| `task-researcher` | Research context for task planning |
| `planner` | General planning assistance |
| `plan` | Quick planning mode |
| `prd` | Product Requirements Document creation |
| `implementation-plan` | Detailed implementation planning |
| `research-technical-spike` | Technical spike research and documentation |

### Skills

| Skill | Description |
|-------|-------------|
| `planning-guidelines` | Guidelines for task tracking and spec-driven workflows |

## Usage Examples

### Break down a feature
```
/project-planning:breakdown-feature-implementation

I need to implement user authentication with OAuth2
```

### Create an implementation plan
```
/project-planning:create-implementation-plan

Feature: Shopping cart checkout flow
Requirements: Support credit cards, PayPal, and Apple Pay
```

### Use the planning agent
```
@task-planner Help me plan the migration from REST to GraphQL
```

## Source

This plugin is part of [Awesome Copilot](https://github.com/github/awesome-copilot), a community-driven collection of GitHub Copilot extensions.

## License

MIT
