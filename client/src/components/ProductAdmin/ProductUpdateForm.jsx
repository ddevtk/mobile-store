/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Input, notification, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { UploadOutlined } from '@ant-design/icons';
import * as categoryApi from '../../api/categoryApi';
import * as productApi from '../../api/productApi';
import * as cloudinaryApi from '../../api/cloudinaryApi';
import * as subCategoryApi from '../../api/subCategoryApi';
import LoadingButton from '../LoadingButton';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const initialState = {
  title: '',
  description: '',
  price: '',
  categories: [],
  category: '',
  sub: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus'],
  color: '',
  brand: '',
};

const resizeImage = (file, allUriString, setUriString) => {
  Resizer.imageFileResizer(
    file,
    720,
    720,
    'JPEG',
    100,
    0,
    (uri) => {
      allUriString.push(uri);
      setUriString(allUriString);
    },
    'base64',
    200,
    200
  );
};

const ProductUpdateForm = ({ product, slug }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fields, setFields] = useState([
    { name: 'title', value: product && product.title },
    { name: 'description', value: product && product.description },
    { name: 'price', value: product && product.price },
    { name: 'shipping', value: product && product.shipping },
    { name: 'quantity', value: product && product.quantity },
    { name: 'color', value: product && product.color },
    { name: 'brand', value: product && product.brand },
    { name: 'category', value: product && product.category._id },
    { name: 'sub', value: product && product.sub.map((p) => p._id) },
    { name: 'images', value: [] },
  ]);
  const [sub, setSub] = useState([]);
  const [uriString, setUriString] = useState([]);

  const [cookie] = useCookies(['user']);

  let allUriString = [];

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: 'Vui l??ng nh???p ${label}',
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };
  const onChangeFile = (info) => {
    switch (info.file.status) {
      case 'done':
        if (info.file.uid === info.fileList[info.fileList.length - 1].uid) {
          info.fileList.forEach((_file, id) => {
            if (id === info.fileList.length - 1) {
              info.fileList.forEach((f) => {
                resizeImage(f.originFileObj, allUriString, setUriString);
              });
            }
          });
        }
        break;
      case 'removed':
        allUriString = [];
        if (info.fileList.length === 0) {
          setUriString([]);
        } else {
          info.fileList.forEach((file) => {
            resizeImage(file.originFileObj, allUriString, setUriString);
          });
        }
        break;
      default:
        break;
    }
  };

  const onFinish = async (values) => {
    try {
      setUpdateLoading(true);
      const imageArr =
        uriString.length === 0
          ? []
          : await Promise.all(
              uriString.map(async (uri) => {
                try {
                  const res = await cloudinaryApi.uploadImages(
                    uri,
                    cookie.user.token
                  );
                  return res.data;
                } catch (error) {
                  throw new Error(error.response.data.message);
                }
              })
            );

      values.images = imageArr;
      if (imageArr.length === 0) {
        delete values.images;
      }

      try {
        const res = await productApi.updateProduct(
          slug,
          values,
          cookie.user.token
        );
        console.log(res);
        notification.success({ message: 'C???p nh???t th??nh c??ng', duration: 2 });
        setTimeout(() => {
          navigate('/admin/product');
        }, 2000);
      } catch (error) {
        throw new Error(error.response.data.message);
      }

      setUpdateLoading(false);
      //   form.resetFields();
    } catch (error) {
      setUpdateLoading(false);
      notification.error({
        message: error.message,
        duration: 4,
      });
    }
  };

  useEffect(() => {
    categoryApi.getAllCategories().then((res) => setCategories(res.data));
    subCategoryApi
      .getSubsByCategoryId(product.category._id)
      .then((res) => setSub(res.data));
  }, []);

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      validateMessages={validateMessages}
      onFinish={onFinish}
      fields={fields}
    >
      <Form.Item name='title' label='T??n s???n ph???m' rules={[{ required: true }]}>
        <Input allowClear placeholder='Nh???p t??n s???n ph???m' />
      </Form.Item>
      <Form.Item name='description' label='M?? t???' rules={[{ required: true }]}>
        <Input allowClear placeholder='Nh???p m?? t???' />
      </Form.Item>
      <Form.Item
        name='price'
        label='Gi?? ti???n'
        rules={[
          { required: true },
          {
            validator: (_, price) => {
              if (price && isNaN(price)) {
                return Promise.reject(new Error('Gi?? ti???n kh??ng h???p l???'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          allowClear
          placeholder='Nh???p gi?? ti???n'
          style={{ width: '10rem' }}
        />
      </Form.Item>
      <Form.Item label='Shipping' name='shipping' rules={[{ required: true }]}>
        <Select style={{ width: '10rem' }} placeholder='Shipping' allowClear>
          <Select.Option value='Yes'>Yes</Select.Option>
          <Select.Option value='No'>No</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name='quantity'
        label='S??? l?????ng'
        rules={[
          { required: true },
          {
            validator: (_, quantity) => {
              if (quantity && isNaN(quantity)) {
                return Promise.reject(new Error('S??? l?????ng kh??ng h???p l???'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          allowClear
          placeholder='Nh???p s??? l?????ng'
          style={{ width: '10rem' }}
        />
      </Form.Item>
      <Form.Item label='M??u s???c' name='color' rules={[{ required: true }]}>
        <Select style={{ width: '10rem' }} placeholder='Ch???n m??u' allowClear>
          {initialState.colors.map((c, id) => (
            <Select.Option value={c} key={id}>
              {c}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Th????ng hi???u' name='brand' rules={[{ required: true }]}>
        <Select
          style={{ width: '10rem' }}
          placeholder='Ch???n th????ng hi???u'
          allowClear
        >
          {initialState.brands.map((b, id) => (
            <Select.Option value={b} key={id}>
              {b}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Danh m???c' name='category' rules={[{ required: true }]}>
        <Select
          style={{ width: '10rem' }}
          placeholder='Ch???n danh m???c'
          allowClear
          onChange={(value) => {
            console.log(value);
            if (value) {
              setFields([{ name: 'sub', value: [] }]);
              subCategoryApi
                .getSubsByCategoryId(value)
                .then((res) => setSub(res.data));
            } else {
              setSub([]);
              setFields([{ name: 'sub', value: [] }]);
            }
          }}
        >
          {categories?.map((c, id) => (
            <Select.Option value={c._id} key={id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Danh m???c con' name='sub'>
        <Select
          maxTagCount='responsive'
          mode='multiple'
          style={{ width: '25rem' }}
          placeholder='Ch???n danh m???c con'
          allowClear
          disabled={sub.length === 0}
        >
          {sub.length !== 0 &&
            sub?.map((s, id) => (
              <Select.Option value={s._id} key={id}>
                {s.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='images'
        label='???nh s???n ph???m'
        valuePropName='fileList'
        getValueFromEvent={normFile}
        // rules={[{ required: true }]}
      >
        <Upload
          multiple
          accept='images/*'
          onChange={onChangeFile}
          customRequest={dummyRequest}
          listType='picture'
        >
          <Button
            icon={<UploadOutlined />}
            className='d-flex align-items-center'
          >
            T???i ???nh l??n
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
        <LoadingButton loading={updateLoading} type='update' />
      </Form.Item>
    </Form>
  );
};

export default ProductUpdateForm;
