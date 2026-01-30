"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { CircleCheck, CircleX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { CallToAction } from "@/components/cta";

const VOTER_ID_KEY = "poll_voter_id";
const HAS_VOTED_KEY = "poll_has_voted";

const STATUS_VALUES = ["single", "relationship"] as const;

function getOrCreateVoterId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

const formSchema = z.object({
  status: z.enum(STATUS_VALUES, {
    message: "Please select your relationship status.",
  }),
});


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [voted, setVoted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyVotedError, setAlreadyVotedError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const vote = useMutation(api.poll.vote);
  const totalVotes = useQuery(api.poll.getTotalVotes);

  useEffect(() => {
    setMounted(true);
    setVoterId(getOrCreateVoterId());
    setVoted(localStorage.getItem(HAS_VOTED_KEY) === "true");
  }, []);

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const id = getOrCreateVoterId();
      if (!id) return;
      setVoterId((prev) => prev || id);
      setAlreadyVotedError(false);
      try {
        await vote({ voterId: id, status: values.status });
        localStorage.setItem(HAS_VOTED_KEY, "true");
        setVoted(true);
        setShowSuccess(true);
        form.reset();
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message.includes("already voted")) {
          localStorage.setItem(HAS_VOTED_KEY, "true");
          setVoted(true);
          setAlreadyVotedError(true);
          toast.error("You already voted! You can only vote once.");
        }
      }
    },
    [vote, form]
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#EAE5E0] flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center text-[#6b6b6b]">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EAE5E0] flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {showSuccess && (
            <Alert className="flex flex-row items-start gap-3 border-success/80 bg-success/5 text-success">
              <CircleCheck className="size-4 shrink-0 translate-y-0.5 text-success/60" />
              <div className="flex flex-1 flex-col gap-1">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription className="text-success/80">
                  Your vote has been recorded successfully.
                </AlertDescription>
                <Button
                  className="mt-2 w-fit bg-success text-white hover:bg-success/90"
                  size="sm"
                  variant="default"
                  onClick={() => setShowSuccess(false)}
                >
                  Dismiss
                </Button>
              </div>
            </Alert>
          )}

          {(alreadyVotedError || voted) && !showSuccess && (
            <Alert className="flex flex-row items-start gap-3 border-destructive/80 bg-destructive/5 text-destructive">
              <CircleX className="size-4 shrink-0 translate-y-0.5 text-destructive/60" />
              <div className="flex flex-1 flex-col gap-1">
                <AlertTitle>Already voted</AlertTitle>
                <AlertDescription className="text-destructive/80">
                  You have already voted. You can only vote once.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {!voted && (
            <section className="rounded-none border-0 bg-[#FBFAF8] p-6 shadow-none">
              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-semibold text-[#2c2c2c]">
                          Your relationship status
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            className="flex flex-col space-y-2"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                id="single"
                                value="single"
                                className="border-[#c4bfb8] text-[#4285F4]"
                              />
                              <Label
                                htmlFor="single"
                                className="cursor-pointer font-normal text-[#2c2c2c]"
                              >
                                Single
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                id="relationship"
                                value="relationship"
                                className="border-[#c4bfb8] text-[#4285F4]"
                              />
                              <Label
                                htmlFor="relationship"
                                className="cursor-pointer font-normal text-[#2c2c2c]"
                              >
                                In relationship
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription className="text-[#6b6b6b] text-sm">
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
                    className="w-full bg-[#4285F4] text-white hover:bg-[#3367D6] py-6 text-base font-medium rounded-md"
                    suppressHydrationWarning
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </section>
          )}
        </div>
      </div>

      <CallToAction />
    </main>
  );
}
