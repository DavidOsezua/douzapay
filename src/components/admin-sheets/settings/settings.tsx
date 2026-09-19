import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Card from "./_misc/components/card";
import Profile from "./_misc/components/profile";
import Referral from "./_misc/components/referral";
import Wallet from "./_misc/components/wallet";

const Settings = ({
  userData,
  closeSheet,
}: {
  userData: any;
  closeSheet: () => void;
}) => {
  return (
    <>
      <div className="text-primary-500 mt-4 bg-[#DFEEFF] px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">
            {userData?.firstName} {userData?.lastName}
          </h2>
        </div>
      </div>

      <Tabs className="mt-4" defaultValue="profile">
        <div className="px-4">
          <TabsList className="*:data-[state=active]:text-primary-500 mx-auto flex w-full justify-center overflow-hidden rounded border border-[#3D69C580] bg-[#F9F9F9] p-0 *:rounded *:text-xs *:text-[#07173D66] *:data-[state=active]:bg-[#DFEEFF]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className="font-darker space-y-4 px-4" value="profile">
          <Profile userData={userData} closeSheet={closeSheet} />
        </TabsContent>
        <TabsContent value="wallet">
          <Wallet user={userData} />
        </TabsContent>
        <TabsContent value="card">
          <Card userData={userData} />
        </TabsContent>
        <TabsContent value="referral">
          <Referral userData={userData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
