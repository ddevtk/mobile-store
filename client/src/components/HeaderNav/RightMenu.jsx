import React, { useEffect, useState } from 'react';
import {
  Menu,
  Input,
  Dropdown,
  Popover,
  Tooltip,
  Divider,
  Card,
  Row,
  Button,
  Col,
  Tag,
  Badge,
} from 'antd';
import { MDBIcon } from 'mdb-react-ui-kit';

import {
  AppstoreOutlined,
  SearchOutlined,
  UserDeleteOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import avatar from '../../images/avatar.png';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart } from '../../redux/cart/cartAction';

const str = 'ÁO SƠ MI BRITISH CLASSICS STRIPES 1448';

const RightMenu = ({
  search,
  onFinish,
  setSearch,
  title,
  setTitle,
  user,
  logoutHandler,
}) => {
  const cartReducer = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const { cart, sl, isInit, total } = cartReducer;

  const userMenu = (
    <Menu>
      <Menu.Item icon={<AppstoreOutlined />}>
        <Link to='/user/history'>History</Link>
      </Menu.Item>
      <Menu.Item icon={<UserDeleteOutlined />} onClick={logoutHandler}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  const adminMenu = (
    <Menu>
      <Menu.Item icon={<AppstoreOutlined />}>
        <Link to='/admin/dashboard'>Dashboard</Link>
      </Menu.Item>
      <Menu.Item icon={<UserDeleteOutlined />} onClick={logoutHandler}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (isInit) {
      return;
    }
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const removeItemHandler = (item) => {
    dispatch(removeItemFromCart(item));
  };

  return (
    <>
      <form
        className='d-flex justify-content-end'
        onClick={() => setSearch(true)}
        onSubmit={onFinish}
      >
        <Input
          className={`d-flex ${search ? 'search-normal' : ''}`}
          style={{
            width: '20%',
            marginRight: '0.5rem',
            borderRadius: '1rem',
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size='middle'
          placeholder='Nhập nội dung tìm kiếm...'
          prefix={<SearchOutlined />}
        />
      </form>
      <div className='d-flex align-items-center'>
        <Popover
          trigger='click'
          placement='bottomLeft'
          visible={visible}
          onClick={() => setVisible(!visible)}
          onVisibleChange={(visible) => setVisible(visible)}
          title={
            <div
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f8fd',
                textAlign: 'center',
                border: '1px solid #e7ebec',
                borderRadius: '4px',
              }}
            >
              Giỏ hàng
            </div>
          }
          content={
            <Card>
              {cart.length === 0 && (
                <div className='text-center mt-2'>
                  <ShoppingCartOutlined
                    style={{ display: 'block', fontSize: '2rem' }}
                  />
                  Hiện chưa có sản phẩm
                </div>
              )}
              <div
                id='style-2'
                style={{
                  maxHeight: '220px',
                  overflowY: 'scroll',
                  padding: '0.5rem',
                }}
              >
                {cart.length !== 0 &&
                  cart.map((item) => {
                    return (
                      <Row className='cart-item' key={item._id}>
                        <Col md={4}>
                          <Link to={`/${item.slug}`}>
                            <img
                              src={item.images[0].url}
                              alt={item.title}
                              style={{ width: '3.2rem' }}
                            />
                          </Link>
                        </Col>
                        <Col md={19} offset={1}>
                          <Row justify='space-between' align='middle'>
                            <Col>
                              <span style={{ fontSize: '0.8rem' }}>
                                <Link
                                  className='custom-hover'
                                  to={`/${item.slug}`}
                                >
                                  <Tooltip title={item.title}>
                                    {`${item.title.substring(0, 25)}...`}
                                  </Tooltip>
                                </Link>
                              </span>
                            </Col>
                            <Col>
                              <MDBIcon
                                style={{ cursor: 'pointer' }}
                                fas
                                icon='times'
                                onClick={() => {
                                  removeItemHandler(item);
                                }}
                              />
                            </Col>
                          </Row>
                          <Row
                            justify='space-between'
                            align='middle'
                            className='mt-2'
                          >
                            <Col>
                              <Tag>{item.count}</Tag>
                            </Col>
                            <Col>
                              <span>
                                {item.price.toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
              </div>
              <Divider />
              <Row align='middle' justify='space-between'>
                <span>Tổng tiền</span>
                <span style={{ fontWeight: 'bold' }}>
                  {total.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </Row>
              <Row justify='space-between'>
                <Button type='primary'>Xem giỏ hàng</Button>
                <Button type='primary'>Thanh toán</Button>
              </Row>
            </Card>
          }
        >
          {cart ? (
            <Badge size='small' count={sl}>
              <span className='text-reset me-2' style={{ cursor: 'pointer' }}>
                <i className='fas fa-shopping-cart'></i>
              </span>
            </Badge>
          ) : (
            <span className='text-reset me-2' style={{ cursor: 'pointer' }}>
              <i className='fas fa-shopping-cart'></i>
            </span>
          )}
        </Popover>
        {!user && (
          <div className='d-flex' style={{ marginLeft: '0.5rem' }}>
            <Link
              className='text-reset d-flex align-items-center'
              to='/login'
              style={{ marginLeft: '0.2rem' }}
            >
              <UserOutlined /> Đăng nhập
            </Link>
          </div>
        )}

        {user && user.role === 'subscriber' && (
          <Dropdown overlay={userMenu}>
            <div
              className='d-flex align-items-center'
              style={{ marginLeft: '0.5rem' }}
            >
              <img
                src={user.avatar || avatar}
                className='rounded-circle'
                height='25'
                alt='Black and White Portrait of a Man'
                loading='lazy'
                style={{ marginRight: '0.2rem' }}
              />
              {`${user.email.split('@')[0].substring(0, 10)}...`}
            </div>
          </Dropdown>
        )}
        {user && user.role === 'admin' && (
          <Dropdown overlay={adminMenu}>
            <div
              className='d-flex align-items-center'
              style={{ marginLeft: '0.5rem' }}
            >
              <img
                src={user.avatar || avatar}
                className='rounded-circle'
                height='25'
                alt='Black and White Portrait of a Man'
                loading='lazy'
                style={{ marginRight: '0.2rem' }}
              />
              <Tooltip title={user.email.split('@')[0]} placement='left'>
                {`${user.email.split('@')[0].substring(0, 10)}...`}
              </Tooltip>
            </div>
          </Dropdown>
        )}
      </div>
    </>
  );
};

export default RightMenu;