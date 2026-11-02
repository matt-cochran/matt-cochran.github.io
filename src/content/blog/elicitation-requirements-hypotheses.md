---
title: "Resolve conflicting requirements before implementation"
description: "Use an export-permissions example to separate assumptions, existing behavior and the policy decision someone must make."
updatedDate: 2026-10-25
pubDate: 2026-11-12
draft: false
tags: [requirements, elicitation, AI agents, Junior]
heroImage: /assets/blog/elicitation-requirements-hypotheses-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Consider a hypothetical export feature. One participant expects exports to be restricted to administrators. Another expects any signed-in account to be able to download the same data. Both believe the specification reflects their decision.

If you are the engineer preparing the feature, a readable spec does not resolve that disagreement. Ask who owns the access policy, record the decision and turn it into acceptance criteria before implementing either interpretation.

## Keep assumptions distinct from decisions

For each access rule, record who supplied it and what authority they have to decide it. Mark unresolved assumptions explicitly. Existing behavior is another source of evidence, but it may differ from the behavior the owner wants next.

You are investigating whether the written requirements agree with one another and with the intended policy. Treating a requirement as a claim to examine does not mean an approved policy decision is merely a guess.

## Keep the interview inspectable

The [elicitation README](https://github.com/praxec/elicitation) describes an offline engine for recording claims and evidence while the calling agent conducts an interview. It computes standing, identifies structural contradictions and supplies a readiness gate. Those features keep an interview inspectable. They do not establish that the supplied claims are correct or complete.

You can use the same discipline with a plain document. Keep each decision with its owner, its evidence and the question that remains open.

## Resolve one export rule before building it

For the conflicting export rules, ask the decision owner which users should have access and under what conditions.

Keep the answer and its authority with the requirement. A developer's description of existing code is evidence of current behavior. A product owner's approval is evidence of the intended policy. They answer different questions; neither automatically substitutes for the other.

If the owner chooses administrator-only access, add acceptance criteria that distinguish the alternatives: an administrator can export, and an ordinary account receives the agreed refusal. If the policy includes exceptions, write them down before calling the requirement ready.

The tool can keep these claims and contradictions visible. The people responsible for the policy still decide which rule should hold. A computed readiness result means the supplied evidence satisfies the configured gate, not that every user need has been discovered.

## What it won't do for you

**It can't make up for weak claims.** If your agent writes vague claims, you get vague claims with standings. The quality of the interview still depends on the questions.

**Inspect what readiness means.** A positive answer from a participant establishes what they said. It does not establish that they own the decision or that the implementation matches it. Review those distinctions before relying on a readiness result.


## Break your next requirement before your agent builds it

Take the spec for whatever you're building next. Pick the three sentences everyone agrees on.

For each one, ask: who confirmed this, and what would prove it wrong?

If the answer is "nobody" and "I don't know", you have an unresolved assumption to investigate before implementation. Write the answer into the requirement so the next person does not have to reconstruct the discussion.


## References

1. elicitation source, specification and skills. https://github.com/praxec/elicitation
