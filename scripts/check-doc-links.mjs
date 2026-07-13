import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const roots = ["README.md", "docs", "packages", "apps/docs/src/pages"];
const markdownFiles = [];
const docsPagesRoot = "apps/docs/src/pages";

for (const root of roots) {
  collectMarkdown(root);
}

const missingLinks = [];
const docsRoutes = new Set(
  markdownFiles
    .filter((file) => file.startsWith(`${docsPagesRoot}/`))
    .map((file) => {
      const page = file
        .slice(docsPagesRoot.length)
        .replace(/\.(?:md|mdx)$/, "")
        .replace(/\/index$/, "");
      return page || "/";
    }),
);

for (const file of markdownFiles) {
  const contents = readFileSync(file, "utf8");

  for (const match of contents.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const link = match[1].replace(/^<|>$/g, "");

    if (/^(?:#|https?:|mailto:|data:|\/\/)/.test(link)) {
      continue;
    }

    const target = decodeURIComponent(link.split("#", 1)[0].split("?", 1)[0]);

    if (target.startsWith("/")) {
      const route = target.length > 1 ? target.replace(/\/$/, "") : target;
      const publicAsset = resolve("apps/docs/public", route.slice(1));

      if (file.startsWith(`${docsPagesRoot}/`) && !docsRoutes.has(route) && !existsSync(publicAsset)) {
        missingLinks.push(`${file}: ${link}`);
      }
      continue;
    }

    if (target && !existsSync(resolve(dirname(file), target))) {
      missingLinks.push(`${file}: ${link}`);
    }
  }
}

if (missingLinks.length > 0) {
  console.error(`Broken local documentation links:\n${missingLinks.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${markdownFiles.length} documentation files.`);
}

function collectMarkdown(path) {
  if (!existsSync(path)) {
    return;
  }

  if (extname(path) === ".md" || extname(path) === ".mdx") {
    markdownFiles.push(path);
    return;
  }

  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);

    if (entry.isDirectory()) {
      if (path === "packages" && !existsSync(join(child, "README.md"))) {
        continue;
      }

      collectMarkdown(child);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      markdownFiles.push(child);
    }
  }
}
