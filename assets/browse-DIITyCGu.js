var e=`import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Search, X } from 'lucide-react';
import { Button, EmptyState, Input, PageHeader } from '@hessel-design/ui';
import { useFeedback, useLocalState, usePreferences } from '../lib/preferences';
import { entries, isStringArray, type Entry } from './data';

export function EntryCard({
  entry,
  detailPath,
  saved,
  onSave,
}: {
  entry: Entry;
  detailPath: string;
  saved: boolean;
  onSave: () => void;
}) {
  const { t } = usePreferences();
  return (
    <article className="entry-card">
      <Link
        className={\`entry-cover entry-cover--\${entry.coverStyle}\`}
        to={\`\${detailPath}?item=\${entry.id}\`}
        aria-label={t(entry.title, entry.titleEn)}
      >
        <span className="cover-edition">{t('日常选集', 'Everyday collection')}</span>
        <strong>{t(entry.cover, entry.coverEn)}</strong>
        <span className="cover-bottom">
          {t('观察 · 记录 · 思考', 'Observe · Record · Reflect')}
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="entry-card-meta">
        <span>
          {t(entry.category, entry.categoryEn)} · {entry.time} {t('分钟', 'min read')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            saved
              ? t(\`取消收藏：\${entry.title}\`, \`Unsave: \${entry.titleEn}\`)
              : t(\`收藏：\${entry.title}\`, \`Save: \${entry.titleEn}\`)
          }
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </Button>
      </div>
      <Link className="entry-card-title" to={\`\${detailPath}?item=\${entry.id}\`}>
        {t(entry.title, entry.titleEn)}
      </Link>
      <p>{t(entry.description, entry.descriptionEn)}</p>
    </article>
  );
}

export function BrowseExample({ standalone = false }: { standalone?: boolean }) {
  const { t } = usePreferences();
  const feedback = useFeedback();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [saved, setSaved] = useLocalState<string[]>('saved-items', [], isStringArray);
  const categories = [
    ['全部', 'All'],
    ['生活', 'Living'],
    ['设计', 'Design'],
    ['阅读', 'Reading'],
    ['已收藏', 'Saved'],
  ];
  const filtered = entries.filter(
    (entry) =>
      (category === '全部' ||
        category === entry.category ||
        (category === '已收藏' && saved.includes(entry.id))) &&
      \`\${entry.title} \${entry.titleEn} \${entry.description} \${entry.descriptionEn}\`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function toggleSave(entry: Entry) {
    const exists = saved.includes(entry.id);
    setSaved((current) =>
      exists ? current.filter((id) => id !== entry.id) : [...current, entry.id],
    );
    feedback(
      exists
        ? t('已取消收藏', 'Removed from saved items')
        : t('已加入收藏', 'Added to saved items'),
    );
  }
  return (
    <div className="example-page browse-example">
      <PageHeader
        title={t('发现值得读的内容', 'Something worth reading')}
        description={t(
          '设计、阅读，还有日常里的好时刻。',
          'Design, reading, and the good moments in between.',
        )}
      />
      <div className="browse-toolbar">
        <div
          className="category-tabs"
          role="group"
          aria-label={t('内容分类', 'Content categories')}
        >
          {categories.map(([zh, en]) => (
            <button key={zh} aria-pressed={category === zh} onClick={() => setCategory(zh)}>
              {t(zh, en)}
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={16} />
          <Input
            aria-label={t('搜索内容', 'Search content')}
            placeholder={t('搜索内容', 'Search content')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button aria-label={t('清空搜索', 'Clear search')} onClick={() => setQuery('')}>
              <X size={14} />
            </button>
          ) : null}
        </div>
      </div>
      {filtered.length ? (
        <div className="entry-grid">
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              detailPath={standalone ? '/preview/detail' : '/examples/detail'}
              saved={saved.includes(entry.id)}
              onSave={() => toggleSave(entry)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={20} />}
          title={t('没有找到相关内容', 'No matching content')}
          description={t(
            '试试其他关键词，或查看全部内容。',
            'Try a different search or browse everything.',
          )}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setCategory('全部');
              }}
            >
              {t('查看全部', 'View all')}
            </Button>
          }
        />
      )}
    </div>
  );
}
`;export{e as default};