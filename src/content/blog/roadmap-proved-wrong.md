---
title: "Before building a roadmap item, test the premise behind it"
description: "Use one proposed parallel runner to distinguish a plausible feature from a problem your records can actually establish."
updatedDate: 2026-10-25
pubDate: 2026-10-23
draft: false
tags: [product development, experimentation, AI agents, Junior]
heroImage: /assets/blog/roadmap-proved-wrong-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

A parallel runner sounds like a sensible fix when your coding jobs feel slow. Before building it, check the premise: are the jobs actually running one at a time?

For an engineer deciding what to improve next, this separates a plausible feature from the problem it is meant to solve. A roadmap item is an action. Its justification is a claim you can investigate.

## Turn the feature into a testable premise

Consider a hypothetical team with slow agent runs and a proposal to add parallel execution. Write the premise as: “Our jobs execute serially, so otherwise independent work has to wait.”

The statement contains two questions. Do execution intervals overlap? And is there independent work that could use more capacity? Start with the first because the records may already answer it.

Write down what would refute strict serial execution before opening the logs: two jobs doing work at the same time. That gives you a check whose result can disagree with the proposal.

## Make sure the timestamps mean what you think

Collect start and finish times for a defined set of completed jobs. Use execution times, not the time a request entered the queue. Note missing records, cancelled jobs and clock differences rather than silently treating them as ordinary runs.

For each job, compare its interval with the others. If one starts before another finishes, the records show overlap under those timestamp definitions.

That result refutes the claim that every job runs serially in this sample. It does not show that the current scheduler uses capacity well. Overlapping intervals may include waiting for I/O or a person; they do not by themselves measure simultaneous useful work.

## Choose the next question from the result

If there is no overlap, inspect why. The queue may be serial, or the tasks may depend on one another. A new runner cannot make a genuinely dependent task ready sooner.

If there is overlap, investigate queue waits, resource limits and the work that remains blocked. A scheduler change might still help, but it needs a more specific justification than “nothing runs in parallel.”

Keep the original proposal, the query and its interpretation together. That way, a future discussion can start from the evidence rather than repeating the same assumption.

## Test a new check before relying on it

The same discipline applies to the guardrails you add. In Junior's public [clarity-gate decision record](https://github.com/matt-cochran/junior/blob/515139f719b76ef8821b6018f77c22aea47dc544/docs/adr/0009-contract-clarity-before-delegation.md), a replay over recorded work exposed a gate condition that would stop almost every run. Tests that checked individual cases had not measured that distribution.

That record describes one project’s gate and replay sample. It does not establish a suitable threshold for another project. The reusable lesson is to check both intended rejections and acceptable work before deploying a gate.

Take one roadmap item and write the premise it depends on. Choose an observation that could refute it. Then decide whether the result supports the proposed feature, a narrower investigation or a different problem entirely.
