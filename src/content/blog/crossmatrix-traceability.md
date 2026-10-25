---
title: "Know which tests cover which requirements without a spreadsheet"
description: "Check one export-permission requirement against a specific test assertion, record the evidence, and revisit the link when either changes."
updatedDate: 2026-10-25
pubDate: 2026-11-10
draft: false
tags: [traceability, testing, Crossmatrix, AI agents]
heroImage: /assets/blog/crossmatrix-traceability-banner-v2.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

A reviewer asks whether ordinary accounts are prevented from exporting restricted data. Your test suite is green, and several filenames contain “export.” Which assertion answers the question?

Start with that access rule and inspect the test that should enforce it. Record the relationship with a reference to the assertion. This is traceability: keeping a requirement connected to the evidence used to judge it.

## Write the rule narrowly enough to check

Consider a hypothetical feature with this policy: only administrators may download the restricted export. Keep that rule separate from requirements about CSV formatting and file size. They need different checks.

Suppose a test signs in as an administrator, downloads a file and checks its header. It supplies evidence about an allowed download. It does not establish what happens when an ordinary account makes the same request.

For the access rule, look for a test that uses an ordinary account and checks the agreed refusal without receiving the restricted data. Inspect how the test obtains its account and makes its request, too. An assertion against a fake response cannot establish that the real access boundary is enforced.

## Record what the assertion establishes

A small review table can hold the link:

| Requirement | Evidence to inspect | Unresolved question |
| --- | --- | --- |
| Administrators can export | An allowed request and returned file | Does this test use the real authorization path? |
| Ordinary accounts cannot export | A refused request with no restricted payload | Does the refusal also hold for a direct request? |

These are proposed checks for the hypothetical feature, not results from a test run. Leave a relationship unresolved until its evidence has been inspected.

[Crossmatrix](https://github.com/praxec/crossmatrix) provides a structured record for cross-reference observations and evidence. Its documented gap and stale-evidence checks can direct this review. The relationship still depends on what the supplied observation establishes.

## Recheck the link after a change

Suppose a refactor replaces the ordinary-account request with a check that the Export button is hidden. The test may still pass, but it no longer exercises the same boundary. A hidden button does not answer whether a direct request returns data.

Review the old coverage observation when the requirement, assertion or setup changes. A file-change signal helps locate work to inspect; the reviewer still decides whether the relationship remains supported.

Pick one access rule in your own project. Find the exact assertion used to accept it, then write down what that assertion leaves undecided. That is a useful first link, whether you store it in Crossmatrix or a plain document.
