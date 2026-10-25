---
title: "Plan the work your AI agents do like a project, not a to-do list"
description: "Use a documentation handoff to make dependencies explicit and keep schedule estimates distinct from observed delivery."
updatedDate: 2026-10-25
pubDate: 2026-11-02
draft: false
tags: [CPM, planning, AI agents, Junior]
heroImage: /assets/blog/cpm-critical-path-planning-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Suppose you are coordinating coding agents for a command-line change. One agent is updating the commands, another is checking worker behavior, and a third has been asked to write the documentation. When can that third task safely start?

The documentation needs stable command names and confirmed behavior. An ordered task list leaves those inputs implicit. A dependency plan states them so you can distinguish work that is ready from work that is waiting.

This is a hypothetical example. Use it to inspect your own plan's assumptions rather than infer a delivery-time saving.

The **critical path method** maps task durations and dependencies so you can examine which chain constrains the modeled finish. With coding agents, that dependency map also helps you decide what can safely run at once.

## A plan should be made of things you can check

For this plan, make each deliverable inspectable: **every item in the plan is an artifact.** Not "review the API", but "the API schema, reviewed". Not "testing", but "the test suite for the scope check".

Then each dependency says what it actually consumes. Here is a hypothetical documentation deliverable for a coding project:

    {
      "id": "DOCS10",
      "owned_files": ["README.md", "CHANGELOG.md", "docs/runtime.md", "skills/junior/SKILL.md"],
      "prerequisites": [
        {"id": "CLI10", "consumes": "final command names"},
        {"id": "WIRE10-worker", "consumes": "gate, scope and isolation behaviour to document"}
      ],
      "estimate": {"optimistic": 1, "likely": 2, "pessimistic": 3}
    }

Two things make this useful for agents:

- **`consumes` is a reason.** If you cannot name what one item takes from another, investigate the reason for that edge before using it to constrain the schedule.
- **`owned_files` says what it writes.** Two changes to the same file can conflict. Record that shared ownership as a constraint rather than assuming every otherwise independent task can run safely at once.

## The critical path tells you where to look

Give the planner those deliverables and it finds the **critical path**: the longest chain of dependencies through the plan. Under the current estimates and dependency graph, a delay on that path moves the modeled finish. An off-path item may have slack; new dependencies or resource limits can change which work constrains delivery.

Start there when checking progress, then inspect blocked work, shared resources and changes in scope. Progress on one critical item does not establish that the whole project is healthy.

Then it **levels** the plan against real capacity. A dependency-only schedule omits finite worker capacity. Tell the planner you have three agents and one manager, and it estimates a finish time under those capacity assumptions and which steps are waiting for a person rather than a dependency.

## Try a different plan without wrecking the one you have

Keep the original plan and compare a variant with one proposed dependency change.

The [cpm-planner README](https://github.com/praxec/cpm-planner) documents dependency scheduling, resource limits and plan variants. A reported comparison depends on the estimates and constraints you supplied.

Consider a hypothetical documentation task that depends on two other deliverables: final command names and confirmed worker behavior. The documentation can start once both inputs are stable. It need not wait for an unrelated interface cleanup.

Before removing that dependency, inspect what the documentation actually consumes. If the cleanup changes the command names, the edge is real. If it changes an unrelated screen, the edge may be unnecessary.

Compare the original and revised schedules with the same estimates and capacity limits. A shorter modeled schedule is a reason to examine the variant. It is not evidence that the team has already delivered faster. Keep any coordination cost in the comparison.

## Keep accepted work connected to the plan

A deliverable is not complete merely because its owner reports progress. Keep the acceptance evidence beside the plan item so the next agent can inspect the input it is about to consume.

For the hypothetical documentation task, credit completion only after someone checks the commands against the implementation. Revisit its dependencies if those commands change. That keeps the plan connected to an artifact someone can inspect.

## Start with one honest dependency

Take the task list your agents are working from. For each item, write what it produces, and what it takes from the items before it.

Investigate an edge you cannot explain. Remove it only when you have established that the downstream work does not consume that input, then recompute the path.

Then inspect the resulting path together with resource conflicts and any assumptions that have changed.


## References

1. cpm-planner source, README and skills. https://github.com/praxec/cpm-planner
2. `@matthew-cochran/cpm` on npm. https://www.npmjs.com/package/@matthew-cochran/cpm
3. Junior. https://github.com/matt-cochran/junior
