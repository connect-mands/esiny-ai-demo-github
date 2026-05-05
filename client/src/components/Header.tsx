const mainUrl = import.meta.env.VITE_MAIN_URL;

const tabs = [
    { name: "Why Endoscopic", path: "/why-endoscopic" },
    { name: "Meet ESINY", path: "/meet-esiny" },
    { name: "Blog", path: "/blog" }
]

import { COLORS } from '../constants/color';
import { useEffect, useState } from 'react';
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import logo_dark from "../assets/logo-dark.svg";
import logo__small from "../assets/logo-small-dark.svg"
import logo_small_accent from "../assets/logo-small-accent.svg"
import logo_small_dark from "../assets/logo-small-dark.svg"
import { footerLinks } from './Footer';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 0);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    useEffect(() => {
        if (openMenu) {
            document.body.style.overflow = "hidden";
        }
    }, [openMenu]);



    return (
        <>
            <header className={`hidden md:flex sticky top-0 left-0 right-0 bg-white px-10 justify-between items-center border-b border-gray-200 z-50 transition-all duration-500 ${scrolled ? "py-4 shadow-md" : "pt-10 pb-4"}`}>
                <div className="w-[17%]">
                    <Link to={mainUrl || "/"}>
                        <img src={!scrolled ? logo_dark : logo__small} alt="" className={`w-${scrolled ? '16' : 'full'} h-auto`} />
                    </Link>
                </div>

                <div className="w-[83%] flex justify-between items-center">
                    <div className="w-[80%] flex justify-evenly gap-6">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.path}
                                to={`${mainUrl}/${tab.path}`}
                                className={`transition duration-300 hover:text-[#02EEFF] px-3 py-2 rounded-md  font-medium text-sm`}
                            >
                                {tab.name.toUpperCase()}
                            </Link>
                        ))}
                    </div>

                    <Link to={`${mainUrl}/contact`} className={`w-[17%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-2 flex items-center gap-2 transition-all duration-500 border-2 border-white hover:border-[#02EEFF] hover:bg-white text-sm`} >
                        CONTACT US
                        <span className="text-xl">→</span>
                    </Link>
                </div>
            </header>

            <header className={`md:hidden sticky top-0 left-0 right-0 bg-white px-6 flex items-center border-b border-gray-200 z-50 transition-all duration-500 py-4`}>
                <div className="w-[22%]">
                    <Link to={mainUrl || "/"}>
                        <img src={logo_small_dark} alt="" className="w-full h-auto" />
                    </Link>
                </div>

                <Link to={`${mainUrl}/contact`} className={`w-[60%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-4 flex items-center gap-2 transition-all duration-500 border-2 border-white hover:border-[#02EEFF] hover:bg-white text-zinc-700`} >
                    CONTACT US
                </Link>

                <button onClick={() => setOpenMenu(true)} className='flex-1 flex justify-end'>
                    <MdMenu size={30} className='text-zinc-700' />
                </button>

                <div className={`absolute h-screen overflow-hidden top-0 left-0 py-4 px-6 right-0 bg-[#344856] border-b border-gray-200 flex flex-col py-4 space-y-4 transition-transform duration-300 ${openMenu ? "translate-x-0" : "translate-x-full"}`}>
                    <div className='flex flex-row items-center'>
                        <div className='w-full flex items-center'>
                            <div className="w-[35%]">
                                <Link to={mainUrl || "/"}>
                                    <img src={logo_small_accent} alt="" className="w-full h-auto" />
                                </Link>
                            </div>
                            <Link to={`${mainUrl}/contact`} className={`w-[60%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-4 flex items-center gap-2 transition-all duration-500`} >
                                CONTACT US
                            </Link>


                        </div>
                        <button onClick={() => setOpenMenu(false)}>
                            <IoMdClose size={30} className='text-zinc-700' color={COLORS.primary} />
                        </button>
                    </div>

                    <div className='mt-6'>
                        {[{ name: "Home", path: mainUrl }, ...tabs].map((tab) => (
                            <Link
                                key={tab.path}
                                to={`${mainUrl}/${tab.path}`}
                                className={`transition duration-300 text-[#02EEFF] mb-6 block rounded-md font-semibold text-xl`}
                                onClick={() => setOpenMenu(false)}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </div>

                    <hr className="text-[#02EEFF] my-8" />

                    <div className='mt-4'>
                        {
                            footerLinks.map((tab) => (
                                <Link
                                    key={tab.label}
                                    to={`${mainUrl}/${tab.to}`}
                                    className={`transition duration-300 text-[#02EEFF] mb-6 block rounded-md `}
                                    onClick={() => setOpenMenu(false)}
                                >
                                    {tab.label}
                                </Link>
                            ))
                        }
                    </div>
                </div>

            </header>

        </>
    )
}

export default Header;