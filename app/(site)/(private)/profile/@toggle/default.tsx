import { redirect } from 'next/navigation';

export default function TogglePage() {
  redirect('/profile/own');
  return null;
}
