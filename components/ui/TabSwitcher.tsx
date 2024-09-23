'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  SignUpTab: React.ReactNode;
  SignInTab: React.ReactNode;
};

const TabSwitcher: React.FC<Props> = ({ SignUpTab, SignInTab }) => {
  return (
    <Tabs className='w-500px' defaultValue='sign-in'>
      <TabsList>
        <TabsTrigger value='sign-in'>Sign In</TabsTrigger>
        <TabsTrigger value='sign-up'>Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value='sign-in'>{SignInTab}</TabsContent>
      <TabsContent value='sign-up'>{SignUpTab}</TabsContent>
    </Tabs>
  );
};

export default TabSwitcher;
