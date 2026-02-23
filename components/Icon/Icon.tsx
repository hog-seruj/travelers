import {SVGProps} from 'react';

type IconProps=SVGProps<SVGSVGElement> & {
    name: string;
    className?: string;
}

export default function Icon({name, className, ...rest}: IconProps) {
    return (
        <svg className={className} {...rest}>
            <use href={`/images/sprite.svg#${name}`} />
        </svg>
    )
};
