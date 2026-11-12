---
title: "The development shortcut that put a real key into the repository"
description: "Keep credentials out of tracked files and verify a clean integration setup."
pubDate: 2026-11-16
updatedDate: 2026-11-16
draft: false
heroImage: /assets/blog/development-key-in-repository.svg
tags: [development, credentials, onboarding]
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 420
---

A developer is trying to run a sample integration before a handoff. The app needs a credential, so they paste a real key into the sample configuration. The integration works. Then the sample file goes into the pull request with the rest of the change.

This is a hypothetical example, but the shortcut has a recognizable cause. The checked-in file was the easiest way to make the app start. A warning in the README leaves that path open.

**Give the app one documented way to receive a credential outside the repository.** Commit the names of the settings, a safe example, and instructions for obtaining access. Supply the real values through your team’s secret manager or runtime environment. Use a limited development credential so running the example does not require production access. If the value is missing, print the setting name and the setup command. Keep the value out of diagnostics.

**Try the instructions from a clean checkout.** Use a disposable account with only the permissions the example needs. Confirm that a new contributor can start the integration without editing a tracked file. Then inspect the staged changes and captured logs. You are checking two things: the example worked, and its credential stayed out of both places.

**Put a second check before merge.** Configure a secret scan in the PR workflow and use fictional fixtures for ordinary CI tests. Test the scanner with its documented fake test value. Scanners can miss unfamiliar formats, so keep the safe startup path even if scanning is already required.

If you discover a real key in a commit, revoke or rotate it first. Check where the old key was used, then coordinate any history cleanup with the repository owner. Deleting a line from the latest commit leaves earlier copies of that commit accessible.

Start with one integration that new contributors use. Time a clean setup and inspect what it leaves behind. Fix the point where the instructions make a tracked file the easiest place to put a credential.
