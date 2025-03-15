'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {session.user?.name}!</p>
    </div>
  );
}