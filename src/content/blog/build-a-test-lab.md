---
title: "Build a small lab for your browser-testing tool"
description: "Build a controlled fixture and answer key, retain incomplete runs, and test the scorer before using it to compare browser-testing tools."
updatedDate: 2026-10-25
pubDate: 2026-10-23
draft: false
tags: [Jevitate, browser testing, test strategy]
heroImage: /assets/blog/build-a-test-lab-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You changed one line in your test tool. Now three runs fail that passed yesterday.

Did the change cause a regression, or did the runs differ for another reason?

Without a known answer and repeated runs, it is hard to tell a regression from variation in the test tool.

A small lab gives you a controlled comparison: an app with deliberately planted defects, an answer key and a script that scores verdicts. The public [Jevitate accuracy lab](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/docs/accuracy.md) supplies the concrete example here; its results describe that fixture and those builds.

Here are seven design decisions for a lab you can inspect and rerun.


## 1. Start with the smallest app that can fail like your users' apps

Use a controlled app for this evaluation. Production testing remains useful, but it does not supply a complete answer key for scoring the testing tool.

Build something tiny instead. The public lab example exercises these jobs:

- update a profile
- send a message to a contact
- import contacts from a CSV

Then add **variants**. Each one changes exactly one behaviour:

- a Save that fails on the server while the page says "Saved"
- a Send button that does nothing
- an Import button that's disabled with no reason
- three extra "Are you sure?" screens: annoying, not broken
- a clean version with nothing wrong

Include a working case so you can count false alarms as well as detected defects. Check that it really satisfies the behavior in the answer key.

The [example app](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/test/fixtures/accuracy-lab/app.mjs) supplies these variants. Start with only the behavior your evaluation needs.


## 2. Write the answer key before you run anything

For every variant, write down what a correct verdict looks like, and put it in a file next to the app.

Define the expected verdict before inspecting the tool's answer. Otherwise, your scoring rule can become a response to the result it is meant to judge.

Review the answer key when a run contradicts it.

The public accuracy report describes a supposedly clean import case that still failed: imported contacts did not appear on the Contacts page.

The report identifies a bug in the fixture's clean case. Check the answer key as well as the testing tool when the two disagree.



## 3. One cell at a time, then a matrix that can resume

A **cell** is one job, one variant, one strategy, one run. Make a script that runs exactly one cell and appends a single JSON line: what happened, how long it took, what the tool reported.

Then make a second script that runs the whole matrix, and **skips cells already recorded**.

Recording each completed cell makes an interrupted experiment inspectable. On resuming, check the run identity and completed-cell keys before skipping work; a new build needs its own results.

Let the runner take the tool's location as a setting, too. You'll want to point the same matrix at two builds.


## 4. Score with a script that has its own test

Use explicit scoring rules so another reviewer can inspect how each verdict was classified. Write a [scorer](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/scripts/accuracy-lab/score.mjs) that puts every cell in a bucket:

- **found**: reported a planted bug
- **missed**: said "all clear" on a broken variant
- **false alarm**: reported a problem on a working variant
- **correctly clear**
- **couldn't tell**: no verdict

Keep "couldn't tell" separate. Count it separately rather than silently treating an unfinished run as a completed verdict.

Test the scorer against a small, fictional set of verdicts whose expected buckets you have written down. Keep that fixture when changing the scoring rules so a changed classification is visible.

Give the scorer a case where the task succeeds with unnecessary steps. That distinguishes an effort finding from a functional failure. Keep that classification in the answer key before comparing builds.


## 5. Record the environment with the verdict

A run that times out on a busy machine does not establish the same thing as a completed run that misses a defect. Record resource pressure, tool version and time budget alongside the verdict. Keep inconclusive runs visible.

Do not silently discard difficult runs after seeing the result. Define exclusions beforehand and report them. If you rerun a case, retain both outcomes and the reason for the rerun.

## 6. Compare builds without confusing time with the change

Suppose a new build misses a planted defect that the previous build found. Alternate the builds over repeated runs rather than running all of one build first. That can reduce the risk that a change in machine load or provider behavior affects only one group.

It cannot eliminate every confound. Keep both builds on the same fixture with fixed budgets, and inspect the transcripts behind a difference before assigning a cause.

If several code changes shipped together, isolate them with a regression case or a controlled comparison. Git's [bisect command](https://git-scm.com/docs/git-bisect) helps locate a commit when the reproduction can distinguish good from bad revisions. An intermittent verdict needs repeated observations and an explicit decision rule.

## 7. Add the variants that make your next change dangerous

Before you tune anything, ask what would make the change risky, then build that variant first.

The pinned accuracy report examines a lower completion threshold against cases that show success while storing nothing. Those cases test what accepting a lower-confidence result could miss.

In that report's calibration sample, incomplete jobs received scores as high as 0.95, overlapping rejected complete jobs. The tested thresholds did not separate those cases. That sample did not justify relaxing the acceptance threshold.

Use imported names that differ from the app's built-in contacts. Otherwise, finding an existing contact could satisfy the check even when the import stored nothing.


## Separate offline checks from live experiments

If the lab calls a paid model, decide when its cost and run time are justified. Offline scorer tests can run separately from live verdict experiments.

Keep the answer key and versioned results with the harness so a later change has a comparison point. A small lab still cannot establish accuracy on every application.

Start with one clean variant and one broken one this week. Write the answer key first. Then run them both, and see what your tool tells you.


## References

1. Git. "git-bisect: Use binary search to find the commit that introduced a bug." https://git-scm.com/docs/git-bisect
2. Jevitate. The seeded-defect lab (`test/fixtures/accuracy-lab`) and its scorer. https://github.com/matt-cochran/jevitate/tree/1a1faf3dae17757eb74e973053eda8dc96f56dee/test/fixtures/accuracy-lab
