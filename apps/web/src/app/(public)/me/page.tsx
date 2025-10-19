import PageTitle from '@/components/sections/PageTitle';
import React from 'react';

function MePage() {
  return (
    <div>
      <PageTitle
        title="Account"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/me' },
        ]}
      />
      MePage
    </div>
  );
}

export default MePage;
