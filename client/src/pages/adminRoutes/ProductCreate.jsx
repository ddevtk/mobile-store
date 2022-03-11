import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import React from 'react';
import AdminNav from '../../components/AdminNav';
import ProductCreateForm from '../../components/ProductAdmin/ProductCreateForm';

const ProductCreate = () => {
  return (
    <Layout
      style={{ padding: '24px 0', background: '#fff', flexDirection: 'row' }}
    >
      <AdminNav selectedKey='products' />
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <ProductCreateForm />
      </Content>
    </Layout>
  );
};

export default ProductCreate;