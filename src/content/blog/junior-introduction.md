---
title: "Write a coding-agent handoff you can review"
description: "Use a bounded slug-helper example to define scope, acceptance checks and the evidence needed before applying a change."
pubDate: 2026-10-06
updatedDate: 2026-10-25
draft: false
tags: [Junior, AI agents, software development]
heroImage: /assets/blog/junior-introduction-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

When you delegate “clean up this helper” to a coding agent, the agent has to choose what clean means. Reviewing the result then includes reconstructing its interpretation as well as checking the code.

If you want a lower-cost worker to handle a bounded task, start with the result someone else can verify. Keep scope and acceptance decisions with the manager. The price of the model alone does not tell you whether delegation is worthwhile; count repair and review work too.

The [Junior README](https://github.com/matt-cochran/junior) describes a manager-and-worker handoff with a compact receipt and independent checks. The useful planning habit works with another tool as well: state what the worker may change, what behavior you expect and how you will check it.

## A contract, not a prompt

You don't hand Junior a chat message. You hand it a contract: one deliverable, criteria someone else could verify, and the checks that prove it.

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

Review those requirements before execution. A vague contract leaves room for a result that passes the written checks while missing what you intended.

Junior helps here too. Before the worker starts, it can ask Jev, a small classifier model, whether the contract is clear. When it isn't, Junior stops and comes back with numbered questions instead of guessing.

## Check the contract before using a worker

Before a real handoff, check that the criteria distinguish the results you care about. Suppose the slug helper returns two hyphens for two spaces. Does your example catch that? What should happen to punctuation or an empty input?

Ask the manager to resolve those questions before execution. An acceptance check cannot supply a policy you left undecided.

Junior's README documents an offline mock handoff for inspecting the workflow without a paid worker call. Treat that as a setup check, not evidence that an actual worker has implemented the helper. On a real run, review the changed files and independent check results before accepting the work.

## Review, then apply

When a real run comes back ready, review the diff and the check results. If you're happy:

    junior apply slugify-helper

That brings the worktree's changes into your checkout with a three-way merge. It refuses a run that wasn't ready for review, or one whose base has moved, and leaves your tree untouched if anything conflicts.

If the result is close but not right, you write a short repair contract that points at the previous result. If it's wrong, you have the evidence to decide what to do next.

## Keep the execution boundary visible

The public README describes Junior's commodity-model policy and handoff controls. Check your installed version and configuration rather than assuming a particular model, cost or isolation mode from an older article.

For this helper, the reviewable boundary is the contract: only the named helper and its tests should change. If the diff includes unrelated files, investigate why before applying it. An execution tool can report a boundary violation; the manager still decides what to accept.

## Where it falls short

Junior doesn't make a weak model strong. Some tasks need more judgment than a commodity model has, and the right move is to keep those with the manager.

It also moves work rather than removing it. Someone still writes the contract and reviews the result. Compare the work retained by the manager with what the worker actually completed. A difficult handoff may cost more review than doing the task directly.

And "ready for review" is a claim, not a verdict. Passing checks establish the assertions they actually exercise. Inspect requirements that those assertions do not cover.

## Start with one routine task

Pick something on your list you'd hand to a capable junior engineer without a second thought. Write it as a contract with one check that would fail if the work were wrong. Run it with `--mock` first, then for real.

Then read the receipt before you read the diff. If the receipt tells you what you need, compare that review with doing the task in the manager session. Count repair and review work before deciding whether the delegation helped.

For the setup and controls discussed here, start with [Junior's README](https://github.com/matt-cochran/junior). Check the instructions against the version you install.


## References

1. Junior source and README. https://github.com/matt-cochran/junior
2. `@matthew-cochran/junior` on npm. https://www.npmjs.com/package/@matthew-cochran/junior
3. Pi coding agent. https://github.com/earendil-works/pi-coding-agent
