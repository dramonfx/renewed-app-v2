
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Permanently redirect users from root URL (/) to /book
  redirect('/book');
}
