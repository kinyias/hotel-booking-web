import PageTitle from '@/components/sections/PageTitle';
import React from 'react';

function MePage() {
  return (
    <div>
      <PageTitle
        title="Tài khoản của tôi"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tài khoản', href: '/me' },
        ]}
      />
      MePage
    </div>
  );
}

export default MePage;
