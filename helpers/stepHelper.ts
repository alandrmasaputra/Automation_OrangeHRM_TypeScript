import { test } from '@playwright/test';

export async function step<T>(title: string, body: () => Promise<T>): Promise<T> {
  return await test.step(title, body);
}
