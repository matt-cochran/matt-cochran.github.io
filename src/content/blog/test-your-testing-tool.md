---
title: "Plant the bugs yourself: how to find out if your testing tool cries wolf"
description: "Your test tool flags a failure, and you lose an hour proving the code works. Here's a one-afternoon way to measure how often its verdicts are right, with real numbers from mine."
pubDate: 2026-10-23
draft: false
tags: [Jevitate, browser testing, test strategy]
heroImage: /assets/blog/test-your-testing-tool-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

It's 4:40 on a Friday. CI is red.

You open the report, retrace the steps, poke at the page. Everything works. Forty minutes later you mark it "flaky" and merge.

Next week it happens again. By the third time, you stop reading the reports closely. That's the moment a real bug slips through.

Here's the uncomfortable part: you probably have no idea how often your testing tool is right. You know roughly how often it complains. You don't know how many of those complaints are true.

You can find out in an afternoon. You plant the bugs yourself, run the tool, and count.

---

## The question nobody measures

Every testing tool makes two promises.

It will **find what's broken**. And it will **stay quiet about what isn't**.

Teams check the first promise all the time. A bug escapes, someone asks why the tests missed it, and a new test appears.

The second promise rarely gets checked. False alarms don't cause outages. They cause something slower: people learn to ignore the alarm.

Google saw this at scale. In 2016, its testing team reported that almost 16% of its tests showed some flakiness, and that "it is quite common to ignore legitimate failures in flaky tests due to the high number of false-positives."

A false alarm isn't free. You pay for it in attention.

---

## Build a tiny app with known answers

The idea is old. In 1972, Harlan Mills suggested seeding a program with known faults to estimate how many real ones a review would catch. It's sometimes called *bebugging*.

You're doing the same thing to your test tool.

I did this for [Jevitate](https://jevitate.com), the browser-testing tool I'm building. The lab is a deliberately small web app with three everyday jobs: update a profile, send a message to a contact, and import contacts from a CSV.

The app starts in one of several versions:

- **Clean.** Nothing is wrong. Every job works.
- **One planted bug each.** A Save that fails on the server while the page still says "Saved." A Send button that does nothing. An Import button that's disabled with no explanation.
- **Works, but tediously.** Three extra "Are you sure?" screens before the import. Annoying, not broken.

Then comes the step people skip: **write down the right answer for every version before you run anything.**

If you write the answers after you see the results, you'll grade the tool on a curve. You won't even notice you're doing it.

---

## Score every verdict, including "I couldn't tell"

Run each job against each version a few times. I used three runs per combination, 42 runs in all, because a tool that uses an AI model doesn't behave identically twice.

Then put every result in one of five buckets:

1. **Found:** it reported a planted bug.
2. **Missed:** it said "all clear" on a broken version.
3. **False alarm:** it reported a problem on a working version.
4. **Correctly clear:** it said "all clear" on a working version.
5. **Couldn't tell:** the run ended without a verdict.

Keep the last bucket separate. A tool that says "I don't know" is being honest. If you fold those runs into passes or failures, you hide your most useful signal.

Now you can compute two numbers that matter. **Precision** is the share of reported problems that were real. **Recall** is the share of planted bugs it found.

---

## The tool found every bug, and still wasted my time

My first run scored perfectly on recall. Every planted bug was found.

Precision told a different story. More than a third of the problems it reported were on code that worked.

That's the Friday afternoon from the top of this post, quantified.

The totals didn't explain why. The run transcripts did. Almost every false alarm traced back to one of a few specific behaviours:

- **A message form looked like a chatbot.** The page had a Contact picker, a message box and a Send button. The tool treated it as a chat with the app, typed its whole instruction as the message, then waited 60 seconds for a reply. After every send.
- **Picking the already-selected option was refused.** The dropdown already showed the right column. The tool tried to confirm it, got refused, and wandered off.
- **Identical wizard screens looked frozen.** Three confirmation screens shared the same buttons, so each click seemed to change nothing. The tool gave up one screen before the finish.

None of these was "the AI is flaky." Each was a precise cause you could write a test for.

---

## What changed when I fixed the causes

I fixed those behaviours and reran the same 42 runs on the same lab:

| | Before | After |
|---|---|---|
| Precision, goal-directed runs | 64% | 90% |
| Precision, usability reviews | 60% | 90% |
| Planted bugs found | 100% | 100% |
| Runs with no verdict | 2 | 0 |
| Time for all 42 runs | 30 min | 6.5 min |

The time drop surprised me. Most of it came from the tool no longer waiting a minute for chat replies that were never coming.

A caveat, because you should ask: this is one small app with three runs per combination. It shows the direction and the size of the change. It doesn't promise you 90% on your app. The [full method and results](https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/docs/accuracy.md) are in the repository, and the lab ships with the tool so you can rerun it.

---

## Sometimes the tool is right and your answer key is wrong

After the fixes, the "clean" import still failed now and then.

I read the transcript. The tool imported the contacts, opened the Contacts page to check them, didn't find them, and reported a problem.

It was right. My clean app saved imports somewhere the Contacts page never looked.

The bug was in my answer key.

So when the tool and your expectations disagree, check both. Ground truth is a hypothesis too.

---

## Before you turn a dial, test what could go wrong

One stubborn false alarm remained. Sometimes the tool judged a finished job as unfinished, with its confidence just below the cut-off.

The obvious fix was to lower the cut-off. It looked harmless.

So I asked a different question: what happens to jobs that *look* finished but aren't?

I added versions where Send and Import show success but quietly store nothing. That settled it. The tool's confidence on those fake successes went as high as 0.95. No cut-off could separate real finishes from fake ones, and lowering it would have meant reporting success on lost data.

Those same versions exposed a real hole. A message the server accepted but never stored was reported as fine, because the page showed it right after sending.

The fix wasn't a number. The tool now checks that what it sent appears on a page freshly loaded from the server before it trusts it.

Without the fake-success versions, I would have tuned a dial and shipped a tool that confirms data loss.

---

## Try it on your own tools this week

You don't need a big harness. Start here:

1. **Build the smallest app with your real failure modes.** A success message that lies. A button that does nothing. A dead end.
2. **Write the right answers first.** One line per version, before any run.
3. **Include a clean version and an "annoying but working" one.** They catch false alarms.
4. **Run each combination a few times on a quiet machine.** Keep "couldn't tell" separate.
5. **Score, then read the transcripts behind every miss and every false alarm.**
6. **Before changing a threshold, add the cases that would make the change dangerous.**

The numbers matter less than the habit.

Once you've measured your tool, every change after that has something to be judged against. And the next red build on a Friday afternoon is something you can believe.

---

## References

1. Micco, J. "Flaky Tests at Google and How We Mitigate Them." Google Testing Blog, 2016. https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html
2. Mills, H. D. "On the Statistical Validation of Computer Programs." IBM Federal Systems Division, 1972. Summarised in "Bebugging," Wikipedia. https://en.wikipedia.org/wiki/Bebugging
3. "Mutation testing." Wikipedia. https://en.wikipedia.org/wiki/Mutation_testing
4. "Precision and recall." Wikipedia. https://en.wikipedia.org/wiki/Precision_and_recall
5. Jevitate. "Verdict accuracy: the seeded-defect lab." https://github.com/matt-cochran/jevitate/blob/1a1faf3dae17757eb74e973053eda8dc96f56dee/docs/accuracy.md
