## Update

This submission updates MultiscaleSCP from 0.1.1 to 0.2.0.

It adds an atom-based multiscale minimum-set objective, associated feature
loading and evaluation functions, a registered Rcpp backend, tests, and
a synthetic workflow vignette using HiGHS.

eval_geom_feature_coverage() and eval_exact_raster_coverage() are deprecated
but remain available.

## Test environments

* Local macOS Tahoe 26.4, aarch64, R 4.6.0.
* win-builder: Windows Server 2022 x64, R-release 4.6.1.
* win-builder: Windows Server 2022 x64, R-devel
  (2026-10-10 r90659).
* R-hub: Ubuntu 24.04.5 LTS, x86_64, R-devel
  (2026-10-10 r90659).

## R CMD check results

* macOS: 0 errors, 0 warnings, 1 note.
* Windows R-release: 0 errors, 0 warnings, 0 notes.
* Windows R-devel: 0 errors, 0 warnings, 0 notes.
* Linux R-devel: 0 errors, 0 warnings, 0 notes.
  Checked with --no-manual; PDF manual checks passed on macOS
  and both Windows environments.

The local macOS note reports that HTML manual validation was skipped
because the installed HTML Tidy executable was not sufficiently recent.
HTML manual checks passed on both Windows environments.

Package installation, tests, examples, and vignette rebuilding passed
in all four test environments. PDF manual generation passed on macOS
and both Windows environments; the Linux check used --no-manual.