'use client';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/common/Editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const EditorClient = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
  return (
    <>
      <Editor content={content} onChange={onChange} />
    </>
  );
}



export default EditorClient;