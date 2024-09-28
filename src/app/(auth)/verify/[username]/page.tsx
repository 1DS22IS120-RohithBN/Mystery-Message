"use client"
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { APIresponse } from '@/types/APIresponse';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const page = () => {
    const [isSubmitting,setIsSubmitting]=useState(false)
    const router=useRouter();
    const param=useParams<{username:string}>()
    const {toast}=useToast();
    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
          code:""
        },
      });

      const onSubmit=async(data: z.infer<typeof verifySchema>)=>{
        try {
            setIsSubmitting(true)
            const username=param.username
            const reqdata={username,code:data.code}
            console.log(reqdata)
            const response=await axios.post("/api/verify-otp",reqdata)
            toast({
                title: "Verification successful",
                description: response.data.message,
              });
              router.push('/sign-in')


      }
      catch(error){

        const axiosError=error as AxiosError<APIresponse>
        toast({
            title: 'Verification  Failed',
            description: axiosError.response?.data.message ?? 'There was a problem with your verification. Please try again.',
            variant: 'destructive',
          });

      }
      finally{
        setIsSubmitting(false)
      }
    }
      useEffect(() => {
        if(!param.username){
            router.push('/sign-up')
            }
            }, [param.username])
      

            return (
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                      </h1>
                      <p className="mb-4">Enter the verification code sent to your email</p>
                    </div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          name="code"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verification Code</FormLabel>
                              <Input {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Verify</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              );
            }

export default page