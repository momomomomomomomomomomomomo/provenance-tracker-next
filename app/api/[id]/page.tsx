'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import LoadingPage from '@/app/loading';

export default function TransactionRedirect() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
   
    if (pathname.startsWith('/api/transaction')) {
      router.push(`/?transactionId=${params.id}`);
    }
  }, [params.id, router, pathname]);


  return <LoadingPage/>;
}