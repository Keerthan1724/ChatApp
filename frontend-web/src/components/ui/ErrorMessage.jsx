const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-medium text-error animate-fadeIn">
      {error}
    </p>
  );
};

export default ErrorMessage;