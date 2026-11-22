# Add multiscale connectivity penalties to a prioritizr problem

Adds penalties to a conservation planning problem to account for
cross-resolution connectivity between H3 planning units. Connections
with larger values are given greater importance when identifying
solutions with coordinated selection across resolutions. Connectivity
data can be supplied as a matrix, `Matrix::dgCMatrix`, data frame in
Marxan format, or four-dimensional array, following the formats
supported by
[`prioritizr::add_connectivity_penalties()`](https://prioritizr.net/reference/add_connectivity_penalties.html).

## Usage

``` r
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)

# S4 method for class 'ANY,ANY,ANY,matrix,character'
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)

# S4 method for class 'ANY,ANY,ANY,Matrix,character'
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)

# S4 method for class 'ANY,ANY,ANY,data.frame,character'
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)

# S4 method for class 'ANY,ANY,ANY,dgCMatrix,character'
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)

# S4 method for class 'ANY,ANY,ANY,array,character'
add_multiscale_connectivity_penalties(
  x,
  penalty,
  zones = diag(prioritizr::number_of_zones(x)),
  data,
  normalize = c("none", "sym")
)
```

## Arguments

- x:

  [`problem()`](https://prioritizr.net/reference/problem.html) object.

- penalty:

  `numeric` value denoting the importance of selecting planning units
  with strong connectivity between them compared to the main problem
  objective (e.g., solution cost if `x` has a minimum set objective set
  using
  [`add_min_set_objective()`](https://prioritizr.net/reference/add_min_set_objective.html)).
  Higher `penalty` values can be used to obtain solutions with a high
  degree of connectivity, and smaller `penalty` values can be used to
  obtain solutions with a small degree of connectivity. Note that
  negative `penalty` values can be used to obtain solutions that avoid
  connectivity.

- zones:

  `matrix` or `Matrix` object describing the level of connectivity
  between different zones. Each row and column corresponds to a
  different zone in `x`, and cell values indicate the level of
  connectivity between each combination of zones. Cell values along the
  diagonal of the matrix represent the level of connectivity between
  planning units allocated to the same zone. Cell values must range
  between 1 and -1, where negative values favor solutions with weak
  connectivity. Defaults to an identity matrix (i.e., a matrix with ones
  along the matrix diagonal and zeros elsewhere), so that planning units
  are only considered to be connected when they are allocated to the
  same zone. Note that `zones` is only required when working with
  multiple zones and `data` is a `matrix` or `Matrix` object. If `data`
  is an `array` or `data.frame` with data for multiple zones (e.g.,
  using the `"zone1"` and `"zone2"` column names), then `zones` must be
  `NULL`.

- data:

  A symmetric connectivity object (matrix, `Matrix::dgCMatrix`, data
  frame in Marxan format, or 4D array) describing cross-scale links.

- normalize:

  Either `"none"` (use data as provided) or `"sym"` to apply symmetric
  degree normalization before penalization.

## Value

The modified `ConservationProblem` object.

## Functions

- `add_multiscale_connectivity_penalties( x = ANY, penalty = ANY, zones = ANY, data = matrix, normalize = character )`:
  matrix method

- `add_multiscale_connectivity_penalties( x = ANY, penalty = ANY, zones = ANY, data = Matrix, normalize = character )`:
  Matrix method

- `add_multiscale_connectivity_penalties( x = ANY, penalty = ANY, zones = ANY, data = data.frame, normalize = character )`:
  data.frame (Marxan) method

- `add_multiscale_connectivity_penalties( x = ANY, penalty = ANY, zones = ANY, data = dgCMatrix, normalize = character )`:
  dgCMatrix method

- `add_multiscale_connectivity_penalties( x = ANY, penalty = ANY, zones = ANY, data = array, normalize = character )`:
  array (4D) method
