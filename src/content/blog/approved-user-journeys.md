---
title: "Keep end-to-end tests useful as your app changes"
description: "When a browser test breaks after a screen changes, preserve the user outcome before repairing the steps. A worked order-flow example shows what to check."
updatedDate: 2026-10-25
pubDate: 2026-10-16
draft: false
heroImage: /assets/blog/jevitate-journey-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
tags: [Jevitate, end-to-end testing, user journeys, adversarial testing]
---

You rename a button, and a browser test breaks. Before repairing the click, check what the test was meant to prove. Finding the new button will not help if the updated flow submits the wrong order.

For a developer maintaining end-to-end tests, the useful unit is the user's job together with its success checks. Keep those available when changing the recorded steps. Jevitate stores browser steps and their checks as a flow you can review and replay.

## Give the test an outcome to preserve

Consider a hypothetical order wizard in a local test app. A person enters a name, reviews the order and confirms it. The intended outcome is an order stored for that person, with the details they reviewed.

A check for a completion message establishes only that the message appeared. Add a check against an appropriate server-backed view or test interface to establish which order was stored. Use fictional orders and an environment where you have permission to create them.

Review the steps and success checks together. A discovered route is a candidate for that review, even if the browser can already complete it.

## Repair a step without changing the meaning

Suppose Next becomes Continue. Inspect the new button's behavior. If it advances to the same review screen, retargeting the click may be appropriate. If it skips review or submits the order immediately, the change needs a decision about product behavior.

Jevitate's [version-pinned repair documentation](https://github.com/matt-cochran/jevitate/blob/6d451555d319f3f9cd454a69b443dd63d786a3c6/docs/journeys.md) describes eligible retargeting under a write guard. Repair must be enabled and supplied with change context. A repaired run is held for review; it does not silently replace the stored flow. Write-producing and irreversible steps are excluded from automatic healing.

For this order example, review whether Continue reaches the same state with the same details. Keep the stored-order check. A successful click is no reason to weaken it.

## Branch from a state you have actually reached

The review screen offers another test: go back, change the name and return. Does the submitted order use the reviewed name? Another probe might attempt a double confirmation and check for duplicate orders.

These probes need the wizard state created by earlier steps. Opening the review URL in a fresh session may not recreate it. Jevitate's documented flow-anchored missions replay the saved steps to a selected point before investigating from that browser context.

First check that the branch point contains the intended order. If replay fails to establish it, the investigation is inconclusive. The documented branch-point replay does not self-heal. Repair and review the starting flow before interpreting a later probe.

## Keep people responsible for the contract

People still choose the user's goal, the success checks, permitted actions and test data. They review proposed repairs and decide whether changed behavior is acceptable. A tool can discover a route or propose a probe without establishing that either checks the right outcome.

Start with one browser test that repeatedly needs repair. Write its user outcome beside its steps. After the next interface change, check whether the repair preserves that outcome, then record the maintenance work you still do by hand. That gives you a basis for deciding where this approach fits your suite.
