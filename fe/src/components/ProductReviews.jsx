import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Star, Send, MessageCircle, User } from 'lucide-react';

const API_URL = 'http://localhost:8082';

const StarRating = ({ rating, size = 18, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= (hovered || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const { user, profile, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0 });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const [reviewsRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/api/reviews/product/${productId}`),
        fetch(`${API_URL}/api/reviews/product/${productId}/summary`),
      ]);
      const reviewsData = await reviewsRes.json();
      const summaryData = await summaryRes.json();
      setReviews(reviewsData);
      setSummary(summaryData);

      // Kiểm tra user đã review chưa
      if (user?.id) {
        const checkRes = await fetch(
          `${API_URL}/api/reviews/product/${productId}/check?userId=${user.id}`
        );
        const checkData = await checkRes.json();
        setHasReviewed(checkData.hasReviewed);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      setError('Vui lòng chọn số sao');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          userName: profile?.name || user.email?.split('@')[0] || 'Ẩn danh',
          rating: newRating,
          comment: newComment.trim(),
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Có lỗi xảy ra');
        return;
      }
      setNewRating(0);
      setNewComment('');
      fetchData();
    } catch (err) {
      setError('Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-slate-100 rounded"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      {/* Header */}
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
        <MessageCircle size={18} className="text-brand-500" />
        Đánh giá & Bình luận
      </h3>

      {/* Summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-5 flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-black text-slate-900">
            {summary.averageRating || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">trên 5</div>
        </div>
        <div className="flex-1">
          <StarRating rating={Math.round(summary.averageRating)} size={20} />
          <p className="text-xs text-slate-500 mt-1">
            {summary.totalReviews} đánh giá
          </p>
        </div>
      </div>

      {/* Form đánh giá */}
      {isAuthenticated && !hasReviewed ? (
        <form onSubmit={handleSubmit} className="bg-brand-50/50 rounded-xl p-4 mb-5 border border-brand-100">
          <p className="text-sm font-semibold text-slate-700 mb-2">Đánh giá của bạn</p>
          <div className="mb-3">
            <StarRating rating={newRating} size={28} interactive onRate={setNewRating} />
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      ) : isAuthenticated && hasReviewed ? (
        <div className="bg-green-50 rounded-xl p-3 mb-5 border border-green-100 text-sm text-green-700 font-medium">
          ✓ Bạn đã đánh giá sản phẩm này
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100 text-sm text-slate-500 text-center">
          Đăng nhập để đánh giá sản phẩm
        </div>
      )}

      {/* Danh sách review */}
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">Chưa có đánh giá nào</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate block">
                    {review.userName || 'Ẩn danh'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 flex-shrink-0">
                  {formatTime(review.createdAt)}
                </span>
              </div>
              <div className="ml-9">
                <StarRating rating={review.rating} size={14} />
                {review.comment && (
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{review.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
