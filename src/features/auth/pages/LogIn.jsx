import { useState } from "react";
import LogInBg from "../../../assets/images/loginBg.jpg";

export default function LogIn() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* ── Background image ── */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[72%] pointer-events-none select-none">
        <img
          src={LogInBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        {/* Left-edge blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-[#0a0a0f]/10 lg:via-[#0a0a0f]/35 lg:to-transparent" />
        {/* Top / bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-transparent to-[#0a0a0f]/70" />
      </div>

      {/* ── Logo — fixed top-left ── */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-8 md:left-14 lg:left-20 z-20 flex items-center gap-2">
        <img src="" alt="" />
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 w-full min-h-screen flex items-center">
        <div className="w-full max-w-[80%] mx-auto px-10 sm:px-8 md:px-14 lg:px-20 py-24 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-10 lg:gap-8">
          {/* ── LEFT: Hero copy ── */}
          <div className="w-full lg:flex-1 lg:min-w-0 text-center lg:text-left">
            <h1
              className="font-semibold leading-[0.95] tracking-tight
             text-[clamp(2rem,5vw,8rem)]"
            >
              <span className="text-white">The </span>
              <span className="bg-gradient-to-br from-violet-500 via-purple-400 to-purple-300 bg-clip-text text-transparent">
                Future
              </span>
              <br />
              <span className="text-white">in AI-Powered</span>
              <br />
              <span className="text-white">Sports Highlights</span>
            </h1>

            <p className="text-white/50 mt-5 text-xl sm:text-base leading-relaxed  mb-8 sm:mb-10 mx-auto lg:mx-0">
              Detect, clip, enrich, and deliver sports highlights with AI-driven
              precision and broadcast-grade quality.
            </p>

            {/* Get Started */}
            <button
              onClick={() => setShowLogin(true)}
              className="group relative overflow-hidden px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-semibold text-white text-sm sm:text-base tracking-wide bg-gradient-to-br from-[#5a29f5] to-violet-600 hover:from-violet-500 hover:to-violet-700 shadow-[0_0_28px_rgba(108,63,255,0.5)] hover:shadow-[0_0_45px_rgba(108,63,255,0.7)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]" />
              <span className="relative">Get Started</span>
            </button>
          </div>

          {/* ── RIGHT: Login card ── */}
          <div
            className={`w-full max-w-[360px] lg:max-w-[360px] shrink-0 transition-all duration-500 ease-out ${
              showLogin
                ? "opacity-100 translate-y-0 lg:translate-y-0 lg:translate-x-0 pointer-events-auto"
                : "opacity-0 translate-y-8 lg:translate-y-0 lg:translate-x-20 pointer-events-none"
            }`}
          >
            {/* Single glass card — matches Image 2 */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(15, 22, 50, 0)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
              }}
            >
              {/* Subtle top highlight line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative z-10 px-6 sm:px-8 py-8 sm:py-9">
                <h2 className="text-white text-2xl sm:text-[1.85rem] font-extrabold text-center tracking-tight mb-1.5">
                  Log In
                </h2>
                <p className="text-white/45 text-[0.74rem] sm:text-[0.77rem] text-center leading-relaxed mb-6 sm:mb-7">
                  Login now and get access to exclusive content!
                </p>

                {/* Email */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-white/80 text-[0.8rem] sm:text-[0.82rem] font-semibold mb-1.5 sm:mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="Email@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a2845]/75 border border-white/[0.1] rounded-lg px-4 py-2.5 sm:py-[11px] text-white text-sm placeholder-white/25 outline-none focus:border-violet-500/60 transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-white/80 text-[0.8rem] sm:text-[0.82rem] font-semibold mb-1.5 sm:mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1a2845]/75 border border-white/[0.1] rounded-lg px-4 py-2.5 sm:py-[11px] text-white text-sm placeholder-white/25 outline-none focus:border-violet-500/60 transition-colors"
                  />
                </div>

                {/* Forgot */}
                <div className="text-center mb-5 sm:mb-6">
                  <span className="text-white/38 text-[0.74rem] sm:text-[0.77rem]">
                    Forgot password?{" "}
                  </span>
                  <a
                    href="#"
                    className="text-[#4f8ef7] text-[0.74rem] sm:text-[0.77rem] font-semibold hover:text-blue-300 transition-colors"
                  >
                    Reset password
                  </a>
                </div>

                {/* Login btn */}
                <button className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#5530f5] to-[#7c3aed] hover:from-[#6040ff] hover:to-[#8b46ff] text-white font-bold text-sm sm:text-[0.95rem] rounded-lg shadow-[0_0_22px_rgba(108,63,255,0.45)] hover:shadow-[0_0_38px_rgba(108,63,255,0.65)] hover:-translate-y-px transition-all duration-200 mb-3 sm:mb-4 tracking-wide">
                  Login
                </button>

                {/* Terms */}
                <p className="text-white/28 text-[0.64rem] sm:text-[0.67rem] text-center leading-relaxed mb-4 sm:mb-5 px-1">
                  By clicking on Sign up, you agree to our{" "}
                  <a
                    href="#"
                    className="text-white/42 hover:text-white/60 transition-colors"
                  >
                    Terms of service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-white/42 hover:text-white/60 transition-colors"
                  >
                    Privacy policy
                  </a>
                  .
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="flex-1 h-px bg-white/[0.1]" />
                  <span className="text-white/30 text-[0.72rem]">or</span>
                  <div className="flex-1 h-px bg-white/[0.1]" />
                </div>

                {/* Google */}
                <button className="w-full py-2.5 sm:py-[11px] bg-white hover:bg-gray-50 text-[#1a1a2e] font-semibold text-sm rounded-lg flex items-center justify-center gap-2.5 hover:-translate-y-px transition-all duration-200 shadow-md">
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5.1C9.7 39.7 16.4 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.2 5.2C41 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"
                    />
                  </svg>
                  Sign with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
