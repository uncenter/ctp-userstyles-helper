// ==UserScript==
// @name        Catppuccin Userstyles Helper
// @description Make reviewing new userstyles for catppuccin/userstyles a little bit easier.
// @namespace   https://github.com/uncenter/ctp-userstyles-helper
// @match       https://github.com/catppuccin/userstyles/pull/*
// @grant       none
// @downloadURL https://github.com/uncenter/ctp-userstyles-helper/raw/main/index.js
// @homepageURL https://github.com/uncenter/ctp-userstyles-helper
// @version     0.1.0
// @author      uncenter
// @license     MIT
// ==/UserScript==

async function getPRDetails() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/catppuccin/userstyles/pulls/${new URL(location.href).pathname.split("/").at(4)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    const data = await res.json();

    return {
      repo: data.head.repo.full_name,
      branch: data.head.ref,
    };
  } catch {
    throw new Error(
      "Something went wrong while trying to fetch pull request details.",
    );
  }
}

(async () => {
  const title = document.querySelector(
    ".gh-header-title .js-issue-title",
  ).textContent;
  if (!title.endsWith(": init")) {
    return;
  }
  const details = await getPRDetails();
  const sidebar = document.querySelector(".Layout-sidebar > div");

  const filesURL = `https://github.com/${details.repo}/raw/${details.branch}/styles/${/feat\(([\w-]+)\)/.exec(title)[1]}/`;

  const actions = document.createElement("div");
  actions.classList.add("discussion-sidebar-item");
  actions.innerHTML = `
<div class="discussion-sidebar-heading text-bold">Actions</div>
<div class="d-flex" style="flex-direction: column;">
	<a href="${filesURL + "catppuccin.user.css"}">Install with Stylus</a>
	<p style="padding-top: 1rem;">Preview Images:</p>
	<ul style="padding-left: 1rem;">
		<li><a href="${filesURL + "assets/latte.webp"}">Latte</a></li>
		<li><a href="${filesURL + "assets/frappe.webp"}">Frappe</a></li>
		<li><a href="${filesURL + "assets/macchiato.webp"}">Macchiato</a></li>
		<li><a href="${filesURL + "assets/mocha.webp"}">Mocha</a></li>
		<li><a href="${filesURL + "assets/catwalk.webp"}">Catwalk</a></li>
	</ul>
</div>
`;
  sidebar.append(actions);
})();
