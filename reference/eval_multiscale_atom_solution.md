# Evaluate multiscale feature representation

Calculates feature representation and conservation cost for a selected
set of planning units in a multiscale conservation problem.

## Usage

``` r
eval_multiscale_atom_solution(pu, solution_col, data, targets = NULL)
```

## Arguments

- pu:

  Planning units containing the solution to evaluate, in the same row
  order used to build `data`.

- solution_col:

  Name of the column indicating selected planning units.

- data:

  A `multiscale_objective_data` object returned by
  [`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md).

- targets:

  Optional relative representation targets for the features.

## Value

A list containing:

- `feature_held`: amount of each feature represented by the solution.

- `feature_total`: total amount of each feature in the multiscale data.

- `relative_held`: proportion of each feature represented by the
  solution.

- `deduplicated_cost`: total multiscale cost of the solution.

- `n_selected_pu`: number of selected planning units.

- `n_selected_atoms`: number of spatial accounting units represented.

- `selected_atoms`: indexes of those spatial accounting units.

When `targets` are supplied, the list also contains `target_relative`,
`target_absolute`, and `target_met`.

## Details

Feature representation is calculated across the planning-unit hierarchy
so that protection at different spatial resolutions contributes to the
same representation estimate. Spatial contributions shared by
overlapping planning units are counted once.

For each feature, the function reports the total available amount, the
amount represented by the selected planning units, and the proportion
represented. When `targets` are supplied, it also reports the
corresponding target amounts and whether each target is met. The
function also reports the cost of the selected area using the same
multiscale accounting.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
pu <- data.frame(
  h3_address = c("872a1072bffffff","882a1072b1fffff","882a1072b3fffff"),
  res = c(7L, 8L, 8L),
  area_km2 = c(14, 2, 2),
  msopt_A = c(3, 1, 2),
  msopt_B = c(6, 2, 1),
  selected = c(1L, 1L, 0L))

maps <- build_h3_maps(pu, res_levels = c(7L, 8L))

ms_data <- build_multiscale_objective_data(pu, maps,
feature_cols = c(A = "msopt_A", B = "msopt_B"))

result <- eval_multiscale_atom_solution(pu,
  solution_col = "selected", data = ms_data, targets = c(A = 2/3, B = 1/2))

result$feature_held
#> A B 
#> 3 6 
result$relative_held
#> A B 
#> 1 1 
result$target_met
#>    A    B 
#> TRUE TRUE 
result$deduplicated_cost
#> [1] 14
```
