---
name: microsoft-docs
description: 'Query official Microsoft and Microsoft-adjacent documentation to understand concepts, find tutorials, and get code examples. Covers Azure, .NET, Agent Framework, Semantic Kernel, DevUI, Aspire, VS Code, GitHub, Microsoft 365, Windows, and Power Platform using Microsoft Learn MCP and Context7 for comprehensive lookup across learn.microsoft.com, code.visualstudio.com, docs.github.com, aspire.dev, and GitHub source repos.'
---

# Microsoft Docs

A unified documentation research skill for the full Microsoft technology ecosystem — including technologies like VS Code, GitHub, and Agent Framework repos that live outside or ahead of learn.microsoft.com.

## Tools

### Microsoft Learn MCP Server

| Tool | Use For |
|------|---------|
| `microsoft_docs_search` | Find documentation on learn.microsoft.com — concepts, guides, tutorials, configuration |
| `microsoft_code_sample_search` | Find **working code snippets** from official Microsoft Learn docs. Especially strong for Agent Framework, Semantic Kernel, DevUI, and Azure SDK examples. Pass `language` parameter (`python`, `csharp`) for best results. |
| `microsoft_docs_fetch` | Get full page content from a specific Microsoft docs URL (when search excerpts aren't enough) |

### Context7 (broader coverage)

Context7 indexes both **websites** and **GitHub repos**, giving access to documentation that the Microsoft Learn MCP server cannot reach — including VS Code docs, GitHub docs, Aspire.dev, GitHub CLI, and README-level content from source repos that is often ahead of published docs.

| Tool | Use For |
|------|---------|
| `mcp_context7_resolve-library-id` | Find the Context7 library ID for a technology (one-time per session) |
| `mcp_context7_query-docs` | Query docs with a specific library ID — returns code snippets, explanations, and source links in a single call |

### When GitHub Repo Sources (Context7) Beat Published Docs

Context7 indexes GitHub repo README files, which often contain API-level detail, CLI references, and advanced config that hasn't been published to learn.microsoft.com yet. This is especially true for:

- **DevUI** — the repo README (`/microsoft/agent-framework`) has complete API reference (endpoints, parameters, response schemas), OpenAI proxy config, and auth setup that the Learn page summarizes
- **Agent Framework .NET** — the repo has `Microsoft.Agents.AI.DevUI` integration code for ASP.NET Core before it appears on Learn
- **Extension samples** — `/microsoft/vscode-extension-samples` has working projects not always linked from the VS Code API docs

**Rule of thumb:** query the **website source** for tutorials and concepts, then the **repo source** for API-level detail and the latest features.

## When to Use Which Tool

| Scenario | Best Tool | Why |
|----------|-----------|-----|
| Azure services, .NET, M365, Power Platform | `microsoft_docs_search` | Direct access to learn.microsoft.com |
| Code samples for any Learn topic | `microsoft_code_sample_search` | Returns up to 20 working code snippets with links. Filter by language. |
| Agent Framework — tutorials, concepts | `microsoft_docs_search` + Context7 Learn | Polished guides on learn.microsoft.com |
| Agent Framework — DevUI setup, API, CLI | Context7 `/microsoft/agent-framework` | GitHub repo has detailed DevUI README with full API reference |
| Agent Framework — DevUI tracing, directory discovery | Context7 `/websites/learn_microsoft_en-us_agent-framework` | Learn website has step-by-step guides |
| Semantic Kernel — agents, plugins, orchestration | Context7 `/websites/learn_microsoft_en-us_semantic-kernel` + `microsoft_code_sample_search` | Learn has the best SK docs; code sample search excels here |
| Semantic Kernel — source code, ADRs, design docs | Context7 `/microsoft/semantic-kernel` | GitHub repo has samples and architectural decisions |
| VS Code features, settings, shortcuts | Context7 `/websites/code_visualstudio` | VS Code docs live on code.visualstudio.com, not Learn |
| VS Code extension development / API | Context7 `/websites/code_visualstudio_api` | Extension API docs are separate from user docs |
| GitHub Actions, repos, API, features | Context7 `/websites/github_en` | GitHub docs live on docs.github.com |
| GitHub CLI (gh) | Context7 `/websites/cli_github` | CLI reference lives on cli.github.com |
| .NET Aspire (AppHost, integrations, CLI) | Context7 `/microsoft/aspire.dev` | Aspire docs live on aspire.dev, not Learn |
| Aspire community integrations (Go, Java) | Context7 `/communitytoolkit/aspire` | Community Toolkit is a separate repo |
| Need full tutorial with all steps | `microsoft_docs_fetch` | Gets complete page content |

## Context7 Library Reference

Call `mcp_context7_resolve-library-id` once per session to confirm IDs. Below are tested, quality-ranked sources.

### Agent Frameworks

#### Microsoft Agent Framework

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/websites/learn_microsoft_en-us_agent-framework` | 2,282 | 81.2 | **Primary for tutorials** — DevUI guides, directory discovery, tracing, AG-UI integration, workflow orchestration |
| `/microsoft/agent-framework` | 1,177 | — | **Primary for API detail** — DevUI README (full REST API, CLI flags, auth, OpenAI proxy), .NET DevUI integration, samples |

The **Learn website** source has polished tutorials and conceptual docs. The **GitHub repo** source has README-level detail that is often ahead of published docs — particularly the DevUI REST API reference, advanced CLI options, and .NET `Microsoft.Agents.AI.DevUI` package setup.

**Use both** for comprehensive Agent Framework coverage: query the website source for "how to" guides, then the repo source for API-level specifics.

##### DevUI Workflow

DevUI is a sample app for running and debugging agents/workflows interactively. Key topics:

1. **Installation**: `pip install agent-framework-devui --pre`
2. **Programmatic launch**: `serve(entities=[agent], auto_open=True)` — registers agents in-memory
3. **Directory discovery**: `devui ./agents --port 8080` — auto-discovers agents/workflows from `__init__.py` files
4. **Tracing**: `devui ./agents --tracing` or `serve(entities=[agent], tracing_enabled=True)` — enables OpenTelemetry traces visible in the debug panel
5. **OpenAI-compatible API**: `POST /v1/responses` with `metadata.entity_id` — use with OpenAI Python SDK
6. **OpenAI proxy**: Set `X-Proxy-Backend: openai` header to proxy requests through DevUI (keeps API key server-side)
7. **Authentication**: `devui ./agents --auth --auth-token "token"` — Bearer token auth
8. **UI modes**: `--mode developer` (default, full debug) vs `--mode user` (simplified, restricted)
9. **.NET integration**: `builder.AddDevUI()` + `app.MapDevUI()` in ASP.NET Core (development only)
10. **Export to external observability**: Set `OTLP_ENDPOINT` to send traces to Jaeger, Zipkin, Azure Monitor, Datadog

**Best query strategy for DevUI:**
- Use `microsoft_code_sample_search` with `language: "python"` for working DevUI code
- Use Context7 `/microsoft/agent-framework` for the DevUI REST API reference
- Use Context7 `/websites/learn_microsoft_en-us_agent-framework` for directory structure and tracing guides

#### Semantic Kernel

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/websites/learn_microsoft_en-us_semantic-kernel` | 4,909 | 69.5 | **Primary** — agents, plugins, orchestration, function calling, migration guides |
| `/websites/learn_microsoft_en-us_semantic-kernel_frameworks_agent` | 932 | 76.4 | Agent framework subset — ChatCompletionAgent, AgentGroupChat, orchestration patterns |
| `/microsoft/semantic-kernel` | 2,950 | 74.7 | GitHub repo — samples, ADRs, design documents, process integration |

**Use the Learn website source** for Semantic Kernel tutorials and plugin setup. **Use the agent framework subset** for focused agent orchestration queries. **Use the GitHub repo** for sample code, architectural decisions, and advanced patterns (e.g., `GettingStartedWithProcesses`).

### Azure & .NET (learn.microsoft.com)

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/websites/learn_microsoft_en-us_azure` | 164,912 | 73.8 | All Azure services — compute, storage, networking, AI, databases |
| `/microsoftdocs/azure-docs` | 61,791 | 76.7 | Azure docs GitHub repo — higher quality score |
| `/websites/learn_microsoft_en-us` | 158,360 | 45.4 | All of Microsoft Learn — broadest but lower precision |
| `/websites/learn_microsoft_en-us_dotnet_azure` | 1,156 | — | Azure SDK for .NET developers specifically |

### .NET Aspire

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/microsoft/aspire.dev` | 1,865 | 73.0 | **Primary** — official docs site repo, best quality, full Aspire 13+ coverage |
| `/websites/aspire_dev` | 31,845 | 71.6 | Website crawl — massive but includes multilingual duplicates |
| `/dotnet/aspire` | 1,185 | 71.5 | Runtime source — API internals, playground examples |
| `/communitytoolkit/aspire` | 311 | 64.2 | Community integrations — Golang, Java, Node.js, Vite, Ollama |
| `/dotnet/docs-aspire` | 482 | 71.4 | **Legacy** — being superseded by aspire.dev, avoid for tutorials |

### Visual Studio Code

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/websites/code_visualstudio` | 6,288 | 80.4 | **Primary** — user docs, settings, features, debugging, remote dev |
| `/websites/code_visualstudio_api` | 1,681 | 65.4 | Extension API — webviews, TreeViews, commands, contribution points |
| `/microsoft/vscode-docs` | 8,289 | 87.9 | Docs repo — highest score, markdown source files |
| `/microsoft/vscode-extension-samples` | 320 | 82.4 | Extension samples — working code examples |

### GitHub

| Library ID | Snippets | Score | Coverage |
|---|---|---|---|
| `/websites/github_en` | 43,828 | 66.2 | **Primary** — Actions, API, repos, security, admin, Copilot |
| `/github/docs` | 24,544 | 73.7 | Docs repo — markdown source, higher quality score |
| `/websites/cli_github` | 386 | 83.2 | GitHub CLI reference — gh commands, flags, examples |
| `/websites/cli_github_manual` | 478 | 44.0 | CLI manual — alternative, lower score |

## Query Effectiveness

Good queries are specific:

```
# ❌ Too broad
"Azure Functions"
"VS Code extensions"
"agent framework"

# ✅ Specific
"Azure Functions Python v2 programming model"
"Cosmos DB partition key design best practices"
"VS Code webview API onDidReceiveMessage postMessage"
"GitHub Actions workflow_dispatch inputs matrix strategy"
"Aspire AddUvicornApp Python FastAPI integration"
"DevUI serve agents tracing OpenTelemetry directory discovery"
"ChatCompletionAgent plugin tool calling multi-agent orchestration"
"Agent Framework workflow conditional edges branching handoff"
```

Include context:
- **Version** when relevant (`.NET 8`, `Aspire 13`, `VS Code 1.96`)
- **Task intent** (`quickstart`, `tutorial`, `overview`, `limits`, `API reference`)
- **Platform** for multi-platform docs (`Linux`, `Windows`, `macOS`)
- **Language** for polyglot docs (`Python`, `TypeScript`, `C#`)

### Agent Framework Query Examples

```
# DevUI — setup and running
microsoft_code_sample_search(language="python", query="DevUI agent framework serve agents tracing")
context7_query("/microsoft/agent-framework", "DevUI CLI options port host headless authentication")
context7_query("/websites/learn_microsoft_en-us_agent-framework", "DevUI directory discovery agent workflow __init__.py")

# DevUI — tracing and observability
context7_query("/websites/learn_microsoft_en-us_agent-framework", "DevUI tracing OpenTelemetry debug panel span hierarchy")
microsoft_docs_search("configure tracing agent framework DevUI OTLP_ENDPOINT Jaeger")

# DevUI — API and OpenAI SDK
context7_query("/microsoft/agent-framework", "DevUI POST /v1/responses OpenAI SDK entity_id streaming")
context7_query("/microsoft/agent-framework", "DevUI OpenAI proxy X-Proxy-Backend authentication")

# DevUI — .NET integration
microsoft_code_sample_search(language="csharp", query="DevUI AddDevUI MapDevUI ASP.NET Core agent")
context7_query("/microsoft/agent-framework", "Microsoft.Agents.AI.DevUI AddDevUI MapDevUI ASP.NET Core")

# Semantic Kernel agents
microsoft_code_sample_search(language="python", query="ChatCompletionAgent plugin AgentGroupChat")
context7_query("/websites/learn_microsoft_en-us_semantic-kernel", "ChatCompletionAgent plugin tool calling setup")
context7_query("/websites/learn_microsoft_en-us_semantic-kernel_frameworks_agent", "AgentGroupChat selection strategy termination")

# Agent Framework workflows
context7_query("/websites/learn_microsoft_en-us_agent-framework", "workflow orchestration magentic handoff conditional edge")
microsoft_code_sample_search(language="csharp", query="agent framework workflow WorkflowBuilder AddEdge")

# Cross-framework tracing
microsoft_docs_search("configure tracing AI agent frameworks Foundry Semantic Kernel Agent Framework")
```

## Workflow

1. **Identify the technology** — is it Azure/Learn content, Agent Framework, Semantic Kernel, DevUI, VS Code, GitHub, or Aspire?
2. **Pick the right tool** — use the decision table above to choose between Microsoft Learn MCP and Context7
3. **For Agent Frameworks** — use `microsoft_code_sample_search` for working code, then Context7 for deeper API docs:
   - **DevUI how-to**: Context7 Learn website → code sample search for working examples → Context7 repo for API detail
   - **Semantic Kernel**: Context7 Learn website + code sample search → Context7 repo for advanced samples
   - **Workflow orchestration**: Microsoft Learn search → Context7 Learn website for patterns
4. **For Context7** — resolve the library ID first (if not cached), then query with a specific question
5. **For Microsoft Learn** — search first, then fetch full pages when you need complete tutorials or all config options
6. **Combine tools** — for cross-cutting questions (e.g., "deploy Aspire to Azure", "trace Agent Framework to Azure Monitor"), use multiple sources

## When to Fetch Full Page (Microsoft Learn MCP)

Use `microsoft_docs_fetch` after `microsoft_docs_search` when:
- **Tutorials** — need complete step-by-step instructions
- **Configuration guides** — need all options listed
- **Deep dives** — user wants comprehensive coverage
- **Search excerpt is cut off** — full context needed
- **Agent Framework DevUI docs** — `https://learn.microsoft.com/en-us/agent-framework/user-guide/devui/` for complete setup guide

## Why Use This

- **Accuracy** — live docs and indexed sources, not stale training data
- **Completeness** — full tutorials, not fragments
- **Breadth** — covers the entire Microsoft ecosystem including VS Code, GitHub, Agent Framework repos, and Aspire that live outside learn.microsoft.com
- **Depth** — GitHub repo sources provide API-level detail ahead of published docs
- **Authority** — official Microsoft and first-party documentation
