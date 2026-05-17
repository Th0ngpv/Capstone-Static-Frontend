//CoachPage.tsx
import { useState } from 'react';
import './CoachPage.css';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  card?: {
    title: string;
    pct: number;
    tip: string;
    action: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  pinned?: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    pinned: true,
    title: 'Tăng tốc mục tiêu nhà ở',
    preview: 'Cho tôi biết cách đạt mục tiêu nhà sớm hơn...',
    time: 'Vừa xong',
    messages: [
      {
        id: 'm1',
        role: 'ai',
        text: 'Xin chào! Tôi là huấn luyện viên tài chính AI của bạn. Tôi đã xem xét danh mục mới nhất của bạn. Bạn muốn bắt đầu với kế hoạch tái cân bằng hay kiểm tra mục tiêu?',
      },
      {
        id: 'm2',
        role: 'user',
        text: 'Cho tôi biết cách đạt mục tiêu nhà sớm hơn.',
      },
      {
        id: 'm3',
        role: 'ai',
        text: 'Dựa trên dòng tiền hiện tại của bạn, đây là phân tích:',
        card: {
          title: 'Trả trước nhà',
          pct: 59,
          tip: 'Thêm +300.000đ/tháng để đạt mục tiêu vào Tháng 2/2027.',
          action: 'Áp dụng +300.000đ/tháng',
        },
      },
    ],
  },
  {
    id: '2',
    pinned: true,
    title: 'Tùy chọn tái cân bằng tháng 4',
    preview: 'Bạn đang thừa 4,2% cổ phiếu...',
    time: '2 giờ trước',
    messages: [
      {
        id: 'm1',
        role: 'ai',
        text: 'Bạn đang thừa 4,2% cổ phiếu so với mục tiêu phân bổ.',
      },
      {
        id: 'm2',
        role: 'user',
        text: 'Tôi nên chuyển bao nhiêu?',
      },
      {
        id: 'm3',
        role: 'ai',
        text: 'Hãy chuyển khoảng 8–10 triệu đồng sang quỹ trái phiếu để đưa danh mục về đúng mục tiêu 60/40.',
      },
    ],
  },
  {
    id: '3',
    title: 'Nghỉ hưu lúc 55 hay 60?',
    preview: 'Chạy Monte Carlo cho cả hai...',
    time: 'Hôm qua',
    messages: [
      {
        id: 'm1',
        role: 'ai',
        text: 'Nghỉ hưu lúc 55 có xác suất thành công 72%, trong khi nghỉ hưu lúc 60 tăng lên 91%.',
      },
      {
        id: 'm2',
        role: 'user',
        text: 'Tôi cần làm gì để đạt 85%?',
      },
      {
        id: 'm3',
        role: 'ai',
        text: 'Bạn cần tăng tiết kiệm thêm 2 triệu/tháng và giảm chi tiêu không thiết yếu xuống 15%.',
      },
    ],
  },
];

const QUICK_ACTIONS = [
  '✦ Chạy kế hoạch tái cân bằng',
  '✦ Kiểm tra trạng thái mục tiêu',
  '✦ Xem xét hồ sơ rủi ro',
  '✦ Tìm kiếm tiết kiệm thuế',
];

const MOCK_CONTEXT = {
  portfolio: '6 loại tài sản · 1,38 tỷ',
  goals: '5 hoạt động · 2 ưu tiên cao',
  riskProfile: 'Trung bình (62/100)',
  debt: '779K · 4 khoản nợ',
};

export default function CoachPage() {
  // Static page → no useState/useEffect
  const [historyOpen, setHistoryOpen] = useState(false);
  const active = MOCK_CONVERSATIONS[0];

  const pinned = MOCK_CONVERSATIONS.filter((c) => c.pinned);
  const recent = MOCK_CONVERSATIONS.filter((c) => !c.pinned);

  return (
    <div className="coach-shell">
      {/* Sidebar */}
      <aside
        className={`coach-sidebar ${historyOpen ? 'open' : ''
          }`}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2)',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-700)',
            }}
          >
            Lịch sử trò chuyện
          </span>

          <button
            className="coach-icon-btn"
            onClick={() => setHistoryOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="coach-search-wrap">
          <span className="coach-search-icon">🔍</span>

          <input
            className="coach-search"
            placeholder="Tìm kiếm..."
            defaultValue=""
          />
        </div>

        {pinned.length > 0 && (
          <>
            <span className="coach-list-label">ĐÃ GHIM</span>

            {pinned.map((conversation) => (
              <button
                key={conversation.id}
                className={`coach-conv-item ${conversation.id === active.id ? 'active' : ''
                  }`}
              >
                <div className="coach-conv-title">
                  <span>{conversation.title}</span>
                  <span className="coach-conv-pin">★</span>
                </div>

                <p className="coach-conv-preview">
                  {conversation.preview}
                </p>

                <span className="coach-conv-time">
                  {conversation.time}
                </span>
              </button>
            ))}
          </>
        )}

        {recent.length > 0 && (
          <>
            <span className="coach-list-label">GẦN ĐÂY</span>

            {recent.map((conversation) => (
              <button
                key={conversation.id}
                className="coach-conv-item"
              >
                <div className="coach-conv-title">
                  <span>{conversation.title}</span>
                </div>

                <p className="coach-conv-preview">
                  {conversation.preview}
                </p>

                <span className="coach-conv-time">
                  {conversation.time}
                </span>
              </button>
            ))}
          </>
        )}
      </aside>

      {/* Main Chat */}
      <main className="coach-main">
        <div className="coach-chat-header">
          <div className="coach-chat-avatar">🤖</div>

          <div style={{ flex: 1 }}>
            <h2>{active.title}</h2>
            <span className="coach-powered">
              ● Powered by Gemini 1.5 Pro
            </span>
          </div>

          <button
            className="coach-icon-btn"
            onClick={() => setHistoryOpen(true)}
          >
            🕐
          </button>

          <button className="coach-new-btn">
            + Mới
          </button>
        </div>

        <div className="coach-messages">
          {active.messages.map((message) => (
            <div
              key={message.id}
              className={`coach-msg coach-msg-${message.role}`}
            >
              {message.role === 'ai' && (
                <div className="coach-msg-avatar">🤖</div>
              )}

              <div className="coach-msg-body">
                <p>{message.text}</p>

                {message.card && (
                  <div className="coach-card">
                    <div className="coach-card-header">
                      <span>🏠 {message.card.title}</span>

                      <span className="coach-card-pct">
                        {message.card.pct}% hoàn thành
                      </span>
                    </div>

                    <div className="coach-card-bar-track">
                      <div
                        className="coach-card-bar-fill"
                        style={{ width: `${message.card.pct}%` }}
                      />
                    </div>

                    <p className="coach-card-tip">
                      {message.card.tip}
                    </p>

                    <div className="coach-card-actions">
                      <button className="coach-card-btn-primary">
                        {message.card.action}
                      </button>

                      <button className="coach-card-btn-ghost">
                        Xem thêm tùy chọn
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="coach-msg-avatar coach-msg-avatar-user">
                  AT
                </div>
              )}
            </div>
          ))}

          {/* Static typing indicator */}
          <div className="coach-msg coach-msg-ai">
            <div className="coach-msg-avatar">🤖</div>

            <div className="coach-msg-body coach-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Static input */}
        <div className="coach-input-wrap">
          <input
            className="coach-input"
            placeholder="Hỏi về tài chính của bạn..."
            defaultValue=""
          />

          <button className="coach-send-btn">
            ↑
          </button>
        </div>
      </main>

      {/* Context Panel */}
      <aside className="coach-context">
        <div className="coach-context-section">
          <h3>NGỮ CẢNH GỬI CHO AI</h3>

          <div className="coach-context-row">
            <span>Danh mục</span>
            <span>{MOCK_CONTEXT.portfolio}</span>
          </div>

          <div className="coach-context-row">
            <span>Mục tiêu</span>
            <span>{MOCK_CONTEXT.goals}</span>
          </div>

          <div className="coach-context-row">
            <span>Hồ sơ rủi ro</span>
            <span>{MOCK_CONTEXT.riskProfile}</span>
          </div>

          <div className="coach-context-row">
            <span>Nợ</span>
            <span>{MOCK_CONTEXT.debt}</span>
          </div>

          <p className="coach-context-note">
            Chỉ gửi ngữ cảnh ẩn danh. Dữ liệu lưu trên thiết bị.
          </p>
        </div>

        <div className="coach-context-section">
          <h3>TRONG CUỘC TRÒ CHUYỆN NÀY</h3>

          <div className="coach-context-row">
            <span>Tin nhắn</span>
            <span>{active.messages.length}</span>
          </div>

          <div className="coach-context-row">
            <span>Bắt đầu</span>
            <span>{active.time}</span>
          </div>

          <div className="coach-context-row">
            <span>Trạng thái</span>
            <span className="coach-status-active">
              Hoạt động
            </span>
          </div>

          <div className="coach-context-btns">
            <button className="coach-ctx-btn">
              ↗ Xuất
            </button>

            <button className="coach-ctx-btn coach-ctx-btn-del">
              ✕ Xoá
            </button>
          </div>
        </div>

        <div className="coach-context-section">
          <h3>HÀNH ĐỘNG NHANH</h3>

          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              className="coach-quick-action"
            >
              {action}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}