# Build a multiscale H3 connectivity matrix

Constructs a sparse connectivity matrix linking each finer planning unit
to its ancestor at the next coarser resolution represented in `maps`.
This is typically used as the `data` input to
[`add_multiscale_connectivity_penalties()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_connectivity_penalties.md).

## Usage

``` r
build_multiscale_connectivity_matrix(maps, symmetric = TRUE)
```

## Arguments

- maps:

  A list as returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md),
  containing at least `h3_vec`, `res_vec`, `res_levels`, and
  `row_idx_by_h3`.

- symmetric:

  Logical; if `TRUE` (default), the matrix is symmetrised so that each
  parent–child link appears in both directions.

## Value

A `Matrix::dgCMatrix` connectivity matrix of size `n_pu × n_pu`.

## Examples

``` r
# Minimal 2-resolution parent-child example
h3_child  <- "8a2a1072b59ffff"
h3_parent <- "892a1072b5bffff"

h3_vec <- c(h3_parent, h3_child)
h3_res <- h3jsr::get_res(h3_vec, simple = TRUE)

maps <- build_h3_maps(s_or_h3 = h3_vec, res_vec = h3_res)

conn <- build_multiscale_connectivity_matrix(maps)
conn
#> 2 x 2 sparse Matrix of class "dgCMatrix"
#>         
#> [1,] . 1
#> [2,] 1 .
```
