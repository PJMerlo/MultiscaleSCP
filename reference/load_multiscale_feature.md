# Prepare a conservation feature for multiscale planning

Extracts feature amounts from raster or vector data and prepares them
for use across a nested H3 planning-unit hierarchy. The returned
planning-unit object contains a native-resolution feature column for
reporting and a multiscale feature column used to represent the feature
across resolutions.

## Usage

``` r
load_multiscale_feature(
  pu,
  source,
  native_res,
  maps,
  feature_name = NULL,
  res_col = "res",
  opt_prefix = "msopt_",
  overwrite = FALSE,
  scale_raster_by_area = TRUE,
  value_col = NULL
)
```

## Arguments

- pu:

  An `sf` planning-unit object. Its row order must match `maps`.

- source:

  A single-layer `SpatRaster`, `RasterLayer`, `RasterStack`,
  `RasterBrick`, `sf`, or `sfc` object containing the feature data.

- native_res:

  Integer H3 resolution at which the feature is represented for
  reporting.

- maps:

  A hierarchy object returned by
  [`build_h3_maps()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_h3_maps.md).

- feature_name:

  Optional feature name. When `NULL`, a name is inferred from `source`.

- res_col:

  Character name of the planning-unit resolution column.

- opt_prefix:

  Character prefix used for the multiscale feature column.

- overwrite:

  Logical; should existing output columns be replaced?

- scale_raster_by_area:

  Logical; should raster means be multiplied by planning-unit area?

- value_col:

  Optional character name of a value column in a vector source. When
  `NULL`, vector amounts are based on geometry measure alone.

## Value

The input `pu` object with a native-resolution feature column, a
multiscale feature column, and metadata describing the feature.

## Details

Feature amounts are extracted from planning units at `native_res` or
finer. Coarser planning units receive amounts aggregated through the H3
hierarchy. The native-resolution column contains the feature amount at
`native_res`, while the multiscale column records the amounts used to
represent the feature across resolutions. By default, these columns are
named `r<resolution>_<feature>` and `msopt_<feature>`.

Where finer planning units completely partition a parent, the parent
amount is obtained by summing child amounts. Where finer planning units
cover only part of a parent, the feature amount in the uncovered parent
area is combined with the child amounts.

For raster data, values are extracted with
[`exactextractr::exact_extract()`](https://isciences.gitlab.io/exactextractr/reference/exact_extract.html)
using a mean weighted by raster-cell coverage fraction. By default, this
mean is multiplied by the extracted geometry area in square kilometres
to produce an area-scaled feature amount. With
`scale_raster_by_area = FALSE`, the coverage-weighted mean is used
directly.

Polygon features contribute area in square kilometres, line features
contribute length in kilometres, and point features contribute counts.
Single and multipart geometries can be combined within one geometry
family; each point in a MULTIPOINT is counted separately. Sources mixing
polygons, lines, or points, and GEOMETRYCOLLECTION features, must be
separated before loading. Supplying `value_col` weights these amounts by
the corresponding source values.

## See also

Other multiscale minimum-set:
[`add_multiscale_min_set()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set.md),
[`add_multiscale_min_set_objective()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_min_set_objective.md),
[`add_multiscale_relative_targets()`](https://pjmerlo.github.io/MultiscaleSCP/reference/add_multiscale_relative_targets.md),
[`build_multiscale_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_atoms.md),
[`build_multiscale_feature_atoms()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_feature_atoms.md),
[`build_multiscale_objective_data()`](https://pjmerlo.github.io/MultiscaleSCP/reference/build_multiscale_objective_data.md),
[`eval_multiscale_atom_solution()`](https://pjmerlo.github.io/MultiscaleSCP/reference/eval_multiscale_atom_solution.md),
[`multiscale_feature_cols()`](https://pjmerlo.github.io/MultiscaleSCP/reference/multiscale_feature_cols.md)

## Examples

``` r
# Create one H3 parent and one of its children.
parent <- "872a1072bffffff" 
child <- h3jsr::get_children(parent, 8L, simple = TRUE)
child <- as.character(unlist(child, use.names = FALSE))[1]

h3_vec <- c(parent, child)

pu <- h3jsr::cell_to_polygon(h3_vec, simple = FALSE)
pu <- pu[match(h3_vec, pu$h3_address), ]
pu$res <- c(7L, 8L)

maps <- build_h3_maps(pu,res_levels = c(7L, 8L))

# Feature occupies the child planning unit.
feature <- sf::st_sf(geometry = sf::st_geometry(pu[2, ]))

pu <- load_multiscale_feature(pu = pu,source = feature,
  native_res = 8L,maps = maps,feature_name = "habitat")

sf::st_drop_geometry(pu)[,c("h3_address", "res", "r8_habitat", "msopt_habitat")]
#>        h3_address res r8_habitat msopt_habitat
#> 1 872a1072bffffff   7    0.00000       0.74037
#> 2 882a1072b1fffff   8    0.74037       0.74037
multiscale_feature_cols(pu)
#>      r8_habitat 
#> "msopt_habitat" 
```
