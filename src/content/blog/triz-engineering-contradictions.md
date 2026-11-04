---
title: "When every fix makes something else worse, look for the contradiction"
description: "Use a cache-size example to turn opposing requirements into a design candidate, then test it against both response time and memory constraints."
updatedDate: 2026-10-25
pubDate: 2026-11-06
draft: false
tags: [TRIZ, problem solving, engineering, AI agents]
heroImage: /assets/blog/triz-engineering-contradictions-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Suppose a larger cache improves your dashboard response time but exceeds its memory budget. Reducing it stays within the budget but misses the response-time target. Before choosing a middle setting, write down both constraints.

For an engineer choosing the cache policy, that framing can suggest another candidate to test. TRIZ is a problem-solving method with prompts for examining such opposing requirements. It does not establish that every tradeoff has a solution.

## Ask where the requirements actually conflict

Here, use TRIZ as a set of prompts for reframing opposing requirements. A reframing suggests a candidate to test; it does not establish that a compromise can always be avoided.

TRIZ names two kinds of contradiction:

- **Technical:** improving one thing makes another worse. *Faster responses, but staler data.*
- **Physical:** one element needs opposite properties. *The cache must be large for hit rate and small for memory.*

The physical framing supplies a useful question for this example. If something has to be large and small, ask: **large when, small when? Large where, small where?** That's the idea behind TRIZ's separation principles. Consider whether the opposing demands apply at different times or under different conditions. Treat any resulting design as a candidate until it has been tested.

For the cache, one candidate is to give frequently used keys more of a fixed memory budget and evict other entries sooner. That separates treatment by condition. You still have to measure whether the workload's hit rate and total memory fit the requirements; the reframing does not establish that both demands are met.

## Use principles to propose another candidate

The other half of TRIZ is the **40 inventive principles**: segmentation, doing something in advance, adding feedback, adding an intermediary, and so on. They're prompts, not answers. Use them to propose another option, then check that option against the same constraints.

The [triz README](https://github.com/matt-cochran/triz) documents an open-source CLI for this method. Its catalog rewords all 40 principles for software and adds six separation routes: space, time, condition, system level, satisfy both, and bypass.

The following illustrative input uses invented measurements. It shows a physical contradiction: the cache is asked to be both large and small.

    {
      "evidence": [
        {"id": "e1", "text": "Dashboard p95 latency is 2.4 s with a 256 MB cache"},
        {"id": "e2", "text": "The 2 GB cache trial hit memory limits twice in a week"}
      ],
      "desiredImprovement": "Reduce dashboard latency",
      "element": "response cache",
      "opposingProperties": ["large for hit rate", "small for memory"]
    }

It classifies the contradiction as technical or physical, checks that the evidence you cited exists, and returns a ranked shortlist of principles to think with. If you mix both framings in one request, it refuses before spending anything, because it can't tell which problem you mean.

The current public README describes live classification through a Pi SDK adapter and offline fixtures for replay. Check the installed version’s provider configuration before a live call; do not assume an older OpenRouter setup still applies.

## A useful prompt still needs an experiment

Return to the hypothetical cache. Identify which requests are slow and how much memory the cache actually uses before choosing a principle. If only a small set of keys accounts for repeated work, partitioning the budget is a candidate worth testing. If requests rarely repeat, another cache policy may not address the cause.

Compare the candidate with the existing policy under a stated memory ceiling and representative workload. Watch response times as well as evictions and memory. If the experiment improves one metric while violating the other, the contradiction remains.

This is where a catalog earns its place: it helps you propose alternatives. A ranked suggestion, even one with high model confidence, is not evidence that a design will work. Keep the measurements and acceptance criteria outside the ranking.

## What it won't do

- **It won't decide for you.** Every principle is a prompt to think with, not a recommendation.
- **One contradiction per request, one framing per contradiction.** That's deliberate, but it means you do the framing work.
- **It's probabilistic and paid.** A live run asks a model, so the same request can rank slightly differently twice.
- **It doesn't include the classical 39-by-39 contradiction matrix.** The ranking is a relevance check, not a table lookup.

## Rewrite your next compromise

Find the last trade-off your team settled with "somewhere in the middle". Write it as one sentence: *this has to be X and also not-X.*

Then ask the TRIZ question: **X when, and not-X when?**

Sometimes the answer is that it really is a dial. If the reframing suggests a candidate, test it against both constraints before replacing the existing design.


## References

1. triz source and README. https://github.com/matt-cochran/triz
2. triz issue 14: confident results returned all 40 principles unranked. https://github.com/matt-cochran/triz/issues/14
3. `@matthew-cochran/triz` on npm. https://www.npmjs.com/package/@matthew-cochran/triz

