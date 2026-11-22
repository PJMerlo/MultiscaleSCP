# Prepare data for multiscale minimum-set optimization

Combines the planning-unit hierarchy, costs, and feature amounts into
the data used for multiscale minimum-set optimization and solution
evaluation.

## Usage

``` r
build_multiscale_objective_data(
  pu,
  maps,
  cost_col = "area_km2",
  feature_cols,
  native_cols = NULL,
  tol = 1e-06
)
```

## Arguments

- pu:

  A planning-unit object. Its row order must match `maps`.

- maps:

  A hierarchy object returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

- cost_col:

  Character name of the spatially additive planning-unit cost column.

- feature_cols:

  A character vector or named character vector identifying the
  multiscale feature columns, typically the output of
  [`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md).

- native_cols:

  Optional character vector identifying native-resolution feature
  columns. When supplied, native and atom-based totals are compared as a
  diagnostic.

- tol:

  Numeric relative tolerance used for hierarchy reconciliation and
  diagnostic checks.

## Value

A `multiscale_objective_data` object for use with
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md)
and
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md).

## Details

The prepared data combine cost and feature representation across nested
planning-unit resolutions. This allows planning units selected at
different resolutions to contribute toward the same feature
representation while shared spatial contributions are accounted for
once.

The planning-unit row order used to build this object must also be used
for the corresponding conservation problem and solution evaluation.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
# Small hierarchy: a parent and two of its seven children.
# Feature amounts below are already prepared and additive.
pu <- data.frame(
  h3_address = c("872a1072bffffff", "882a1072b1fffff", "882a1072b3fffff"),
  res = c(7L, 8L, 8L), area_km2 = c(14, 2, 2),
  msopt_A = c(3, 1, 2), msopt_B = c(6, 2, 1),
  selected = c(1L, 1L, 0L))
maps <- build_h3_maps(pu, res_levels = c(7L, 8L))
ms_data <- build_multiscale_objective_data(
  pu = pu, maps = maps,
  feature_cols = c(A = "msopt_A", B = "msopt_B"))

result <- eval_multiscale_atom_solution(pu,
  solution_col = "selected", data = ms_data,
  targets = c(A = 2/3, B = 1/2))

result$relative_held
#> A B 
#> 1 1 
result$target_met
#>    A    B 
#> TRUE TRUE 
```
