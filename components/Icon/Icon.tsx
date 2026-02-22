type IconProps = {
  name: string;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
};

export default Icon;
