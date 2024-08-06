import React from 'react';
import Image from 'next/image';
import logo from "../../public/Learnability (GenAi) logo svg/Logo.svg";

const Logo: React.FC = ({}) => {
  function handleClick() {
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex items-center py-0 my-0">
      <Image onClick={handleClick} src={logo} alt="Learnability AI" layout="intrinsic" className="w-36" />
    </div>
  );
};

export default Logo;
