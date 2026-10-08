import { getAddress, parseEther, type Address } from "viem";

import { SdkError } from "@/lib/errors";

export type IndexDtfFeeRecipient = {
  readonly recipient: Address;
  readonly portion: bigint;
};

/** Folio fee tables are D18 fractions that must total exactly 100%. */
export const INDEX_DTF_FEE_RECIPIENT_TOTAL = parseEther("1");
export const INDEX_DTF_MAX_FEE_RECIPIENTS = 64;

/** Folio requires each table strictly ascending by recipient address. */
export function sortIndexDtfFeeRecipients(recipients: readonly IndexDtfFeeRecipient[]): IndexDtfFeeRecipient[] {
  return recipients
    .map((recipient) => ({ recipient: getAddress(recipient.recipient), portion: recipient.portion }))
    .sort((a, b) =>
      BigInt(a.recipient) < BigInt(b.recipient) ? -1 : BigInt(a.recipient) > BigInt(b.recipient) ? 1 : 0,
    );
}

/**
 * Rescales a table that sums to 100% so it sums to `total` instead, putting the rounding residual on the
 * last entry. Used to fit a mutable table next to an immutable one on Folio 6.0.
 */
export function scaleIndexDtfFeeRecipients(
  recipients: readonly IndexDtfFeeRecipient[],
  total: bigint,
): IndexDtfFeeRecipient[] {
  if (recipients.length === 0) {
    return [];
  }
  const inputTotal = recipients.reduce((sum, recipient) => sum + recipient.portion, 0n);
  if (inputTotal !== INDEX_DTF_FEE_RECIPIENT_TOTAL) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "fee recipient portions must total 100% before scaling",
      meta: { total: inputTotal },
    });
  }

  const scaled = recipients.map((recipient) => ({
    recipient: recipient.recipient,
    portion: (recipient.portion * total) / INDEX_DTF_FEE_RECIPIENT_TOTAL,
  }));
  const allButLast = scaled.slice(0, -1).reduce((sum, recipient) => sum + recipient.portion, 0n);
  scaled[scaled.length - 1]!.portion = total - allButLast;

  return scaled;
}

/** Mirrors FolioLib's checks so a bad table fails at build time instead of at execution. */
export function assertIndexDtfFeeRecipientTables(tables: {
  readonly recipients: readonly IndexDtfFeeRecipient[];
  readonly immutableRecipients: readonly IndexDtfFeeRecipient[];
  /** The Folio itself may not be a recipient; pass it when known. */
  readonly folio?: Address;
}) {
  const folio = tables.folio === undefined ? undefined : BigInt(getAddress(tables.folio));
  const count = tables.recipients.length + tables.immutableRecipients.length;

  if (count === 0) {
    return;
  }
  if (count > INDEX_DTF_MAX_FEE_RECIPIENTS) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `fee recipients cannot exceed ${INDEX_DTF_MAX_FEE_RECIPIENTS}`,
      meta: { count },
    });
  }

  for (const [name, table] of [
    ["recipients", tables.recipients],
    ["immutableRecipients", tables.immutableRecipients],
  ] as const) {
    let previous = -1n;

    for (const entry of table) {
      const address = BigInt(getAddress(entry.recipient));

      if (address === 0n || address === folio || address <= previous) {
        throw new SdkError({
          code: "INVALID_INPUT",
          message: `${name} must be unique, non-zero, not the Folio itself, and sorted ascending by address`,
          meta: { recipient: entry.recipient },
        });
      }
      if (entry.portion <= 0n) {
        throw new SdkError({
          code: "INVALID_INPUT",
          message: `${name} portions must be positive`,
          meta: { recipient: entry.recipient },
        });
      }

      previous = address;
    }
  }

  const total = [...tables.recipients, ...tables.immutableRecipients].reduce((sum, entry) => sum + entry.portion, 0n);
  if (total !== INDEX_DTF_FEE_RECIPIENT_TOTAL) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "fee recipient portions across both tables must total 100%",
      meta: { total },
    });
  }
}
