import { AppLogo } from '@/components/icons';
import { StudyingIllustration } from '@/components/illustrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col items-center justify-center text-center">
            <StudyingIllustration className='w-full max-w-md'/>
             <h1 className="text-3xl font-bold mt-4 font-heading">Welcome to Prep Quiz</h1>
            <p className="text-muted-foreground mt-2">Your fun and interactive way to master exams.</p>
        </div>
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex items-center gap-2">
                    <AppLogo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">Prep Quiz</span>
                </div>
                <CardTitle className="text-2xl font-heading">Get Started</CardTitle>
                <CardDescription>
                    Log in or create an account to start your prep journey.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm />
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
