# Tests

The test suite focuses on the highest-risk part of the product: the deterministic audit engine.

## Run Tests

```bash
npm test
```

Current result:

```text
1 test file passed
17 tests passed
```

## What Is Covered

Test file:

```text
__tests__/audit-engine.test.ts
```

Coverage areas:

| Area | Examples |
| --- | --- |
| Cursor rules | Business plan with 1 or 2 seats, correctly priced Pro plan |
| ChatGPT rules | Team vs Plus for tiny teams, Enterprise vs Team for small teams |
| GitHub Copilot rules | Enterprise downgrade, Business vs Individual for tiny teams |
| API spend rules | High spend per person, moderate spend, low spend |
| Tool overlap | Cursor + Copilot, triple coding-assistant overlap, ChatGPT + OpenAI API |
| Totals | Monthly and annual savings aggregation |

## Why These Tests Matter

The audit engine produces financial recommendations. That means the riskiest failures are not UI bugs, but incorrect savings math or bad recommendation severity.

The tests make sure:

- Savings calculations are deterministic.
- Plan downgrade recommendations trigger only under intended conditions.
- Overlap detection does not double as random AI output.
- Total savings are calculated from recommendation data.

## What Is Not Yet Covered

Not currently covered:

- Server Action integration with Supabase
- Lead capture submission
- Resend email behavior
- Browser-level form completion
- Accessibility snapshots

These would be the next test additions if the MVP moved beyond assignment scope.

## Recommended Next Tests

1. Add Playwright smoke test:
   Complete the audit form, submit, and assert that a results page appears.

2. Add Server Action tests with mocked Supabase:
   Verify successful insert, failed insert, and missing env var handling.

3. Add accessibility test:
   Run Axe against landing, audit form, and results pages.

4. Add regression test:
   Verify result share button copies `/audit/[id]` rather than a removed route.
