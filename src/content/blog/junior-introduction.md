---
title: "Stop paying frontier prices for routine code"
description: "Junior lets a frontier model manage while a cheaper open-weight model does one bounded coding task at a time, then hands back a compact receipt you review."
pubDate: 2026-10-06
updatedDate: 2026-10-23
draft: false
tags: [Junior, AI agents, software development]
heroImage: /assets/blog/junior-introduction-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You open a session with the best coding model you can get. You ask it to plan a feature. It does that well.

Then it spends the next hour renaming a function across eleven files, fixing lint warnings and writing test fixtures. Every file it reads lands in its context. By the time you need its judgment on the hard part, the session is full of routine work, and you've paid frontier prices for all of it.

You wouldn't run a team that way. A senior engineer doesn't type every line. They define the work, hand the routine parts to someone capable, and review what comes back.

[Junior](https://github.com/matt-cochran/junior) lets your AI agent work the same way. Your frontier model stays the manager. A cheaper open-weight model does one bounded task at a time. You get the result back as a short receipt, not a transcript.

## The expensive model should decide, not type

Most coding work isn't hard. It's careful. Add the endpoint, update the tests, keep the style consistent, don't break anything.

Open-weight models can do a lot of that well, at a fraction of the price. What they're worse at is the judgment around it: is this the right change, is the request clear, is the result actually done?

So split the job:

- **The manager** (your frontier model) writes the contract, decides what "done" means and reviews the result.
- **The worker** (a commodity model running in [Pi](https://github.com/earendil-works/pi-coding-agent)) does the bounded task.
- **Junior** sits between them. It runs the worker in a clean Git worktree, runs your checks independently and hands back the evidence.

Junior never accepts its own work. "Ready for review" means exactly that.

## A contract, not a prompt

You don't hand Junior a chat message. You hand it a contract: one deliverable, criteria someone else could verify, and the checks that prove it.

```json
{
  "id": "slugify-helper",
  "deliverable": "Add a slugify(text) helper in src/slug.ts with unit tests",
  "cwd": "/home/you/projects/blog",
  "workflow": "test_first",
  "acceptance": [
    "slugify lowercases, trims and joins words with single hyphens",
    "Characters outside a-z and 0-9 are removed"
  ],
  "constraints": ["Only edit src/slug.ts and src/slug.test.ts"],
  "checks": [{"command": "node", "args": ["--test", "src/slug.test.ts"]}]
}
```

Writing that takes a few minutes, and it's the most valuable few minutes in the whole loop. A vague contract produces a confident, wrong result no matter which model runs it.

Junior helps here too. Before the worker starts, it can ask Jev, a small classifier model, whether the contract is clear. When it isn't, Junior stops and comes back with numbered questions instead of guessing.

## Try a handoff without spending anything

You need Node 24 or newer. Install Junior and set up a project:

```bash
npm install -g @matthew-cochran/junior
junior init
junior doctor
```

`init` writes project defaults and an example contract, `tasks/example-task.json`. `doctor` checks what's ready and tells you what isn't.

Now run that example with `--mock`. It simulates the worker, so there are no API keys and no provider calls:

```bash
junior handoff tasks/example-task.json --mock
```

The receipt that comes back is what your manager model reads instead of a transcript. Trimmed, mine looked like this:

```json
{
  "id": "example-task",
  "outcome": "simulation_passed",
  "execution": { "isolation": "worktree" },
  "changedFiles": [],
  "checks": [
    { "command": "node -e console.log('setup check passed')", "exitCode": 0, "passed": true }
  ],
  "unresolved": [],
  "runtime": { "state": "ready_for_review" }
}
```

On a real run, the same receipt lists the changed files, the model that ran, its token usage and cost when the provider reports one, and anything the worker couldn't resolve. The full logs and diff stay on disk under `.delivery/` for when you need them.

## Review, then apply

When a real run comes back ready, review the diff and the check results. If you're happy:

```bash
junior apply slugify-helper
```

That brings the worktree's changes into your checkout with a three-way merge. It refuses a run that wasn't ready for review, or one whose base has moved, and leaves your tree untouched if anything conflicts.

If the result is close but not right, you write a short repair contract that points at the previous result. If it's wrong, you have the evidence to decide what to do next.

## Guardrails you don't have to remember

A few rules are built in, because they're easy to forget at 6pm:

- **Commodity models only.** Junior refuses frontier models for execution before any money is spent. The default is DeepSeek V4.1 Flash through OpenRouter.
- **No silent upgrades.** Switching to a pricier model needs a human's approval, with the rationale shown first.
- **A clean workspace.** The worker runs in its own worktree. By default it gets only the contract and four tools (read, bash, edit and write), and none of the skills, extensions or context files on your machine.
- **Scope you can see.** If the worker touches files outside the ones the contract owns, the receipt says so.

## Where it falls short

Junior doesn't make a weak model strong. Some tasks need more judgment than a commodity model has, and the right move is to keep those with the manager.

It also moves work rather than removing it. Someone still writes the contract and reviews the result. The saving is that the expensive model spends its time on decisions, and its context window stays clear for them.

And "ready for review" is a claim, not a verdict. Passing checks prove the criteria you wrote, not the ones you forgot.

## Start with one routine task

Pick something on your list you'd hand to a capable junior engineer without a second thought. Write it as a contract with one check that would fail if the work were wrong. Run it with `--mock` first, then for real.

Then read the receipt before you read the diff. If the receipt tells you what you need, you've just kept an hour of routine work out of your most expensive context window.

You'll find the docs, the commands and the toolbelt for planning and risk at [junioragent.dev](https://junioragent.dev).

---

## References

1. Junior source and README. https://github.com/matt-cochran/junior
2. `@matthew-cochran/junior` on npm. https://www.npmjs.com/package/@matthew-cochran/junior
3. Pi coding agent. https://github.com/earendil-works/pi-coding-agent
4. Junior Agent site. https://junioragent.dev
