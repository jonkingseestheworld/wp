# MCP Playwright Browser Automation Setup

**Date:** 2026-01-31
**Goal:** Enable Claude Code to automatically open a browser and check the Jekyll website at localhost:4000 for self-checking code implementation.

---

## What We Successfully Accomplished

| Step | Status | Details |
|------|--------|---------|
| **Node.js Upgrade** | Done | Upgraded from v16.17.0 to **v20.19.6** via Homebrew (`brew install node@20`) |
| **PATH Update** | Done | Added `/opt/homebrew/opt/node@20/bin` to PATH in `~/.zshrc` |
| **Playwright MCP Server Install** | Done | Installed `@playwright/mcp@0.0.62` globally via npm |
| **MCP Server Verification** | Done | Server responds correctly when tested directly with JSON-RPC |
| **Config: ~/.claude/settings.json** | Done | Created with proper MCP server configuration |
| **Config: VSCode settings.json** | Done | Added `claudeCode.mcpServers` configuration |
| **Claude Code CLI Installed** | Done | Installed via `npm install -g @anthropic-ai/claude-code` |

---

## Configuration Files Created

### ~/.claude/settings.json
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "/opt/homebrew/opt/node@20/bin/node",
      "args": ["/opt/homebrew/bin/playwright-mcp"],
      "env": {}
    }
  }
}
```

### VSCode settings.json (excerpt)
```json
{
  "claudeCode.mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "/opt/homebrew/opt/node@20/bin/node",
      "args": ["/opt/homebrew/bin/playwright-mcp"],
      "env": {}
    }
  },
  "chat.mcp.gallery.enabled": true
}
```

---

## What Failed / Obstacles

| Issue | Status | Details |
|-------|--------|---------|
| **MCP tools not available in VSCode extension** | Failed | Despite correct config, Playwright tools never appeared in Claude's available tools |
| **Multiple VSCode restarts** | Failed | Did not resolve the issue |
| **Playwright VSCode extension install** | Failed | Installing it didn't enable MCP tools |
| **`chat.mcp.gallery.enabled` setting** | Failed | Enabling this setting didn't help |

---

## Root Cause Identified

**Known bugs in the Claude Code VSCode extension** (as of January 2026):

1. [Issue #11448](https://github.com/anthropics/claude-code/issues/11448): "MCP tools not exposed to AI assistant despite successful connection"
   - MCP servers connect successfully but tools aren't accessible to the AI
   - Same config works perfectly in Claude Code CLI and Claude Desktop

2. [Issue #19054](https://github.com/anthropics/claude-code/issues/19054): "VSCode does not use MCP servers at all"
   - Terminal/CLI variant works, VSCode extension doesn't

3. [Issue #12992](https://github.com/anthropics/claude-code/issues/12992): "Native UI prevents MCP servers from connecting"
   - Using native UI causes massive delays or failures in MCP loading

---

## Current State

| Component | Status |
|-----------|--------|
| Playwright MCP Server | Installed and working |
| Configuration Files | Correctly set up |
| Claude Code CLI | Installed and should have MCP support |
| Claude Code VSCode Extension | Cannot access MCP tools (known bug) |

---

## Available Workarounds

### Option 1: Use Claude Code CLI (Recommended)
```bash
# Start Jekyll server in one terminal
cd /Users/drjonkl/Desktop/PWebsite/wp
bundle exec jekyll serve

# Open Claude CLI in another terminal
claude

# Then ask Claude to check the site
> Open browser and check localhost:4000
```

### Option 2: Screenshot-Based Approach
- Take manual screenshots of the site at localhost:4000
- Share them in the VSCode chat
- Claude analyzes and provides feedback

---

## Installed Versions

| Package | Version |
|---------|---------|
| Node.js | v20.19.6 |
| npm | 10.8.2 |
| @playwright/mcp | 0.0.62 |
| Playwright | 1.58.1 |

---

## Next Steps

1. **Test CLI**: Run `claude` in terminal to verify MCP works there
2. **Monitor GitHub Issues**: Wait for VSCode extension bug fixes
3. **Use Screenshots**: As fallback in VSCode extension

---

## References

- [Microsoft Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright MCP npm package](https://www.npmjs.com/package/@playwright/mcp)
- [Claude Code VSCode Docs](https://code.claude.com/docs/en/vs-code)
- [Configuring MCP Tools in Claude Code](https://scottspence.com/posts/configuring-mcp-tools-in-claude-code)
