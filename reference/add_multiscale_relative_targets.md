# Add multiscale relative targets

Adds feature representation targets expressed as proportions between
zero and one of the total amount of each feature in the multiscale
planning data.

## Usage

``` r
add_multiscale_relative_targets(x, targets, data)
```

## Arguments

- x:

  A single-zone `prioritizr` `ConservationProblem` object.

- targets:

  A numeric value or vector of proportions between zero and one. Supply
  either one value for all features or one value per problem feature. A
  named vector is matched to the problem feature names.

- data:

  A `multiscale_objective_data` object returned by
  [`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md).

## Value

An updated `ConservationProblem` object with the targets added.

## Details

Relative targets specify the minimum proportion of each feature that
should be represented by the solution. Feature totals are calculated
across the nested planning-unit hierarchy, allowing representation
secured at different resolutions to contribute toward the same target.

A single target value is applied to every feature. An unnamed vector
follows the feature order in the problem, and a named vector is matched
by feature name and must provide a value for every feature.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
h3_vec <- c("872a1072bffffff","882a1072b1fffff","882a1072b3fffff")

pu <- h3jsr::cell_to_polygon(h3_vec, simple = FALSE)
pu <- pu[match(h3_vec, pu$h3_address), ]

pu$res <- c(7L, 8L, 8L)
pu$area_km2 <- c(14, 2, 2)
pu$A <- c(3, 1, 2)
pu$B <- c(6, 2, 1)

maps <- build_h3_maps(pu)

ms_data <- build_multiscale_objective_data(pu, maps, feature_cols = c(A = "A", B = "B"))

p <- prioritizr::problem(pu,features = c("A", "B"),cost_column = "area_km2")
p <- add_multiscale_min_set_objective(p,ms_data)
p <- add_multiscale_relative_targets(p,c(B = 1/2, A = 2/3),ms_data)
```
