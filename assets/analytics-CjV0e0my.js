var e=`import { lazy, Suspense, useMemo, useState } from 'react';
import {
  AnalyticsToolbar,
  Button,
  EmptyState,
  PageHeader,
  Select,
  Surface,
  getPeriodRange,
  type AnalyticsToolbarValue,
} from '@hessel-design/ui';
import { usePreferences } from '../lib/preferences';
import {
  analyticsCategories,
  analyticsFirstDate,
  analyticsToday,
  summarizeAnalytics,
} from './analytics-data';
import './analytics.css';

const TrendChart = lazy(() =>
  import('./analytics-chart').then((module) => ({ default: module.TrendChart })),
);
const initialValue: AnalyticsToolbarValue = {
  period: 'month',
  anchorDate: analyticsToday,
  granularity: 'day',
};

export function AnalyticsExample({ standalone = false }: { standalone?: boolean }) {
  const { t, preferences } = usePreferences();
  const [value, setValue] = useState(initialValue);
  const [category, setCategory] = useState('all');
  const range = getPeriodRange(value.period, value.anchorDate, value.range);
  const summary = useMemo(
    () => summarizeAnalytics(range, category, value.granularity),
    [range?.from, range?.to, category, value.granularity],
  );
  const format = new Intl.NumberFormat(preferences.locale);
  const start = range?.from && range.from > analyticsFirstDate ? range.from : analyticsFirstDate;
  const end = range?.to && range.to < analyticsToday ? range.to : analyticsToday;
  return (
    <div
      className={\`example-page analytics-example\${standalone ? ' analytics-example--standalone' : ''}\`}
    >
      <PageHeader
        title={t('内容分析', 'Content analytics')}
        description={t(
          '了解内容的阅读与收藏趋势。',
          'Understand how your content is read and saved.',
        )}
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setValue(initialValue);
              setCategory('all');
            }}
          >
            {t('重置筛选', 'Reset filters')}
          </Button>
        }
      />
      <AnalyticsToolbar
        value={value}
        onValueChange={setValue}
        minDate={analyticsFirstDate}
        maxDate={analyticsToday}
        locale={preferences.locale}
        filters={
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label={t('内容分类', 'Content category')}
          >
            <option value="all">{t('全部分类', 'All categories')}</option>
            {analyticsCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.zh, item.en)}
              </option>
            ))}
          </Select>
        }
      />
      <div className="analytics-summary" aria-live="polite" aria-atomic="true">
        <span>
          {start} — {end}
        </span>
        <span>{t(\`共 \${summary.days} 天\`, \`\${summary.days} days\`)}</span>
      </div>
      <div className="analytics-metrics">
        <Surface variant="muted">
          <span>{t('阅读次数', 'Views')}</span>
          <strong>{format.format(summary.views)}</strong>
        </Surface>
        <Surface variant="muted">
          <span>{t('收藏次数', 'Saves')}</span>
          <strong>{format.format(summary.saves)}</strong>
        </Surface>
        <Surface variant="muted">
          <span>{t('收藏率', 'Save rate')}</span>
          <strong>
            {new Intl.NumberFormat(preferences.locale, {
              style: 'percent',
              maximumFractionDigits: 1,
            }).format(summary.views ? summary.saves / summary.views : 0)}
          </strong>
        </Surface>
      </div>
      <Surface className="analytics-trend">
        <div className="analytics-chart-heading">
          <h2>{t('阅读趋势', 'Reading trend')}</h2>
          <span>{t('阅读次数', 'Views')}</span>
        </div>
        {summary.points.length ? (
          <Suspense
            fallback={
              <div
                className="analytics-chart analytics-chart-loading"
                role="status"
                aria-label={t('正在加载图表', 'Loading chart')}
              >
                <span className="dr-spinner" />
              </div>
            }
          >
            <TrendChart points={summary.points} locale={preferences.locale} />
          </Suspense>
        ) : (
          <EmptyState
            title={t('暂无数据', 'No data')}
            action={
              <Button variant="secondary" onClick={() => setValue(initialValue)}>
                {t('返回本月', 'Back to this month')}
              </Button>
            }
          />
        )}
      </Surface>
    </div>
  );
}
`;export{e as default};