"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  status: z.enum(["single", "relationship"], {
    required_error: "Please select your relationship status.",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const vote = useMutation(api.poll.vote);
  const totalVotes = useQuery(api.poll.getTotalVotes);

  function onSubmit(values: z.infer<typeof formSchema>) {
    vote({ status: values.status });
    toast.success("Thanks for voting!");
    form.reset();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-6">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 border border-slate-200/80 dark:border-slate-700">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    Your relationship status
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col space-y-3"
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10">
                        <RadioGroupItem id="single" value="single" />
                        <Label htmlFor="single" className="cursor-pointer text-slate-700 dark:text-slate-200 font-medium flex-1">
                          Single
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10">
                        <RadioGroupItem id="relationship" value="relationship" />
                        <Label htmlFor="relationship" className="cursor-pointer text-slate-700 dark:text-slate-200 font-medium flex-1">
                          In relationship
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription className="text-slate-500 dark:text-slate-400">
                    {totalVotes !== undefined
                      ? `${totalVotes} ${totalVotes === 1 ? "person" : "people"} voted so far`
                      : "Loading..."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-6 text-base font-medium rounded-xl"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
