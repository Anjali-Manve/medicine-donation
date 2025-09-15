import React from 'react';

function FeaturesSection() {
  const features = [
    {
      icon: '🌍', // Community icon
      title: 'Community',
      description: 'Join our network and contribute to a healthier society.',
    },
    {
      icon: '♻️', // Eco-Friendly icon
      title: 'Eco-Friendly',
      description: 'Recycling medicines helps protect our environment.',
    },
    {
      icon: '🏆', // Verified Donors icon
      title: 'Verified Donors',
      description: 'Only verified donors are allowed to donate medicines.',
    },
  ];

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        {features.map((feature, index) => (
          <div key={index} className="col-lg-3 col-md-6 mb-4">
            <div className="card text-center p-4 h-100 shadow-sm rounded-3">
              <div className="card-body">
                <div className="fs-1 mb-3">{feature.icon}</div>
                <h5 className="card-title fw-bold text-primary">{feature.title}</h5>
                <p className="card-text text-muted">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
