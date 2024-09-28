"use client"
import { signOut } from "next-auth/react";

const Dashboard = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/sign-up' }); // Redirect to home page after sign out
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <button onClick={handleSignOut}></button>
    </div>
  );
};

export default Dashboard;
