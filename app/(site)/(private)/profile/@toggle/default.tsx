import Link from 'next/link';

export default function TogglePage() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/profile/saved">Збережені історії</Link>
        </li>
        <li>
          <Link href="/profile/own">Мої історії</Link>
        </li>
      </ul>
    </div>
  );
}
