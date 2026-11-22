# Compute cross-scale planning-unit scores by resolution

This function computes a feature-based importance score at each
resolution present in a multiscale planning-unit set, and then
propagates those resolution-specific scores through the H3 hierarchy so
every planning unit receives a score "as seen from" each resolution.

Propagation rules:

- **Downward (parent \\\rightarrow\\ children):** undamped broadcast.
  All descendants of a given parent at resolution `r` inherit the same
  `score_from_r` value.

- **Upward (children \\\rightarrow\\ parent):** aggregation of
  descendant scores at resolution `r` using `mean` (default) or `max`.

## Usage

``` r
compute_pu_scores_crossscale(
  s,
  feature_mat,
  maps,
  cs_idx,
  feature_weights = NULL,
  winsor_p = NULL,
  cost_col = NULL,
  cost_beta = 1,
  agg_mode = c("mean", "max"),
  res_col = "res",
  res_levels = NULL,
  feature_cols_by_res = NULL,
  prefix = "score_from_r"
)
```

## Arguments

- s:

  An `sf` object with one row per planning unit. Must contain a
  resolution column (default `"res"`).

- feature_mat:

  A numeric matrix/data.frame with one row per planning unit and one
  column per feature. Feature columns are expected to be prefixed by
  resolution (e.g., `r5_`, `r6_`, ...), unless `feature_cols_by_res` is
  supplied.

- maps:

  Output of
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

- cs_idx:

  Output of
  [`build_crossscale_index()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md).

- feature_weights:

  Optional named numeric vector of user weights for features. Names must
  match `colnames(feature_mat)`.

- winsor_p:

  Optional winsorization level passed to the feature-only score
  computation. See
  [`compute_pu_scores()`](https://pjmerlo.github.io/MultiscaleSCP/reference/compute_pu_scores.md).

- cost_col:

  Optional name of a numeric cost column in `s`. If provided,
  feature-based scores are divided by `cost^cost_beta` within each
  resolution before propagation.

- cost_beta:

  Numeric exponent applied to costs when `cost_col` is provided.

- agg_mode:

  Character, aggregation used for upward propagation (children
  \\\rightarrow\\ parent). One of `"mean"` or `"max"`.

- res_col:

  Name of the resolution column in `s`. Defaults to `"res"`.

- res_levels:

  Optional integer vector of resolutions to compute. Defaults to
  `maps$res_levels`.

- feature_cols_by_res:

  Optional named list mapping each resolution (as a character) to a
  character vector of feature column names. If `NULL`, columns are
  inferred using the prefix pattern `^r{res}_`.

- prefix:

  Column name prefix for outputs. Defaults to `"score_from_r"`.

## Value

The same `sf` object `s` with one new numeric column per resolution,
named `paste0(prefix, res)` (e.g., `score_from_r5`).

## Examples

``` r
# Tiny 2-level setup: 2 parents (r7), and 2 children (r8) under the first parent
parent1 <- "872a1072bffffff"
parent2 <- "872a10729ffffff"
kids    <- c("882a1072b1fffff", "882a1072b3fffff")

h3_vec  <- c(parent1, parent2, kids)
res_vec <- c(7L, 7L, 8L, 8L)

s <- sf::st_as_sf(
  data.frame(
    h3_address = h3_vec,
    res        = res_vec,
    cost       = c(1, 1, 1, 1),
    x          = c(0, 1, 2, 3),
    y          = c(0, 0, 0, 0)
  ),
  coords = c("x", "y"), crs = 4326
)

# Feature columns prefixed by resolution (r7_, r8_)
feature_mat <- data.frame(
  r7_f1 = c(1.0, 0.2, 0.0, 0.0),
  r8_f1 = c(0.0, 0.0, 0.6, 0.2)
)

maps   <- build_h3_maps(s)
cs_idx <- build_crossscale_index(maps)

s2 <- compute_pu_scores_crossscale(
  s, feature_mat,
  maps = maps, cs_idx = cs_idx,
  agg_mode = "mean",
  res_col = "res"
)

s2[, c("res", "score_from_r7", "score_from_r8")]
#> Simple feature collection with 4 features and 3 fields
#> Geometry type: POINT
#> Dimension:     XY
#> Bounding box:  xmin: 0 ymin: 0 xmax: 3 ymax: 0
#> Geodetic CRS:  WGS 84
#>   res score_from_r7 score_from_r8    geometry
#> 1   7     0.6666667           0.5 POINT (0 0)
#> 2   7     0.0000000           0.0 POINT (1 0)
#> 3   8     0.6666667           1.0 POINT (2 0)
#> 4   8     0.6666667           0.0 POINT (3 0)
```
