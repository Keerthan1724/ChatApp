import logo from "@/assets/logo.png";

const Navbar = () => {
  
  return (
    <header className="flex h-15 items-center bg-background px-5">

      <img
        src={logo}
        alt="QuickChat"
        className="h-9 w-auto"
      />

    </header>
  );
};

export default Navbar;