# Software Engineering Team Plugin

7 specialized agents covering the full software development lifecycle from UX design and architecture to security and DevOps.

Based on learnings from [The AI-Native Engineering Flow](https://medium.com/data-science-at-microsoft/the-ai-native-engineering-flow-5de5ffd7d877) experiments at Microsoft.

## Installation

```bash
copilot plugin install github/awesome-copilot/plugins/software-engineering-team
```

## Agents

| Agent | Description |
|-------|-------------|
| `se-ux-ui-designer` | Jobs-to-be-Done analysis and user journey mapping |
| `se-technical-writer` | Technical documentation, blogs, ADRs, and user guides |
| `se-gitops-ci-specialist` | CI/CD debugging and deployment troubleshooting |
| `se-product-manager-advisor` | GitHub issues with business context and acceptance criteria |
| `se-responsible-ai-code` | Bias testing, accessibility (WCAG), and ethical development |
| `se-system-architecture-reviewer` | Architecture reviews with Well-Architected frameworks |
| `se-security-reviewer` | OWASP Top 10, LLM/ML security, and Zero Trust |

## Key Design Principles

- **Standalone**: Each agent works independently without cross-dependencies
- **Enterprise-ready**: Incorporates OWASP, Zero Trust, WCAG, and Well-Architected frameworks
- **Lifecycle coverage**: From UX research → Architecture → Development → Security → DevOps

## Usage

```
@se-security-reviewer Review this authentication implementation for security issues
```

```
@se-system-architecture-reviewer Evaluate this microservices design against Azure Well-Architected
```

## Source

Part of [Awesome Copilot](https://github.com/github/awesome-copilot).

## License

MIT
