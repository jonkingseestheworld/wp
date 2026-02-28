# MCP Playwright Browser Automation Setup - Complete Summary

**Date:** 2026-02-08
**Project:** Jekyll Website at `/Users/drjonkl/Desktop/PWebsite/wp`
**Objective:** Enable Claude Code to automatically open a browser for self-checking website implementation at localhost:4000

---

## Section 1: Prerequisites & Environment Setup

### Actions Taken

| Action | Result | Details |
|--------|--------|---------|
| Checked existing Node.js version | v16.17.0 | Too old - required ≥18 for Playwright MCP |
| Checked Homebrew installation | Installed | Version 4.6.20 available at `/opt/homebrew/bin/brew` |
| Installed Node.js 20 via Homebrew | **Success** | `brew install node@20` installed v20.19.6 |
| Updated PATH in ~/.zshrc | **Success** | Added `/opt/homebrew/opt/node@20/bin` to PATH |
| Verified new Node.js version | **Success** | Node v20.19.6, npm 10.8.2 confirmed |

### Installed Versions
```
Node.js: v20.19.6
npm: 10.8.2
Homebrew: 4.6.20
```

---

## Section 2: Playwright MCP Server Installation

### Actions Taken

| Action | Result | Details |
|--------|--------|---------|
| Attempted `npm install -g @modelcontextprotocol/server-playwright` | **Failed** | Package not found (wrong package name) |
| Searched for correct package name | **Success** | Found official package: `@playwright/mcp` |
| Installed `@playwright/mcp` globally | **Success** | Installed v0.0.62 with Playwright 1.58.1 |
| Verified MCP server responds | **Success** | Server responds to JSON-RPC initialize request |
| Tested MCP server command | **Success** | `/opt/homebrew/bin/playwright-mcp` available |

### Installed Versions
```
@playwright/mcp: 0.0.62
Playwright: 1.58.1
```

---

## Section 3: Configuration Files Setup

### Actions Taken

| Action | Result | Details |
|--------|--------|---------|
| Created `~/.claude/settings.json` | **Success** | MCP server configuration added |
| Updated VSCode `settings.json` | **Success** | Added `claudeCode.mcpServers` configuration |
| Added `"type": "stdio"` field | **Success** | Synced both config files with proper format |
| Enabled `chat.mcp.gallery.enabled` | **Success** | Set to `true` in VSCode settings |

### Configuration Files Created

**~/.claude/settings.json**
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

**VSCode settings.json (relevant excerpt)**
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

## Section 4: VSCode Extension Attempts

### Actions Taken

| Action | Result | Details |
|--------|--------|---------|
| Restarted VSCode multiple times | **Failed** | MCP tools never appeared in Claude's available tools |
| Installed Playwright VSCode extension | **Failed** | Did not enable MCP tools for Claude |
| Checked VSCode Output panel for errors | **No errors** | No MCP-related error messages found |
| Checked Claude debug logs | **No errors** | Logs showed query processing but no MCP loading errors |
| Reloaded VSCode window (Developer: Reload Window) | **Failed** | MCP tools still not available |

---

## Section 5: Claude Code CLI Installation

### Actions Taken

| Action | Result | Details |
|--------|--------|---------|
| Checked if CLI was installed | Not installed | `which claude` returned not found |
| Installed Claude Code CLI | **Success** | `npm install -g @anthropic-ai/claude-code` |
| Verified CLI installation | **Success** | Debug logs showed MCP configs loading |

---

## Section 6: Root Cause Analysis

### Investigation Results

Web search revealed **known bugs** in the Claude Code VSCode extension (as of February 2026):

| GitHub Issue | Description |
|--------------|-------------|
| [#11448](https://github.com/anthropics/claude-code/issues/11448) | MCP tools not exposed to AI assistant despite successful connection |
| [#19054](https://github.com/anthropics/claude-code/issues/19054) | VSCode extension does not use MCP servers at all |
| [#12992](https://github.com/anthropics/claude-code/issues/12992) | Native UI prevents MCP servers from connecting |
| [#11959](https://github.com/anthropics/claude-code/issues/11959) | MCP Server Error -32601 (Method not found) |

### Key Finding
The Claude Code CLI (terminal version) works correctly with MCP servers, but the VSCode extension has known integration issues that prevent MCP tools from being exposed to the AI assistant.

---

## Section 7: Summary of Successes

| Component | Status | Notes |
|-----------|--------|-------|
| Node.js v20 | ✅ Installed | Via Homebrew, PATH configured |
| Playwright MCP Server | ✅ Installed | v0.0.62, responds correctly |
| ~/.claude/settings.json | ✅ Created | Proper MCP configuration |
| VSCode settings.json | ✅ Updated | MCP server config added |
| Claude Code CLI | ✅ Installed | Should have MCP support |
| MCP Server Test | ✅ Passed | Server responds to JSON-RPC |

---

## Section 8: Summary of Failures

| Component | Status | Reason |
|-----------|--------|--------|
| MCP in VSCode Extension | ❌ Failed | Known bug in extension |
| Browser automation in VSCode | ❌ Failed | MCP tools not exposed |
| Multiple VSCode restarts | ❌ Failed | Did not resolve issue |
| Playwright VSCode extension | ❌ Failed | Didn't enable MCP tools |

---

## Section 9: Current State

| Component | Status |
|-----------|--------|
| Playwright MCP Server | ✅ Installed and working |
| Configuration Files | ✅ Correctly set up |
| Claude Code CLI | ✅ Installed (MCP should work) |
| Claude Code VSCode Extension | ❌ Cannot access MCP tools |

---

## Section 10: Future Recommendations & Next Steps

### Immediate Options

1. **Test Claude Code CLI**
   ```bash
   # Terminal 1: Start Jekyll server
   cd /Users/drjonkl/Desktop/PWebsite/wp
   bundle exec jekyll serve

   # Terminal 2: Run Claude CLI
   claude

   # Then ask: "Open browser and check localhost:4000"
   ```

2. **Use Screenshot-Based Approach in VSCode**
   - Take manual screenshots of site at localhost:4000
   - Share in VSCode chat for Claude to analyze
   - Works immediately, no additional setup needed

### Future Possibilities

| Option | Description | When to Try |
|--------|-------------|-------------|
| **Monitor GitHub Issues** | Watch [#11448](https://github.com/anthropics/claude-code/issues/11448), [#19054](https://github.com/anthropics/claude-code/issues/19054) for fixes | Ongoing |
| **Update Claude Code Extension** | Check for new VSCode extension versions | When updates available |
| **Try Alternative MCP Servers** | Test `@executeautomation/playwright-mcp-server` | If official package continues to fail |
| **Use Claude Desktop** | MCP reportedly works in Claude Desktop app | If CLI doesn't work |
| **Try npx approach** | Use `npx @playwright/mcp@latest` instead of global install | If current setup fails in CLI |

### Alternative MCP Configuration (npx)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### Security Considerations for Future Use
- Restrict browser automation to localhost only
- Use isolated browser profiles without saved credentials
- Review actions before confirming in production environments

---

## References

- [Microsoft Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright MCP npm package](https://www.npmjs.com/package/@playwright/mcp)
- [Claude Code VSCode Docs](https://code.claude.com/docs/en/vs-code)
- [Configuring MCP Tools in Claude Code](https://scottspence.com/posts/configuring-mcp-tools-in-claude-code)
- [Install Playwright MCP Server in VS Code](https://dev.to/debs_obrien/install-playwright-mcp-server-in-vs-code-4o91)

---

## Appendix: Commands Used

```bash
# Node.js installation
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc

# Playwright MCP installation
/opt/homebrew/opt/node@20/bin/npm install -g @playwright/mcp

# Claude Code CLI installation
npm install -g @anthropic-ai/claude-code

# Verify installations
/opt/homebrew/opt/node@20/bin/node --version
/opt/homebrew/opt/node@20/bin/npx playwright --version
which playwright-mcp

# Test MCP server
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | /opt/homebrew/opt/node@20/bin/node /opt/homebrew/bin/playwright-mcp
```
