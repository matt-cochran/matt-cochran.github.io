---
title: "Every requirement is a guess until something tries to break it"
description: "Elicitation treats each requirement as a claim with evidence, finds contradictions early and tells you when a spec is ready to build."
pubDate: 2026-11-12
draft: false
tags: [requirements, elicitation, AI agents, Junior]
heroImage: /assets/blog/elicitation-requirements-hypotheses-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

You get off a call with a clear picture. You write the spec that afternoon. It reads well.

Two weeks into the build, someone says, "Wait, I thought exports were admin-only?" Somebody else was sure they weren't. Both of them were on the call.

That's the trouble with requirements. They feel like facts the moment you write them down. They're not. They're guesses about what people want, and some of them contradict each other in ways nobody notices until the code makes them collide.

You can catch most of that before anyone builds anything. The trick is to stop treating requirements as statements and start treating them as **claims you're trying to break**.

## A spec reads as finished long before it is

Here's what a normal spec hides:

- **Which lines are confirmed and which are assumptions.** They all look the same on the page.
- **Who said what.** "Exports are admin-only" might be the CEO's decision or a developer's guess.
- **Contradictions.** Two sensible sentences, forty lines apart, that can't both be true.
- **Gaps.** A must-have with no acceptance criteria, or no owner.

An AI agent makes this worse, not better. Hand it a thin spec and it will fill every gap with a confident guess, and the result will read beautifully.

## Make every requirement earn its place

The tool I use for this is [elicitation](https://github.com/praxec/elicitation), an open-source interview engine we build as part of Praxec. It runs no model and makes no network calls. Your agent does the talking. The tool keeps score.

It works like this:

1. **Every requirement is a claim.** "Exports are admin-only" goes in as a hypothesis, with a subject, a predicate and an object.
2. **Evidence attaches to claims.** A person confirming it, a quote from a meeting, a line of code that already does it, or a counter-example.
3. **Standing is computed.** Each claim is `open`, `challenged`, `withstood` or `disproven`, worked out from the evidence log. Nobody gets to mark their own claim as settled.
4. **Contradictions are detected structurally.** Two claims that can't both hold get flagged, with a severity.
5. **The next question is ranked.** `question.next` returns the single highest-leverage thing to ask, so your agent spends the interview on what matters.

Then there's the readiness check. A spec is ready only when **all four** of these hold:

- the areas you said must be covered have claims that survived;
- no high-severity contradiction is still standing;
- no fix for a contradiction is still open;
- every must-have requirement has acceptance criteria and an owner.

Notice the wording the tool uses. Ready means the claims **survived** the evidence you gave them. It never says they're true.

## How I've used it so far

I'll be honest: my real use is small so far, and the most useful lesson came from getting it wrong.

**It now sits inside Junior's clarity check.** When [Junior](/blog/junior-introduction/) decides a task is unclear, it builds the clarifying questions on top of this engine. On the docs task for Junior 0.10, that meant four claims, one per acceptance criterion. I confirmed each one. One read:

> Claim: CHANGELOG 0.10.0 lists each issue.
> Evidence: "Confirmed: the 0.10.0 section names #75, #76, #78, #79 and #85."

The readiness check came back with no blockers and `ready: true`. Fine, but look at what that evidence was: me, saying yes. No code was checked and nobody else was asked. The tool was right to call it ready on that evidence. Whether the evidence was enough is still my call.

**And here's the scar.** When I first wired this engine into Junior, an agent built the integration against a fake version of the tool's responses. The fake assumed you could call `question.next` repeatedly to collect a batch of questions. Every test passed. The run came back marked ready for review.

Run against the real server, it produced **zero questions.** The real `question.next` returns one top question and gives you the same one every time you ask. The batch has to be built from the full list of open signals instead.

So the tool designed to catch untested assumptions was integrated on an untested assumption. The fix was boring: read the real response shape, and record real responses for the tests. Junior has done that for every companion tool since. I wrote more about that pattern in [Your coding agent's "done" is a hypothesis](/blog/scientific-method-agentic-development/).

## What it won't do for you

**It can't make up for weak claims.** If your agent writes vague claims, you get vague claims with standings. The quality of the interview still depends on the questions.

**Names must match exactly.** The engine matches subjects and predicates by their exact ids. If your agent calls the same thing "exports" in one claim and "export-feature" in another, they're two different things.

**One question at a time.** That's deliberate, because it keeps you on the most important question. But if you want a batch, building it is your job.

**And "ready" is only as strong as the evidence.** A spec where every claim is backed by someone saying yes is ready in the tool's eyes, and fragile in reality.

## Set it up

It ships as an npm launcher, a Rust crate and prebuilt binaries:

```sh
npx -y @matthew-cochran/elicitation
```

As an MCP server, point your client at the same command:

```json
{"command": "npx", "args": ["-y", "@matthew-cochran/elicitation"]}
```

Install the interview skills with `elicitation skills install --target claude --dir <path>`. With Cargo, install `eliciter`, since another project owns the `elicitation` crate name. If you use Junior, it's already wired in, and its `discover` workflow runs a full interview and writes the result as a report.

## Break your next requirement before your agent builds it

Take the spec for whatever you're building next. Pick the three sentences everyone agrees on.

For each one, ask: who confirmed this, and what would prove it wrong?

If the answer is "nobody" and "I don't know", you've found the requirement that's going to collide in week two. Better to find it now, while it's a sentence and not a migration.

---

## References

1. elicitation source, specification and skills. https://github.com/praxec/elicitation
2. `@matthew-cochran/elicitation` on npm. https://www.npmjs.com/package/@matthew-cochran/elicitation
3. `eliciter` on crates.io. https://crates.io/crates/eliciter
