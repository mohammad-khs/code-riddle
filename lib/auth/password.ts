import argon2 from "argon2";
import { HashPasswordParams, VerifyPasswordParams } from "@/types/auth";

export async function hashPassword({ password }: HashPasswordParams) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword({ hash, password }: VerifyPasswordParams) {
  return await argon2.verify(hash, password);
}
