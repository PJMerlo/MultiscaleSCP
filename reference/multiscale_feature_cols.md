# Retrieve feature columns for multiscale optimization

Returns the multiscale feature columns created by
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md)
in a named vector that can be passed directly to the `feature_cols`
argument of
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md).

## Usage

``` r
multiscale_feature_cols(pu, names_as = c("native", "feature"))
```

## Arguments

- pu:

  A planning-unit object containing a `multiscale_features` attribute.

- names_as:

  Character; use `"native"` to name the returned vector with native
  feature columns, or `"feature"` to use feature names.

## Value

A named character vector mapping native feature columns or feature names
to their corresponding multiscale feature columns.

## Details

With `names_as = "native"`, the vector is named using the native feature
columns, such as `r8_habitat`. With `names_as = "feature"`, it is named
using the feature names supplied to
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md).

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md)

## Examples

``` r
parent <- "872a1072bffffff" # Create one H3 parent and one of its children.
child <- h3jsr::get_children(parent, 8L, simple = TRUE)
child <- as.character(unlist(child, use.names = FALSE))[1]

h3_vec <- c(parent, child)

pu <- h3jsr::cell_to_polygon(h3_vec, simple = FALSE)
pu <- pu[match(h3_vec, pu$h3_address), ]
pu$res <- c(7L, 8L)

maps <- build_h3_maps(pu,res_levels = c(7L, 8L))

feature <- sf::st_sf(geometry = sf::st_geometry(pu[2, ]))

pu <- load_multiscale_feature(pu = pu,source = feature,
  native_res = 8L,maps = maps,feature_name = "habitat")

# Map native feature columns to optimization columns.
multiscale_feature_cols(pu)
#>      r8_habitat 
#> "msopt_habitat" 
```
