import Button from '../Button/Button';
import css from './MessageNoStories.module.css';

interface MessageNoStoriesProps {
  text: string;
  buttonText: string;
  href: string;
}

function MessageNoStories({ text, buttonText, href }: MessageNoStoriesProps) {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>{text}</p>

      <Button size="large" variant="primary" href={href} className={css.btn}>
        {buttonText}
      </Button>
    </div>
  );
}

export default MessageNoStories;
