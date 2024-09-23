'use client';

import { getGoogleOAuthConsentUrl } from '@/app/authenticate/auth.action';
import { Button } from '../button';
import { RiGoogleFill } from '@remixicon/react';
import { toast } from 'sonner';

export default function GoogleOAuthButton() {
  return (
    <Button
      onClick={async () => {
        const res = await getGoogleOAuthConsentUrl();
        if (res.url) {
          console.log(res.url);
          window.location.href = res.url;
        } else {
          toast.error('Failed to get Google OAuth URL');
        }
      }}
    >
      <RiGoogleFill className='w-4 h-4 mr-2' />
      Continue with Google!
    </Button>
  );
}
