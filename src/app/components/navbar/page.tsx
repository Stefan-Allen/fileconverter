"use client";
import Link from 'next/link';
import {usePathname} from 'next/navigation'; // Import from next/navigation
import styles from '../../page.module.css'; // Replace with the actual path to your CSS module

// Define the type for the link objects
type LinkType = {
    href: string;
    label: string;
};

// Define the possible paths and their links
const links: Record<string, LinkType[]> = {
    "/": [
        {href: "/converter/imageconverter", label: "Image Converter"},
        //{href: "/pages/settings", label: "Settings"},

    ],
    "/converter/imageconverter": [
        {href: "/", label: "Home"},
        //{href: "/pages/settings", label: "Settings"}
    ],
    //"/pages/settings": [
        //{href: "/converter/imageconverter", label: "Image Converter"},
        //{href: "/", label: "Home"},
    // ]
};

const Navbar = () => {
    const pathname = usePathname(); // Get the current path

    // Get the links based on the current pathname, or use default for '/'
    const currentLinks = links[pathname] || links["/"];

    return (
        <nav className={styles.navbarContainer}>
            <div className={styles.ctaButton}>
                <ul className={styles.navLinks}>
                    {currentLinks.map((link) => (
                        <li
                            key={link.href}
                            className={pathname === link.href ? styles.activeLink : ""}
                        >
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
