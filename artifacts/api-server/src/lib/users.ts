import { eq } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";

export async function findUserByClerkId(clerkUserId: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerkUserId));
  return user ?? null;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username.toLowerCase()));
  return user ?? null;
}
