---
title: "Plant the bugs yourself: how to find out if your testing tool cries wolf"
description: "Use planted defects and working cases to distinguish useful findings from false alarms, with a small Jevitate evaluation and its limits."
updatedDate: 2026-10-25
pubDate: 2026-10-23
draft: false
tags: [Jevitate, browser testing, test strategy]
heroImage: /assets/blog/test-your-testing-tool-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Your browser-testing tool reports a defect. You replay the steps and cannot reproduce it. Was the report wrong, the app intermittent, or the replay missing something?

For a maintainer changing the testing tool itself, production reports alone leave that question difficult to score. A controlled fixture supplies cases with known expected outcomes: some broken, some working. Compare the tool's verdict with the answer for each case, then investigate disagreements.

## Test both the alarm and the silence

Use a small app with a save form. In one variant, Save returns a server error while the page displays success. In another, the save really works. Write the expected result for both before running the tool.

The broken case checks whether the tool finds the defect. The working case checks whether it reports a false alarm. Neither case alone measures both behaviors.

Keep unfinished runs separate. A timeout does not establish that the app works or that it is broken.

## What the Jevitate fixture comparison showed

Jevitate's [October 23 accuracy report](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/docs/accuracy.md) compares two builds on the same 42-cell matrix. A cell combines a job, app variant, testing strategy and repetition. The jobs include profile updates and importing contacts.

The report gives these results for that matrix:

| Measure | Version 0.21.1 | After fixes 638–643 |
| --- | --- | --- |
| Precision, goal strategy | 64.3% | 90.0% |
| Precision, usability strategy | 60.0% | 90.0% |
| Recall, both strategies | 100% | 100% |
| Inconclusive cells | 2 | 0 |

Precision measures the share of positive defect verdicts that were correct. Recall measures the share of expected defect cases detected. The comparison shows why recall alone was insufficient: both builds found the expected defects in this matrix, while false alarms differed.

The report attributes false alarms to specific behaviors, including treating a message form as a chat and interpreting repeated confirmation screens as a stalled wizard. Those are cases a maintainer can investigate and retain as regressions.

This was a small fixture comparison, not an accuracy estimate for arbitrary applications. Later silent-loss cases in the same report exposed misses outside that initial result.

## Add a case that challenges your proposed fix

Suppose a completed task receives confidence just below the tool's acceptance threshold. Lowering the threshold might accept it. What else would that change accept?

The report examines variants that display success but store nothing. In its calibration sample, incomplete jobs received scores from 0.66 to 0.95, overlapping rejected complete jobs. The tested thresholds could not separate the two groups.

That evidence did not justify relaxing the threshold. It identified a different check to investigate: reload a server-backed view and read back the submitted value. The historical report leaves that repair open; it does not prove the repair shipped.

## Check the fixture when the result disagrees

The same report records a bug in the supposedly clean import case: imported contacts did not reach the Contacts page. A report against that case was not automatically a false alarm.

When the tool disagrees with the answer key, inspect both. Retain corrections with the run record so a changed expected result does not silently rewrite the evaluation.

Start with one working case and one planted defect from your own failure modes. Define their expected verdicts, retain inconclusive runs, and read the evidence behind every disagreement. Before changing an acceptance threshold, add the case that would make that change unsafe.
