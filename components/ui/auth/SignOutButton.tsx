'use client';
import { logout } from '@/app/authenticate/auth.action';

type Props = {
  children: React.ReactNode;
};

const SignOutButton = ({ children }: Props) => {
  return <button onClick={() => logout()}>{children}</button>;
};

export default SignOutButton;
