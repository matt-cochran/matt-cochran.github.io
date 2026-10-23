---
title: "Plan the work your AI agents do like a project, not a to-do list"
description: "CPM planning for agent work: deliverables as artifacts, a critical path you can see, variants you can compare and earned value that tells you the truth."
pubDate: 2026-11-02
draft: false
tags: [CPM, planning, AI agents, Junior]
heroImage: /assets/blog/cpm-critical-path-planning-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You give your agents a task list. Twelve items, nicely ordered.

Two hours later, three agents are waiting on the one item nobody started. Another has finished something that two other items were supposed to change first. And when someone asks "are we on track?", the honest answer is a shrug.

A to-do list tells you what's left. It doesn't tell you what's in the way, what can run at the same time, or whether you're late.

Project managers solved this in the 1950s with the **critical path method**. It's not glamorous. But when the workers are AI agents that can run in parallel, it matters more than it ever did, because you're not just ordering tasks. You're deciding what can safely run at once.

## A plan should be made of things you can check

Here's the first rule, and it changes everything after it: **every item in the plan is an artifact.** Not "review the API", but "the API schema, reviewed". Not "testing", but "the test suite for the scope check".

Then each dependency says what it actually consumes. Here's a real deliverable from the plan for [Junior](/blog/junior-introduction/) 0.10:

```json
{
  "id": "DOCS10",
  "owned_files": ["README.md", "CHANGELOG.md", "docs/runtime.md", "skills/junior/SKILL.md"],
  "prerequisites": [
    {"id": "CLI10", "consumes": "final command names"},
    {"id": "WIRE10-worker", "consumes": "gate, scope and isolation behaviour to document"}
  ],
  "estimate": {"optimistic": 1, "likely": 2, "pessimistic": 3}
}
```

Two things make this useful for agents:

- **`consumes` is a reason.** If you can't say what one item takes from another, the dependency probably isn't real, and it's stretching your schedule for nothing.
- **`owned_files` says what it writes.** Two items that touch the same file can't safely run at the same time. The planner knows that, so it won't hand them to two agents at once.

## The critical path tells you where to look

Give the planner those deliverables and it finds the **critical path**: the longest chain of dependencies through the plan. Anything on it that slips makes the whole project late. Anything off it has some slack.

That one line answers most status meetings. If the critical-path item is moving, you're fine. If it isn't, nothing else matters much.

Then it **levels** the plan against real capacity. The critical path assumes unlimited workers. You don't have those. Tell the planner you have three agents and one manager, and it shows you the real finish time and which steps are waiting for a person rather than a dependency.

## Try a different plan without wrecking the one you have

This is the part I use most. You can **fork** the plan into a variant, change one thing, and compare.

The planner I use, [cpm-planner](https://github.com/praxec/cpm-planner), is an open-source server we build as part of Praxec. It simulates each variant, runs a Monte Carlo spread on the estimates, and tells you which one wins on finish time, risk and effort.

Three real comparisons from Junior's releases:

**A split that saved nothing.** For 0.6, an automated review suggested splitting three deliverables along their interfaces so more could run in parallel. I built that variant. Compared side by side: makespan 14 hours against 14, effort 28 against 28. Identical. I kept the original. A variant that changes nothing is still an answer: it means the idea wasn't worth the extra coordination.

**A reorder that paid off.** For 0.8, a "fixtures first" variant put the recorded test data ahead of the code that used it. It finished in 6.75 hours against 8.25, and its risk band dropped from high to in target. That one I picked.

**A false dependency.** For 0.10, a review flagged that one deliverable didn't really need another to finish first. Moving that edge cut the plan's makespan from 12 hours to 10.

None of these were big. Together, they're the difference between guessing and knowing.

## Earned value tells you if you're late before it's obvious

Once a plan starts, take a **baseline**: freeze the schedule and the budget. Then the planner tracks **earned value** against it.

You don't need the whole acronym soup. Two numbers do most of the work:

- **SPI**, the schedule performance index: above 1 means ahead, below 1 means behind.
- **CPI**, the cost performance index: the same idea for effort.

If both of the last two snapshots read below 0.9, the planner raises an alert. That's your early warning, days before a missed date makes it obvious.

Junior's own development has run on this for fifteen plans: **227 deliverables, every one complete.** The 0.10 release closed at 100% earned value with an SPI of 1.10.

## The numbers can lie to you, too

I'd love to tell you the CPI proves agents are seven times faster than my estimates. It doesn't.

**CPI compares actual hours to my own guesses.** And "actual hours" are whatever got recorded. Some deliverables in the 0.10 plan show 0.01 hours of effort, which isn't real work, it's a lease that opened and closed. A CPI of 7.29 there says more about my bookkeeping than about anyone's speed.

**Re-baselining can break SPI.** When I re-baselined one release a dozen times as scope grew, the planned value right after each re-baseline was almost zero, and SPI briefly read 289,285. It's a real edge case in the tool, and a reminder to read the trend, not a single snapshot.

**Monte Carlo needs ranges to mean anything.** Most of my deliverables have point estimates, so the P80 finish time sits only 5 to 13% above the plain schedule. Give the planner a three-point estimate, like DOCS10 above, and the spread starts telling you something.

**And the comparison picks a winner even on a tie.** In the 0.6 case, it "recommended" the split variant on a tie-break. Read the scores, not only the recommendation.

## Set it up

Install it from npm and register it with your agent host. In Claude Code:

```sh
npm install -g @matthew-cochran/cpm
claude mcp add --transport stdio --scope user cpm-planner -- cpm-planner
```

Write the plan as a file under `.cpm-planner/plans/<name>/main.json`, then lint and sync it. If you use Junior, you don't need to register anything:

```sh
junior tools call cpm plan.lint path=.cpm-planner/plans/<name>/main.json
junior tools call cpm plan.status plan_id=<id>
```

## Start with one honest dependency

Take the task list your agents are working from. For each item, write what it produces, and what it takes from the items before it.

Some of those dependencies won't survive the question. Cross them out. What's left is your real critical path.

Then you'll know which one thing to watch.

---

## References

1. cpm-planner source, README and skills. https://github.com/praxec/cpm-planner
2. `@matthew-cochran/cpm` on npm. https://www.npmjs.com/package/@matthew-cochran/cpm
3. Junior. https://github.com/matt-cochran/junior
