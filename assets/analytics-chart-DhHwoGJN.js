var e=`import { useEffect, useRef } from 'react';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, AriaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { parseISODate } from '@hessel-design/ui';
import type { AnalyticsPoint } from './analytics-data';

use([LineChart, GridComponent, TooltipComponent, AriaComponent, CanvasRenderer]);

export function TrendChart({ points, locale }: { points: AnalyticsPoint[]; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const chart = init(element);
    const draw = () => {
      const css = getComputedStyle(document.documentElement);
      const color = (token: string) => \`hsl(\${css.getPropertyValue(\`--\${token}\`).trim()})\`;
      chart.setOption({
        animation: !matchMedia('(prefers-reduced-motion: reduce)').matches,
        animationDuration: 180,
        aria: {
          enabled: true,
          label: {
            description: locale.startsWith('zh')
              ? \`阅读趋势，共 \${points.length} 个统计周期；详细数值见下方数据明细。\`
              : \`Reading trend across \${points.length} periods. Detailed values are available in the data table below.\`,
          },
        },
        grid: {
          left: 8,
          right: 16,
          top: 20,
          bottom: 8,
          outerBoundsMode: 'same',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: color('surface-panel'),
          borderColor: color('border'),
          textStyle: { color: color('foreground') },
          confine: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: points.map((point) => point.date),
          axisLine: { lineStyle: { color: color('border') } },
          axisTick: { show: false },
          axisLabel: {
            color: color('muted-foreground'),
            hideOverlap: true,
            formatter: (date: string) =>
              new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(
                parseISODate(date),
              ),
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: { color: color('muted-foreground') },
          splitLine: { lineStyle: { color: color('border'), type: 'dashed' } },
        },
        series: [
          {
            name: locale.startsWith('zh') ? '阅读次数' : 'Views',
            type: 'line',
            data: points.map((point) => point.views),
            showSymbol: points.length < 4,
            symbolSize: 7,
            lineStyle: { width: 2.5, color: color('primary') },
            itemStyle: { color: color('primary') },
          },
        ],
      });
    };
    draw();
    const resize = new ResizeObserver(() => chart.resize());
    resize.observe(element);
    const theme = new MutationObserver(draw);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-palette'],
    });
    return () => {
      resize.disconnect();
      theme.disconnect();
      chart.dispose();
    };
  }, [points, locale]);
  return (
    <div
      ref={ref}
      className="analytics-chart"
      role="img"
      aria-label={
        locale.startsWith('zh')
          ? \`阅读趋势，共 \${points.length} 个统计周期\`
          : \`Reading trend across \${points.length} periods\`
      }
    />
  );
}
`;export{e as default};