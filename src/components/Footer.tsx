import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from 'react-icons/fa'

const socialLinks = [
  { href: 'https://discord.com', icon: <FaDiscord />, name: 'Discord' },
  { href: 'https://twitter.com', icon: <FaTwitter />, name: 'Twitter' },
  { href: 'https://youtube.com', icon: <FaYoutube />, name: 'YouTube' },
  { href: 'https://medium.com', icon: <FaMedium />, name: 'Medium' }
]

export default function Footer() {
  return (
    <footer className="w-screen bg-[#5542ff] py-4 text-black">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          © Nova {new Date().getFullYear()}. All rights reserved
        </p>

        <div className="flex justify-center gap-4  md:justify-start">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors duration-500 ease-in-out hover:text-white"
              aria-label={`Visite nossa página no ${link.name}`}
            >
              {link.icon}
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>

        <a
          href="#privacy-policy"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}
