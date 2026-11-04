---
title: "Catch a failed save even when the page says Saved"
description: "Use Jevitate to investigate a misleading success message, inspect browser evidence, and recheck a fix against the failure that prompted it."
pubDate: 2026-09-22
updatedDate: 2026-10-25
tags: [Jevitate, browser testing, regression testing]
heroImage: /assets/blog/jevitate-launch-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
draft: false
---

You edit a profile, click Save, and see a confirmation. You reload the page. Your old name is still there.

A test that checks only for the confirmation message can miss this failure. To catch it, you need to check what happened to the request and whether the application kept the change.

The [pinned Jevitate demo](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/docs/demo.md) describes a deliberately broken profile form with this behavior. Its example uses a name containing characters outside Latin-1: the server returns HTTP 500, while the page displays “Saved.” This article follows that historical demo, rather than reporting a new test run.

The pinned demo uses deterministic stand-ins for advisory model calls. Its setup and commands apply to that checkout; check your installed release before using them elsewhere.

## Decide what a successful save means

Before running a browser tool, write down the behavior you expect. For this form, there are three separate observations:

- The page shows a confirmation.
- The save request succeeds.
- The saved name survives a reload.

The confirmation is useful feedback, but it cannot establish the other two. In the broken example, it actively misleads you.

Jevitate's demo also declares an invariant: when the page says Saved, the server should hold the name that was entered. An invariant is a rule the application should continue to satisfy. Writing that rule explicitly gives the test something concrete to check.

For your application, choose the observation that matches the user's actual goal. A checkout confirmation might need a matching order record. A settings change might need to survive a new session. Keep the check specific enough that a failure tells you what to investigate.

## Run the broken form locally

The [source demo instructions](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/docs/demo.md) cover cloning the repository, building its CLI, installing Chromium, and starting the example app. They require Node.js 20 or newer and pnpm 9. Use the CLI built from that checkout so the example and its commands match.

With the app running, use the adversarial exploration command in that pinned demo. It supplies the local profile URL and the saved-value invariant. Its fake-AI mode replaces advisory model calls with deterministic stand-ins while the browser still interacts with the local application.

The pinned demo describes two expected findings: the HTTP 500 and the broken saved-value invariant. Treat those as expected results to compare with your run. If your output differs, inspect the result and environment before drawing a conclusion. An exit code of 1 from this exploration means defects were found.

## Inspect the failure before changing code

Open the result file reported by the command. Find the defect's fingerprint, the steps leading to it, and its associated Recording. A fingerprint identifies the finding for later checks; the Recording contains the browser steps needed to replay it.

For this bug, inspect both the failed request and the mismatch between the entered and stored name. Together, they explain why a user could see a success message and still lose the edit.

That evidence gives you a narrower debugging task: investigate the server's handling of the input and the form's handling of a failed response. You can make that decision without accepting a model's explanation of what went wrong.

## Recheck the same failure after the fix

Use `verify-fix` with the result path and fingerprint from your run:

    jevitate verify-fix --result <result.json> --fingerprint <fingerprint>

Replace the placeholders with the actual values. This command replays the finding and reports a verdict with a reason. A result can still reproduce, be fixed under the checks that ran, be intermittent, or remain inconclusive. An incomplete replay gives you no basis for declaring the bug fixed.

If you want a regression you can keep with the code, the demo shows how to capture the invariant violation and run it again after enabling the example app's fix. The HTTP 500 and the invariant take different paths: a hard-signal finding can be rechecked with `verify-fix`, while the declared invariant can become a standalone regression. The [verification reference](https://github.com/matt-cochran/jevitate/blob/73d164896cfc4faf001ca437bef3bf91cc317fa3/docs/verification.md) explains which failures capture supports.

For your next save-flow test, reload after the confirmation and check the value the user expected to keep. If that check fails, retain the request evidence and replay steps before changing the code.
