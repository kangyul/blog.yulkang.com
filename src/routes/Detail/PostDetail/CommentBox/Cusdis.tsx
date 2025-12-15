'use client';

import Script from 'next/script';
import { useEffect, useMemo } from 'react';

type Props = {
  id: string;
  slug: string;
  title: string;
};

export default function Cusdis({ id, slug, title }: Props) {
  const host = 'https://cusdis.com';

  const resolved = useMemo(() => {
    if (typeof window === 'undefined') {
      // SSR 시점에는 URL을 모르니 빈 값으로 두고,
      // 클라이언트에서 CUSDIS.renderTo로 다시 렌더링되며 채워집니다.
      return { url: '', id: id || slug, title: title || '' };
    }
    return {
      url: window.location.href,
      // 댓글 스레드를 “포스트 단위로 고정”시키는 핵심 키
      id: id || slug || window.location.pathname,
      title: title || document.title
    };
  }, [id, slug, title]);

  useEffect(() => {
    const w = window as any;
    if (w.CUSDIS && typeof w.CUSDIS.renderTo === 'function') {
      w.CUSDIS.renderTo('#cusdis_thread');
    }
  }, [resolved.id, resolved.url, resolved.title]);

  return (
    <>
      <div
        id="cusdis_thread"
        data-host={host}
        data-app-id={process.env.NEXT_PUBLIC_CUSDIS_APP_ID}
        data-page-id={resolved.id}
        data-page-url={resolved.url}
        data-page-title={resolved.title}
        data-theme="auto"
      />
      <Script strategy="afterInteractive" src={`${host}/js/cusdis.es.js`} />
    </>
  );
}