import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/api-error";
import { isAuthenticated, setAuthSession } from "@/utils/auth";
import { apiClient } from "@/utils/ts-rest";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/admin" });
  },
  head: () => ({ meta: [{ title: "Admin Login — Veershree Realty" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);
    const response = await apiClient.login({ body: { username: username.trim(), password } });
    setLoading(false);

    if (response.status !== 200) {
      toast.error(getErrorMessage(response.body));
      return;
    }

    setAuthSession(response.body.token, response.body.user);
    toast.success(`Welcome, ${response.body.user.username}`);
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border border-border shadow-soft p-10">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl text-coffee-deep">Veershree Realty</div>
          <div className="eyebrow text-gold mt-2">Admin Studio</div>
        </div>

        <label className="block mb-4">
          <span className="eyebrow block mb-2">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={inp}
            placeholder="admin"
          />
        </label>

        <label className="block mb-8">
          <span className="eyebrow block mb-2">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={inp}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coffee-deep text-cream py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-coffee transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const inp = "w-full px-3 py-2.5 bg-cream border border-border text-sm text-coffee-deep outline-none focus:border-gold";
