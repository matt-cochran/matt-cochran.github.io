---
title: "Build a tiny lab for your test tool: 7 lessons from mine"
description: "A step-by-step guide to building a seeded-defect lab: the variants, the answer key, the runner, the scorer, and the experiments that tell a real regression from noise."
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

Is that your change? Or did the tool flip a coin again?

If you can't answer in five minutes, you don't have a measurement. You have a mood.

A small lab fixes that. It's an app you control, with bugs you planted, and a script that scores every verdict. I built one for [Jevitate](https://jevitate.com), the browser-testing tool I'm working on, and it caught me shipping a regression I was sure wasn't there.

Here's how to build yours, and the seven things I wish I'd known first.

---

## 1. Start with the smallest app that can fail like your users' apps

Don't test against your production app. You don't know its true bug count, so you can't score anything.

Build something tiny instead. Mine is one plain Node server with three jobs anyone recognises:

- update a profile
- send a message to a contact
- import contacts from a CSV

Then add **variants**. Each one changes exactly one behaviour:

- a Save that fails on the server while the page says "Saved"
- a Send button that does nothing
- an Import button that's disabled with no reason
- three extra "Are you sure?" screens: annoying, not broken
- a clean version with nothing wrong

That last one does more work than any of the others. Without a clean version you can count found bugs, but never false alarms.

The [lab's source](https://github.com/matt-cochran/jevitate/tree/1a1faf3dae17757eb74e973053eda8dc96f56dee/test/fixtures/accuracy-lab) is a single file. Yours can be too.

---

## 2. Write the answer key before you run anything

For every variant, write down what a correct verdict looks like, and put it in a file next to the app.

Do this first. Once you've seen results, you'll write answers that match them without meaning to.

Then, and this is the part that stung, **treat your answer key as a hypothesis**.

After my first round of fixes, the "clean" import kept failing. The tool imported the contacts, opened the Contacts page to check, didn't find them, and reported a problem.

It was right. My clean app saved imports somewhere the Contacts page never read. My lab had a bug, and the tool found it.

When the tool and your key disagree, check both.

---

## 3. One cell at a time, then a matrix that can resume

A **cell** is one job, one variant, one strategy, one run. Make a script that runs exactly one cell and appends a single JSON line: what happened, how long it took, what the tool reported.

Then make a second script that runs the whole matrix, and **skips cells already recorded**.

That second detail saves you. Long runs get interrupted. One of mine was killed partway through when the machine ran low on memory while other projects built in the background. The 11 cells it had finished were already on disk, so I lost minutes, not the afternoon.

Let the runner take the tool's location as a setting, too. You'll want to point the same matrix at two builds.

---

## 4. Score with a script that has its own test

Sorting results by eye is how you fool yourself. Write a [scorer](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/scripts/accuracy-lab/score.mjs) that puts every cell in a bucket:

- **found**: reported a planted bug
- **missed**: said "all clear" on a broken variant
- **false alarm**: reported a problem on a working variant
- **correctly clear**
- **couldn't tell**: no verdict

Keep "couldn't tell" separate. Folding it into passes or failures hides your best signal.

Then give the scorer a test that pins your first baseline: "this recorded run scores 66.7% precision." When you change the scoring rules later, that test tells you whether you changed the numbers or only the code.

My first version counted an "extra effort" finding as a bug. The extra-screens variant scored as three false alarms, though the tool had done exactly the right thing. The scorer was wrong, not the tool.

---

## 5. Run on a quiet machine, and say so

A starved machine produces "couldn't tell" results. Jevitate notices when its host is overloaded and refuses to guess, which is correct, but it means your numbers measure your laptop as well as your tool.

During one of my runs, the load average jumped past 120 because of an unrelated build. Half the cells went inconclusive. Those results told me about the build, not the tool.

So check the load before a run, write it into the log, and rerun cells that ran while it was high. Then compare like with like.

---

## 6. When something gets worse, interleave and bisect

This is the lesson that earned the article.

I'd built a fix for a nasty case: a message the server accepted but never stored, which the tool reported as fine. In my first runs the fix worked. Clean usability runs then dropped to 1 out of 6.

My first instinct was "noise." The tool uses an AI model, after all.

So I tested the instinct. I ran the same cells on the old build and the new build, **alternating them**, so time of day and machine load hit both equally. The old build scored 6 out of 6. That wasn't noise.

Then I turned off one piece of the fix at a time, the same idea as [`git bisect`](https://git-scm.com/docs/git-bisect) but for behaviour. With one small block disabled, clean runs went back to 6 out of 6.

That block added a helpful-sounding note to the tool's history after every page reload. The note was true, but with it in place the tool's later judgments went wrong, and without it they didn't. I removed it and kept the rest. The final fix caught the lost message on 6 of 6 runs, up from 1 of 6. The two clean runs it still flagged traced to known, unrelated causes, not to the fix.

Without interleaving, I'd have blamed randomness. Without bisecting, I'd have reverted the whole fix.

---

## 7. Add the variants that make your next change dangerous

Before you tune anything, ask what would make the change risky, then build that variant first.

I wanted to lower the confidence threshold the tool uses to decide a job is done. It looked harmless. So I added versions where jobs look finished but aren't: success messages over saves that never happened.

The tool's confidence on those fakes went as high as 0.95. No threshold could separate them from real finishes, and lowering it would have meant reporting success on lost data. I didn't lower it.

One more small trap: my import sample used the same two names as the app's built-in contacts. Any check that looked for those names on the Contacts page passed, whether or not the import had worked. Make your test data distinctive enough that you can't find it by accident.

---

## Keep it out of CI, and keep it close

My lab makes real calls to an AI model, so it doesn't run on every pull request. It runs before a release, and whenever I change how the tool reaches a verdict.

That's enough. The point isn't a dashboard. The point is that when three runs fail tomorrow, you can find out in an hour whether it was you.

Start with one clean variant and one broken one this week. Write the answer key first. Then run them both, and see what your tool tells you.

---

## References

1. Mills, H. D. "On the Statistical Validation of Computer Programs." IBM Federal Systems Division, 1972. Summarised in "Bebugging," Wikipedia. https://en.wikipedia.org/wiki/Bebugging
2. Micco, J. "Flaky Tests at Google and How We Mitigate Them." Google Testing Blog, 2016. https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html
3. "Precision and recall." Wikipedia. https://en.wikipedia.org/wiki/Precision_and_recall
4. Git. "git-bisect: Use binary search to find the commit that introduced a bug." https://git-scm.com/docs/git-bisect
5. Jevitate. The seeded-defect lab (`test/fixtures/accuracy-lab`) and its scorer. https://github.com/matt-cochran/jevitate/tree/1a1faf3dae17757eb74e973053eda8dc96f56dee/test/fixtures/accuracy-lab
