---
title: "Keep the reasoning behind an agent's result"
description: "Keep a coding agent’s claim, prediction, observations and conclusion together so another reviewer can reconstruct the decision."
updatedDate: 2026-10-25
pubDate: 2026-10-29
draft: false
tags: [scientific-process, AI agents, debugging, experimentation]
heroImage: /assets/blog/scientific-process-lab-notebook-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

A coding agent reports that a cache race is fixed. A week later, the failure returns. The handoff says tests passed, but it does not identify the experiment, its inputs or the result that supported the diagnosis.

For the engineer reviewing that fix, the missing record matters. Keep the claim, its prediction, the observations and the conclusion together, outside a chat summary. Another reviewer should be able to see what was tested and what remains uncertain.

## Separate the prediction from the result

Consider a hypothetical proposal to add a parallel task runner because coding jobs feel slow. Its premise is “our jobs run one at a time.”

Before opening the records, define a possible counterexample: two execution intervals that overlap. Specify what start and finish mean. Queue-entry timestamps describe a different interval from execution timestamps.

Then inspect a stated time window, retaining missing and incomplete records as limitations. If two execution intervals overlap, the strict claim of serial execution is refuted for that sample. It does not establish that the scheduler makes good use of available capacity.

## Keep the pieces together

An investigation record for that example needs:

- The claim: jobs execute serially.
- The check and prediction: compare execution intervals; overlap would refute strict serial execution.
- The observations: references to the inspected records, their definitions and exclusions.
- The conclusion: what those observations establish, with the sample and limits.

This structure lets a later reviewer distinguish a recorded observation from an interpretation. It also shows where a new investigation should begin.

[scientific-process](https://github.com/praxec/scientific-process) is an open-source Praxec tool for recording hypotheses, experiments, observations and conclusions. Its documented append-only application log keeps corrections as additional events and computes standing from the record. A plain versioned document can preserve the same reasoning.

## Correct the record without hiding the earlier result

Suppose you discover that the timestamps describe queue occupancy. The original check is now inconclusive about simultaneous execution. Add the corrected definition and repeat the appropriate check; retain why the earlier conclusion changed.

An append-only application interface is not tamper-proof storage. Someone with file access can edit files outside the tool. Use suitable access controls and repository review when detecting record changes matters. Remove credentials and personal data before sharing evidence.

For the next agent handoff, ask for the claim, the check that could contradict it and a reference to the observed result. If the evidence does not settle the claim, record that limit rather than converting “tests passed” into a broader conclusion.
