# Matching Algorithm

## Overview

The matching engine is a rule-based system that automatically compares lost and found items to identify potential matches based on multiple attributes.

## Scoring System

Each attribute comparison contributes to a match score:

| Attribute | Weight | Criteria |
|-----------|--------|----------|
| Category | 40 points | Exact match (case-insensitive) |
| Location | 30 points | Exact match (case-insensitive) |
| Color | 15 points | Exact match (case-insensitive) |
| Brand | 10 points | Exact match (case-insensitive) |
| Date | 5 points | Within 7 days of each other |

**Maximum Score:** 100 points
**Match Threshold:** 60 points

## Algorithm

```
for each lost_item in items:
    for each found_item in items:
        score = 0
        
        if lost_item.category == found_item.category:
            score += 40
            
        if lost_item.location == found_item.location:
            score += 30
            
        if lost_item.color == found_item.color:
            score += 15
            
        if lost_item.brand == found_item.brand:
            score += 10
            
        date_diff = abs(lost_item.date - found_item.date)
        if date_diff <= 7 days:
            score += 5
            
        if score >= 60:
            create_match(lost_item, found_item, score)
```

## Match Status

Matches can have one of three statuses:

1. **suggested** - Automatically generated, awaiting review
2. **confirmed** - Approved as a valid match
3. **rejected** - Denied as not matching

## Implementation

The matching engine is implemented in `/lib/matching-engine/index.ts`:

- `calculateMatchScore()` - Computes score between two items
- `runMatchingEngine()` - Runs the matching algorithm
- `getMatches()` - Retrieves matches with filtering
- `updateMatchStatus()` - Updates match status

## Usage

### Running the Matching Engine

```typescript
import { runMatchingEngine } from "@/lib/matching-engine";

const matches = await runMatchingEngine();
```

### API Endpoint

```bash
POST /api/matches/run
# Requires admin authentication
```

## Performance Considerations

- Algorithm runs on all lost/found item pairs
- Consider running during off-peak hours for large datasets
- Indexes on status field improve retrieval performance
- Consider caching results for frequently accessed matches
