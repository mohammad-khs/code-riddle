import argon2 from "argon2";
import { HashPassword } from "@/types/auth";
import { VerifyPassword } from "@/types/auth";

export async function hashPassword({ password }: HashPassword) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64MB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword({ hash, password }: VerifyPassword) {
  return await argon2.verify(hash, password);
}
