# Submission Review

This review focuses on assignment scoring: clarity, realism, working MVP quality, and polish.

## Repository Structure

Strong points:

- Clear App Router structure in `app/`.
- Components are named by product responsibility.
- Core audit logic is isolated in `lib/audit-engine.ts`.
- Database schema is included in `supabase/schema.sql`.
- Tests exist for the highest-risk logic.
- Product/business docs now exist as separate reviewable artifacts.

Weak spots to watch:

- `tsconfig.json` has local generated changes. Commit intentionally or revert before final submission.
- The app was updated to a newer Next version; keep docs and dependencies consistent.
- Screenshots still need to be added before final submission.
- There is no end-to-end browser test yet.
- Analytics instrumentation is planned but not implemented.

## Missing or Risky Deliverables

Before submitting, make sure the final package includes:

- Production URL
- GitHub repository URL
- README with setup and architecture links
- Screenshots or short demo video
- Test command and passing test output
- Reflection document
- Business/GTM/economics thinking

## Lighthouse Opportunities

Targets:

- Performance: >= 85
- Accessibility: >= 90

Likely wins:

1. Fonts
   `next/font/google` is good for production, but verify it does not delay first paint. If Lighthouse flags font loading, consider fewer weights.

2. JavaScript
   Keep the landing page mostly server-rendered. Avoid adding new client components to the homepage.

3. Images
   If screenshots or logos are added to the landing page, use optimized image sizes and `next/image`.

4. Accessibility
   Check color contrast on muted slate text, button focus states, form labels, and error messages.

5. Mobile layout
   Verify the audit form does not overflow at 320px width.

6. Metadata
   Keep static metadata. Do not reintroduce database-backed `generateMetadata` on dynamic result routes.

Suggested Lighthouse run:

```bash
npm run build
npm run start
```

Then run Lighthouse against:

```text
http://localhost:3000
http://localhost:3000/audit
```

## Git Hygiene

Suggested final commit structure:

```text
feat: build ai spend audit mvp
test: cover deterministic audit engine
docs: add submission materials
fix: make dynamic audit route deployment-safe
chore: final submission polish
```

Current cleanup opportunities:

- Decide whether to commit or revert the local `tsconfig.json` modification.
- Make one final docs/polish commit after this pass.
- Avoid committing `.env.local`.
- Confirm `.env.example` is committed.
- Tag the final submitted commit if desired:

```bash
git tag submission-final
git push origin submission-final
```

## Entrepreneurial Realism

What reads well:

- The product is narrow and timely.
- The audit gives a specific dollar outcome.
- The free tool can credibly generate qualified leads.
- The rules reflect real startup behavior: tool sprawl, seat bloat, overlapping code assistants.

What to avoid claiming:

- Do not claim exact savings without billing integrations.
- Do not claim enterprise-grade procurement coverage.
- Do not claim the AI has perfect financial judgment.
- Do not overstate traction without real usage data.

Best framing:

"This is a focused MVP for discovering whether AI spend waste is a real wedge. The app produces immediate user value, captures demand, and gives the founder enough data to decide whether to deepen into integrations, services, or monitoring."
