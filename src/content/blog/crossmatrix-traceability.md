---
title: "Know which tests cover which requirements without a spreadsheet"
description: "Crossmatrix keeps needs, features, code, tests and risks cross-referenced, so you can see what's uncovered before it ships."
pubDate: 2026-11-10
draft: false
tags: [traceability, testing, Crossmatrix, AI agents]
heroImage: /assets/blog/crossmatrix-traceability-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Someone asks, "Which tests cover the export feature?"

You know the answer is somewhere. Maybe in a spreadsheet from last spring. Maybe in a wiki page with a "last updated" date nobody wants to look at. Maybe only in the head of the person who left in June.

So you grep for "export", find 40 hits, and make your best guess.

Traceability, knowing which needs map to which features, code, tests and risks, is one of those things every team agrees matters and almost nobody keeps up. Not because people don't care, but because the usual tools make it a chore. And chores that don't break the build don't get done.

Here's how I'm approaching it now, including an honest look at where I've fallen short.

## A traceability matrix rots the day you stop feeding it

The classic tool is a matrix. Requirements down the side, tests across the top, a mark wherever one covers the other. Quality engineers have built these for decades. In product design, the bigger version, needs against engineering characteristics, is called a **House of Quality**.

They all fail the same way:

- **They're filled in bulk, once.** Someone spends a week marking cells before an audit. Then the code moves on.
- **The numbers are invented.** "Strength 7" between a need and a feature. Says who, based on what?
- **Nobody knows when a cell went stale.** The test was rewritten in August. The mark is still there.

A matrix like that isn't traceability. It's a snapshot of what someone believed once.

## Observations with evidence, not numbers

[Crossmatrix](https://github.com/praxec/crossmatrix) is an open-source engine we build as part of Praxec. It's a cross-reference matrix with any number of dimensions: needs, features, code, tests, risks, plan deliverables. It runs as an MCP server, so your AI agent can drive it.

It makes three design choices that address the rot directly:

**1. You record observations, not scores.** A cell holds a word from a fixed scale, like `none`, `weak`, `moderate` or `strong`, plus the evidence for it:

```json
{"kind": "observe", "relationId": "rel_need_char",
 "from": "need_fast", "to": "char_latency",
 "observation": "strong", "provenanceClass": "inferred",
 "evidence": [{"sourceRef": {"sourceRef": "docs/perf.md", "locator": "L10-L24"}}]}
```

A numeric weight is accepted only when it's imported from another system, such as the criticality of a risk from an [FMECA analysis](/blog/fmeca-software-risk/). Nobody types a 7.

**2. It knows when evidence goes stale.** Give it the current file hashes, or let it read the files, and `stale` lists every cell whose evidence has changed since it was recorded. The test was rewritten in August? That cell shows up.

**3. It tells you what to fill next.** `gaps.next` returns the most important members that nothing covers yet. Your agent fills one cell, with evidence, and asks again. Small and steady, instead of a week before the audit.

Support and opposition are kept separate, too. A test that covers a requirement and a change that undermines it don't cancel out. You see both, and the tension between them.

And the store lives in your repository, under `.crossmatrix/`, as plain JSON with an append-only audit log. It changes in pull requests, like the code it describes. `crossmatrix-mcp check` validates it in CI.

## What my own matrix looks like right now

Here's the honest part.

The one real store I have is for Jevitate, my browser-testing tool. It holds **2,600 members**: 1,833 code files, 740 test files and a handful of task traits and playbooks. It passes the integrity check with zero problems.

And it has **zero cells.**

I synced the rosters, every file and every test, and never recorded a single observation between them. The matrix knows what exists. It knows nothing about what covers what.

That's the exact failure I described above, and the tool didn't save me from it. Syncing members is automatic. Recording coverage takes judgment, one cell at a time, and I never made the time.

There's a second scar, from wiring it into [Junior](/blog/junior-introduction/). Junior can export a project plan into the matrix, so deliverables can be traced to files. After a planner update, that export quietly read **zero deliverables**, and the next step failed with "unknown member". The fix was small. But it's a reminder that a traceability tool is only as good as the data flowing into it, and that flow is code too.

## What I'm doing about it

The lesson isn't that matrices don't work. It's that **nobody fills a matrix as a separate job.** It has to happen as a side effect of work you're already doing.

So that's the direction:

- When Junior hands back an accepted change, it can link the files that changed to the feature they serve. That's one observation, with the commit as evidence, recorded at the moment someone knows it's true.
- Before a worker starts, Junior can give it the files already linked to its feature, so the matrix pays for itself by saving a search.
- After a merge, `stale` lists the links to re-confirm.

The Junior commands for that loop exist today: `junior matrix sync`, `link`, `context` and `stale`. I haven't run it long enough to show you results. When I have a matrix with real cells in it, I'll write that one up with the numbers.

## Set it up

It ships as an npm launcher for a checksum-verified binary. In Claude Code:

```sh
claude mcp add crossmatrix --scope user -- npx -y @matthew-cochran/crossmatrix
```

To start a store in your repository and install its agent skills:

```sh
crossmatrix-mcp init
npx -y @matthew-cochran/crossmatrix skills install --target claude --project .
```

The skills cover a House of Quality, jobs to be done, test coverage, risk, prioritization, competitive benchmarking and review. If you use Junior, `junior init` creates the store for you.

## Start with one question you can't answer today

Don't map everything. Pick the question that keeps coming up: *which tests cover exports?*

Record the answer as observations with evidence, one test at a time. Then point `stale` at it after the next refactor.

If the matrix tells you something you didn't know, keep going. If it doesn't, you've lost an afternoon, not a quarter. That's the right size for a first try.

---

## References

1. Crossmatrix source, README and skills. https://github.com/praxec/crossmatrix
2. `@matthew-cochran/crossmatrix` on npm. https://www.npmjs.com/package/@matthew-cochran/crossmatrix
3. Junior 0.8.0 release notes (the export fix, #58). https://github.com/matt-cochran/junior/blob/main/CHANGELOG.md
