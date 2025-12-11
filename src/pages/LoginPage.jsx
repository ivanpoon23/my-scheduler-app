import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // ⬅️ New Import
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function CanvasTokenInput() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate(); // Initialize navigator

  const submitToken = async () => {
    setStatus("Saving token..."); // Show loading state
    
    try {
      // ⬅️ Use relative URL if using a Vite proxy (recommended)
      const res = await fetch("/api/user/canvas/token", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        setStatus("Token saved successfully! Redirecting...");
        setToken("");
        // Redirect user to the main app page
        setTimeout(() => {
          navigate('/todo', { replace: true });
        }, 1200); 
      } else {
        let errorMessage;
        if (res.status === 400) {
          errorMessage = "Invalid Canvas Token or format error. Please verify.";
        } else if (res.status === 500) {
          errorMessage = "Server error. Check database connection.";
        } else {
          errorMessage = `Failed with status: ${res.status}`;
        }
        setStatus(errorMessage);
      }
    } catch (error) {
        setStatus("Network error: Could not connect to the backend server.");
    }
  };

  const isSaving = status.startsWith("Saving");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-semibold">Connect Your Canvas Account</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Enter your Canvas Access Token below to sync your assignments and schedule.
            </p>

            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Canvas API Token"
              className="rounded-xl"
              disabled={isSaving}
            />

            <Button
              onClick={submitToken}
              className="w-full rounded-xl py-2 text-base font-medium"
              disabled={!token.trim() || isSaving} // Disable if token is empty or saving
            >
              {isSaving ? "Saving..." : "Save Token"}
            </Button>

            {status && (
              <p 
                className={`text-center text-sm pt-2 ${
                  status.includes("successfully") ? 'text-green-600' : 
                  status.includes("error") || status.includes("Invalid") ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {status}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}