'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import styles from './ProductReviews.module.css';

export default function ProductReviews({ productId, reviews }: { productId: string, reviews: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment })
      });
      
      if (res.ok) {
        setRating(5);
        setComment('');
        router.refresh(); // reload reviews
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsHeader}>
        <h2>Customer Reviews</h2>
        <div className={styles.averageRating}>
          <span className={styles.stars}>{"★".repeat(Math.round(Number(averageRating)))}{"☆".repeat(5 - Math.round(Number(averageRating)))}</span>
          <span className={styles.ratingText}>{averageRating} out of 5 ({reviews.length} reviews)</span>
        </div>
      </div>

      <div className={styles.writeReview}>
        <h3>Write a Review</h3>
        {session ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Comment (optional)</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think about this piece?"
                rows={4}
              />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <p>You must be logged in to leave a review.</p>
            <button onClick={() => signIn('google')} className={styles.loginBtn}>Sign In with Google</button>
          </div>
        )}
      </div>

      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewUser}>
                {review.user.image ? (
                  <img src={review.user.image} alt={review.user.name} className={styles.userAvatar} />
                ) : (
                  <div className={styles.userAvatarPlaceholder}>{review.user.name?.charAt(0) || 'U'}</div>
                )}
                <div>
                  <strong>{review.user.name || 'Anonymous'}</strong>
                  <div className={styles.starsSmall}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                </div>
              </div>
              {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
              <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
