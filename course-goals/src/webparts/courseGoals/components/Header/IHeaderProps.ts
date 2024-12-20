import { ReactNode } from "react";

export interface IHeaderProps {
    img: {
        src: string; 
        alt: string;
    }
    children: ReactNode;
}