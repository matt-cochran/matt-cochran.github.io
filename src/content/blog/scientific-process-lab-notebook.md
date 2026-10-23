---
title: "Give your AI agent a lab notebook it can't quietly rewrite"
description: "How scientific-process keeps an agent's hypotheses, experiments and verdicts in an append-only record you can check later, with any model doing the work."
pubDate: 2026-10-23
draft: false
tags: [scientific-process, AI agents, debugging, experimentation]
heroImage: /assets/blog/scientific-process-lab-notebook-banner.svg
heroDecorative: true
heroAlt: ""
heroWidth: 1440
heroHeight: 320
---

Your agent tells you it found the cause. The flaky test was a race in the cache, it's fixed, and everything passes.

A week later the test fails again. You go back to see what the agent checked. The conversation has been compacted. The reasoning is now a summary of a summary. You can't tell what was tested, what was assumed, or what the agent decided without looking.

That's not a model problem. It's a record-keeping problem.

Scientists solved it long ago with the lab notebook: write down what you expect before you look, write down what you saw, and never tear out a page. You can give your agent the same thing in about five minutes.

## A chat transcript is not a record

Agents reason in conversation, and conversations are bad at keeping evidence:

- **They get compacted.** Long sessions are summarized to fit the context window, and the details go first.
- **They blur everything together.** Guesses, test output and conclusions all arrive as the same confident prose.
- **They don't separate the prediction from the result.** So you can't tell whether a test was designed to fail or picked because it passed.

Richard Feynman put the risk plainly: "The first principle is that you must not fool yourself—and you are the easiest person to fool." ([Feynman, 1974](https://calteches.library.caltech.edu/51/2/CargoCult.htm)) An agent working fast on your behalf is no exception.

## What scientific-process does

[scientific-process](https://github.com/praxec/scientific-process) is a small open-source server I built as part of Praxec. It speaks MCP, so any agent host that supports MCP can call it. It's also the scientific-method tool in [Junior](https://github.com/matt-cochran/junior)'s toolbelt.

It records four kinds of events:

1. **Hypothesis**: a claim that could be wrong.
2. **Experiment**: how you'll test it, and what you predict you'll see if it's true.
3. **Observation**: what you saw, whether it supports the claim, and the raw evidence.
4. **Conclusion**: `Supported`, `Refuted` or `Inconclusive`, with the reasoning.

Here's the design choice that matters: **the log is append-only.** The tool has no edit and no delete. If a conclusion was wrong, you append a new one. The old one stays in the record, so anyone reading later can see that the thinking changed, and why.

The standing of each hypothesis isn't stored anywhere. It's computed by replaying the log, so the same log always gives the same answer.

## One investigation, start to finish

Here's a real one, trimmed a little, from planning [Junior 0.10](/blog/roadmap-proved-wrong/). I was about to build a runner that executes tasks in parallel, because runs felt slow.

**The hypothesis**, written as something that could fail:

```json
{"tool": "append", "arguments": {
  "session_id": "junior-pi-hub-value",
  "variant": "add_hypothesis",
  "id": "H6-cohort-parallelism",
  "statement": "Parallel execution is not happening today, so a cohort runner would unlock wall-clock gains that are currently lost."
}}
```

**The experiment**, with the prediction written before looking at the data:

```json
{"tool": "append", "arguments": {
  "session_id": "junior-pi-hub-value",
  "variant": "add_experiment",
  "id": "E-H6-cohort-parallelism",
  "hypothesis_id": "H6-cohort-parallelism",
  "design": "Treat each run as [start, finish] and compute max concurrency and the share of busy time with more than one run in flight.",
  "prediction": "Max concurrency near 1 and little overlapping busy time."
}}
```

**The observation**, with evidence someone else could rerun:

```json
{"tool": "append", "arguments": {
  "session_id": "junior-pi-hub-value",
  "variant": "add_observation",
  "id": "O-H6-cohort-parallelism",
  "experiment_id": "E-H6-cohort-parallelism",
  "result": "Max concurrent runs 6; more than one run in flight for 34% of busy time.",
  "supports": false,
  "evidence": "interval sweep over 125 recorded runs"
}}
```

**The conclusion:**

```json
{"tool": "append", "arguments": {
  "session_id": "junior-pi-hub-value",
  "variant": "conclude",
  "hypothesis_id": "H6-cohort-parallelism",
  "verdict": "Refuted",
  "rationale": "Runs already overlap; a cohort runner would not recover lost wall-clock time."
}}
```

Four calls. The feature never got built. And months from now, when someone says "we should really run these in parallel", the answer is in the log with its evidence attached.

## The parts that keep you honest

A few more tools turn a pile of events into a process:

- **`experiment.next`** returns the open hypothesis with the fewest observations. That's usually where your next test teaches you the most.
- **`report.export`** gives you every hypothesis with its experiments, observations and verdict in one structure. It's what you'd paste into a decision record.
- **`adjudicate`** judges a batch of claims and evidence in one pass, without touching your session. Useful when you have twenty use cases to check, not one.

There's also an optional second opinion. With a key for Jev, TypeSafe's small classifier model, four advisory checks switch on. They ask whether an experiment can fail, whether an observation supports its claim, whether a verdict is backed by its observations, and whether a new hypothesis duplicates an old one. They never write to the log. They flag; you decide.

Here's what it **won't** do: stop you from concluding nonsense. You can append `Supported` with no supporting evidence, and the server will accept it. The verdict check will warn you, and the record will show exactly what you did.

That's the deal. The tool doesn't make you right. It makes it obvious when you're not.

## Any model can hold the pen

Nothing here depends on which model does the reasoning.

When I used it on Junior, a frontier model ran the investigation. A cheaper model could make the same calls. So could you, typing JSON by hand. The record looks the same either way, so you can hand an investigation from one to another, or from today's session to next month's.

That's the quiet benefit. The expensive part of an investigation is the thinking. The notebook makes sure you pay for it once.

## Set it up in five minutes

It ships as an npm launcher that downloads a checksum-verified binary for your platform. In Claude Code:

```sh
claude mcp add scientific-process --scope user -- npx -y @matthew-cochran/scientific-process
```

Other MCP clients take the same command and arguments. To install the agent skills that teach the loop:

```sh
npx -y @matthew-cochran/scientific-process skills install --target claude --user
```

If you use Junior, you don't need to register anything. It's already wired in:

```sh
junior tools call scientific-process state.get session_id=junior-pi-hub-value
```

Each session is one JSONL file, kept under `SCIENTIFIC_PROCESS_STATE_DIR` when you set it. Point that at a folder in your repository and the notebook travels with your code.

## Start with the fix you're least sure about

Pick the last thing your agent told you it had fixed. Write its claim down as a hypothesis. Then ask the agent for one experiment that could prove the claim wrong, with the prediction written first.

If it can't name one, you've learned something about the fix.

If it can, run it. And keep the page.

For the wider habit of treating every agent claim this way, read [Your coding agent's "done" is a hypothesis](/blog/scientific-method-agentic-development/).

---

## References

1. Feynman, R. "Cargo Cult Science." Caltech commencement address, 1974. https://calteches.library.caltech.edu/51/2/CargoCult.htm
2. scientific-process source and skills. https://github.com/praxec/scientific-process
3. `@matthew-cochran/scientific-process` on npm. https://www.npmjs.com/package/@matthew-cochran/scientific-process
4. Junior. https://github.com/matt-cochran/junior
