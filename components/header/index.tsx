import Image from "next/image";
import Link from "next/link";


import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              priority={true}
              src="/assets/logo.png"
              width={48}
              height={48}
              alt={`Provenancetracker logo`}
            />
            <span className="hidden lg:block text-foreground font-bold text-2xl ml-3">
              {"GridTracker"}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
