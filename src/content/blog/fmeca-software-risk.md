---
title: "Check how an agent handoff could fail"
description: "Trace a changed dependency response to an unreadable delivery report, then distinguish planned controls from controls you have tested."
updatedDate: 2026-10-25
pubDate: 2026-11-04
draft: false
tags: [FMECA, risk, AI agents, Junior]
heroImage: /assets/blog/fmeca-software-risk-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Before accepting work from a coding agent, you read its delivery report. Suppose a dependency update changes that report's response format. What should happen if your acceptance code can no longer interpret it?

This is a hypothetical design review for an engineer building the handoff. Begin with the failure and follow its effects: an incompatible response makes the report unreadable, leaving the manager without evidence for accepting the work.

That is a small use of **Failure Mode, Effects and Criticality Analysis**, or FMECA: name a way the design can fail, trace its effects and assess which controls it needs. It gives a worry such as “dependency risk” a concrete behavior to investigate.

## Let the code do the scoring

Agree on what the severity and likelihood categories mean before applying them. Otherwise, two reviewers can use the same score for different observations.

The [fmeca README](https://github.com/praxec/fmeca) describes a deterministic engine that maps catalogued observations to scores and tracks mitigations. That makes the arithmetic inspectable. It does not establish that the caller chose credible observations.

An agent can propose failure modes and observations, but a repeatable calculation does not establish that it chose credible ones. Review the observations alongside the score.

Everything goes into an append-only log. Residual risk after mitigation is computed, not typed. Inspect the readiness report and the applicable policy to see which unresolved items block the decision.

## Follow one dependency failure to its effect

Return to the hypothetical report. The dependency renames a response field, so the worker finishes but the manager cannot interpret whether its checks passed.

The failure mode is the incompatible response. The local effect is an unreadable report. The downstream risk is that someone either accepts work without evidence or spends time reconstructing it.

Consider three controls. Pin and review dependency upgrades to reduce unexpected changes. Test the report parser against representative responses to detect incompatibility. If the report still cannot be read, stop acceptance and retain the run for inspection.

Those controls address different parts of the failure. A refusal to accept an unreadable report can limit harm, but it does not prevent the dependency change or establish that the work is correct.

## Separate a planned control from a verified one

Writing “test the parser” in a risk record does not mean the test exists. Record where it was implemented, what input it checks and what happened when that check ran.

For the renamed field, deliberately try an incompatible response. The expected result is a visible refusal to accept, with a useful diagnostic. A test that exercises only the old response does not demonstrate that behavior.

Keep residual risk visible. A fixed scoring matrix cannot verify your observations or establish that the scenarios cover every failure. Use the tool's implementation and verification gates according to the decision you are making; a planned mitigation is not proof of protection.


## Ask the quiet question first

Before your agents start on the next feature, ask one question for each part of the design: **how does this fail, and what happens next?**

Write the failure mode and its effect. Apply the agreed severity categories to that effect, retaining any uncertainty about how often it could occur.

Choose one failure mode and test its control. A named risk gives you something to investigate; it does not establish that the risk has been removed.


## References

1. fmeca source, README and skills. https://github.com/praxec/fmeca
2. `@matthew-cochran/fmeca` on npm. https://www.npmjs.com/package/@matthew-cochran/fmeca
3. Junior 0.10.0 release notes. https://github.com/matt-cochran/junior/blob/515139f719b76ef8821b6018f77c22aea47dc544/CHANGELOG.md
