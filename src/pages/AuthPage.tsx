import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OTPVerification from "@/components/OTPVerification";
import { securityService } from "@/services/securityService";
import { Eye, EyeOff, Shield } from "lucide-react";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showOTP, setShowOTP] = useState(false);
  const [showPhoneOTP, setShowPhoneOTP] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [csrfToken] = useState(() => securityService.generateCSRFToken());
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CSRF protection
    if (!securityService.validateCSRFToken(csrfToken)) {
      toast.error("Security validation failed. Please refresh the page.");
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        setPendingEmail(email);
        setShowOTP(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast.error(`Google sign-in failed: ${error.message}`);
        await securityService.logSecurityEvent({
          action: 'OAUTH_LOGIN_FAILED',
          resource: 'auth',
          details: { provider: 'google', error: error.message }
        });
      } else {
        await securityService.logSecurityEvent({
          action: 'OAUTH_LOGIN_SUCCESS',
          resource: 'auth',
          details: { provider: 'google' }
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        toast.error("Please enter a valid phone number with country code");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          channel: 'sms'
        }
      });
      
      if (error) {
        toast.error(`Phone sign-in failed: ${error.message}`);
        await securityService.logSecurityEvent({
          action: 'PHONE_OTP_FAILED',
          resource: 'auth',
          details: { phone: phone.replace(/\d(?=\d{4})/g, '*'), error: error.message }
        });
      } else {
        setPendingPhone(phone);
        setShowPhoneOTP(true);
        toast.success("OTP sent to your phone number");
        await securityService.logSecurityEvent({
          action: 'PHONE_OTP_SENT',
          resource: 'auth',
          details: { phone: phone.replace(/\d(?=\d{4})/g, '*') }
        });
      }
    } catch (error) {
      console.error("Phone sign-in error:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        toast.error(`Password reset failed: ${error.message}`);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setShowPasswordReset(false);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOTP = async (otp: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: pendingPhone,
        token: otp,
        type: 'sms'
      });
      
      if (error) {
        toast.error(`OTP verification failed: ${error.message}`);
        return false;
      } else {
        toast.success("Phone number verified successfully!");
        setShowPhoneOTP(false);
        navigate("/");
        return true;
      }
    } catch (error) {
      console.error("Phone OTP verification error:", error);
      toast.error("Failed to verify OTP");
      return false;
    }
  };

  const handleOTPVerification = () => {
    setShowOTP(false);
    navigate("/");
  };

  const handleResendOTP = async () => {
    console.log("Resending OTP to:", pendingEmail);
  };

  const handleResendPhoneOTP = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: pendingPhone,
        options: {
          channel: 'sms'
        }
      });
      
      if (error) {
        toast.error(`Failed to resend OTP: ${error.message}`);
      } else {
        toast.success("OTP resent to your phone number");
      }
    } catch (error) {
      console.error("Resend phone OTP error:", error);
      toast.error("Failed to resend OTP");
    }
  };

  if (showOTP) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <OTPVerification
          email={pendingEmail}
          onVerificationComplete={handleOTPVerification}
          onResendOTP={handleResendOTP}
        />
      </div>
    );
  }

  if (showPhoneOTP) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verify Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Enter the 6-digit code sent to {pendingPhone.replace(/\d(?=\d{4})/g, '*')}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const otp = (e.target as any).otp.value;
              verifyPhoneOTP(otp);
            }}>
              <div className="space-y-4">
                <Input
                  name="otp"
                  placeholder="Enter OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="text-center text-lg"
                  required
                />
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleResendPhoneOTP}
                >
                  Resend OTP
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowPhoneOTP(false)}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(securityService.sanitizeInput(e.target.value))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Email"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPasswordReset(false)}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            {activeTab === "login" ? "Sign In" : "Create an Account"}
          </CardTitle>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <CardContent className="pt-6">
            <input type="hidden" name="csrf_token" value={csrfToken} />
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(securityService.sanitizeInput(e.target.value))}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Sign in with Google
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-sm"
                  onClick={() => setShowPasswordReset(true)}
                >
                  Forgot your password?
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(securityService.sanitizeInput(e.target.value))}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(securityService.sanitizeInput(e.target.value))}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password (min 8 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters with letters and numbers
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  Sign up with Google
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number (with country code)"
                    value={phone}
                    onChange={(e) => setPhone(securityService.sanitizeInput(e.target.value))}
                    pattern="^\+?[1-9]\d{1,14}$"
                    autoComplete="tel"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Include country code (e.g., +91 for India)
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === "login"
            ? "Don't have an account? Register above."
            : activeTab === "register"
            ? "Already have an account? Login above."
            : "Quick login with your phone number."}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
