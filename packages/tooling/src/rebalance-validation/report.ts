export type CheckLevel = "pass" | "warn" | "fail";

export type Check = {
  readonly level: CheckLevel;
  readonly label: string;
  readonly detail?: string;
};

/**
 * Two-pass ordering, deliberately: "preventing disasters" (value landing in the
 * wrong place) gates the review, "optimizing outcomes" (execution quality) only
 * informs it. Only the first pass can fail a run.
 */
export type CheckPass = "disasters" | "outcomes";

export class Report {
  private readonly checks: { pass: CheckPass; check: Check }[] = [];

  record(pass: CheckPass, level: CheckLevel, label: string, detail?: string): void {
    this.checks.push({ pass, check: { level, label, ...(detail === undefined ? {} : { detail }) } });
  }

  get failures(): number {
    return this.checks.filter(({ pass, check }) => pass === "disasters" && check.level === "fail").length;
  }

  print(log: (line: string) => void = console.log): void {
    for (const pass of ["disasters", "outcomes"] as const) {
      const passChecks = this.checks.filter((entry) => entry.pass === pass);
      if (passChecks.length === 0) continue;
      log(`\n${pass === "disasters" ? "Preventing disasters" : "Optimizing outcomes"}`);
      for (const { check } of passChecks) {
        log(`  ${{ pass: " ok ", warn: "WARN", fail: "FAIL" }[check.level]}  ${check.label}`);
        if (check.detail) log(`        ${check.detail}`);
      }
    }
    const warns = this.checks.filter((entry) => entry.check.level === "warn").length;
    const fails = this.checks.filter((entry) => entry.check.level === "fail").length;
    log(
      `\n${this.failures ? "BLOCKED" : warns || fails ? "OK WITH FLAGS" : "OK"} — ${this.checks.length - warns - fails} pass, ${warns} warn, ${fails} fail`,
    );
  }
}

export const formatUsd = (value: number): string =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatPercent = (value: number, digits = 3): string => `${(value * 100).toFixed(digits)}%`;
