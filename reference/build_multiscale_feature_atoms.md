# Build multiscale feature accounting for nested planning units

Distributes hierarchy-consistent feature amounts among non-overlapping
spatial units ("atoms") so feature representation can be evaluated
consistently across nested H3 resolutions.

## Usage

``` r
build_multiscale_feature_atoms(pu, atoms, feature_cols, maps, tol = 1e-06)
```

## Arguments

- pu:

  A planning-unit object containing the multiscale feature columns.

- atoms:

  A `multiscale_atoms` object returned by
  [`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md).

- feature_cols:

  A character vector or named character vector identifying multiscale
  feature columns. When named, names define feature names used by the
  optimization problem.

- maps:

  A hierarchy object returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

- tol:

  Numeric relative tolerance used when reconciling parent and child
  values.

## Value

An object of class `multiscale_feature_atoms` containing the sparse
atom-by-feature matrix, atom-based feature totals, and reconciliation
diagnostics.

## Details

Rows of `feature_atom_matrix` are atoms and columns are features. Each
value represents the feature amount assigned to that atom, and
`feature_totals` contains the corresponding column totals. Feature names
come from `names(feature_cols)`, or from the column names when
`feature_cols` is unnamed.

Feature amounts should be defined so that the amount in a parent
planning unit can be decomposed among its non-overlapping child and
remainder areas. Non-finite feature values are treated as zero and
negative values cause an error. Reconciliation diagnostics are returned
with the result.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
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
features <- build_multiscale_feature_atoms(
  pu, atoms, feature_cols = c(A = "A", B = "B"), maps = maps
)
as.matrix(features$feature_atom_matrix)
#>      A B
#> [1,] 0 3
#> [2,] 1 2
#> [3,] 2 1
features$feature_totals # A = 3, B = 6
#> A B 
#> 3 6 
```
