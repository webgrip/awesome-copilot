# Testing & Test Automation Plugin

Comprehensive collection for writing tests, test automation, and test-driven development including unit tests, integration tests, and end-to-end testing strategies.

## Installation

```bash
copilot plugin install github/awesome-copilot/plugins/testing-automation
```

## Agents

| Agent | Description |
|-------|-------------|
| `tdd-red` | Write failing tests first (Red phase of TDD) |
| `tdd-green` | Write minimal code to pass tests (Green phase of TDD) |
| `tdd-refactor` | Refactor while keeping tests green (Refactor phase of TDD) |
| `playwright-tester` | End-to-end testing with Playwright |

## Commands

| Command | Description |
|---------|-------------|
| `/testing-automation:playwright-explore-website` | Explore a website with Playwright |
| `/testing-automation:playwright-generate-test` | Generate Playwright tests |
| `/testing-automation:csharp-nunit` | Generate C# NUnit tests |
| `/testing-automation:java-junit` | Generate Java JUnit tests |
| `/testing-automation:ai-prompt-engineering-safety-review` | Review AI prompts for safety |

## TDD Workflow

Use the three TDD agents in sequence:

1. `@tdd-red` - Write a failing test for the feature
2. `@tdd-green` - Implement just enough code to pass
3. `@tdd-refactor` - Clean up while tests stay green

## Source

Part of [Awesome Copilot](https://github.com/github/awesome-copilot).

## License

MIT
