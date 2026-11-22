# Stratified multiscale selection by strata and resolution

Select planning units to meet area-based targets for each strata (e.g.
country) at each H3 resolution. Selection is based on a single score
column (typically `ensemble_score`) and a cross-scale index produced by
[`build_crossscale_index`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md).

Resolutions are processed from finest to coarsest. At each strata and
resolution, the function accounts for area already covered by selected
planning units at other resolutions to avoid double-counting. Within
each strata, it prefers native-resolution units that do not have finer
descendants in the input dataset, using coarser units with descendants
only when needed to reach the target.

The result is a single 0/1 selection that meets per-strata area targets
while minimizing cross-scale overlap.

## Usage

``` r
compute_selection_by_strata(
  s,
  cs_idx,
  strata_masks,
  target = 0.3,
  admin_strata = "admin",
  score_col = "ensemble_score",
  area_col = "area_km2",
  res_col = "res",
  out_col = "selected_by_admin",
  blocked_col = NULL,
  target_by_strata = NULL
)
```

## Arguments

- s:

  An `sf` object or data frame of planning units. Must contain at least
  the columns referenced by `admin_strata`, `score_col`, `area_col`, and
  `res_col`.

- cs_idx:

  A cross-scale index list as returned by
  [`build_crossscale_index()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md),
  containing at least `res_levels`, `rows_by_res`, `anc_at_res`,
  `desc_at_res`, and `finer_rows_by_r0cell`.

- strata_masks:

  Optional named list of logical vectors (length `nrow(s)`) defining the
  "in-scope" units for each strata. Names should match the values in
  `admin_strata`. If a given strata is missing from `strata_masks`, a
  fallback mask `admin_strata == A` is used.

- target:

  Default area-based target proportion (e.g. `0.3`) applied to all
  strata if `target_by_strata` is `NULL` or does not contain an entry
  for that strata.

- admin_strata:

  Name of the column in `s` containing strata labels (e.g. `"admin"`).

- score_col:

  Name of the column in `s` containing the PU score to rank candidates.

- area_col:

  Name of the column in `s` with PU areas.

- res_col:

  Name of the column in `s` with integer resolution codes.

- out_col:

  Name of the output column that will be created in `s` containing the
  final 0/1 selection flag (default `"selected_by_admin"`).

- blocked_col:

  Optional name of a column to store the global "has finer descendants"
  flag as 0/1. If `NULL` (default), this column is not written.

- target_by_strata:

  Optional named numeric vector of per-strata targets, e.g.
  `c("Ireland" = 0.30, "Norway" = 0.25)`. Names should match the values
  in `admin_strata`. When present, these override `target` for the
  corresponding strata.

## Value

The input `s` with an additional column `out_col` (0/1), and optionally
`blocked_col` if requested.

## Examples

``` r
# Tiny multiscale example with two strata (A and B)
parent1 <- "872a1072bffffff"
kids1   <- c("882a1072b1fffff", "882a1072b3fffff")
parent2 <- "872a10729ffffff"
parent3 <- "872a10774ffffff"

h3_vec  <- c(parent1, parent2, parent3, kids1)
res_vec <- c(7L, 7L, 7L, 8L, 8L)

s <- data.frame(
  h3_address     = h3_vec,
  res            = res_vec,
  admin          = c("A", "B", "B", "A", "A"),
  area_km2       = c(14, 14, 14, 2, 2),
  ensemble_score = c(0.2, 0.9, 0.2, 0.8, 0.1)
)

maps   <- build_h3_maps(s, res_levels = c(7L, 8L))
cs_idx <- build_crossscale_index(maps)

strata_masks <- list(
  A = (s$admin == "A"),
  B = (s$admin == "B")
)

out <- compute_selection_by_strata(
  s, cs_idx,
  strata_masks     = strata_masks,
  target           = 0.3,
  admin_strata     = "admin",
  score_col        = "ensemble_score",
  area_col         = "area_km2",
  res_col          = "res",
  out_col          = "selected_by_admin",
  target_by_strata = c(A = 0.12, B = 0.5)
)

out[, c("admin", "res", "area_km2", "ensemble_score", "selected_by_admin")]
#>   admin res area_km2 ensemble_score selected_by_admin
#> 1     A   7       14            0.2                 0
#> 2     B   7       14            0.9                 1
#> 3     B   7       14            0.2                 0
#> 4     A   8        2            0.8                 1
#> 5     A   8        2            0.1                 0
```
