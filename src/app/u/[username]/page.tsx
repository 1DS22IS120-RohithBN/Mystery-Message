"use client"
import React, { useState } from 'react'
import { Message } from 'postcss'
import UserModel from '@/models/User'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { messagesSchema } from '@/schemas/messageSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { APIresponse } from '@/types/APIresponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'


const page = () => {
    const [isLoading,setIsLoading]=useState(false)
    const param=useParams<{username:string}>()
    const username=param.username
    const {toast}=useToast()
    const form = useForm<z.infer<typeof messagesSchema>>({
        resolver: zodResolver(messagesSchema),
        defaultValues: {
          content: "",
        },
      })

      const onSubmit = async (data: z.infer<typeof messagesSchema>) => {
        setIsLoading(true);
        try {
          console.log("username and content",username,data)
          const response = await axios.post<APIresponse>('/api/sendMessage', {
            content:data.content,
            username,
          });
    
          toast({
            title: response.data.message,
            variant: 'default',
          });
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
            Public Profile Link
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
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
)}
export default page