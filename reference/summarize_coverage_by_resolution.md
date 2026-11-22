# Cross-scale coverage summary by resolution

Summarize how much area is selected at each resolution in a multiscale
H3 system. This function adjusts for overlap between coarse and fine
planning units so that selected area is not double-counted across
resolutions.

The output reports, for each resolution, the total available area, the
effective selected area (after cross-scale adjustment), and the
proportion selected.

## Usage

``` r
summarize_coverage_by_resolution(
  s,
  flag_col = "selected_by_resolution_final",
  cs_idx
)
```

## Arguments

- s:

  An `sf` or data frame of planning units. Must contain columns `res`
  and `area_km2`, plus the selection column referenced by `flag_col`.

- flag_col:

  Name of the 0/1 selection column to summarise.

- cs_idx:

  A cross-scale index list from
  [`build_crossscale_index()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_crossscale_index.md),
  containing at least `res_levels`, `rows_by_res`, `pos_in_res`,
  `anc_at_res`, and `desc_at_res`.

## Value

A tibble with columns:

- `res` – resolution,

- `area_total_km2` – total area at that resolution,

- `area_selected_km2` – cross-scale selected area, and

- `coverage_prop` – proportion selected.

## Examples

``` r
parent <- "872a1072bffffff"
kids   <- c("882a1072b1fffff", "882a1072b3fffff")

s <- data.frame(
  h3_address = c(parent, kids),
  res = c(7L, 8L, 8L),
  area_km2 = c(14, 2, 2),
  selected_by_resolution_final = c(0L, 1L, 0L)
)
maps   <- build_h3_maps(s, res_levels = c(7L, 8L))
cs_idx <- build_crossscale_index(maps)

summarize_coverage_by_resolution(s, "selected_by_resolution_final", cs_idx)
#> # A tibble: 2 × 4
#>     res area_total_km2 area_selected_km2 coverage_prop
#>   <int>          <dbl>             <dbl>         <dbl>
#> 1     7             14                 2         0.143
#> 2     8              4                 2         0.5  
```
