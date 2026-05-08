const listingStatuses = new Set(["DRAFT", "PENDING_REVIEW", "ACTIVE", "PAUSED", "REJECTED", "ARCHIVED"])
const kycStatuses = new Set(["PENDING", "APPROVED", "REJECTED", "NOT_SUBMITTED"])
const payoutStatuses = new Set(["PENDING", "PROCESSING", "COMPLETED", "FAILED"])
const accountStatuses = new Set(["ACTIVE", "SUSPENDED", "DELETED"])

function readObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object")
  }
  return value as Record<string, unknown>
}

function readString(body: Record<string, unknown>, key: string) {
  const value = body[key]
  return typeof value === "string" ? value.trim() : undefined
}

export async function parseListingUpdate(request: Request) {
  const body = readObject(await request.json())
  const status = readString(body, "status")?.toUpperCase()
  if (status && !listingStatuses.has(status)) {
    throw new Error("Invalid listing status")
  }

  return {
    status,
    reason: readString(body, "reason"),
    isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
    title: readString(body, "title"),
  }
}

export async function parseKycDecision(request: Request) {
  const body = readObject(await request.json())
  const action = readString(body, "action")?.toLowerCase()
  const status = readString(body, "status")?.toUpperCase()

  if (action && !["approve", "reject", "request_changes", "resubmission_required"].includes(action)) {
    throw new Error("Invalid KYC action")
  }

  if (status && !kycStatuses.has(status)) {
    throw new Error("Invalid KYC status")
  }

  return {
    action,
    status,
    rejectionReason: readString(body, "rejectionReason") || readString(body, "reason"),
  }
}

export async function parsePayoutUpdate(request: Request) {
  const body = readObject(await request.json())
  const status = readString(body, "status")?.toUpperCase()
  if (!status || !payoutStatuses.has(status)) {
    throw new Error("Invalid payout status")
  }

  return {
    status,
    transactionId: readString(body, "transactionId"),
    failureReason: readString(body, "failureReason"),
    notes: readString(body, "notes"),
  }
}

export async function parseAccountUpdate(request: Request) {
  const body = readObject(await request.json())
  const status = readString(body, "status")?.toUpperCase()
  if (!status || !accountStatuses.has(status)) {
    throw new Error("Invalid account status")
  }

  return {
    status,
    reason: readString(body, "reason"),
  }
}
