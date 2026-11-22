# Cross-scale coverage summary by strata

Summarize how much area is selected within each stratum (e.g. country or
region) in a multiscale H3 system. This function reports a cross-scale
coverage metric that avoids double-counting when selected planning units
overlap across resolutions.

For each stratum, coverage is reported at a single "native" resolution
chosen from the planning units labeled with that stratum.

## Usage

``` r
summarize_coverage_by_strata(
  s,
  flag_col = "selected_by_resolution_final",
  cs_idx,
  strata_col = "strata"
)
```

## Arguments

- s:

  An `sf` object or data frame of planning units. Must contain columns
  `res`, `area_km2`, and the strata column referenced by `strata_col`.

- flag_col:

  Name of the 0/1 selection column to summarize.

- cs_idx:

  A cross-scale index list returned by
  [`build_crossscale_index()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md),
  containing at least `anc_at_res` and `desc_at_res`.

- strata_col:

  Name of the strata column in `s` (default `"strata"`).

## Value

A tibble with one row per stratum and the following columns:

- `strata`

- `native_res`

- `area_total_native_km2`

- `area_selected_km2`

- `coverage_prop`

## Examples

``` r
parent <- "872a1072bffffff"
kids   <- c("882a1072b1fffff", "882a1072b3fffff")

s <- data.frame(
  h3_address = c(parent, kids),
  res = c(7L, 8L, 8L),
  strata = c("A", "B", "B"),
  area_km2 = c(14, 2, 2),
  selected_by_resolution_final = c(0L, 1L, 0L)
)
maps   <- build_h3_maps(s, res_levels = c(7L, 8L))
cs_idx <- build_crossscale_index(maps)

summarize_coverage_by_strata(
  s,
  "selected_by_resolution_final",
  cs_idx,
  strata_col = "strata"
)
#> # A tibble: 2 × 5
#>   strata native_res area_total_native_km2 area_selected_km2 coverage_prop
#>   <chr>       <int>                 <dbl>             <dbl>         <dbl>
#> 1 B               8                     4                 2         0.5  
#> 2 A               7                    14                 2         0.143
```
