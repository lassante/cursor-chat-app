import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store/useStore";
import { SignInTab } from "./SignInTab";
import { SignUpTab } from "./SignUpTab";

export const AuthTabs = () => {
  const { signInWithGoogle, error } = useStore();

  return (
    <div className="space-y-6 w-full">
      <Tabs defaultValue="signin" className="w-full">
        <AuthTabsList />

        <TabsContent value="signin">
          <SignInTab />
        </TabsContent>

        <TabsContent value="signup">
          <SignUpTab />
        </TabsContent>
      </Tabs>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/80 dark:bg-black/95 px-2 text-neutral-600 dark:text-neutral-400">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full bg-white hover:bg-neutral-100 dark:bg-background/60 dark:hover:bg-background/80 dark:border-white/10"
        onClick={signInWithGoogle}
      >
        Continue with Google
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
};

const AuthTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-2 bg-neutral-100/20 dark:bg-background/60">
      <TabsTrigger value="signin">Sign In</TabsTrigger>
      <TabsTrigger value="signup">Create Account</TabsTrigger>
    </TabsList>
  );
};
