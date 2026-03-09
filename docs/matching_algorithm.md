# Matching Algorithm

This project uses a weighted similarity-based matching engine to compare `lost` and `found` items and store realistic match suggestions.

## Location

Engine module:

- `lib/matching-engine/index.ts`

## Data Compared

The algorithm compares these fields from `items`:

- `title`
- `category`
- `brand`
- `color`
- `description`
- `location`
- `date_reported`

Only cross-status pairs are compared:

- `lost` ↔ `found`

## Scoring Model

Threshold:

- `score >= 60` => valid match
- `score < 60` => ignored

Scores are capped at `100`.

### Weights

- Category exact match: `+30`
- Title similarity >= 70%: `+20`
- Brand exact match: `+15`
- Color same/similar: `+10`
- Description keyword overlap: `+15`
- Location exact match: `+20`
- Location partial similarity: `+10`
- Date proximity:
  - <= 3 days: `+10`
  - <= 7 days: `+5`

## Similarity Techniques

### Title similarity

- Uses bigram-based string similarity.
- Considered a match if similarity is at least `0.70`.

### Description similarity

- Normalizes text and tokenizes keywords.
- Removes stop-words.
- Uses keyword overlap (Jaccard + common token count).
- Awards points when overlap is meaningful.

### Color similarity

- Supports canonical color groups (e.g., `dark blue` -> `blue`, `charcoal` -> `black`).

### Location similarity

- Exact normalized string match: full points.
- Otherwise checks partial similarity using bigram/Jaccard methods.

### Date proximity

- Absolute day difference between report dates.

## Duplicate Prevention

Before insert, engine checks existing pair:

- `lost_item_id`
- `found_item_id`

If the pair exists:

- skip insert
- update score only when existing status is `suggested`

Database uniqueness also exists on `(lost_item_id, found_item_id)`.

## Automatic Triggering

Matching is triggered automatically when new items are reported:

- `POST /api/items`
- `POST /api/items/report-lost`
- `POST /api/items/report-found`

The trigger uses incremental matching (`runMatchingForItem`) against opposite-status candidates.

## Full Rebuild

Admin can run full matching via existing matching endpoint flow (`runMatchingEngine`) to evaluate all lost-found pairs.

## Match Explanation

Each match includes `matched_attributes` for UI display (e.g.,
`Same category`, `Similar item title`, `Same brand`, `Same location`, `Reported within 7 days`).

## Performance Considerations

- Incremental matching uses candidate filtering for opposite items by:
  - same category, or
  - same location, or
  - report date within 30 days
- SQL indexes used by the schema (`status`, `category`, `location`, etc.) help query speed.
- Full matrix matching is available for backfill/recompute workflows.

## Logging

Engine logs comparison and storage events for debugging:

- item pair being compared
- computed score
- whether stored or skipped
