import * as React from 'react';
import { IHeaderProps } from './IHeaderProps';

export default function Header(props: IHeaderProps): JSX.Element {
    const { img, children } = props; 
    return (
        <header>
            <img {...img} />
            {children}
        </header>
    );
}