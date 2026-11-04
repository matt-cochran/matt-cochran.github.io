---
title: "Your coding agent's \"done\" is a hypothesis. Treat it like one."
description: "Use a webhook-retry example to separate the agent’s completion claim, the expected behavior and the evidence needed to accept it."
updatedDate: 2026-10-25
pubDate: 2026-10-27
draft: false
tags: [AI agents, software development, testing, experimentation]
heroImage: /assets/blog/scientific-method-agentic-development-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Suppose you ask a coding agent to add webhook retries. Its tests pass, but they cover only a failed response followed by a successful one. Should you accept the change?

For an engineer reviewing the handoff, the missing question is what the tests leave undecided. If the receiver stores a delivery but its acknowledgement is lost, a retry could deliver the event again. You need an agreed outcome for that case before calling the feature complete.

This hypothetical example shows how to separate a claim from the evidence supplied for it.



## 1. Name the claim before you weigh the evidence

"All tests pass" is evidence. It isn't the claim.

The claim is something like: *the sender retries a failed acknowledgement, and the receiver processes each event at most once.* Write that sentence down, separately from the test output.

Now compare the claim with what each assertion observes. A retry assertion can establish that another request was attempted. You need a separate observation of receiver behavior to establish whether the event was processed again.

## 2. Write the prediction first

Before inspecting a passing result, write what a failing result would look like. That gives you a reference independent of the outcome you are about to see.

So before the agent runs anything, ask it what it expects to see if the change is right, **and what it would see if it were wrong.** Make the prediction specific enough that an observation can disagree with it.

For the duplicate-delivery case, specify how you would distinguish a safely handled retry from the same event being processed twice.

## 3. Look upstream, at the request

For the webhook example, “retry failures” leaves several choices open: which failures, how many attempts, and what the receiver should do with duplicates.

Write down which decisions the agent had to infer. Ask the owner about behavior that changes the public contract. Additional checks can test a decision once it exists; they cannot decide what the owner intended.

Do this proportionately. A request with a clear contract may need no additional interview. A retry change that affects external systems needs more care than a local rename.

## 4. Check the assumptions in your fixtures

A fake receiver that always acknowledges immediately cannot exercise a lost acknowledgement. Add a case where the event is stored and the response is interrupted. Check whether the sender's retry and the receiver's duplicate handling produce the intended outcome.

When an integration permits it, compare representative real responses with your fixture. Remove secrets and personal data before retaining recordings. A recording is evidence about that interaction, not a promise that every future version behaves identically.

## 5. Test the check itself

Before trusting a new gate, try a case it should reject and one it should allow. For example, a duplicate-handling check should detect the same event being processed twice while allowing two genuinely different events.

Keep inconclusive runs separate. If the receiver is unavailable, the test has not established correct duplicate handling. A green result created by skipping that check answers a different question.

## Keep the record outside the chat

Keep the reasoning outside the conversation so another reviewer can inspect it later.

Write the claim with its prediction and the resulting verdict in a versioned record. The [scientific-process README](https://github.com/praxec/scientific-process) describes an append-only record for this kind of work. A plain Markdown file works too. Record corrections explicitly and use version control to make changes inspectable.

The same habit works before implementation: examine the premise behind a proposed feature, as in [testing a roadmap assumption](/blog/roadmap-proved-wrong/).

## Keep the conclusion within the test

The lost-acknowledgement case checks one failure mode. It does not establish correct behavior for every receiver, storage failure or future version. Keep the tested assumptions with the result, then choose further checks in proportion to the consequences of a missed defect.

## Try it on the next handoff

When your agent says it's done, ask it three questions before you read the diff:

1. What exactly are you claiming works?
2. What would you have seen if it didn't?
3. Which part of the request did you have to guess?

Use the third answer to choose the next check. It identifies an assumption to inspect, not proof that a defect exists.


## References

1. ADR 0009: Plan contracts go through the clarity gate before delegation. https://github.com/matt-cochran/junior/blob/515139f719b76ef8821b6018f77c22aea47dc544/docs/adr/0009-contract-clarity-before-delegation.md
2. Junior. https://github.com/matt-cochran/junior
3. scientific-process. https://github.com/praxec/scientific-process
