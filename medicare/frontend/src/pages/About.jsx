import React from 'react';
import './About.css'; // Import the new custom CSS

const About = () => {
  return (
    <div className="about-page-container">

      {/* 1. Hero Section (Top) */}
      <section className="about-section-card">
        <img src="https://img.freepik.com/premium-vector/medical-service-donation-man-hand-holding-box-full-medical-equipment-s-charity-concept_530733-1002.jpg" alt="Medicine Donation Box" className="about-hero-image" />
        <h2>About MediCare – A Step Towards Healthier Tomorrow</h2>
        <p>We connect donors with people in need of medicines to reduce waste and save lives.</p>
      </section>

      {/* 2. Mission & Vision */}
      <section className="about-section-card">
        <h2>Our Mission & Vision</h2>
        <h3>Mission:</h3>
        <p>To make healthcare accessible for everyone by creating a platform where unused, unexpired medicines can be donated to those in need.</p>
        <h3>Vision:</h3>
        <p>A future where no medicine is wasted, and no life is lost due to lack of medicine.</p>
      </section>

      {/* 3. How It Works (Steps with Icons / Images) */}
      <section className="about-section-card">
        <h2>How It Works</h2>
        <div className="about-grid three-cols">
          <div className="grid-item">
            <img src="https://via.placeholder.com/80" alt="Register" className="icon" />
            <h4>1. Register & List Medicines</h4>
            <p>Donors sign up and easily list their unused, unexpired medicines.</p>
          </div>
          <div className="grid-item">
            <img src="https://via.placeholder.com/80" alt="Request" className="icon" />
            <h4>2. Receiver Requests</h4>
            <p>People in need browse available medicines and send requests.</p>
          </div>
          <div className="grid-item">
            <img src="https://via.placeholder.com/80" alt="Verify" className="icon" />
            <h4>3. Admin Verification</h4>
            <p>Our team verifies all donations and requests to ensure safety and legitimacy.</p>
          </div>
          <div className="grid-item">
            <img src="https://via.placeholder.com/80" alt="Handover" className="icon" />
            <h4>4. Safe Handover</h4>
            <p>Medicines are safely handed over to the approved receivers.</p>
          </div>
        </div>
      </section>

      {/* 4. Why Medicine Donation Matters */}
      <section className="about-section-card">
        <h2>Why Medicine Donation Matters</h2>
        <p>Millions of medicines are wasted every year 💊</p>
        <p>At the same time, many people cannot afford basic treatment 💔</p>
        <p>Your small contribution can save lives & reduce waste 🌍</p>
      </section>

      {/* 5. Cards / Sections with Images */}
      <section className="about-section-card">
        <h2>Our Impact</h2>
        <div className="about-grid two-cols">
          <div className="grid-item">
            <img src="https://img.freepik.com/premium-vector/medical-service-donation-man-hand-holding-box-full-medical-equipment-s-charity-concept_530733-1002.jpg" alt="Donation Box" className="icon" />
            <h4>Donation Box</h4>
            <p>A symbol of giving and hope for countless individuals.</p>
          </div>
          <div className="grid-item">
            <img src="https://c8.alamy.com/comp/2BEP793/cardboard-box-full-of-drugs-in-hand-needed-items-for-donation-different-pills-bottles-healthcare-pharmacy-medical-drug-vitamin-antibiotic-donate-charity-thanksgiving-flat-vector-illustration-2BEP793.jpg" alt="Medicines" className="icon" />
            <h4>Life-Saving Medicines</h4>
            <p>Providing access to a variety of essential life-saving drugs.</p>
          </div>
          <div className="grid-item">
            <img src="https://static.vecteezy.com/system/resources/previews/021/533/753/non_2x/donation-box-with-medicines-photo.jpg" alt="Helping Hands" className="icon" />
            <h4>Connecting Lives</h4>
            <p>Facilitating the crucial connection between generous donors and grateful receivers.</p>
          </div>
          <div className="grid-item">
            <img src="https://thumbs.dreamstime.com/b/group-diverse-young-volunteers-smiling-camera-packing-pills-medicine-donation-girls-holding-card-group-diverse-202783081.jpg" alt="Community Impact" className="icon" />
            <h4>Community Impact</h4>
            <p>Building trust and fostering a strong, supportive community.</p>
          </div>
        </div>
      </section>

      {/* 6. Impact Numbers (Optional) */}
      <section className="about-section-card">
        <h2>Our Impact at a Glance</h2>
        <div className="about-grid three-cols">
          <div className="grid-item">
            <div className="impact-number">500+</div>
            <div className="impact-label">Patients Helped</div>
          </div>
          <div className="grid-item">
            <div className="impact-number">1000+</div>
            <div className="impact-label">Medicines Donated</div>
          </div>
          <div className="grid-item">
            <div className="impact-number">30+</div>
            <div className="impact-label">NGOs Associated</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
