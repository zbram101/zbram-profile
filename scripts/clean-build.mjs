import { rm } from 'node:fs/promises';
// Clear the old output root so earlier static builds cannot shadow the new client.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
