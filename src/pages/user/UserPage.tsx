import { useState } from 'react';

import './UserPage.css';

interface User {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  occupation: string;
  monthlyIncome: number;
}

const MOCK_USER: User = {
  id: '1',
  userName: 'Phạm Việt Thông',
  email: 'thongpham@example.com',
  phoneNumber: '0901234567',
  createdAt: '2025-01-15',
  occupation: 'Sinh viên Công nghệ Thông tin',
  monthlyIncome: 12000000,
};

function formatVND(value: number) {
  return value.toLocaleString('vi-VN') + ' ₫';
}

export default function UserPage() {
  const [user] = useState<User>(MOCK_USER);

  const initials = user.userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="user-page">
      {/* Header */}
      <div className="user-header">
        <div>
          <span className="user-breadcrumb">
            Hồ sơ người dùng
          </span>

          <h1>Thông tin tài khoản</h1>
        </div>

        <button className="user-edit-btn">
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Profile Card */}
      <div className="user-profile-card">
        <div className="user-avatar">
          {initials}
        </div>

        <div className="user-profile-content">
          <h2>{user.userName}</h2>

          <p>{user.occupation}</p>

          <span>
            Thành viên từ{' '}
            {new Date(
              user.createdAt
            ).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>

      {/* Information Grid */}
      <div className="user-info-grid">
        {/* Contact Information */}
        <div className="user-info-card">
          <div className="user-card-header">
            <h3>Thông tin liên hệ</h3>

            <p>
              Dữ liệu mẫu cho frontend testing
            </p>
          </div>

          <div className="user-info-list">
            <div className="user-info-item">
              <span>Email</span>

              <strong>{user.email}</strong>
            </div>

            <div className="user-info-item">
              <span>Số điện thoại</span>

              <strong>
                {user.phoneNumber}
              </strong>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="user-info-card">
          <div className="user-card-header">
            <h3>Thông tin tài chính</h3>

            <p>
              Thông tin mô phỏng người dùng
            </p>
          </div>

          <div className="user-info-list">
            <div className="user-info-item">
              <span>
                Thu nhập hàng tháng
              </span>

              <strong>
                {formatVND(
                  user.monthlyIncome
                )}
              </strong>
            </div>

            <div className="user-info-item">
              <span>Nghề nghiệp</span>

              <strong>
                {user.occupation}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="user-settings-card">
        <div className="user-card-header">
          <h3>Cài đặt tài khoản</h3>

          <p>
            Chức năng demo giao diện
          </p>
        </div>

        <div className="user-settings-list">
          <button className="user-setting-item">
            🔒 Đổi mật khẩu
          </button>

          <button className="user-setting-item">
            🔔 Cài đặt thông báo
          </button>

          <button className="user-setting-item">
            🌙 Giao diện tối
          </button>

          <button className="user-setting-item logout">
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}