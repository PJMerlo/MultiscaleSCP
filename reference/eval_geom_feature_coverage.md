# Geometry-based feature coverage evaluation from sf column features and selected PUs

Calculate how well features are represented by a selected set of
planning units.

This function evaluates feature coverage using feature values stored
directly in planning unit attributes. For each feature, it calculates
the total amount available, the amount held by the selected planning
units, and the proportion of the feature represented by the solution.

If targets are provided, the function also reports absolute and relative
shortfalls from those targets.

Feature coverage is calculated using fractional overlap between planning
units and the union of selected planning units.

## Usage

``` r
eval_geom_feature_coverage(
  s,
  flag_col = "selected_by_resolution",
  feature_cols,
  res_col = "res",
  targets = NULL
)
```

## Arguments

- s:

  An `sf` object of planning units (all resolutions).

- flag_col:

  Name of the 0/1 selection column in `s`.

- feature_cols:

  Character vector of feature column names in `s`. Feature names must
  start with `r<res>_` so the native resolution can be inferred.

- res_col:

  Name of the resolution column in `s` (default `"res"`).

- targets:

  Optional named numeric vector of RELATIVE targets (proportions in
  \\\[0,1\]\\). For example, `targets = c(r7_featA = 0.30)` means a
  target of 30\\ available amount of `r7_featA` within its
  native-resolution footprint. If unnamed, the first value is applied to
  all features.

## Value

A tibble with one row per feature and columns:

- `feature`, `native_res`

- `total` Total feature amount across all PUs at the native resolution.

- `held` Feature amount held by the selected area (via fractional
  overlap), restricted to the native-resolution footprint.

- `rel_held` Relative held amount (`held / total`).

- `target` Relative target proportion (if `targets` supplied).

- `abs_shortfall` Absolute shortfall in feature units (\\\max(0, target
  \* total - held)\\).

- `rel_shortfall` Relative shortfall in proportions (\\\max(0, target -
  rel\\held)\\).

## Deprecated

This function is deprecated and retained for compatibility. For
multiscale workflows, use
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md)
together with
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md).
The evaluator uses precomputed multiscale data and matching
planning-unit row order, and has different arguments and accounting
semantics from this geometry-based function.

## Examples

``` r
# Minimal polygons
p1 <- sf::st_polygon(list(rbind(c(0, 0), c(1, 0), c(1, 1), c(0, 1), c(0, 0))))
p2 <- sf::st_polygon(list(rbind(c(1, 0), c(2, 0), c(2, 1), c(1, 1), c(1, 0))))

s <- sf::st_sf(
  res = c(7L, 7L),
  area_km2 = c(1, 1),
  selected_by_resolution = c(1L, 0L),
  r7_featA = c(10, 5),
  geometry = sf::st_sfc(p1, p2, crs = 4326)
)

eval_geom_feature_coverage(
  s,
  flag_col = "selected_by_resolution",
  feature_cols = "r7_featA",
  res_col = "res"
)
#> Warning: 'eval_geom_feature_coverage' is deprecated.
#> Use 'eval_multiscale_atom_solution' instead.
#> See help("Deprecated") and help("MultiscaleSCP-deprecated").
#> # A tibble: 1 × 8
#>   feature  native_res total  held rel_held target abs_shortfall rel_shortfall
#>   <chr>         <int> <dbl> <dbl>    <dbl>  <dbl>         <dbl>         <dbl>
#> 1 r7_featA          7    15    10    0.667     NA            NA            NA
```
