import { defineConfig } from "vocs/config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  title: "Reserve DTF SDK",
  description: "Documentation for the Reserve DTF SDK and React SDK.",
  titleTemplate: "%s | Reserve DTF SDK",
  ...(isGitHubPages
    ? {
        basePath: "/dtf-interface",
        baseUrl: "https://reserve-protocol.github.io",
      }
    : {}),
  renderStrategy: "full-static",
  accentColor: "light-dark(#111827, #f8fafc)",
  topNav: [
    { text: "Guide", link: "/quickstart" },
    { text: "SDK", link: "/sdk/overview", match: "/sdk" },
    { text: "React SDK", link: "/react-sdk/overview", match: "/react-sdk" },
    { text: "GitHub", link: "https://github.com/reserve-protocol/dtf-interface", external: true },
  ],
  sidebar: [
    {
      text: "Start",
      items: [
        { text: "Overview", link: "/" },
        { text: "Installation", link: "/installation" },
        { text: "Quickstart", link: "/quickstart" },
        { text: "LLM Guide", link: "/llm-guide" },
        { text: "Data Sources", link: "/data-sources" },
        { text: "Gotchas", link: "/gotchas" },
      ],
    },
    {
      text: "SDK",
      items: [
        { text: "Overview", link: "/sdk/overview" },
        { text: "Architecture", link: "/sdk/architecture" },
        { text: "Client Configuration", link: "/sdk/client-configuration" },
        { text: "Wallet Clients", link: "/sdk/wallet-clients" },
        { text: "Contract Calls", link: "/sdk/contract-calls" },
        { text: "Index DTF API", link: "/sdk/index-dtf" },
        { text: "Governance API", link: "/sdk/governance" },
        { text: "Rebalances & Auctions", link: "/sdk/rebalances" },
        { text: "Deployment", link: "/sdk/deployment" },
        { text: "Vote-Lock", link: "/sdk/vote-lock" },
        { text: "Portfolio & Tokens", link: "/sdk/portfolio-tokens" },
        { text: "Yield DTF Boundary", link: "/sdk/yield-dtf" },
      ],
    },
    {
      text: "React SDK",
      items: [
        { text: "Overview", link: "/react-sdk/overview" },
        { text: "Providers", link: "/react-sdk/providers" },
        { text: "Index DTF Hooks", link: "/react-sdk/index-dtf-hooks" },
        { text: "Governance Hooks", link: "/react-sdk/governance-hooks" },
        { text: "Query Options & Keys", link: "/react-sdk/query-options" },
        { text: "Transactions", link: "/react-sdk/transactions" },
      ],
    },
    {
      text: "Index DTFs",
      collapsed: true,
      items: [
        { text: "Overview", link: "/index-dtf/overview" },
        { text: "Issuance & Redemption", link: "/index-dtf/issuance-redemption" },
        { text: "Governance", link: "/index-dtf/governance" },
        { text: "Rebalances & Auctions", link: "/index-dtf/rebalance-auctions" },
        { text: "Revenue & Fees", link: "/index-dtf/revenue-fees" },
        { text: "Vote-Lock", link: "/index-dtf/vote-lock" },
        { text: "Deployment", link: "/index-dtf/deployment" },
        { text: "Contracts & Versions", link: "/index-dtf/contracts-and-versions" },
      ],
    },
    {
      text: "Protocol",
      collapsed: true,
      items: [
        { text: "Reserve Overview", link: "/protocol/overview" },
        { text: "Data Sources", link: "/protocol/data-sources" },
        { text: "Governance", link: "/protocol/governance" },
        { text: "RSR", link: "/protocol/rsr" },
      ],
    },
    {
      text: "Integrations",
      collapsed: true,
      items: [
        { text: "Register", link: "/integrations/register" },
        { text: "Zapper", link: "/integrations/zapper" },
        { text: "Index Subgraph", link: "/subgraphs/index-dtf" },
      ],
    },
    {
      text: "Journal",
      items: [{ text: "Docs Journal", link: "/journal/docs-journal" }],
    },
  ],
  editLink: {
    link: "https://github.com/reserve-protocol/dtf-interface/edit/main/apps/docs/src/pages/:path",
    text: "Edit this page",
  },
  socials: [{ icon: "github", link: "https://github.com/reserve-protocol/dtf-interface" }],
});
