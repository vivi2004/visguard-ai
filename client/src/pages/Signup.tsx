import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function Signup() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) {
            toast({
                title: "Signup failed",
                description: error.message,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Account created",
                description: "Check your email to verify your account.",
            })
            navigate("/login")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white dark:bg-slate-800 p-10 shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Create your account</h2>
                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                        <Input
                            type="text"
                            placeholder=""
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <Input
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                        <Input
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-xl"
                        />
                    </div>
                    <Button type="submit" className="w-full rounded-xl text-base font-semibold tracking-wide">
                        Sign up
                    </Button>
                </form>
                <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 dark:text-blue-400 underline font-medium">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    )
}
