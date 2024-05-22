/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const MobileNav = ({ toggleNav, setToggleNav, linkObj }) => {
    return (
        <>
            <button className="md:hidden" onClick={() => setToggleNav(!toggleNav)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.25zm0 4.5A.75.75 0 013.75 9h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
            </button>
            <ul className={`${toggleNav ? "md:hidden flex flex-row flex-wrap gap-4 px-2 py-3 items-center justify-evenly bg-white w-full absolute top-[3rem] right-0" : "hidden"}`}>
                <li><Link to={linkObj.homeLink} className="cursor-pointer text-cyan-600 hover:text-cyan-900">Learn more</Link></li>
                <li><Link to={linkObj.signupLink} className="text-cyan-600 cursor-pointer border-2 border-cyan-600 
                py-3 px-4 text-sm lg:text-md hover:text-white hover:bg-cyan-600">Earn money as a Driver</Link>
                </li>
                <li><Link to={linkObj.loginLink} className="text-white cursor-pointer 
                        bg-cyan-600 text-sm lg:text-base py-3 px-4 hover:bg-cyan-700">
                        Login
                        </Link>
                </li>
            </ul>
        </>
    );
};

export default MobileNav;
