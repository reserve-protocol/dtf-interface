import { readFile, writeFile } from "node:fs/promises";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/dtf-interface";
const origin = "https://reserve-protocol.github.io";
const siteUrl = `${origin}${githubPagesBasePath}`;
const publicDir = new URL("../dist/public/", import.meta.url);
const originWithoutBasePathPattern = /https:\/\/reserve-protocol\.github\.io\/(?!dtf-interface(?:\/|$))/g;
const markdownLinkWithoutBasePathPattern = /\]\(\/(?!dtf-interface(?:\/|\)))([^)\s]*)\)/g;

for (const fileName of ["llms.txt", "llms-full.txt"]) {
  const fileUrl = new URL(fileName, publicDir);
  const file = await readFile(fileUrl, "utf8");
  const basePath = isGitHubPages ? githubPagesBasePath : "";

  // WHY: Vocs emits /index for the home page and does not apply basePath to llms links.
  await writeFile(
    fileUrl,
    file.replaceAll("](/index)", `](${basePath}/)`).replace(markdownLinkWithoutBasePathPattern, `](${basePath}/$1)`),
  );
}

if (!isGitHubPages) {
  process.exit(0);
}

for (const fileName of ["sitemap.xml", "robots.txt"]) {
  const fileUrl = new URL(fileName, publicDir);
  const file = await readFile(fileUrl, "utf8");

  // WHY: Vocs applies basePath to HTML URLs, but not sitemap URLs.
  await writeFile(fileUrl, file.replace(originWithoutBasePathPattern, `${siteUrl}/`));
}
