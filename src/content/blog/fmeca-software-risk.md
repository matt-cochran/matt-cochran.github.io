---
title: "Find the ways your plan will fail before your agents start"
description: "FMECA for software: name the failure modes, let a fixed matrix score them, and fix them in the right order before you write code."
pubDate: 2026-11-04
draft: false
tags: [FMECA, risk, AI agents, Junior]
heroImage: /assets/blog/fmeca-software-risk-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You've got a design you like. The pieces fit. The plan says three days.

Then someone asks, "What happens when the dependency changes under us?" and the room goes quiet. Nobody has an answer, because nobody asked the question until now.

Most risk reviews go like that. A list of worries, a few nods, and a document nobody opens again.

There's an older, stricter way, and it works better than it sounds. Engineers in aerospace and manufacturing have used it for decades: **Failure Mode, Effects and Criticality Analysis**, or FMECA. You name each way the thing can fail, say what happens when it does, score how bad and how likely it is, and fix the worst ones first.

It sounds heavy. With the right tool, it takes an hour, and it changes what you build.

## A risk list without scores is a mood

Here's the trouble with most risk lists: everything on them looks equally scary.

"The API could change." "The cache could go stale." "Users might be confused." Which one do you fix first? Usually the one the loudest person in the room is worried about.

FMECA fixes that with three moves:

1. **Name the failure mode precisely.** Not "API risk", but "a Pi update breaks the report extension".
2. **Trace its effects.** What breaks locally, what breaks next, what the user sees.
3. **Score it on a fixed scale.** Severity and probability, read off a matrix nobody gets to argue with.

Then you mitigate in a fixed order: **prevent** it first, **detect** it second, **fail fast** last. A fix that only fails fast is a weak fix, and the method says so.

## Let the code do the scoring

The problem with scoring is people. Ask someone to rate a risk from 1 to 10 and you'll get their anxiety level.

So the tool I use, [fmeca](https://github.com/praxec/fmeca), doesn't accept scores at all. It's an open-source server we build as part of Praxec, and it takes **observations** instead: "this causes a service outage", "this happens occasionally". Each one comes from a fixed catalog. The tool maps them to severity and probability and reads the criticality off a locked matrix: a simple three-by-three, or a five-by-five modelled on NASA's.

Its README puts it in six words: "The model proposes; the code scores."

That matters more when an AI agent is doing the analysis. The agent proposes failure modes and picks observations. It never gets to decide that its own idea is low-risk.

Everything goes into an append-only log. Residual risk after mitigation is computed, not typed. A readiness check tells you whether anything high or medium is still standing.

## What it found in a real release

Before building [Junior](/blog/junior-introduction/) 0.10, I ran a technical-plan analysis of the design. The first pass named **31 failure modes**. Raw criticality: 9 high, 19 medium, 3 low. With 54 planned mitigations, the residual came down to 29 low and 2 medium.

One item stood out. The tool flags a **critical item** when a single point of failure has high raw criticality. There was exactly one:

```json
{
  "id": "fm-f12-pi-api-drift",
  "component": {"id": "dep.pi"},
  "description": "A Pi update breaks the report extension or terminate tools",
  "effect": "Every run degrades to needs_review",
  "severity_observations": ["service_outage"],
  "probability_observations": ["occasional"],
  "single_point": true
}
```

Junior runs its workers inside Pi, an open-source coding agent. If Pi changed under us, every run would quietly go wrong at once. Nobody had said that out loud until the analysis forced it.

The mitigation changed during the release, and that's worth showing too. The first detection idea depended on a feature we later cut. The log records it as abandoned, "replaced by mit-f12-pi-api-drift-3". The replacement became real code: after every run, Junior now reads Pi's own system message and checks that the worker got only the tools and instructions it was supposed to.

It proved itself in live verification. On a real run, the check said isolation held. Pointed at an older run from before the fix, it reported "ambient skills present despite --no-skills". That's the failure mode, caught by the mitigation the analysis asked for.

## When the plan changes, the risks change with it

Halfway through, testing the roadmap against our own run history cut the release from 96 hours to 24. I wrote about that in [I tried to prove my roadmap wrong](/blog/roadmap-proved-wrong/).

A smaller plan means fewer ways to fail. But you can't delete a failure mode in this tool, and that's on purpose. Instead, I **excluded** 22 of them. Each exclusion carries a rationale and evidence: the revised plan file and the investigation that refuted the features. Each one ends the same way: "Re-open if the deferred component is planned again."

So the history survives. If someone brings back the parallel runner next year, its failure modes are waiting, already written.

There's one more move, and it's the one I like most. Two risks couldn't be fully mitigated in this release. The tool lets you **accept** a risk, but only with a named human approver. An agent can't sign. My name is in the log next to the rationale, and the risk still shows as medium. It stops blocking the release only because a person said, in writing, "I'll own this."

## Where it can fool you

I want to be straight about the weak spots, because I hit some of them.

**The tool can't check that your evidence is true.** One mitigation's description says Junior "aborts before spend". The code checks after the run and reports a line in the receipt. The description drifted from the code, and nothing caught it. I found it while writing this article.

**Whoever picks the observations controls the score.** The matrix is fixed, but choosing "occasional" over "frequent" is still a judgment.

**"Ready" can be generous.** The tool has two gates. `ready` counts planned mitigations. `verified.ready` counts only mitigations proven by evidence. On this release, the first says yes. The second still lists five blockers. Both are honest. You need to know which one you're reading.

**And this is one analysis, in one repo, run by my own agent.** It's a worked example, not a study.

## Set it up

It ships as an npm launcher for a checksum-verified binary:

```sh
npx -y @matthew-cochran/fmeca
```

As an MCP server, point your client at the same command:

```json
{"mcpServers": {"fmeca": {"command": "npx", "args": ["-y", "@matthew-cochran/fmeca"]}}}
```

To keep analyses with your code, run `fmeca-mcp init` to create a `.fmeca/` folder, and `fmeca-mcp check --dir .fmeca` in CI. If you use Junior, it's already wired in through `junior tools call fmeca`.

## Ask the quiet question first

Before your agents start on the next feature, ask one question for each part of the design: **how does this fail, and what happens next?**

Write the answer as a failure mode. Say what it breaks. Let something other than your gut decide how bad it is.

The risk you name today is the outage you don't have in March.

---

## References

1. fmeca source, README and skills. https://github.com/praxec/fmeca
2. `@matthew-cochran/fmeca` on npm. https://www.npmjs.com/package/@matthew-cochran/fmeca
3. Junior 0.10.0 release notes. https://github.com/matt-cochran/junior/blob/main/CHANGELOG.md
