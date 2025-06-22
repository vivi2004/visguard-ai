import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            alert("Login failed: " + error.message)
        } else {


            localStorage.setItem("loggedIn", "true")

            navigate("/upload")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
            <div className="w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg p-8 border border-slate-200">
                <h2 className="text-center text-3xl font-bold text-[#0d141c] mb-6">Welcome back</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-[#0d141c]">Email</label>
                        <Input
                            className="mt-1 h-12 rounded-lg border border-[#cedae8] bg-white placeholder:text-[#49709c]"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[#0d141c]">Password</label>
                        <Input
                            type="password"
                            className="mt-1 h-12 rounded-lg border border-[#cedae8] bg-white placeholder:text-[#49709c]"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-sm text-[#49709c] underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        className="w-full h-12 rounded-lg bg-[#0c77f2] hover:bg-[#075cd1] text-white text-sm font-bold tracking-wide"
                        onClick={handleLogin}
                    >
                        Log in
                    </Button>

                    <p className="text-center text-sm text-[#49709c]">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="underline font-medium text-[#0c77f2]">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
