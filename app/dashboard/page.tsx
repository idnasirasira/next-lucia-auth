import SignOutButton from '@/components/ui/auth/SignOutButton';
import { getUser } from '@/lib/lucia';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/authenticate');
  }

  return (
    <div>
      <h1>You are logged in as {user.name}</h1>
      <SignOutButton>Sign Out</SignOutButton>
    </div>
  );
};

export default DashboardPage;
