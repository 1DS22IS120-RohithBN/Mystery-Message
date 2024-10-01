"use client"
import { useToast } from "@/hooks/use-toast";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Message } from "@/models/User";
import axios, { AxiosError } from "axios";
import { APIresponse } from "@/types/APIresponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [messages,setMessages]=useState<Message[]>([])
  const [isLoading,setIsLoading]=useState(false)
  const [isSwitchLoading,setIsSwitchLoading]=useState(false)
  const router=useRouter()
  const form=useForm({
    resolver:zodResolver(acceptMessagesSchema),
  })
  const {toast}=useToast()
  const {register,handleSubmit,setValue,watch}=form
  const acceptMessage=watch('acceptMessage')

  const handleDeleteMessage = (messageId: any) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const {data:session}=useSession();
  const user:User=session?.user
  
  const fetchAcceptMessage=useCallback(async()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<APIresponse>('/api/acceptMessage');
      setValue('acceptMessage', response.data.isAcceptingMessage);
      console.log("fetch acceptM value",acceptMessage)
    } catch (error) {
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages=useCallback(async(refresh:boolean=false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try{
    
      const response = await axios.get<APIresponse>('/api/getMessages');
      setMessages(response?.data.messages||[])
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        }); 
    }}
    catch(error){
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Error',
        description:axiosError?.response?.data.message || "Error Loading  Messages",
        variant: 'destructive'
      })}
      finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
  },[setIsLoading, setMessages, toast]);

  const handleSwitchChange=async()=>{
    try{
      const response = await axios.post<APIresponse>('/api/acceptMessage',{acceptMessage:!acceptMessage});
      setValue('acceptMessage', !acceptMessage);
      console.log("current accept Message value",acceptMessage)
      toast({
        title: response.data.message,
        variant: 'default',
      });
      router.push('/dashboard')

    } catch (error) {
      const axiosError = error as AxiosError<APIresponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };


  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessage();

  }, [session,fetchAcceptMessage,setValue,toast,fetchMessages])
  

 

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;