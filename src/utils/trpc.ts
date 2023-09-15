
import type { AppRouter } from '@/server/routes/root';
import { createTRPCReact } from '@trpc/react-query';


export const trpc = createTRPCReact<AppRouter>();
