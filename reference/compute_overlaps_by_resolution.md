# Count cross-resolution overlaps in a selection

For a given 0/1 selection column, counts how many planning units are
simultaneously selected at a finer resolution and at their ancestor cell
at a coarser resolution (using the hierarchy in `maps`).

For each pair of resolutions `r_low < r_high`, it reports the number of
co-selected ancestor–descendant pairs, plus a total across all pairs.

## Usage

``` r
compute_overlaps_by_resolution(
  s,
  flag_col = "selected_by_resolution_final",
  maps
)
```

## Arguments

- s:

  An `sf` or data frame of planning units. Must contain a resolution
  column `res` and a 0/1 selection column referenced by `flag_col`.

- flag_col:

  Name of the 0/1 selection column to analyse (e.g.
  `"selected_by_resolution"`).

- maps:

  A hierarchy list as returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md),
  containing at least `res_levels` and `nearest_parent_row_of`.

## Value

A named integer vector with one entry per resolution pair (e.g. `"5-6"`,
`"6-7"`) and a `"total"` element.

## Examples

``` r
parent <- "872a1072bffffff"
kids   <- c("882a1072b1fffff", "882a1072b3fffff")

s <- data.frame(
  h3_address = c(parent, kids),
  res = c(7L, 8L, 8L),
  selected_by_resolution_final = c(1L, 1L, 0L)
)
maps <- build_h3_maps(s, res_levels = c(7L, 8L))

compute_overlaps_by_resolution(s, "selected_by_resolution_final", maps)
#>   7-8 total 
#>     1     1 
```
