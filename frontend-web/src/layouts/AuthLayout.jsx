import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

import BackButton from "../components/ui/BackButton";
import { pushNavigationHistory } from "@/utils/flowGuard";

const AuthLayout = ({
  children,

  heading,
  subheading,
  illustration,
  title,
  subtitle,

  formHeading,
  formSubheading,

  authError,
}) => {
  const location = useLocation();

  useEffect(() => {
    pushNavigationHistory(location.pathname, {
      skipPaths: [
        "/email-verification-success",
        "/registration-success",
        "/reset-success",
      ],
    });
  }, [location.pathname]);

  return (
    <main className="min-h-screen lg:h-screen bg-background lg:grid lg:grid-cols-2 lg:overflow-hidden">

      {/* LEFT SIDE */}
      <section className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary via-primary to-primary-dark px-20 text-white h-full overflow-y-auto">

        <BackButton />

        <div className="space-y-3 text-center mb-10">
          <h2
            className="text-4xl lg:text-5xl font-bold tracking-widest leading-tight text-green-700"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heading}
          </h2>

          <p className="mx-auto max-w-md text-base lg:text-lg leading-7 text-white/80">
            {subheading}
          </p>
        </div>

        {illustration && (
          <img
            src={illustration}
            alt=""
            className="mx-auto mb-10 max-h-[300px] xl:max-h-[340px] object-contain"
          />
        )}

        <h1
          className="mb-5 text-4xl xl:text-5xl text-orange-900 font-bold leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>

        <p className="max-w-md text-base xl:text-lg leading-8 text-teal-100">
          {subtitle}
        </p>
      </section>

      {/* RIGHT SIDE */}
      <section className="relative h-full bg-white px-6 md:px-10 overflow-y-auto">

        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm w-full flex justify-center py-2 shrink-0">
          <img
            src={logo}
            alt="QuickChat"
            className="h-10 sm:h-12 lg:h-14 object-contain"
          />
        </div>

        <div className="w-full max-w-md mx-auto pt-28 sm:pt-32 pb-8 flex items-start justify-center">
          <div className="w-full">

            {formHeading && (
              <div className="mb-6 text-center">
                <h2
                  className="text-2xl sm:text-5xl font-bold tracking-tight text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formHeading}
                </h2>

                {formSubheading && (
                  <p className="mt-1.5 text-sm text-text-muted">
                    {formSubheading}
                  </p>
                )}
              </div>
            )}

            {authError && (
              <div className="rounded-xl bg-error/10 p-3 text-center text-sm font-medium text-error mb-4">
                {authError}
              </div>
            )}

            {children}

          </div>
        </div>

      </section>
    </main>
  );
};

export default AuthLayout;