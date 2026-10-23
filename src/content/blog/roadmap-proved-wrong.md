---
title: "I tried to prove my roadmap wrong. Five of nine ideas failed."
description: "Before you build the next round of improvements, test each idea against the history you already keep. A worked example from one release of Junior."
pubDate: 2026-10-23
draft: true
tags: [product development, experimentation, AI agents, Junior]
heroImage: /assets/blog/roadmap-proved-wrong-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You have a list of improvements. Every item on it feels obviously right.

You've seen the problems with your own eyes. You know what's slow, what breaks and what users complain about. So you plan the fixes, estimate them and start building.

Here's the uncomfortable part: a lot of those fixes won't fix anything.

That's not pessimism. When Microsoft measured its own product ideas with controlled experiments, only about a third improved the metric they were designed to improve. Another third made no difference. The last third made things worse. ([Kohavi et al., 2009](https://exp-platform.com/Documents/ExPThinkWeek2009Public.pdf))

You don't need an experimentation platform to avoid paying for the bad two-thirds. You need one habit: before you build an idea, try to prove it wrong with data you already have.

I did this on my own roadmap for one release. It took a day, and it cut the plan by three-quarters.

## The roadmap looked solid. That was the problem.

[Junior](https://github.com/matt-cochran/junior) is an open-source tool I build. A frontier model acts as the manager and hands bounded coding tasks to cheaper open-weight models, which do the work while the manager reviews it. ([Here's how it works](/blog/junior-introduction/).)

For the next version, I'd planned 43 deliverables across three releases. About 96 hours of work. Every item came from something I'd watched go wrong:

- Workers sometimes finished a task, reported success and turned out to be wrong. So: build a ledger that checks every claim a worker makes against real test output.
- Some runs failed in confusing ways. So: classify tasks by how unpredictable they are and handle the hard ones differently.
- Runs felt slow. So: build a runner that executes independent tasks in parallel.
- Failures were piling up. So: mine the run history automatically and draft tickets from the patterns.

Each of these sounded like good engineering. None of them had been tested.

## Turn each idea into a claim that can be wrong

An idea like "add parallel execution" can't fail. It's a feature. You build it, and it exists.

So I rewrote each one as a claim about the world, the kind that has to be true for the feature to be worth building:

> Tasks run one at a time today, so a parallel runner would cut wall-clock time.

Now there's something to check. If tasks already run in parallel, the feature is dead before it starts.

Then I asked one question of each claim: **what would I expect to see in my own records if this were false?**

That question does most of the work. It points you at the cheapest test, and the cheapest test is almost always a short script over history you already keep.

## My own logs disagreed with me

Junior records every run: the task, the timings, the files changed and what the worker reported. I had 125 of them.

Here's what they said about the parallel runner:

- Up to six runs were already in flight at once.
- More than one run was active for 34% of the busy time.

Parallelism was already happening. The feature would have been a faster answer to a question nobody was asking.

The other ideas went the same way:

- **"Hard tasks fail more."** The traits I'd use to spot unpredictable work scored the same on runs that failed and runs that passed: 0.21 against 0.21 for flaky failures, 0.27 against 0.26 for contradictions. No signal.
- **"There are too many failures to read by hand."** There were 14 runs that didn't finish cleanly, in six categories. A handful of short scripts read all of them in one sitting. Automation would have been more work than the problem.
- **"An existing quality check spots bad results."** Junior already asks a model to judge each finished run. It passed all three of the runs that later needed repair, with confidence between 0.67 and 0.90.

The fourth one surprised me most.

## Checking harder wouldn't have caught the real failures

Three runs had come back marked ready for review and needed repair later. These were the ones that hurt, because everything looked fine.

I'd planned the evidence ledger to catch exactly these. So I tested it against them first.

**Every written acceptance criterion had passed, with real tests.** The ledger would have confirmed all three runs as good.

The defects weren't in the work. They were in the request. One task never said where a config file lived. One assumed a tool installed files somewhere it didn't. One was tested against a fake server whose data didn't match the real one.

And here's the twist: Junior already knew. Before each run starts, Junior asks [Jev](https://typesafe.ai), a small classifier model, how clear the task description is. All three of those tasks scored below the 0.6 threshold for clear. Across all the runs, 18% of the tasks that scored that low had a problem, against 4% of the tasks that didn't.

The warning existed. A single condition in the code skipped it for every planned task.

So the fix wasn't a new ledger. It was letting an existing check do its job.

## What survived

Three claims held up:

- **Workers were receiving instructions that had nothing to do with their task.** All 114 runs with a recorded system prompt carried about 6,600 characters of unrelated skills from my machine.
- **Workers edited files outside their assignment.** It happened in 22 of 79 planned runs, mostly in shared files like `package.json`.
- **Unclear tasks predicted the false successes**, as above.

One more stayed open. Nothing proved it, nothing killed it, so I built a smaller version that needed no model calls.

The release shrank from 43 deliverables to 14, and from 96 hours to 24. The ideas that failed weren't deleted. They're parked as open issues with the evidence attached, so the next time they come up, the argument starts from data instead of from scratch.

## Then the data argued with the fix

Testing your ideas doesn't stop once you start building.

The new clarity gate passed every test I wrote for it. Then I ran it against the recorded history. As designed, it would have stopped 121 of 122 real runs and asked the manager questions first. That's a gate on everything, which is the same as no gate at all.

The cause: the gate was keyed on a broader "needs clarification" decision, which fires on almost every task. The original analysis had measured the clarity score alone. Fixing that took one condition. Finding it took one query against real data. No unit test would ever have caught it, because the tests checked that the gate fired, not how often.

I made my own mistake too. My first pass counted a batch of deliberately vague test tasks as if they were real work, which inflated the results. Excluding them moved the problem rate from 25% to 18% for flagged tasks. The conclusion survived. The headline number didn't.

Write the correction down. A claim that's been corrected in public is worth more than one that's never been checked.

## What I still don't know

This was one release, and some of the samples are small. The clarity check caught three of three false successes, and three is a small number.

The gate is new. So far it has stopped one real task, and that one was probably a false alarm. I don't know yet whether it pays for the questions it asks. I'm counting every case, and the threshold moves only when the count says so.

That's the deal you make with this method. You don't get certainty. You get to stop paying for ideas that your own data already rejected.

## Try it on your next roadmap

You don't need my tools for this. You need your history and an honest hour.

1. **Pick the three items you're most sure of.** Confidence is where untested assumptions hide.
2. **Rewrite each as a claim.** "We need X" becomes "Y is happening, so X would change Z."
3. **Ask what you'd see if the claim were false.** Write the answer before you look.
4. **Run the cheapest test.** Usually a query over logs, tickets, deploys or support history you already keep.
5. **Build only what survives.** Park the rest with its evidence attached.

For the parallel-runner claim, the whole test was a few lines. If your records have a start and end time, this tells you how much concurrency you already have:

```js
// runs: [{ start: "2026-10-20T14:02:11Z", end: "2026-10-20T14:06:40Z" }, ...]
function maxConcurrent(runs) {
  const events = runs.flatMap(r => [
    [Date.parse(r.start), 1],
    [Date.parse(r.end), -1],
  ]);
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let now = 0, peak = 0;
  for (const [, step] of events) peak = Math.max(peak, (now += step));
  return peak;
}
```

If that number comes back higher than one, you've just saved yourself a feature.

## The tools I used

The heart of this was [scientific-process](https://github.com/praxec/scientific-process), the scientific-method tool in Junior's toolbelt. It's an open-source lab notebook we build as part of Praxec: every hypothesis, experiment, observation and verdict goes into an append-only log, so the reasoning survives long after the chat that produced it. It can also ask Jev for a second opinion, such as whether a verdict is backed by its observations. I wrote up [how it works](/blog/scientific-process-lab-notebook/) separately.

Nothing about it is tied to one model. A frontier model drove this investigation, but a cheaper model, or you by hand, could make the same calls and get the same record.

Around it, I tracked the plan in a critical-path planner and ran a failure-mode analysis before building. Junior's own workers wrote most of the code under review. All of it is open source, starting from the [Junior repository](https://github.com/matt-cochran/junior). The clarity decision and its correction are written up in [ADR 0009](https://github.com/matt-cochran/junior/blob/main/docs/adr/0009-contract-clarity-before-delegation.md).

The tools made the record easy to keep. The method is what made it worth keeping.

So pick the item on your roadmap you'd bet on without a second thought. Write down what would prove it wrong. Then go and look.

---

## References

1. Kohavi, R., Crook, T., Longbotham, R., et al. "Online Experimentation at Microsoft." Microsoft ThinkWeek, 2009. https://exp-platform.com/Documents/ExPThinkWeek2009Public.pdf
2. Junior source, release 0.10.0. https://github.com/matt-cochran/junior
3. ADR 0009: Plan contracts go through the clarity gate before delegation. https://github.com/matt-cochran/junior/blob/main/docs/adr/0009-contract-clarity-before-delegation.md
4. scientific-process, release 0.3.1. https://github.com/praxec/scientific-process
