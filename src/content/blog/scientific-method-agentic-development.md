---
title: "Your coding agent's \"done\" is a hypothesis. Treat it like one."
description: "Five habits from the scientific method that catch what passing tests miss when AI agents write your code."
pubDate: 2026-10-27
draft: false
tags: [AI agents, software development, testing, experimentation]
heroImage: /assets/blog/scientific-method-agentic-development-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

The agent finishes. Every test is green. The summary says the feature works and is ready for review.

You merge it. Two days later someone hits the case nobody wrote down, and it falls over.

Nothing lied to you. The agent did what it was asked, and the tests checked what they were told to check. The gap was somewhere else, in the space between what you meant and what you wrote.

That gap gets wider as agents get faster. Generating code is cheap now. Knowing whether the code is right is not. The good news is that science has been working on exactly this problem for a few hundred years, and its habits transfer well.

## Passing tests prove less than they seem to

Here's the uncomfortable evidence from my own work.

I run [Junior](https://github.com/matt-cochran/junior), a tool where a frontier model manages and cheaper open-weight models write the code. Over 125 recorded runs, three came back marked ready for review and later needed repair.

In all three, **every written acceptance criterion had passed, with real tests.** A model judging the finished work passed all three too, with confidence between 0.67 and 0.90.

The defects were in the request:

- One task never said where a config file lived, or that a broken file should be refused.
- One assumed another tool installed files in a place it didn't.
- One was tested against a fake server whose responses didn't match the real one.

Checking those runs harder would not have helped. The checks were answering a different question from the one that mattered.

So treat "done" the way a scientist treats a result: as a claim with some evidence behind it, not as a fact. Then go looking for the evidence that's missing.

Five habits make that practical.

## 1. Name the claim before you weigh the evidence

"All tests pass" is evidence. It isn't the claim.

The claim is something like: *the webhook sender retries failed deliveries, and a delivery is never sent twice.* Write that sentence down, separately from the test output.

Now you can ask the useful question: **does this evidence support this claim, or a smaller one?** Passing tests usually support "the code meets the criteria I wrote." That's narrower than "the code does what I meant," and the distance between the two is where your bugs live.

## 2. Write the prediction first

A test written after the code tends to confirm the code. That's not cheating. It's how attention works: you test what you built.

So before the agent runs anything, ask it what it expects to see if the change is right, **and what it would see if it were wrong.** A prediction you can't fail isn't a test. It's a ceremony.

This is the oldest rule in the book. Feynman's version: "The first principle is that you must not fool yourself—and you are the easiest person to fool." ([Feynman, 1974](https://calteches.library.caltech.edu/51/2/CargoCult.htm)) An agent optimizing for your green checkmarks fools you without meaning to.

## 3. Look upstream, at the request

If the failures start in the request, that's where the cheapest fix is too.

Junior already asks Jev, a small classifier model, how clear each task description is before a worker starts. All three of the false successes scored below the threshold for clear. Across the run history, 18% of the tasks that scored that low had a problem, against 4% of the tasks that didn't.

Then I tested whether asking questions would have helped. A fresh agent, with no hindsight and only the repository, answered the generic clarifying questions for each of the three tasks. It named the kind of gap that later needed repair in all three cases, and the exact defects in two.

Three cases is a small sample, so hold that loosely. But the direction is clear: **a few minutes of questions before the work beats a repair after it.** Make your agent ask when the request is thin, and answer with access to the code, not from memory.

## 4. Test against reality, not your fixtures

One of the three failures passed every test because the tests used a fake server, and the fake was wrong.

Fakes are hypotheses too. A mock says "the real thing responds like this." When nobody checks that against the real thing, the whole test suite rests on an assumption.

The fix is boring and it works: **record real responses and test against the recordings.** Re-record when the dependency changes. Junior now ships recorded responses for the tools it talks to and reports when it meets a version it hasn't recorded.

## 5. Measure your measurements

This one caught me out after I'd made all the changes above.

I built a gate that stops unclear tasks before a worker starts. It passed every test I wrote. Then I ran it against the recorded history: it would have stopped **121 of 122 real runs.**

The tests checked that the gate fired when it should. Nothing checked how often it fired. One query against real data found it, and one condition fixed it.

Every check you add is itself a claim, that it catches the problem without drowning you in false alarms. Run new checks against your history before you trust them.

## Keep the record outside the chat

All five habits share a weakness: they live in conversation, and conversations get compacted, summarized and lost.

Write the claims, predictions, results and verdicts somewhere durable. I use [scientific-process](https://github.com/praxec/scientific-process), an open-source lab notebook we build that any model can drive. A plain markdown file in the repository works too. What matters is that the prediction is written before the result, and that nobody, human or agent, quietly edits the page afterward.

The same habit works before you build anything. Testing a roadmap against my own run history cut one release [from 96 hours of planned work to 24](/blog/roadmap-proved-wrong/).

## What this doesn't solve

This isn't a guarantee. You'll still ship bugs.

Some failures only show up in production. Some predictions are wrong in ways no one could have known. And every habit here costs time, so you'll want to spend it where a miss is expensive, not on every one-line change.

What it changes is how you get surprised. Instead of "the agent said it was done," you get "we predicted X, saw Y, and here's the record." That's a surprise you can learn from.

## Try it on the next handoff

When your agent says it's done, ask it three questions before you read the diff:

1. What exactly are you claiming works?
2. What would you have seen if it didn't?
3. Which part of the request did you have to guess?

The third answer is where your next bug is hiding. Go and look there first.

---

## References

1. Feynman, R. "Cargo Cult Science." Caltech commencement address, 1974. https://calteches.library.caltech.edu/51/2/CargoCult.htm
2. ADR 0009: Plan contracts go through the clarity gate before delegation. https://github.com/matt-cochran/junior/blob/main/docs/adr/0009-contract-clarity-before-delegation.md
3. Junior. https://github.com/matt-cochran/junior
4. scientific-process. https://github.com/praxec/scientific-process
