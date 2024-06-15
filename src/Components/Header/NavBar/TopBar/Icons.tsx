import { FaLinkedinIn } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialIcon {
  icon: JSX.Element;
}

export const redes: SocialIcon[] = [
  { icon: <FaFacebookSquare className="text-white" /> },
  { icon: <FaInstagram className="text-white" /> },
  { icon: <FaLinkedinIn className="text-white" /> },
  { icon: <FaYoutube className="text-white" /> },
  { icon: <FaXTwitter className="text-white" /> },
];
