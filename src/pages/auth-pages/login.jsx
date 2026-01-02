import React, { useState } from "react";
import { loginUser } from "../../services/auth-services/authService";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [cin, setCin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await loginUser(cin, password);
      setSuccess(`Bienvenue ${res.user.nom} (${res.user.role})`);
      localStorage.setItem("user", JSON.stringify(res.user));
      if (res.user.role === "manager") {
        navigate("/managerDashboard");
      } else if (res.user.role === "agentC") {
        navigate("/agentCDashboard");
      } else if (res.user.role === "responsableV") {
        navigate("/resVDashboard");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image Section (1/2 of the screen) */}
      <div className="relative hidden lg:block">
        <img
          src="/img/img-login/showroom1.png"
          alt="Sign-in Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right: Form Section (1/2 of the screen) */}
      <div className="flex items-center justify-center bg-black px-8 py-12 text-white">
        <div className="w-full max-w-md">
          {/* Logos */}
          <div className="mb-10 text-center">
            <div className="flex justify-center items-center gap-8 mb-6 ml-30 w-20 ml-30">
              <img
                src="/img/img-login/mercedice.png"
                alt="Citroën"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/kia.png"
                alt="Citroën"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/bmw.png"
                alt="Citroën"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/nissan.png"
                alt="Citroën"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/citreonLogo.png"
                alt="Citroën"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/peugeotLogo.png"
                alt="Peugeot"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
              <img
                src="/img/img-login/opelLogo.png"
                alt="Opel"
                className="w-[8.5rem] h-auto transition-transform duration-300 hover:scale-110"
              />
            </div>

            <Typography
              variant="h2"
              className="font-georgia text-white mb-2 text-2xl"
            >
              Bienvenue chez notre showroom !<br />
              Pilotez vos ventes, boostez vos performances.
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CIN Row */}
            <div className="flex items-center gap-4">
              <Typography
                variant="small"
                className="font-georgia text-white w-32"
              >
                CIN
              </Typography>
              <Input
                size="lg"
                placeholder="********"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="flex-grow bg-gray-300 text-gray-200 !border-t-gray-200 focus:!border-t-blue-700"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            {/* Mot de passe Row */}
            <div className="flex items-center gap-4">
              <Typography
                variant="small"
                className="font-georgia text-white w-32"
              >
                Mot de passe
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-grow bg-gray-300 text-gray-200 !border-t-gray-200 focus:!border-t-blue-700"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <Button
                type="submit"
                className="mt-4 bg-gray-600 hover:bg-gray-400 transition duration-300"
              >
                Se connecter
              </Button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <p className="text-red-500 mt-4 text-center font-medium">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 mt-4 text-center font-medium">
                {success}
              </p>
            )}

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-blue-400 hover:underline">
                Mot de passe oublié?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
