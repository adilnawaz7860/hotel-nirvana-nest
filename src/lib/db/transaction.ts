import mongoose from "mongoose";
import { connectMongo } from "@/lib/db/connect";

const RETRYABLE_LABELS = ["TransientTransactionError", "UnknownTransactionCommitResult"];

function isRetryable(error: unknown): boolean {
  const labels = (error as { errorLabels?: string[] })?.errorLabels ?? [];
  return labels.some((label) => RETRYABLE_LABELS.includes(label));
}

export async function withTransaction<T>(
  fn: (session: mongoose.ClientSession) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  await connectMongo();
  const session = await mongoose.startSession();

  try {
    let attempt = 0;
    let lastError: unknown;

    while (attempt < maxRetries) {
      attempt += 1;
      try {
        let result!: T;
        await session.withTransaction(async () => {
          result = await fn(session);
        });
        return result;
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt >= maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 50 * attempt + Math.random() * 50));
      }
    }

    throw lastError;
  } finally {
    await session.endSession();
  }
}
