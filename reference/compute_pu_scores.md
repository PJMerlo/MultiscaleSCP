# Compute importance scores for planning units

This function calculates a continuous importance score
(`ensemble_score`) for each planning unit by combining two sources of
information: (1) a rarity-weighted aggregation of feature values, and
(2) how consistently each planning unit is selected across one or more
solutions.

The relative influence of these components is controlled by
`alpha_freq`. When multiple solutions are provided, selection
consistency reflects how often each planning unit is selected across the
portfolio. When a single solution is provided, it reflects whether the
planning unit is selected or not. If no solution columns are present,
the score is based entirely on the rarity-weighted feature component.

Optionally, `locked_in` planning units can be forced to rank above all
others.

## Usage

``` r
compute_pu_scores(
  s,
  feature_mat,
  feature_weights = NULL,
  alpha_freq = 0.25,
  freq_gamma = 1.5,
  lock_mode = c("top", "none"),
  winsor_p = NULL,
  cost_col = NULL,
  cost_beta = 1
)
```

## Arguments

- s:

  An `sf` object with one row per planning unit. Must contain any
  `solution_*` columns used to compute selection consistency, and
  optionally a logical `locked_in` column.

- feature_mat:

  A numeric matrix or data frame with one row per planning unit and one
  column per feature (e.g. proportion of each feature in each PU).

- feature_weights:

  Optional named numeric vector of user weights for the features. Names
  must match `colnames(feature_mat)`. If `NULL`, all features receive
  equal weight.

- alpha_freq:

  Numeric in \\\[0,1\]\\ controlling the trade-off between feature score
  and selection consistency. Values near 0 emphasize features, values
  near 1 emphasize consistency across solutions.

- freq_gamma:

  Numeric exponent applied to selection consistency (after percentile
  ranking) to emphasize planning units that are selected in many
  solutions (`freq_gamma > 1` increases contrast).

- lock_mode:

  Character, either `"none"` (locked-in PUs are treated like any others,
  aside from their higher selection consistency) or `"top"` (locked-in
  PUs are always ranked above non-locked ones).

- winsor_p:

  Optional numeric in \\\[0,0.5)\\. If provided, feature values are
  winsorized at the `winsor_p` and `1 - winsor_p` quantiles prior to
  rank/ECDF scaling to \\\[0,1\]\\. If `NULL` (default), no
  winsorization is performed.

- cost_col:

  Optional name of a numeric column in `s` containing planning-unit
  costs. If provided, the feature-based score is divided by
  `cost^cost_beta` prior to final rescaling.

- cost_beta:

  Numeric exponent applied to costs when `cost_col` is provided.
  Defaults to 1 (benefit per cost).

## Value

The same `sf` object `s` with two new numeric columns:
`selection_consistency` and `ensemble_score`.

## Examples

``` r
# Minimal sf with 3 planning units + two solution columns
s <- sf::st_as_sf(
  data.frame(
    x = c(0, 1, 2),
    y = c(0, 0, 0),
    solution_1 = c(1, 0, 1),
    solution_2 = c(1, 1, 0),
    locked_in  = c(FALSE, TRUE, FALSE)
  ),
  coords = c("x", "y"), crs = 4326
)

# Feature matrix must match nrow(s)
feature_mat <- data.frame(
  f1 = c(0.2, 0.0, 0.8),
  f2 = c(0.0, 0.5, 0.1)
)

s2 <- compute_pu_scores(
  s, feature_mat,
  alpha_freq = 0.25,
  lock_mode  = "top"
)

s2[, c("selection_consistency", "ensemble_score", "locked_in")]
#> Simple feature collection with 3 features and 3 fields
#> Geometry type: POINT
#> Dimension:     XY
#> Bounding box:  xmin: 0 ymin: 0 xmax: 2 ymax: 0
#> Geodetic CRS:  WGS 84
#>   selection_consistency ensemble_score locked_in    geometry
#> 1                 1.000        0.25000     FALSE POINT (0 0)
#> 2                 0.125        1.01000      TRUE POINT (1 0)
#> 3                 0.125        0.78125     FALSE POINT (2 0)
```
