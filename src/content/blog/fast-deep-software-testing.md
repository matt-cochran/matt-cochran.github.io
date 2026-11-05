---
title: "Fast Feedback Without Giving Up Deep Testing"
description: "A two-speed verification architecture for deterministic journeys: one fast release lane, one exhaustive assurance lane, and proof receipts that connect them."
pubDate: 2026-10-25
draft: true
tags: [Jevitate, browser testing, CI, test strategy, TRIZ]
heroImage: /assets/blog/fast-deep-software-testing-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Software teams are often forced into a false choice: run shallow tests quickly, or run strong tests slowly.

That is the wrong system boundary.

The better design is to preserve both kinds of evidence while asking for them at different times. A release needs fast evidence that the known user flow still works. A testing system also needs deep evidence that its test can detect important failures. Those are different questions, so they should not share one serial gate.

## The hidden multiplier in a “single” test

Consider a deterministic browser Journey with six write steps. Its mutation verifier checks two failure modes for every write:

1. skip the write and confirm the Journey notices;
2. block the write and confirm the Journey notices.

The full proof is therefore:

```text
1 baseline replay + (6 write steps × 2 mutations) = 13 replays
```

In one release investigation, those 13 planned replays took roughly 94 minutes because the application generated three design directions before the Journey refined, approved, published, and checked the result. A command that looked like one test actually represented more than an hour of serial work.

The test was not exploratory. Every replay followed a deterministic plan. The delay came from **proof cardinality**: the number of executions hidden behind the command.

Make that cardinality visible before execution. Jevitate now exposes the same planner its mutation proof uses without opening a browser, target, fixture, hook, or session:

```bash
jevitate journey verify r1-j-taste-live-01 --plan --json
# 12 mutations · 38 assertion pairs · 22 assertions · minimum 13 replays
```

The plan also names each assertion paired to each mutation. That catches a final publish check accidentally attached to an earlier write before a 94-minute proof discovers the mistake.

## Ask two different questions

A routine release gate should answer:

> Does the promoted Journey still complete against this candidate?

A deep assurance run should answer:

> Does the Journey still detect each important mutation of its write behavior?

Running the second question for every change provides strong evidence, but much of that evidence is repeated when neither the Journey nor its relevant contract changed.

The solution is a two-lane verification architecture.

### Fast lane: deterministic release evidence

For every pull request and release candidate:

- select Journeys affected by the changed routes or capabilities;
- restore a known fixture;
- replay each promoted Journey once;
- run its invariants, goals, and end-state checks;
- fail on a defect, inconclusive result, stale proof dependency, or changed contract.

This is the synchronous gate. Its budget should be explicit—15 minutes in this example.

### Deep lane: mutation assurance

Run the exhaustive mutation matrix when:

- executable Journey content changes;
- verifier semantics change;
- a relevant application, environment, or fixture contract changes;
- a defect shows that the fast lane missed something;
- the scheduled assurance run comes due.

The deep lane is not optional. It is conditionally mandatory.

## Connect the lanes with proof receipts

The fast lane can reuse deep evidence only when a machine-verifiable receipt binds that evidence to everything that affects its meaning. At minimum, the receipt should cover:

- executable Journey content and success checks;
- verifier version and mutation strategy;
- relevant application routes or capability contract;
- environment and fixture contract;
- result, timestamp, and evidence location.

Changing any bound input invalidates the receipt. A cache key that covers only the Journey file is too weak: the same Journey can mean something different against a changed fixture or verifier.

This makes reuse an evidence decision, not a time-based shortcut.

```text
valid deep receipt + unchanged bound inputs
    → run the fast deterministic gate

missing or stale deep receipt
    → require fresh mutation assurance
```

## Parallelize proof, not state

Mutation cases are usually independent computations, but browser tests often share mutable state. Parallelizing them safely requires one isolated fixture and execution slot per case.

Do not point 14 mutations at one tenant and call that concurrency. Shard the cases only after isolating their database state, browser session, generated artifacts, ports, and cleanup ownership. Then the wall-clock duration approaches the slowest shard instead of the sum of all shards.

Prebuilding an immutable post-generation fixture can remove another repeated cost. If every mutation starts after the same expensive setup, generate it once, bind its hash into the proof contract, and clone it into each isolated slot.

## TRIZ makes the architecture obvious

This is a real technical contradiction: reducing release latency can reduce regression-detection depth if exhaustive proof is simply removed.

Several [TRIZ inventive principles](https://triz.org/principles/) point to the same architecture:

- **Local quality:** use different verification policies for routine releases and assurance events.
- **Segmentation:** separate baseline replay from mutation cases, then split mutations into independent shards.
- **Asymmetry:** do not apply the most expensive proof uniformly to every change.
- **Continuity of useful action:** run independent proof in parallel and move scheduled assurance off the synchronous release path.
- **Extraction:** remove repeated fixture generation from every replay.
- **Dynamicity:** choose the proof depth from evidence about what changed.

The result is not “test less.” It is **test at the right depth for the decision being made**.

## Put policy in the right layer

For a reusable testing tool, this design spans four layers:

1. **The verification engine** owns proof hashes, invalidation, mutation planning, safe sharding, and receipts.
2. **The CLI and CI integration** expose fast and deep modes, budgets, changed-scope selection, artifacts, and honest exit codes.
3. **Agent skills and documentation** teach when each mode applies and require cardinality estimates before expensive runs.
4. **Each application repository** declares its release budget, isolation topology, scheduled deep run, and which changes invalidate proof.

An orchestration tool can estimate expanded work generically, but it should not reimplement the testing tool’s semantics. The testing tool must remain the source of truth for how one command expands into executions and which receipt is valid.

## A practical adoption sequence

Start without weakening today’s gate:

1. Run `journey verify --plan`; inspect its pairs, unpaired assertions, and replay floor before execution.
2. Split baseline replay from mutation proof in CI.
3. Bind mutation receipts to executable content and relevant contracts.
4. Add changed-scope selection for the fast lane.
5. Add isolated mutation sharding.
6. Move the full matrix to Journey-change, contract-change, and scheduled triggers.

Measure three things: fast-lane latency, time since the last valid deep proof, and defects that escaped the fast lane. If escaped defects rise, strengthen the invalidation rules or fast checks. Do not hide the signal by weakening the assertions.

Fast delivery and high assurance are compatible when evidence is reusable, invalidation is explicit, and exhaustive work is parallelized instead of repeated blindly.
