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
import dynamic from "next/dynamic";
import HoverSlatButton from "@/components/ui/hover-button";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeToggle } from "@/components/ThemeToggle";

const CallToAction = dynamic(() => import("@/components/cta").then(mod => mod.CallToAction), { ssr: false });
const ProfileForm = dynamic(() => import("@/components/profile-form").then(mod => mod.ProfileForm), { ssr: false });
const ComingSoonPage = dynamic(() => import("@/components/coming-soon").then(mod => mod.ComingSoonPage), { ssr: false });

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

type ViewState = "voting" | "profile-form" | "profile-complete";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [voted, setVoted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alreadyVotedError, setAlreadyVotedError] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("voting");
  const [userStatus, setUserStatus] = useState<"single" | "relationship">("single");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const vote = useMutation(api.poll.vote);
  const totalVotes = useQuery(api.poll.getTotalVotes);
  const userVote = useQuery(api.poll.getUserVote, voterId ? { voterId } : "skip");
  const profile = useQuery(
    api.profiles.getProfile,
    voterId ? { voterId } : "skip"
  );

  useEffect(() => {
    setMounted(true);
    const id = getOrCreateVoterId();
    setVoterId(id);
    setVoted(localStorage.getItem(HAS_VOTED_KEY) === "true");
  }, []);

  // Sync userStatus with vote if profile doesn't exist yet but user has voted
  useEffect(() => {
    if (userVote && !profile) {
      setUserStatus(userVote.status);
    }
  }, [userVote, profile]);

  // Check if profile exists and update view state
  useEffect(() => {
    if (profile) {
      setViewState("profile-complete");
      setUserStatus(profile.status);
    }
  }, [profile]);

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
        setUserStatus(values.status);
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

  const handleBuildClick = () => {
    if (voted && viewState === "voting") {
      setViewState("profile-form");
    }
  };

  const handleProfileCreated = () => {
    setViewState("profile-complete");
  };

  const handleLogout = () => {
    localStorage.removeItem(VOTER_ID_KEY);
    localStorage.removeItem(HAS_VOTED_KEY);
    window.location.reload();
  };

  const handleEditProfile = () => {
    setViewState("profile-form");
  };

  if (!mounted) {
    return (
      <main className="h-screen bg-transparent flex flex-col overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center text-muted-foreground">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-transparent">

      <div
        className="flex h-screen transition-transform duration-700 ease-in-out"
        style={{
          transform:
            viewState === "voting"
              ? "translateX(0)"
              : viewState === "profile-form"
                ? "translateX(-100vw)"
                : "translateX(-200vw)",
          width: "300vw",
        }}
      >
        {/* Voting View */}
        <div className="flex h-screen w-screen flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col items-center justify-center p-6 py-12 md:py-20">
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
                <div className="space-y-2">
                  <Alert className="flex flex-row items-start gap-3 border-destructive/80 bg-destructive/5 text-destructive">
                    <CircleX className="size-4 shrink-0 translate-y-0.5 text-destructive/60" />
                    <div className="flex flex-1 flex-col gap-1">
                      <AlertTitle>Already voted</AlertTitle>
                      <AlertDescription className="text-destructive/80">
                        You have already voted. You can only vote once.
                      </AlertDescription>
                    </div>
                  </Alert>
                  <div className="text-center text-xs font-medium text-muted-foreground">
                    {totalVotes !== undefined
                      ? `${totalVotes} ${totalVotes === 1 ? "person" : "people"} have voted, counting...`
                      : "Counting..."}
                  </div>
                </div>
              )}

              {!voted && (
                <section className="rounded-none border-0 bg-card p-6 shadow-none">
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
                            <FormLabel className="text-base font-semibold text-foreground">
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
                                    className="cursor-pointer font-normal text-foreground"
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
                                    className="cursor-pointer font-normal text-foreground"
                                  >
                                    In relationship
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription className="text-muted-foreground text-sm">
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

              {/* Build/Start Button - Only show after voting */}
              {voted && viewState === "voting" && (
                <div className="flex justify-center pt-4">
                  <HoverSlatButton
                    initialText="BUILD"
                    hoverText="START"
                    onClick={handleBuildClick}
                  />
                </div>
              )}
            </div>
          </div>

          <CallToAction />
        </div>

        {/* Profile Form View */}
        <div className="flex h-screen w-screen flex-col items-center justify-center p-6 overflow-y-auto">
          <ProfileForm
            voterId={voterId}
            userStatus={userStatus}
            onProfileCreated={handleProfileCreated}
            existingProfile={profile ? {
              fullName: profile.fullName,
              imageUrl: profile.imageUrl ?? undefined
            } : null}
          />
        </div>

        {/* Profile Complete View */}
        <div className="flex h-screen w-screen flex-col items-center overflow-y-auto overflow-x-hidden">
          <ComingSoonPage onEditProfile={handleEditProfile} />
        </div>
      </div>

      {/* Top Controls - Global for this page */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-6 md:translate-x-0 z-50 flex items-center gap-2 rounded-full border border-border/40 bg-background/50 p-1 backdrop-blur-md shadow-lg transition-all active:scale-95 sm:shadow-sm">
        <ThemeToggle />
        {viewState === "profile-complete" && profile && (
          <ProfileDropdown
            fullName={profile.fullName}
            status={profile.status === "single" ? "Single" : "In Relationship"}
            imageUrl={profile.imageUrl ?? undefined}
            onLogout={handleLogout}
            onEditProfile={handleEditProfile}
          />
        )}
      </div>
    </main>
  );
}
