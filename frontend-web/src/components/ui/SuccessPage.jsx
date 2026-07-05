import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const SuccessPage = ({
  illustration,
  title,
  description,
  buttonText,
  onButtonClick,
  autoClose = 0, 
}) => {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(autoClose / 1000));

  useEffect(() => {
    if (!autoClose || !onButtonClick) return;

    const timeout = setTimeout(() => {
      onButtonClick();
    }, autoClose);

    return () => clearTimeout(timeout);
  }, [autoClose, onButtonClick]);

  useEffect(() => {
    if (!autoClose || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClose, secondsLeft]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 py-8 md:py-12">
      <div className="w-full max-w-xl text-center px-2">
        {illustration && (
          <img
            src={illustration}
            alt={title}
            className="mx-auto mb-6 md:mb-10 h-40 sm:h-52 md:h-60 w-auto object-contain"
          />
        )}

        <h1
          className="mb-4 md:mb-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text"
          style={{
            fontFamily: "var(--font-display)",
          }}
        >
          {title}
        </h1>

        <div className="mx-auto mb-8 md:mb-10 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-text-muted space-y-4">
          <div className="whitespace-pre-line px-1">{description}</div>

          {autoClose > 0 && (
            <div className="pt-1">
              <p className="text-xs sm:text-sm text-text-muted font-medium bg-surface py-1.5 px-3 rounded-xl inline-block border border-border/40 shadow-sm">
                Redirecting in{" "}
                <span className="text-primary font-bold tabular-nums">
                  {secondsLeft}
                </span>{" "}
                second{secondsLeft !== 1 ? "s" : ""}...
              </p>
            </div>
          )}
        </div>

        {buttonText && (
          <div className="mx-auto w-full max-w-xs px-4 sm:px-0">
            <Button onClick={onButtonClick} className="w-full">
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SuccessPage;