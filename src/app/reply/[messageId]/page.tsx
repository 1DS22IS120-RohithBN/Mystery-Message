'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Heading1, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Message } from '@/models/User'
import { APIresponse } from '@/types/APIresponse'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import { Router } from 'next/router'


const replyFormSchema = z.object({
  reply: z.string().max(50).min(2,{
    message:"Reply Must be atleast 2 characters"
  })
})



const page = () => {
  const param=useParams<{messageId:string}>();
  const [isLoading,setIsLoading]=useState(false)
  const {data:session}=useSession();
  const user:User=session?.user
  const {toast}=useToast()
  const router=useRouter()


  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      reply: "",
    },
  })
  async function onSubmit(values: z.infer<typeof replyFormSchema>) {
    setIsLoading(true)
    try{
      const response=await axios.post<APIresponse>(`/api/replyMessage/${param.messageId}`,{reply:values.reply})
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
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
 


  return (

    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
    <h1 className="text-4xl font-bold mb-6 text-center">
      Reply Message
    </h1>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="reply"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Reply</FormLabel>
            <FormControl>
             
            
            <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                      </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        <div className="flex justify-center">
                {isLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    Send It
                  </Button>
                )}
              </div>
    </form>
  </Form>
</div>
  )
}

export default page