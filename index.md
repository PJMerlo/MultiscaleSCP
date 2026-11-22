# MultiscaleSCP

### Multiscale Systematic Conservation Planning Across Nested H3 Grids

**MultiscaleSCP** is an R package for systematic conservation planning
across nested spatial resolutions, using the H3 hierarchical polygonal
grid system and the `prioritizr` package. It supports the formulation
and optimisation of conservation problems with resolution-specific
features, costs, and management attributes.

## Key features

- **Multiscale planning:** Integrate planning units and conservation
  features across nested H3 resolutions.
- **Overlap-aware optimisation:** Meet conservation targets while
  avoiding double-counting costs and feature representation across
  overlapping planning units.
- **Cross-scale connectivity:** Incorporate connectivity penalties based
  on parent–child relationships.
- **Solution evaluation:** Assess conservation outcomes, costs, and
  planning-unit selection across resolutions.

## Installation

Install the released version from CRAN:

``` r

install.packages("MultiscaleSCP")
```

Or install the latest development version from GitHub:

``` r

install.packages("pak")
pak::pak("PJMerlo/MultiscaleSCP")
```

## Getting started

Start with the [Multiscale SCP workflow
vignette](https://pjmerlo.github.io/MultiscaleSCP/articles/MultiscaleSCP_workflow_vignette.html),
which demonstrates the package’s main workflow using a small synthetic
example.

The tutorial covers building H3 hierarchies, loading conservation
features, defining multiscale optimisation problems, solving them, and
evaluating the results.

## Maintainer

**Pablo Merlo**  
Postdoctoral Researcher, University of Galway, Ireland  
Email: <pablo.merlo@universityofgalway.ie>
