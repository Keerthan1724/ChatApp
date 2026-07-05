const maskEmail = (email = "") => {
  if (!email.includes("@")) return email;

  const [username, domain] = email.split("@");

  if (username.length <= 3) {
    return `${username[0]}***@${domain}`;
  }

  return (
    username.slice(0, 4) +
    "*".repeat(Math.max(username.length - 4, 4)) +
    "@" +
    domain
  );
};

export default maskEmail;