import { COLORS } from '../constants/color';
import { useEffect, useRef, useState } from 'react';
import { MdMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import logo_dark from "../assets/logo-dark.svg";
import logo__small from "../assets/logo-small-dark.svg"
import logo_small_accent from "../assets/logo-small-accent.svg"
import logo_small_dark from "../assets/logo-small-dark.svg"
import { footerLinks } from './Footer';
import { mainSiteBaseUrl as mainUrl } from "../config/env";

const tabs = [
    { name: "Why Endoscopic", path: "/why-endoscopic" },
    { name: "Meet ESINY", path: "/meet-esiny" },
    { name: "Blog", path: "/blog" }
]

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const largLogoRef = useRef<any>(null);
    const smallLogoRef = useRef<any>(null);

    useEffect(() => {
        largLogoRef.current?.decode().catch(() => { });
        smallLogoRef.current?.decode().catch(() => { });

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

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (openMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [openMenu]);

    return (
        <>
            {/* Desktop Header */}
            <header className={`hidden md:flex sticky top-0 left-0 right-0 bg-white px-10 justify-between items-center border-b border-gray-200 z-50 transition-all duration-500 ${scrolled ? " shadow-md" : "pt-10 pb-4"}`}>
                 <Link className='block w-[17%] h-full' to={mainUrl || "/"}>
                
                        <div className="relative w-[100%] h-full" style={{ height: '88px' }}>

                            {/* Full wide logo — visible when NOT scrolled */}
                            <img
                                ref={largLogoRef}
                                src={logo_dark}
                                alt="ESINY"
                                className="absolute top-0 left-0 h-full w-auto transition-opacity duration-500"
                                style={{ opacity: scrolled ? 0 : 1 }}
                            />

                            {/* Small square mark — visible when scrolled */}
                            <img
                                ref={smallLogoRef}
                                src={logo__small}
                                alt="ESINY"
                                className="absolute left-0 transition-opacity duration-500"
                                style={{
                                    height: '28px',
                                    width: 'auto',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    opacity: scrolled ? 1 : 0,
                                }}
                            />

                        </div>

                    </Link>

                <div className="w-[83%] flex justify-evenly items-end">
                    <div className="w-[80%] flex justify-evenly gap-6">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.path}
                                to={`${mainUrl}${tab.path}`}
                                className="transition duration-300 text-[#344856] hover:text-[#02EEFF] px-3 py-2 rounded-md font-semibold text-sm"
                            >
                                {tab.name.toUpperCase()}
                            </Link>
                        ))}
                    </div>

                    <Link
                        to={`${mainUrl}/contact`}
                        className="w-[17%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-2 flex items-center gap-2 transition-all duration-500 border-2 border-white hover:border-[#02EEFF] hover:bg-white text-sm"
                    >
                        CONTACT US
                        <span className="text-xl">→</span>
                    </Link>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 left-0 right-0 bg-white px-6 flex items-center border-b border-gray-200 z-50 py-4">
                <div className="w-[22%]">
                    <Link to={mainUrl || "/"}>
                        {/* Mobile always shows the small square mark */}
                        <img
                            src={logo_small_dark}
                            alt="ESINY"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        />
                    </Link>
                </div>

                <Link
                    to={`${mainUrl}/contact`}
                    className="w-[60%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-4 flex items-center gap-2 transition-all duration-500 border-2 border-white hover:border-[#02EEFF] hover:bg-white text-zinc-700"
                >
                    CONTACT US
                </Link>

                <button onClick={() => setOpenMenu(true)} className="flex-1 flex justify-end">
                    <MdMenu size={30} className="text-zinc-700" />
                </button>

                <div className={`absolute h-screen overflow-hidden top-0 left-0 py-4 px-6 right-0 bg-[#344856] border-b border-gray-200 flex flex-col space-y-4 transition-transform duration-300 ${openMenu ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex flex-row items-center">
                        <div className="w-full flex items-center">
                            <div className="w-[35%]">
                                <Link to={mainUrl || "/"}>
                                    <img src={logo_small_accent} alt="ESINY" className="w-full h-auto" />
                                </Link>
                            </div>
                            <Link
                                to={`${mainUrl}/contact`}
                                className="w-[60%] cursor-pointer bg-[#02EEFF] text-black font-medium tracking-widest rounded-lg justify-center py-4 flex items-center gap-2 transition-all duration-500"
                            >
                                CONTACT US
                            </Link>
                        </div>
                        <button onClick={() => setOpenMenu(false)}>
                            <IoMdClose size={30} className="text-zinc-700" color={COLORS.primary} />
                        </button>
                    </div>

                    <div className="mt-6">
                        {[{ name: "Home", path: mainUrl }, ...tabs].map((tab) => (
                            <Link
                                key={tab.path}
                                to={`${mainUrl}/${tab.path}`}
                                className="transition duration-300 text-[#02EEFF] mb-6 block rounded-md font-semibold text-xl"
                                onClick={() => setOpenMenu(false)}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </div>

                    <hr className="text-[#02EEFF] my-8" />

                    <div className="mt-4">
                        {footerLinks.map((tab) => (
                            <Link
                                key={tab.label}
                                to={`${mainUrl}/${tab.to}`}
                                className="transition duration-300 text-[#02EEFF] mb-6 block rounded-md"
                                onClick={() => setOpenMenu(false)}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;