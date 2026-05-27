# Metrics

## North Star Metric

Qualified savings discovered per week.

Definition:

```text
Sum of monthly savings found in completed audits where:
- total monthly AI spend is at least $300
- savings found is at least $100/month
- the user submits a work email or requests follow-up
```

This metric connects product value to business value. Raw audits can be vanity if users are unqualified.

## Input Metrics

| Metric | Why It Matters |
| --- | --- |
| Landing CTA click rate | Measures message clarity |
| Audit start rate | Measures intent |
| Audit completion rate | Measures form usability |
| Median tools per audit | Indicates ICP fit |
| Median monthly AI spend | Indicates commercial potential |
| Percent with savings found | Measures audit usefulness |
| Median savings found | Measures strength of value proposition |
| Lead capture rate | Measures willingness to engage |
| Qualified lead rate | Measures business quality |
| Follow-up booking rate | Measures sales pull |

## Instrumentation Plan

Use a lightweight analytics tool such as PostHog, Plausible, or Umami.

Events:

```text
landing_viewed
audit_started
tool_added
audit_submitted
audit_completed
results_viewed
share_link_copied
lead_submitted
cta_clicked
```

Properties:

```text
team_size
primary_use_case
tool_count
total_monthly_spend
total_monthly_savings
has_code_assistant_overlap
has_api_spend_flag
lead_company_present
```

Privacy:

- Do not send raw email addresses to analytics.
- Do not send full form data to analytics.
- Store only aggregate spend, savings, and categorical properties.

## Dashboard Views

1. Funnel
   Visitor -> audit start -> audit submit -> results -> lead submit.

2. Value distribution
   Median and percentile savings found by team size.

3. ICP quality
   Completed audits with $300+ monthly spend and 3+ tools.

4. Recommendation mix
   Which findings appear most often: plan downgrade, overlap, API spend, seat review.

5. Lead quality
   Leads by savings band and company completeness.

## Pivot Threshold

Continue if, after 100 completed audits:

- At least 30% find $100+/month savings.
- At least 15% submit a work email.
- At least 5 users agree to a follow-up conversation.
- At least 2 users say they would pay for help implementing savings.

Pivot or narrow the ICP if:

- Median savings found is under $50/month.
- Lead conversion is under 5%.
- Users say recommendations are obvious or not actionable.
- Most completed audits come from individuals, not teams.

Possible pivots:

- AI spend benchmark report for startups.
- CSV/invoice-based AI spend analysis.
- Procurement checklist for engineering teams.
- Agency-led AI tool cleanup service.
