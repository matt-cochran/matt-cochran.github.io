---
title: "When every fix makes something else worse, look for the contradiction"
description: "TRIZ turns a stuck engineering trade-off into a contradiction you can resolve, with a catalog of inventive principles instead of a compromise."
pubDate: 2026-11-06
draft: false
tags: [TRIZ, problem solving, engineering, AI agents]
heroImage: /assets/blog/triz-engineering-contradictions-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You make the cache bigger, and the hit rate goes up. Then memory alarms start firing. You make it smaller, and the dashboard slows to a crawl.

So you split the difference. A medium cache. Nobody's happy, but nobody's paging you either.

That's a compromise, and most engineering teams make dozens of them a quarter. Some are right. But many are a sign that you've framed the problem as a dial when it's really a **contradiction**, and contradictions can often be resolved outright.

There's a method for that. It's called TRIZ, and it's older than most of the software you run.

## A trade-off is a question you haven't asked yet

TRIZ comes from the Soviet engineer Genrich Altshuller, who studied large numbers of patents looking for patterns in how inventors got unstuck. His finding: the best inventions didn't balance two demands. They found a way to satisfy both.

TRIZ names two kinds of contradiction:

- **Technical:** improving one thing makes another worse. *Faster responses, but staler data.*
- **Physical:** one element needs opposite properties. *The cache must be large for hit rate and small for memory.*

The physical version is the more useful one, because it points straight at a way out. If something has to be large and small, ask: **large when, small when? Large where, small where?** That's the idea behind TRIZ's separation principles. Separate the opposing demands in time, in space, or by condition, and the contradiction often dissolves.

For the cache: keep a large cache for hot keys and a small one for everything else. You've separated by condition. Both demands are met.

## A catalog of moves you'd never list on your own

The other half of TRIZ is the **40 inventive principles**: segmentation, doing something in advance, adding feedback, adding an intermediary, and so on. They're prompts, not answers. Their value is that they push you toward options you wouldn't have brainstormed.

The tool I use, [triz](https://github.com/matt-cochran/triz), is an open-source CLI I build. Its catalog rewords all 40 principles for software and adds six separation routes: space, time, condition, system level, satisfy both, and bypass.

You give it the contradiction and your evidence. Here's the cache example from its README, with two made-up evidence items to show the shape:

```json
{
  "evidence": [
    {"id": "e1", "text": "Dashboard p95 latency is 2.4 s with a 256 MB cache"},
    {"id": "e2", "text": "The 2 GB cache trial hit memory limits twice in a week"}
  ],
  "desiredImprovement": "Reduce dashboard latency",
  "element": "response cache",
  "opposingProperties": ["large for hit rate", "small for memory"]
}
```

It classifies the contradiction as technical or physical, checks that the evidence you cited exists, and returns a ranked shortlist of principles to think with. If you mix both framings in one request, it refuses before spending anything, because it can't tell which problem you mean.

The classification and the ranking come from Jev, a small classifier model, so a live run needs an OpenRouter key and costs a little. You can also replay a recorded response offline.

## The honest record: two real runs, no decisions changed

Here's where I have to be straight with you. I've used the tool on real problems twice, and neither run changed what I did.

**The first was a secrets tool I build.** A Junior worker applied the TRIZ method to the tool's command-line design and found twelve contradictions for about five cents. One was "fewer keystrokes versus explicit intent for destructive flags". That analysis led to a simpler profile that did ship. But when I ran the TRIZ tool itself on three of the contradictions, it agreed with the principles the worker had already chosen, segmentation, preliminary action, feedback and an intermediary, and added nothing new. The method helped. The tool didn't.

**The second was a hosting problem.** Several apps shared one warm server. Shipping a single change to one app meant restarting the shared machine and pushing 32 unrelated commits from another app along with it. Independence for each app, against the cost of losing the one shared machine. A real contradiction.

The tool classified it correctly as technical, at 0.8 confidence, fully grounded in the evidence. And then it returned **all 40 principles, unranked, with an empty rationale.** That's not a shortlist. That's the textbook.

So I filed it as an issue, and that became the fix in version 0.4: a relevance check against each principle, returning at most eight that clear the bar. It hasn't been tested on a real decision yet. When it has, I'll tell you how it went.

## The contradiction I didn't run through the tool

Looking back, the clearest TRIZ problem of the last month was one I solved without it.

[Junior](/blog/junior-introduction/) runs AI workers inside a coding agent called Pi. Every worker run had been quietly receiving about 6,600 characters of unrelated skills from my machine: 114 runs out of 114. The worker's environment needed to be **empty** of my setup, and **equipped** with the tools to do the job.

That's a physical contradiction, almost word for word. And the fix was a separation by condition: the worker now gets only the contract and four tools, read, bash, edit and write, and nothing else. Empty of the ambient setup, equipped for the task.

I didn't need the tool to find that. But writing it as "must be empty and equipped" is what made the answer obvious. That's the part of TRIZ worth keeping, even if you never install anything.

## What it won't do

- **It won't decide for you.** Every principle is a prompt to think with, not a recommendation.
- **One contradiction per request, one framing per contradiction.** That's deliberate, but it means you do the framing work.
- **It's probabilistic and paid.** A live run asks a model, so the same request can rank slightly differently twice.
- **It doesn't include the classical 39-by-39 contradiction matrix.** The ranking is a relevance check, not a table lookup.

## Set it up

You need Node 24 or newer:

```sh
npm install -g @matthew-cochran/triz
triz catalog
triz analyze request.json --out result.json
```

`triz catalog` works offline and shows every principle and separation route. `triz analyze` is the live call. To teach your agent the method, `triz skills install --target claude --project .` installs its skills. If you use Junior, its toolbelt points to it for exactly this kind of question.

## Rewrite your next compromise

Find the last trade-off your team settled with "somewhere in the middle". Write it as one sentence: *this has to be X and also not-X.*

Then ask the TRIZ question: **X when, and not-X when?**

Sometimes the answer is that it really is a dial. But often enough, you'll find you were splitting a difference you never had to split.

---

## References

1. triz source and README. https://github.com/matt-cochran/triz
2. triz issue #14: confident results returned all 40 principles unranked. https://github.com/matt-cochran/triz/issues/14
3. `@matthew-cochran/triz` on npm. https://www.npmjs.com/package/@matthew-cochran/triz
