# Exact feature coverage from rasters and selected PUs

Calculate how well raster-based features are represented by a selected
set of planning units.

This function evaluates feature coverage from raster layers using exact
area-weighted extraction. For each feature, it calculates the total
amount available within its native-resolution planning unit footprint,
the amount held by the selected planning units, and the proportion of
the feature represented by the solution.

If targets are provided, the function also reports absolute and relative
shortfalls from those targets.

## Usage

``` r
eval_exact_raster_coverage(
  spp_all,
  pu_sf,
  solution_col,
  targets = NULL,
  res_col = "res"
)
```

## Arguments

- spp_all:

  A `SpatRaster` or `RasterStack`/`RasterBrick` of feature layers. Layer
  names must start with `r<res>_` (e.g. `r5_`, `r6_`, `r7_`).

- pu_sf:

  Planning units as an `sf` polygon object containing all resolutions.
  Must include the resolution column specified by `res_col`.

- solution_col:

  Name of the 0/1 (or logical) selection column in `pu_sf` indicating
  selected planning units.

- targets:

  Optional named numeric vector of RELATIVE targets (proportions in
  \\\[0,1\]\\). For example, `targets = c(r7_featA = 0.30)` means a
  target of holding 30\\ total available amount of `r7_featA` within its
  native-resolution domain. If unnamed, the first value is applied to
  all features.

- res_col:

  Name of the resolution column in `pu_sf` (default `"res"`).

## Value

A data frame with columns:

- `feature`

- `native_res`

- `total_area` Total feature amount within the native-resolution domain
  (area-integral units).

- `held_area` Feature amount held by the selected area, restricted to
  that domain (area-integral units).

- `relative_held` Relative held amount (`held_area / total_area`).

- `target` Relative target proportion (if `targets` supplied).

- `absolute_shortfall` Absolute shortfall in feature units (\\\max(0,
  target \* total\\area - held\\area)\\).

- `relative_shortfall` Relative shortfall in proportions (\\\max(0,
  target - relative\\held)\\).

## Deprecated

This function is deprecated and retained for compatibility. For
multiscale workflows, use
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md)
together with
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md).
The atom-based evaluator uses precomputed multiscale data and matching
planning-unit row order, and has different arguments and accounting
semantics from this raster-based function.

## Examples

``` r
# \donttest{
# Tiny raster with a single layer named with r7_ prefix
r <- terra::rast(nrows = 2, ncols = 2, xmin = 0, xmax = 2, ymin = 0, ymax = 2)
terra::values(r) <- 1
names(r) <- "r7_featA"

# One square PU covering the raster
pu <- sf::st_sf(
  res = 7L,
  selected = 1L,
  geometry = sf::st_sfc(
    sf::st_polygon(list(rbind(c(0, 0), c(2, 0), c(2, 2), c(0, 2), c(0, 0)))),
    crs = 4326
  )
)

eval_exact_raster_coverage(
  spp_all = r,
  pu_sf = pu,
  solution_col = "selected",
  targets = c(r7_featA = 0.3),
  res_col = "res"
)
#> Warning: 'eval_exact_raster_coverage' is deprecated.
#> Use 'eval_multiscale_atom_solution' instead.
#> See help("Deprecated") and help("MultiscaleSCP-deprecated").
#>    feature native_res  total_area   held_area relative_held target
#> 1 r7_featA          7 49558048768 49558048768             1    0.3
#>   absolute_shortfall relative_shortfall
#> 1                  0                  0
# }
```
