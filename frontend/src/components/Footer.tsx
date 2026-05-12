import { CiLocationOn } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Logo_light from "../assets/logo-light.svg";
import { mainSiteBaseUrl as mainUrl } from "../config/env";

export const footerLinks = [
    { label: "FAQ", to: "/faqs" },
    { label: "Reviews", to: "/reviews" },
    { label: "Contact Us", to: "/contact" },
    { label: "SITEMAP", to: "/sitemap-0.xml" },
    { label: "Media Page", to: "/media-page" },
    { label: "What We Treat", to: "/what-we-treat" },
    { label: "Areas We Serve", to: "/areas-we-serve" },
    { label: "Terms Of Service", to: "/terms" },
    { label: "Patient Testimonials", to: "/testimonial" },
];

export const popularTopics = [
    {
        label: "MINIMALLY INVASIVE SPINE SURGEON",
        to: "/minimally-invasive-spine-surgeon-new-york",
    },
    {
        label: "ENDOSCOPIC SPINE SURGEON",
        to: "/endoscopic-spine-surgeon-new-york",
    },
    {
        label: "SPINE SURGEON NEW YORK",
        to: "/spine-surgeon-new-york",
    },
];

export const socialLinks = [
    {
        label: "Youtube @theESINY",
        to: "https://www.youtube.com/@theesiny",
    },
    {
        label: "Dr. Sanjay Konakondla @thespineboss",
        to: "https://www.tiktok.com/@thespineboss",
    },
    {
        label: "Dr. Albert E. Telfeian @nycspine",
        to: "https://www.tiktok.com/@nycspine",
    },
];

const Footer = () => {
    return (
        <footer className="bg-[#2E3F4A] text-gray-300 px-6 md:px-10 pt-16 pb-8 relative" >
            <div className="grid md:grid-cols-3 gap-10">

                <div>
                    <img src={Logo_light} alt="" className="w-[138px] mb-6 h-auto" />

                    <p className="text-xs mb-3">
                        The Endoscopic Spine Institute of New York
                    </p>

                    <div className="text-xs flex gap-2 items-center mb-2">
                        <CiLocationOn color="white" />
                        <Link to={"https://maps.app.goo.gl/AijhAv54xbaBrSNe7"} className={`hover:text-[#02EEFF] hover:underline transition`}>
                            215 E 77th St, New York, NY 10075
                        </Link>
                    </div>

                    <div className="text-xs flex gap-2 items-center mb-2">
                        <IoCallOutline />
                        <Link to={"tel:+15187086300"} className={`hover:text-[#02EEFF] hover:underline transition`}>
                            +1 518-708-6300
                        </Link>
                    </div>

                    {/* MAP */}
                    <div className="rounded-lg w-full overflow-hidden">
                        <iframe className="h-40" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48344.16710893155!2d-73.95727!3d40.772791!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258bfa4af4011%3A0x8f6879a20a517548!2s215%20E%2077th%20St%2C%20New%20York%2C%20NY%2010075!5e0!3m2!1sen!2sus!4v1777626634159!5m2!1sen!2sus" height="450" width={"100%"} loading="lazy" ></iframe>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">ABOUT</h3>
                    <ul className="space-y-2 text-sm">
                        {footerLinks.map((item) => (
                            <li key={item.label}>
                                <Link
                                    to={`${mainUrl}${item.to}`}
                                    className={`text-gray-100 text-sm hover:text-[#02EEFF] hover:underline transition`}
                                >
                                    {item.label.toUpperCase()}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT SECTION */}
                <div>
                    <h3 className="text-white font-semibold mb-4">FOLLOW US</h3>

                    <ul className="space-y-3 text-sm mb-6">
                        {socialLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={`${link.to}`}
                                    className={`text-gray-100 text-sm hover:text-[#02EEFF] hover:underline  transition`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-white font-semibold mb-3">
                        POPULAR TOPICS
                    </h3>

                    <ul className="space-y-2 text-sm">
                        {
                            popularTopics.map((topic) => (
                                <li key={topic.label}>
                                    <Link
                                        to={`${mainUrl}${topic.to}`}
                                        className={`text-gray-100 text-sm hover:text-[#02EEFF] hover:underline  transition`}
                                    >
                                        {topic.label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-gray-500 mt-10 pt-6 text-xs">
                <p>
                    The Endoscopic Spine Institute of New York© 2026
                </p>
                <Link to={`${mainUrl}/terms-of-service`} className="underline cursor-pointer block mt-2">
                    TERMS & CONDITIONS
                </Link>
            </div>

        </footer >
    );
}

export default Footer;