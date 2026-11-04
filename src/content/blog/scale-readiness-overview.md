---
title: "Before hiring more engineers, find where delivery gets stuck"
description: "Trace one recent feature through your team to distinguish a capacity shortage from coordination, architecture, and product-decision bottlenecks."
pubDate: 2025-01-15
updatedDate: 2026-10-25
tags: [engineering leadership, scale readiness, delivery]
heroImage: /assets/blog/scale-readiness-overview-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
draft: false
---

Your roadmap is slipping, and the team wants another engineer. Before opening the role, pick one recent feature and ask where it spent its time.

Was someone actively building it? Was it waiting for a review, a product decision, a shared environment, or the one person who understands a critical service?

The answer changes what you should do next. Another engineer can take on independent work. A feature waiting for a decision still needs someone with the authority and information to make that decision.

This is a useful starting point for scale readiness: find the constraints your next stage of growth would put under more pressure, then decide which to address before adding people.

## Trace one feature from request to release

Choose a recently completed feature that people remember well enough to reconstruct. Use its issue history, pull requests, deployment records, and the people who worked on it.

Write down the major steps, who owned each one, and what had to happen before work could continue. Separate time spent doing the work from time spent waiting. Approximate dates are useful if you label them as estimates; avoid turning uncertain recollections into precise measurements.

A small table is enough:

| Step | What to record | Question to ask |
| --- | --- | --- |
| Decide the scope | Who made the decision and what remained unresolved | Did implementation start before the team agreed on the problem? |
| Build the change | Systems involved and the people responsible | Could someone own a bounded part independently? |
| Review and test | Reviewers, test access, and time waiting | What kept the work from moving forward? |
| Release and observe | Deployment owner and evidence of the result | Could the team tell whether the change worked? |

Start with one feature. If it reveals a suspected constraint, check another example before treating it as a team-wide pattern.

## Match the response to the constraint

Consider a hypothetical team whose changes repeatedly wait for one engineer to review updates to a shared service. Hiring another person to produce changes may increase the review queue unless that person can also help with reviews.

Several responses are possible. The team could pair on reviews to spread knowledge, clarify ownership, improve checks that help reviewers, or reduce the number of changes that cross that service. Which response fits depends on why the reviewer is needed.

If the same person is making product decisions, checking architecture, and approving releases, separate those responsibilities before calling the entire delay a code-review problem.

You may also find a straightforward capacity shortage: well-defined work is ready, dependencies are available, and nobody has time to take it on. That gives you a clearer hiring case and a better description of the work the new engineer would own.

## Check whether the work supports the product decision

A delivery map can explain how a feature reached production. You also need to know why the team chose it.

For the same feature, identify the customer problem, the evidence behind its priority, and the outcome the team hoped to observe. Then look for what happened after release. Customer feedback, usage, support requests, or a decision to change direction can all inform the next step, depending on the feature.

If the team cannot name the intended outcome, write down that gap. Agree on what you need to learn before committing to a larger version of the work.

Bring both questions to the hiring discussion: which work is worth doing, and what currently prevents the team from delivering it? Keep evidence for each alongside the proposed role.

## Test a smaller change before expanding it

Once you have a plausible constraint, choose a bounded change and decide what you will observe. For example, pair a second reviewer with the current owner for the next few changes. Track whether reviews still wait for the original owner and whether the new reviewer can explain the decisions involved.

Keep quality checks in place. A shorter queue achieved by skipping necessary review does not answer the original question about the team's capacity.

Use what you learn to decide whether to continue, change the approach, or hire for a specific responsibility. You do not need a complete organizational redesign to investigate one repeated delay.

Before your next hiring discussion, bring one feature's path to release and the point where it repeatedly stopped. Use that evidence to describe what the next person would be able to move forward.
