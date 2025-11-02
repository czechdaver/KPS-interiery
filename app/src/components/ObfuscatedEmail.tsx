import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

interface ObfuscatedEmailProps {
  user: string;
  domain: string;
  className?: string;
  children?: any;
}

export const ObfuscatedEmail = component$<ObfuscatedEmailProps>(({ user, domain, className, children }) => {
  const email = useSignal('');
  const href = useSignal('');

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Decode email on client-side only
    const fullEmail = `${user}@${domain}`;
    email.value = fullEmail;
    href.value = `mailto:${fullEmail}`;
  });

  return (
    <>
      {email.value ? (
        <a href={href.value} class={className}>
          {children || email.value}
        </a>
      ) : (
        <span class={className}>
          {children || 'Načítání...'}
        </span>
      )}
    </>
  );
});
