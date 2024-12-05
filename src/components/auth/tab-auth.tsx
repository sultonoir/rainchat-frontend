import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormSignin } from "../form/signin/form-signin";
import { FormSignup } from "../form/signup/form-signup";

export function TabAuth() {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              We&apos;re so excited to see you again!.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSignin />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSignup />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
