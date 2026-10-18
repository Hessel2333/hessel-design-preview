var e=`import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark } from 'lucide-react';
import { Avatar, Button, buttonClass } from '@hessel-design/ui';
import { useFeedback, useLocalState, usePreferences } from '../lib/preferences';
import { entries, isStringArray } from './data';

export function DetailExample({ standalone = false }: { standalone?: boolean }) {
  const { t, preferences } = usePreferences();
  const feedback = useFeedback();
  const [params] = useSearchParams();
  const entry = entries.find((item) => item.id === params.get('item')) || entries[0];
  const next = entries[(entries.indexOf(entry) + 1) % entries.length];
  const [saved, setSaved] = useLocalState<string[]>('saved-items', [], isStringArray);
  const isSaved = saved.includes(entry.id);
  return (
    <div className="example-page detail-example">
      <Link className="quiet-link" to={standalone ? '/preview/browse' : '/examples/browse'}>
        <ArrowLeft size={15} />
        {t('返回发现', 'Back to discover')}
      </Link>
      <div className="article-heading">
        <span className="article-category">
          {t(entry.category, entry.categoryEn)} · {entry.time} {t('分钟阅读', 'min read')}
        </span>
        <h1>{t(entry.title, entry.titleEn)}</h1>
        <p>{t(entry.description, entry.descriptionEn)}</p>
        <div className="article-byline">
          <div>
            <Avatar name={t(entry.author, entry.authorEn)} />
            <span>
              {t(entry.author, entry.authorEn)}
              <small>
                {new Intl.DateTimeFormat(preferences.locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(\`\${entry.date}T00:00:00\`))}
              </small>
            </span>
          </div>
          <Button
            variant="secondary"
            aria-pressed={isSaved}
            onClick={() => {
              setSaved((current) =>
                isSaved ? current.filter((id) => id !== entry.id) : [...current, entry.id],
              );
              feedback(
                isSaved
                  ? t('已取消收藏', 'Removed from saved items')
                  : t('已加入收藏', 'Added to saved items'),
              );
            }}
          >
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? t('已收藏', 'Saved') : t('收藏', 'Save')}
          </Button>
        </div>
      </div>
      <div className={\`article-cover entry-cover--\${entry.coverStyle}\`}>
        <span>{t('日常选集', 'Everyday collection')}</span>
        <strong>{t(entry.cover, entry.coverEn)}</strong>
        <span>{t('观察 · 记录 · 思考', 'Observe · Record · Reflect')}</span>
      </div>
      <div className="article-body">
        <p>
          {t(
            '有些改变，并不需要一个盛大的开始。它可以是清晨拉开窗帘，整理桌面的一角，或者为自己留出一段不被打断的时间。日常的质感，往往来自这些很小的选择。',
            'Some changes do not need a grand beginning. They might start with opening the curtains, clearing a corner of your desk, or keeping a little uninterrupted time for yourself. The texture of everyday life often comes from these small choices.',
          )}
        </p>
        <h2>{t('给注意力一个落点', 'Give your attention a place to rest')}</h2>
        <p>
          {t(
            '当周围的信息变少，眼前的事情就变得清楚。我们不必填满每一个空隙，也不必急着回应每一次提醒。试着把一件事情做完，再轻轻地开始下一件。',
            'When there is less information around us, what is in front of us becomes clearer. We do not need to fill every gap or answer every notification. Try finishing one thing, then gently beginning the next.',
          )}
        </p>
        <blockquote>
          {t(
            '留白不是空无一物，而是为真正重要的事留出位置。',
            'Space is not the absence of things. It is room for what matters.',
          )}
        </blockquote>
        <p>
          {t(
            '从今天起，选一个你喜欢的时刻，把它留给自己。读几页书，走一小段路，或者只看一会儿窗外。让生活拥有一点自己的节奏。',
            'Choose a moment today and keep it for yourself. Read a few pages, take a short walk, or simply look out of the window. Let life find a rhythm of its own.',
          )}
        </p>
      </div>
      <div className="next-article">
        <span>{t('继续阅读', 'Read next')}</span>
        <Link
          className={buttonClass('ghost')}
          to={\`\${standalone ? '/preview/detail' : '/examples/detail'}?item=\${next.id}\`}
        >
          {t(next.title, next.titleEn)}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
`;export{e as default};