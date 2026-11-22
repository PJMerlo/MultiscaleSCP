# Add a multiscale minimum-set objective and relative targets

Configures a `prioritizr` conservation problem to minimize cost while
meeting relative feature representation targets across nested
resolutions.

## Usage

``` r
add_multiscale_min_set(x, data, targets)
```

## Arguments

- x:

  A single-zone `prioritizr` `ConservationProblem` object.

- data:

  A `multiscale_objective_data` object returned by
  [`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md).

- targets:

  A numeric value or vector of relative targets between zero and one.

## Value

An updated `ConservationProblem` object with the multiscale minimum-set
objective and relative targets added.

## Details

Feature representation can be contributed by selected planning units at
different resolutions, and spatial contributions shared by nested
planning units are counted once. `targets` specify the proportion of
each feature that should be represented by the solution.

The formulation supports single-zone problems using the compressed
formulation and binary planning-unit decisions.

## See also

Other objectives:
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md)

Other multiscale minimum-set:
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`load_multiscale_feature()`](https://pjmerlo.github.io/MultiscaleSCP/reference/load_multiscale_feature.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
h3_vec <- c("872a1072bffffff", "882a1072b1fffff","882a1072b3fffff")
pu <- h3jsr::cell_to_polygon(h3_vec,simple = FALSE)
pu <- pu[match(h3_vec, pu$h3_address), ]
pu$res <- c(7L, 8L, 8L)
pu$area_km2 <- c(14, 2, 2)
pu$A <- c(3, 1, 2)
pu$B <- c(6, 2, 1)

maps <- build_h3_maps(pu)
ms_data <- build_multiscale_objective_data(pu = pu,
  maps = maps,feature_cols = c(A = "A", B = "B"))

p <- prioritizr::problem(pu,
     features = c("A", "B"),cost_column = "area_km2")

p <- add_multiscale_min_set(p,
  data = ms_data,targets = c(A = 2/3, B = 1/2))
p <- prioritizr::add_binary_decisions(p)
```
