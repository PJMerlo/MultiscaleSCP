# Build H3 hierarchy maps for multiscale planning units

Creates parent–child relationships among H3 planning units represented
at multiple resolutions.

## Usage

``` r
build_h3_maps(s_or_h3, res_vec = NULL, res_levels = NULL)
```

## Arguments

- s_or_h3:

  An `sf` object or data frame containing `h3_address` and `res`
  columns, or a character vector of H3 indexes.

- res_vec:

  Optional integer vector of H3 resolutions. Required when `s_or_h3` is
  supplied as a character vector.

- res_levels:

  Optional integer vector of resolutions represented in the hierarchy.
  Defaults to the unique resolutions in the planning units.

## Value

A list with elements `h3_vec`, `res_vec`, `res_levels`, `row_idx_by_h3`,
`nearest_parent_row_of`, and `children_by_row`.

## Details

The supplied `res` or `res_vec` values are used directly and should
match the resolutions encoded by the corresponding H3 indexes.

## Examples

``` r
# Minimal example: two resolutions, parent-child relationship
h3_child  <- "8a2a1072b59ffff" # example H3 index
h3_parent <- "892a1072b5bffff"

h3_vec <- c(h3_parent, h3_child)
h3_res <- h3jsr::get_res(h3_vec, simple = TRUE)

maps <- build_h3_maps(s_or_h3 = h3_vec, res_vec = h3_res)

str(maps, max.level = 1)
#> List of 6
#>  $ h3_vec               : chr [1:2] "892a1072b5bffff" "8a2a1072b59ffff"
#>  $ res_vec              : int [1:2] 9 10
#>  $ res_levels           : int [1:2] 9 10
#>  $ row_idx_by_h3        : Named int [1:2] 1 2
#>   ..- attr(*, "names")= chr [1:2] "892a1072b5bffff" "8a2a1072b59ffff"
#>  $ nearest_parent_row_of: int [1:2] NA 1
#>  $ children_by_row      :List of 2
maps$nearest_parent_row_of
#> [1] NA  1
```
