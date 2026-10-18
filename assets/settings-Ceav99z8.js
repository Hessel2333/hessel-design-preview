var e=`import { useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  Field,
  Input,
  PageHeader,
  Select,
  Surface,
  Switch,
  Textarea,
} from '@hessel-design/ui';
import { useFeedback, useLocalState, usePreferences, type Theme } from '../lib/preferences';

type Profile = { name: string; bio: string; notifications: boolean; digest: boolean };
const initialProfile: Profile = { name: 'Lin', bio: '', notifications: true, digest: false };
const isProfile = (value: unknown): value is Profile =>
  !!value &&
  typeof value === 'object' &&
  'name' in value &&
  typeof value.name === 'string' &&
  'bio' in value &&
  typeof value.bio === 'string' &&
  'notifications' in value &&
  typeof value.notifications === 'boolean' &&
  'digest' in value &&
  typeof value.digest === 'boolean';

export function SettingsExample() {
  const { t, preferences, update } = usePreferences();
  const feedback = useFeedback();
  const [saved, setSaved] = useLocalState('profile', initialProfile, isProfile);
  const [draft, setDraft] = useState(saved);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const changed = JSON.stringify(saved) !== JSON.stringify(draft);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.name.trim().length < 2) {
      setError(true);
      return;
    }
    setError(false);
    setSaving(true);
    setTimeout(() => {
      const normalized = { ...draft, name: draft.name.trim() };
      setSaved(normalized);
      setDraft(normalized);
      setSaving(false);
      feedback(t('设置已保存', 'Settings saved'));
    }, 600);
  }
  return (
    <div className="example-page settings-example">
      <PageHeader
        title={t('账户设置', 'Account settings')}
        description={t('让这里更适合你的习惯。', 'Make this space feel more like you.')}
      />
      <form onSubmit={submit} noValidate>
        <Surface className="settings-panel">
          <h2>{t('个人资料', 'Profile')}</h2>
          <div className="profile-summary">
            <Avatar name={draft.name} size="large" />
            <div>
              <strong>{draft.name || t('你的名字', 'Your name')}</strong>
              <p>
                {t(
                  '把日常里值得留下的事，慢慢收集。',
                  'A quiet collection of things worth keeping.',
                )}
              </p>
            </div>
          </div>
          <Field
            label={t('显示名称', 'Display name')}
            htmlFor="profile-name"
            error={
              error ? t('请填写 2–20 个字符的名称', 'Enter a name with 2–20 characters') : undefined
            }
          >
            <Input
              id="profile-name"
              value={draft.name}
              maxLength={20}
              onChange={(e) => {
                setDraft((current) => ({ ...current, name: e.target.value }));
                setError(false);
              }}
              aria-invalid={error}
              aria-describedby={error ? 'profile-name-error' : undefined}
            />
          </Field>
          <Field
            label={t('个人简介', 'Bio')}
            htmlFor="profile-bio"
            hint={t('最多 120 个字符', 'Up to 120 characters')}
          >
            <Textarea
              id="profile-bio"
              value={draft.bio}
              maxLength={120}
              placeholder={t('简单介绍一下自己', 'A little about you')}
              onChange={(e) => setDraft((current) => ({ ...current, bio: e.target.value }))}
              aria-describedby="profile-bio-hint"
            />
          </Field>
        </Surface>
        <Surface className="settings-panel">
          <h2>{t('外观与通知', 'Appearance & notifications')}</h2>
          <Field label={t('主题', 'Theme')} htmlFor="profile-theme">
            <Select
              id="profile-theme"
              value={preferences.theme}
              onChange={(e) => update({ theme: e.target.value as Theme })}
            >
              <option value="system">{t('跟随系统', 'System')}</option>
              <option value="light">{t('浅色', 'Light')}</option>
              <option value="dark">{t('深色', 'Dark')}</option>
            </Select>
          </Field>
          <div className="setting-row">
            <div>
              <strong>{t('消息通知', 'Notifications')}</strong>
              <p>{t('有新消息时提醒我', 'Let me know about new messages')}</p>
            </div>
            <Switch
              aria-label={t('消息通知', 'Notifications')}
              checked={draft.notifications}
              onCheckedChange={(value) =>
                setDraft((current) => ({ ...current, notifications: value }))
              }
            />
          </div>
          <div className="setting-row">
            <div>
              <strong>{t('每周精选', 'Weekly picks')}</strong>
              <p>{t('每周接收一份阅读推荐', 'A weekly selection of good reads')}</p>
            </div>
            <Switch
              aria-label={t('每周精选', 'Weekly picks')}
              checked={draft.digest}
              onCheckedChange={(value) => setDraft((current) => ({ ...current, digest: value }))}
            />
          </div>
        </Surface>
        <div className="settings-footer">
          <Button variant="ghost" onClick={() => setResetOpen(true)}>
            {t('恢复默认', 'Reset defaults')}
          </Button>
          <div className="dr-actions">
            {changed ? (
              <span className="muted small">{t('有未保存的更改', 'Unsaved changes')}</span>
            ) : null}
            <Button type="submit" loading={saving} disabled={!changed}>
              {t('保存更改', 'Save changes')}
            </Button>
          </div>
        </div>
      </form>
      <Dialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title={t('恢复默认设置？', 'Reset to defaults?')}
        description={t(
          '个人资料和通知偏好将恢复默认，主题将跟随系统。',
          'Your profile and notification preferences will reset. The theme will follow your system.',
        )}
        closeLabel={t('关闭弹窗', 'Close dialog')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              {t('取消', 'Cancel')}
            </Button>
            <Button
              onClick={() => {
                setSaved(initialProfile);
                setDraft(initialProfile);
                update({ theme: 'system' });
                setError(false);
                setResetOpen(false);
                feedback(t('已恢复默认设置', 'Default settings restored'));
              }}
            >
              {t('确认恢复', 'Reset settings')}
            </Button>
          </>
        }
      />
    </div>
  );
}
`;export{e as default};