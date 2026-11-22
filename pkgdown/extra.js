
document.addEventListener("DOMContentLoaded", function () {
  // Apply only to the workflow vignette.
  if (!location.pathname.endsWith(
    "/MultiscaleSCP_workflow_vignette.html"
  )) return;

  document.querySelectorAll("main div.sourceCode").forEach(function (block) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");

    summary.textContent = "Show R code";
    summary.style.cursor = "pointer";

    details.appendChild(summary);
    block.parentNode.insertBefore(details, block);
    details.appendChild(block);

    details.addEventListener("toggle", function () {
      summary.textContent = details.open ? "Hide R code" : "Show R code";
    });
  });
});
