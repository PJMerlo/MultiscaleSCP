# Stratified multiscale selection by resolution

Select planning units to meet area-based targets at each H3 resolution.
Selection is based on a single score column (e.g.,
[`compute_pu_scores`](https://pjmerlo.github.io/MultiscaleSCP/reference/compute_pu_scores.md))
and a cross-scale index produced by
[`build_crossscale_index`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md).

Resolutions are processed from finest to coarsest. At each resolution,
the function accounts for area already covered by selected finer units
to avoid double-counting. To keep selections non-overlapping, it prefers
units that do not have finer descendants in the input dataset; coarser
units with descendants are only used if needed to reach the target.

The result is a resolution-stratified selection that meets
per-resolution area targets while minimizing overlap between coarse and
fine planning units.

## Usage

``` r
compute_selection_by_resolution(
  s,
  cs_idx,
  target = 0.3,
  score_col = "ensemble_score",
  area_col = "area_km2",
  res_col = "res",
  out_col = "selected_by_resolution",
  blocked_col = NULL,
  target_by_res = NULL
)
```

## Arguments

- s:

  An `sf` object or data frame of planning units. Must contain at least
  the columns referenced by `score_col`, `area_col`, and `res_col`.

- cs_idx:

  A cross-scale index list as returned by
  [`build_crossscale_index`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md).

- target:

  Default area-based target proportion (e.g. `0.3`) applied to all
  resolutions if `target_by_res` is `NULL`.

- score_col:

  Name of the column in `s` containing the planning-unit score used to
  rank candidates (e.g. `"ensemble_score"`).

- area_col:

  Name of the column in `s` containing planning-unit areas (e.g.
  `"area_km2"`).

- res_col:

  Name of the column in `s` containing integer resolution codes (e.g. H3
  resolution).

- out_col:

  Name of the output column created in `s` containing the final 0/1
  selection flag (default `"selected_by_resolution"`).

- blocked_col:

  Optional name of a column to store a global "has finer descendants"
  flag as 0/1 (1 = has finer descendants). If `NULL` (default), this
  column is not written.

- target_by_res:

  Optional named numeric vector of per-resolution targets, e.g.
  `c("5" = 0.30, "6" = 0.20, "7" = 0.15)`. Names should match the values
  in `res_col`. When supplied, these override `target` for the
  corresponding resolutions.

## Value

The input `s` with an additional column named by `out_col` (0/1), and
optionally a column named by `blocked_col` if requested.

## Examples

``` r
# Build a tiny multiscale set: 2 parents (r7), 2 children (r8) under parent1
parent1 <- "872a1072bffffff"
parent2 <- "872a10729ffffff"
kids1   <- c("882a1072b1fffff", "882a1072b3fffff")

h3_vec  <- c(parent1, parent2, kids1)
res_vec <- c(7L, 7L, 8L, 8L)

s <- data.frame(
  h3_address     = h3_vec,
  res            = res_vec,
  area_km2       = c(14, 14, 2, 2),
  ensemble_score = c(0.2, 0.9, 0.8, 0.1)
)

maps   <- build_h3_maps(s, res_levels = c(7L, 8L))
cs_idx <- build_crossscale_index(maps)

out <- compute_selection_by_resolution(
  s, cs_idx,
  target    = 0.5,
  score_col = "ensemble_score",
  area_col  = "area_km2",
  res_col   = "res",
  out_col   = "selected_by_resolution"
)

out[, c("res", "area_km2", "ensemble_score", "selected_by_resolution")]
#>   res area_km2 ensemble_score selected_by_resolution
#> 1   7       14            0.2                      0
#> 2   7       14            0.9                      1
#> 3   8        2            0.8                      1
#> 4   8        2            0.1                      0
```
