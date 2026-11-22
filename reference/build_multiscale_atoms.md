# Build non-overlapping cost atoms for nested planning units

Decomposes additive planning-unit costs into non-overlapping spatial
contributions ("atoms") so costs can be evaluated consistently across
nested H3 resolutions.

## Usage

``` r
build_multiscale_atoms(pu, maps, cost_col = "area_km2", tol = 1e-06)
```

## Arguments

- pu:

  A planning-unit object. Its row order must match `maps`.

- maps:

  A hierarchy object returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

- cost_col:

  Character name of a finite, non-negative, spatially additive
  planning-unit cost column.

- tol:

  Numeric relative tolerance used when reconciling parent and child
  values.

## Value

An object of class `multiscale_atoms` containing atom costs,
planning-unit–atom incidence structures, reconciled planning-unit costs,
and reconciliation diagnostics.

## Details

Atoms are mutually exclusive accounting units defined from the
planning-unit hierarchy. Terminal planning units define atoms, and
parents with incomplete child partitions can contribute a residual atom.
Complete H3 child partitions are represented by their child atoms.

`cost_col` must represent a finite, non-negative, spatially additive
quantity, such as area. A complete child partition is identified when
directly mapped children occur at one common H3 resolution and match the
expected H3 child set.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
pu <- data.frame(
  h3_address = c("872a1072bffffff", "882a1072b1fffff", "882a1072b3fffff"),
  res = c(7L, 8L, 8L),
  area_km2 = c(14, 2, 2),
  A = c(3, 1, 2),
  B = c(6, 2, 1)
)
maps <- build_h3_maps(pu)
atoms <- build_multiscale_atoms(pu, maps)
atoms$atom_cost # Parent residual 10; two children 2 each
#> [1] 10  2  2
atoms$atoms_by_pu # Parent covers all three atoms
#> [[1]]
#> [1] 1 2 3
#> 
#> [[2]]
#> [1] 2
#> 
#> [[3]]
#> [1] 3
#> 
```
