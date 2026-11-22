# Add a multiscale minimum-set objective

Sets the objective of a conservation planning problem to minimize cost
while meeting feature representation targets across nested H3
resolutions.

## Usage

``` r
add_multiscale_min_set_objective(x, data)
```

## Arguments

- x:

  A single-zone `prioritizr` `ConservationProblem` object.

- data:

  A `multiscale_objective_data` object returned by
  [`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md).

## Value

An updated `ConservationProblem` object.

## Details

Feature representation is calculated across the planning-unit hierarchy,
so selecting a planning unit at one resolution can contribute toward
targets for features represented at another resolution. Spatial
contributions shared by overlapping parent and descendant planning units
are counted once.

This accounting is implemented using non-overlapping spatial units,
referred to as atoms, for both cost and feature representation.

The `data` object and conservation problem must use the same
planning-unit row order and matching feature names. The formulation
supports single-zone problems with binary planning-unit decisions and
the compressed formulation.

## Mathematical formulation

Let `x_i` indicate whether planning unit `i` is selected and let `z_a`
indicate whether atom `a` is activated. If `C_a` is the set of planning
units that cover atom `a`, atom activation is linked to planning-unit
selection by `z_a >= x_i` for each `i` in `C_a` and
`z_a <= sum(x_i, i in C_a)`.

Planning-unit decisions are binary, with `x_i` in `{0, 1}`, while atom
activation variables satisfy `0 <= z_a <= 1`.

The objective minimizes `sum(c_a * z_a)`, where `c_a` is the cost of
atom `a`. Feature representation targets require
`sum(q_aj * z_a) >= T_j`, where `q_aj` is the amount of feature `j`
assigned to atom `a` and `T_j` is its representation target.

## See also

Other objectives:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md)

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
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

ms_data <- build_multiscale_objective_data(
  pu, maps, feature_cols = c(A = "A", B = "B"))

p <- prioritizr::problem(
  pu,features = c("A", "B"),cost_column = "area_km2")

p <- add_multiscale_min_set_objective(p, ms_data)
p <- add_multiscale_relative_targets(p, c(A = 2/3, B = 1/2),ms_data)
p <- prioritizr::add_binary_decisions(p)
```
