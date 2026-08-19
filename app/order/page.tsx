'use client';
import { useState, useRef } from 'react';
import styles from './order.module.css';

export default function OrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{orderId: string, whatsappUrl: string} | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Construct WhatsApp URL manually here on client to ensure we have the env var
        // Wait, NEXT_PUBLIC_WHATSAPP_NUMBER is available on client
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || '';
        
        const name = formData.get('name') as string;
        const projectType = formData.get('projectType') as string;
        const description = formData.get('description') as string;
        const hasImage = (formData.get('image') as File)?.size > 0;
        
        const message = `Hi Corchet Art! I'd like to place a custom order.
        
Order ID: ${data.orderId}
Name: ${name}
Project Type: ${projectType}
Description: ${description}

${hasImage ? '(Reference photo was uploaded on the site)' : ''}`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        setOrderComplete({
          orderId: data.orderId,
          whatsappUrl: waUrl
        });
        
        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
      } else {
        alert("There was an error submitting your order. Please try again or contact us directly on WhatsApp.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className={styles.orderContainer}>
        <div className="container">
          <div className={styles.successCard}>
            <h1 className={styles.title} style={{ marginBottom: '1rem' }}>Order Submitted!</h1>
            <p className={styles.successText}>
              Your custom order request has been saved. Your Order ID is:
            </p>
            <div className={styles.orderIdBadge}>{orderComplete.orderId}</div>
            <p className={styles.successText}>
              Please save this ID. You can use it on our Track Order page to check your status.
            </p>
            
            <div className={styles.whatsappNotice}>
              <h3>Next Step:</h3>
              <p>We've opened WhatsApp for you to confirm the details. If it didn't open, click the button below.</p>
              <a href={orderComplete.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.submitButton}>
                Continue to WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderContainer}>
      <div className="container">
        <h1 className={styles.title}>Start a Custom Order</h1>
        <p className="text-center" style={{ marginBottom: '3rem', fontSize: '1.1rem', color: 'var(--foreground)' }}>
          Tell us what you'd like us to create for you. We'll receive your request and finalize the details with you on WhatsApp!
        </p>

        <form className={styles.orderForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Your Details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input type="text" id="name" name="name" required />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number (WhatsApp) *</label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input type="text" id="city" name="city" required />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Project Details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="projectType">Project Type *</label>
              <select id="projectType" name="projectType" required defaultValue="">
                <option value="" disabled>Select a type...</option>
                <option value="Amigurumi">Amigurumi (Toy)</option>
                <option value="Bag">Bag / Purse</option>
                <option value="Blanket">Blanket</option>
                <option value="Clothing">Clothing (Sweater, Cardigan, etc.)</option>
                <option value="Accessory">Accessory (Scarf, Hat, etc.)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Describe what you want *</label>
              <textarea 
                id="description" 
                name="description" 
                rows={4} 
                required 
                placeholder="E.g., I would like a small brown bear amigurumi with a red scarf..."
              ></textarea>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="colors">Preferred Colors</label>
                <input type="text" id="colors" name="colors" placeholder="E.g., Earth tones, pastels, or specific colors" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="size">Size / Dimensions (approx)</label>
                <input type="text" id="size" name="size" placeholder="E.g., 10 inches tall, or Medium adult size" />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">Reference Image (Optional)</label>
              <input type="file" id="image" name="image" accept="image/*" className={styles.fileInput} />
              <p className={styles.helpText}>Upload a photo of what you have in mind to help us understand your vision.</p>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Timeline & Budget</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="budget">Budget Range (Optional)</label>
                <select id="budget" name="budget" defaultValue="">
                  <option value="">I don't know / Flexible</option>
                  <option value="Under 2000 PKR">Under 2,000 PKR</option>
                  <option value="2000-5000 PKR">2,000 - 5,000 PKR</option>
                  <option value="5000-10000 PKR">5,000 - 10,000 PKR</option>
                  <option value="Over 10000 PKR">Over 10,000 PKR</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="neededBy">Needed By Date (Optional)</label>
                <input type="date" id="neededBy" name="neededBy" />
              </div>
            </div>
          </div>

          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Order & Open WhatsApp'}
            </button>
            <p className={styles.disclaimer}>
              By submitting, you understand that this is a custom request, not a final purchase. We will discuss final pricing and payment details on WhatsApp.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
