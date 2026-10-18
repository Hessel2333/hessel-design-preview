var e=`import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Button,
  Dialog,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  Select,
  StatusPill,
  Surface,
  Table,
} from '@hessel-design/ui';
import { useFeedback, useLocalState, usePreferences } from '../lib/preferences';
import { entries } from './data';

type Status = 'pending' | 'approved' | 'rejected';
const initialStatuses: Record<string, Status> = Object.fromEntries(
  entries.map((entry, index) => [
    entry.id,
    index < 3 ? 'pending' : index < 5 ? 'approved' : 'rejected',
  ]),
);
const isStatuses = (value: unknown): value is Record<string, Status> =>
  !!value &&
  typeof value === 'object' &&
  entries.every(
    (entry) =>
      entry.id in value &&
      ['pending', 'approved', 'rejected'].includes((value as Record<string, string>)[entry.id]),
  );

export function AdminExample() {
  const { t } = usePreferences();
  const feedback = useFeedback();
  const [statuses, setStatuses] = useLocalState('review-statuses', initialStatuses, isStatuses);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = entries.filter(
    (entry) =>
      (filter === 'all' || statuses[entry.id] === filter) &&
      \`\${entry.title} \${entry.titleEn} \${entry.author} \${entry.authorEn}\`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedEntry = entries.find((entry) => entry.id === selected);
  function statusLabel(status: Status) {
    return {
      pending: t('待审核', 'Pending'),
      approved: t('已通过', 'Approved'),
      rejected: t('已驳回', 'Rejected'),
    }[status];
  }
  function decide(status: Status) {
    if (!selected) return;
    setStatuses((current) => ({ ...current, [selected]: status }));
    setSelected(null);
    feedback(
      status === 'approved'
        ? t('内容已通过审核', 'Content approved')
        : t('内容已驳回', 'Content rejected'),
    );
  }
  return (
    <div className="example-page admin-example">
      <PageHeader
        title={t('内容审核', 'Content review')}
        description={t('查看投稿，处理待审核内容。', 'Review submissions and resolve the queue.')}
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setStatuses(initialStatuses);
              setQuery('');
              setFilter('all');
              setPage(1);
              feedback(t('审核列表已重置', 'Review list reset'));
            }}
          >
            {t('重置示范', 'Reset example')}
          </Button>
        }
      />
      <Surface className="review-panel">
        <div className="review-panel-heading">
          <h2>
            {t('全部内容', 'All submissions')}
            <span>{filtered.length}</span>
          </h2>
          <div className="review-filters">
            <div className="search-field">
              <Search size={16} />
              <Input
                placeholder={t('搜索标题或作者', 'Search title or author')}
                aria-label={t('搜索标题或作者', 'Search title or author')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              aria-label={t('审核状态', 'Review status')}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">{t('全部状态', 'All statuses')}</option>
              <option value="pending">{t('待审核', 'Pending')}</option>
              <option value="approved">{t('已通过', 'Approved')}</option>
              <option value="rejected">{t('已驳回', 'Rejected')}</option>
            </Select>
          </div>
        </div>
        {visible.length ? (
          <>
            <div className="review-table">
              <Table>
                <caption className="sr-only">{t('投稿审核列表', 'Submissions for review')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('内容', 'Content')}</th>
                    <th scope="col">{t('作者', 'Author')}</th>
                    <th scope="col">{t('状态', 'Status')}</th>
                    <th scope="col">{t('操作', 'Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <strong>{t(entry.title, entry.titleEn)}</strong>
                        <small>
                          {t(entry.category, entry.categoryEn)} · {entry.date}
                        </small>
                      </td>
                      <td>{t(entry.author, entry.authorEn)}</td>
                      <td>
                        <StatusPill
                          tone={
                            statuses[entry.id] === 'pending'
                              ? 'warning'
                              : statuses[entry.id] === 'approved'
                                ? 'success'
                                : 'danger'
                          }
                        >
                          {statusLabel(statuses[entry.id])}
                        </StatusPill>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="compact"
                          onClick={() => setSelected(entry.id)}
                          aria-label={t(\`查看：\${entry.title}\`, \`Review: \${entry.titleEn}\`)}
                        >
                          {t('查看', 'Review')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="review-mobile">
              {visible.map((entry) => (
                <div key={entry.id}>
                  <div>
                    <strong>{t(entry.title, entry.titleEn)}</strong>
                    <p>
                      {t(entry.author, entry.authorEn)} · {entry.date}
                    </p>
                    <StatusPill
                      tone={
                        statuses[entry.id] === 'pending'
                          ? 'warning'
                          : statuses[entry.id] === 'approved'
                            ? 'success'
                            : 'danger'
                      }
                    >
                      {statusLabel(statuses[entry.id])}
                    </StatusPill>
                  </div>
                  <Button variant="ghost" onClick={() => setSelected(entry.id)}>
                    {t('查看', 'Review')}
                  </Button>
                </div>
              ))}
            </div>
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onPageChange={setPage}
              previousLabel={t('上一页', 'Previous')}
              nextLabel={t('下一页', 'Next')}
              label={t('审核列表分页', 'Review list pages')}
            />
          </>
        ) : (
          <EmptyState
            icon={<Search size={20} />}
            title={t('没有符合条件的内容', 'No matching submissions')}
            description={t('调整搜索词或审核状态后重试。', 'Try another search or review status.')}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                  setPage(1);
                }}
              >
                {t('清除筛选', 'Clear filters')}
              </Button>
            }
          />
        )}
      </Surface>
      <Dialog
        open={!!selectedEntry}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={t('审核内容', 'Review submission')}
        description={t(
          '查看内容后，选择审核结果。',
          'Read the submission and choose a review outcome.',
        )}
        closeLabel={t('关闭审核', 'Close review')}
        footer={
          selected ? (
            <>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                {t('稍后处理', 'Review later')}
              </Button>
              <Button variant="danger" onClick={() => decide('rejected')}>
                {t('驳回', 'Reject')}
              </Button>
              <Button onClick={() => decide('approved')}>{t('通过审核', 'Approve')}</Button>
            </>
          ) : null
        }
      >
        {selectedEntry ? (
          <div className="review-detail">
            <StatusPill>{statusLabel(statuses[selectedEntry.id])}</StatusPill>
            <h3>{t(selectedEntry.title, selectedEntry.titleEn)}</h3>
            <p>{t(selectedEntry.description, selectedEntry.descriptionEn)}</p>
            <span>
              {t(selectedEntry.author, selectedEntry.authorEn)} · {selectedEntry.date}
            </span>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
`;export{e as default};