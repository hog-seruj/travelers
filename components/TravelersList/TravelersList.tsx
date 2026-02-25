import css from './TravelersList.module.css';
import Card from '../Card/Card';
import { User } from '@/types/user';

interface TravelersListProps {
  users: User[];
}

export default function TravelersList({ users }: TravelersListProps) {
  return (
    <div className={css.wrapper}>
      <ul className={css.list}>
        {users?.map((user) => (
          <li key={user._id} className={css.item}>
            <Card user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
}
