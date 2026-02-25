import {SVGProps} from 'react';

type IconProps=SVGProps<SVGSVGElement> & {
    name?: string;   // для іконки зі спрайту
  src?: string;    // для окремого SVG-файла
  useSprite?: boolean;  // вибір між спрайтом і окремим файлом
}


export default function Icon({ name, src, useSprite = true, className, ...rest }: IconProps) {
  // Якщо потрібно використовувати спрайт
  if (useSprite && name) {
    return (
      <svg className={className} {...rest}>
        <use href={`/images/sprite.svg#${name}`} />
      </svg>
    );
  }

  // Якщо потрібно завантажити окремий SVG файл
  if (src) {
    return (
      <svg className={className} {...rest}>
        <use href={src} />
      </svg>
    );
  }

  return null; // Якщо нічого не передано
}