---
name: pr-creator
description: Creates well-documented GitHub pull requests from the current feature branch's commit history and diff. Draft PR title and body from real commit/diff history, show it to the user for review, then create via `gh pr create` only after explicit confirmation. Detects default branch, checks for uncommitted changes, verifies branch isn't already pushed, handles existing PRs gracefully.
disable-model-invocation: true
---

# PR Creator

Drafts a PR title and description from real commit/diff history, shows it to the user, and only calls `gh pr create` after explicit confirmation.

## Requirements

- `gh` CLI installed and authenticated (`gh auth status`)
- Currently on a feature branch, not the repo's default branch

## Workflow

### 1. Sanity checks (do these before drafting anything)

- Detect the actual default branch — don't assume `main`:
  ```
  git symbolic-ref refs/remotes/origin/HEAD --short 2>/dev/null | sed 's@^origin/@@'
  ```
  Fall back to checking if `main` or `master` exists if that fails.
- Confirm the current branch is not the default branch. If it is, stop and tell the user they need to be on a feature branch.
- Check for uncommitted changes (`git status --porcelain`). If there are any, flag it to the user — don't silently ignore or auto-commit them.
- Check if a PR already exists for this branch: `gh pr list --head <branch-name>`. If one does, show it to the user instead of drafting a duplicate.

### 2. Gather real content

- Commits since diverging from the default branch: `git log <default-branch>..HEAD --oneline`
- Full diff for context: `git diff <default-branch>...HEAD`
- Do not invent changes that aren't in the diff. The description must be traceable to actual commits/diff content, not generic boilerplate.

### 3. Push the branch if needed

- Check if the local branch has a remote tracking branch and is up to date: `git status -sb`.
- If the branch hasn't been pushed, or has unpushed commits, tell the user and ask before pushing (`git push -u origin <branch-name>`). Pushing is a real, visible action on the remote — don't do it silently.

### 4. Draft the PR

Generate:
- **Title**: concise, imperative mood, based on the actual commits (not just the branch name)
- **Body**, using this shape as a starting point — adapt it, don't force every section if it doesn't fit:

  ```markdown
  ## Summary
  Brief description of what changed and why, grounded in the actual diff/commits

  ## Changes
  - Specific changes, pulled from the real commit log

  ## Testing
  How to verify this, if determinable from the diff (new tests added, manual steps implied by the change) — don't invent testing steps that aren't evidenced
  ```

  **Optional sections — only include if the user asks for them, or has already indicated in this conversation that they want them:**
  - A checklist (e.g. tests pass / docs updated / no breaking changes). Do not include this by default, and never check boxes off without the user asking you to actually verify them.
  - A screenshots section. Do not include this by default. If the user has screenshots or a way to produce them, ask what to include; otherwise leave it out entirely rather than adding a placeholder no one will fill in.

### 5. Show the draft and wait for confirmation

Present the full title + body to the user exactly as it would be submitted. Ask explicitly: "Create this PR?" or similar.

**Do not run `gh pr create` until the user confirms.** If they want changes, revise and re-show the draft — don't create partway through an edit.

### 6. Create the PR

Once confirmed:
```
gh pr create --title "<title>" --body "<body>"
```

Report back the PR URL that `gh` returns.
