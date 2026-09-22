---
title: "Introducing Jevitate: neural browser automation with a deterministic spine"
description: "Jevitate is an open-source, local-first browser-automation and testing platform—typed Journeys over Playwright, autonomous exploration bounded by hard guardrails, and a safe MCP surface for agents."
pubDate: 2026-09-22
---

I've released [Jevitate](https://jevitate.com), an open-source browser-automation and testing platform, under the MIT license. It records real browser sessions into reusable, typed **Journeys**, then replays, load-tests, explores, and reviews them from a single CLI—or from an MCP server that coding agents can drive directly.

The short version: `npm i -g @jevitate/cli`, and the source is at [github.com/matt-cochran/jevitate](https://github.com/matt-cochran/jevitate).

## The problem it solves

Most browser testing sits at one of two unhappy extremes. On one end are brittle scripts you hand-write and then hand-maintain—every selector a hostage to the next UI change. On the other are opaque record-and-replay tools that capture a click stream but break the moment anything shifts, with no artifact you can reason about.

More recently there's a third temptation: hand the whole thing to a model and let it "test the app." That fails in a different way. A model narrating its own success is not evidence. If the thing deciding whether a run passed is the same thing that produced the run, you don't have a test—you have a story.

## The approach

Jevitate makes the browser flow a **deterministic, typed artifact** you can replay, parameterize, load-test, and inspect—and it adds AI only where semantic judgment genuinely helps: driving toward a goal, finding defects, reviewing usability. The governing principle is simple:

> Model decisions are hypotheses to verify. Runtime evidence decides pass or fail.

Autonomous exploration is driven by [TypeSafe's Jev](https://typesafe.ai) judgment model, but success is always adjudicated by an independent assertion against real runtime state—never the model's say-so. That separation is the whole point.

## What's in it

- **Record → replay.** Capture a flow by demonstration into a deterministic recording, then parameterize and promote it to a replayable Journey (Screenplay-pattern actions over Playwright).
- **Goal-directed exploration.** Drive to a natural-language goal; a separate assertion decides whether you actually got there.
- **Feature, exploratory, and adversarial testing.** Capability-scoped path discovery, state-coverage exploration, and bounded misuse checked by a trusted hard-signal defect oracle.
- **Regression artifacts.** Turn a reproducible failure into a minimized, deterministic, replayable regression.
- **Self-healing under policy.** Repair a broken step within bounds—never auto-healing a write or an irreversible action.
- **UX review.** Ranked, cited, evidence-anchored usability findings drawn from Nielsen and cognitive-science heuristics—advisory only.
- **Load testing** of a Journey against an origin you're authorized to hit.
- **An MCP server** that exposes only an allowlisted, safe tool surface to agents like Claude Code, Codex, and Cursor.

## Safety is a design constraint, not a footnote

Every autonomous run is bounded—step, time, and budget caps by default—and restricted to origins you explicitly authorize. Secrets are origin-bound and never stored, and credentials are never sent to a model. Self-healing will fix a flaky read; it will not silently rewrite a destructive action. These aren't warnings in a README; they're invariants the tool is built to hold.

This is the same conviction that runs through the rest of my work: let probabilistic systems do the probabilistic part, and keep authority—state, tools, approvals, and evidence—in code you can audit.

## Try it

```bash
npm i -g @jevitate/cli
jevitate init
jevitate record --url https://example.test
jevitate explore --url https://example.test --goal "reach the confirmation page" --success urlIncludes:/confirmed
jevitate mcp   # start the allowlisted MCP server for your agent
```

Docs and examples live at [jevitate.com](https://jevitate.com), and the code—issues and contributions welcome—is on [GitHub](https://github.com/matt-cochran/jevitate). If you put it to work, I'd genuinely like to hear what breaks and what holds.
