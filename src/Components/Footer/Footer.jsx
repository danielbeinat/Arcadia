import { FaSquareInstagram } from "react-icons/fa6";

import { FaFacebookSquare } from "react-icons/fa";

import { FaSquareXTwitter } from "react-icons/fa6";

import { FaLinkedin } from "react-icons/fa6";




export const Footer = () => {
    return <>

        <footer className="flex flex-col md:flex-row items-center gap-5 justify-between px-10 py-10 bg-gradient-to-tr from-gray-700 to-gray-900 ">
            <div className="flex gap-4 items-center">

                <FaSquareInstagram className="text-2xl text-white" />
                <FaFacebookSquare className="text-2xl text-white" />
                <FaSquareXTwitter className="text-2xl text-white" />
                <FaLinkedin className="text-2xl text-white" />

            </div>
            <div className="text-center">
                <h1 className="text-white">Copyright 2024 © Todos los Derechos Reservados - Diseño: Daniel Beinat</h1>
            </div>
        </footer>




    </>;
};
