# Build cross-scale index structures for H3-based SCP workflows

Extends the basic hierarchy from
[`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md)
into full ancestor, descendant and resolution-index mappings used by all
multiscale selection and evaluation functions.

## Usage

``` r
build_crossscale_index(maps)
```

## Arguments

- maps:

  The list returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

## Value

A list with elements:

- `res_levels`

- `rows_by_res`

- `pos_in_res`

- `anc_at_res`

- `desc_at_res`

- `finer_rows_by_r0cell`

## Examples

``` r
h3_child  <- "8a2a1072b59ffff"
h3_parent <- "892a1072b5bffff"

h3_vec <- c(h3_parent, h3_child)
h3_res <- h3jsr::get_res(h3_vec, simple = TRUE)

maps <- build_h3_maps(s_or_h3 = h3_vec, res_vec = h3_res)

cs_idx <- build_crossscale_index(maps)

names(cs_idx)
#> [1] "res_levels"           "rows_by_res"          "pos_in_res"          
#> [4] "anc_at_res"           "desc_at_res"          "finer_rows_by_r0cell"
cs_idx$res_levels
#> [1]  9 10
```
