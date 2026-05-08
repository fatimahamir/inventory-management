import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect } from 'react';

function LandingPage() {
  const navigate = useNavigate();

  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target && target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div style={{ backgroundColor: '#f9fafb' }}>
      <style>{`
        :root {
          --brand-primary: #1F6F5F;
          --brand-dark: #0a2e2a;
          --brand-light: #e8f4f1;
        }
        
        .btn-brand {
          background-color: #1F6F5F;
          border-color: #1F6F5F;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-brand:hover {
          background-color: #195f51;
          border-color: #195f51;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -8px rgba(31, 111, 95, 0.4);
          color: white;
        }
        
        .btn-outline-brand {
          border: 2px solid #1F6F5F;
          background: transparent;
          color: #1F6F5F;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-outline-brand:hover {
          background-color: #1F6F5F;
          color: white;
          transform: translateY(-2px);
          border-color: #1F6F5F;
        }
        
        .text-brand {
          color: #1F6F5F !important;
        }
        
        .bg-brand {
          background-color: #1F6F5F !important;
        }
        
        .bg-brand-soft {
          background-color: rgba(31, 111, 95, 0.1);
        }
        
        .badge-brand {
          background-color: #1F6F5F;
          color: white;
          font-weight: 600;
        }
        
        .card-hover {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15) !important;
        }
        
        .progress-bar-brand {
          background-color: #1F6F5F;
        }
        
        .feature-icon {
          transition: transform 0.3s ease;
        }
        
        .card-hover:hover .feature-icon {
          transform: scale(1.1);
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }
        
        .floating-card {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .pulse-shadow {
          box-shadow: 0 0 0 0 rgba(31, 111, 95, 0.4);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(31, 111, 95, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(31, 111, 95, 0); }
          100% { box-shadow: 0 0 0 0 rgba(31, 111, 95, 0); }
        }
        
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        
        .nav-link:hover {
          color: #1F6F5F !important;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #1F6F5F;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 80%;
        }

        .hero-image {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .hero-image:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="container">
          <a className="navbar-brand fw-bold fs-3" href="#" >
            <i className="bi bi-box-seam-fill me-2" ></i>
            StockMaster
          </a>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item"><a className="nav-link fw-semibold" href="#features" style={{ color: '#4a5568' }}>Features</a></li>
              <li className="nav-item"><a className="nav-link fw-semibold" href="#how-it-works" style={{ color: '#4a5568' }}>How it Works</a></li>
              <li className="nav-item"><a className="nav-link fw-semibold" href="#testimonials" style={{ color: '#4a5568' }}>Testimonials</a></li>
              <li className="nav-item ms-lg-2">
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-brand px-4 py-2 rounded-pill"
                >
                  Login 
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-gradient py-5 py-lg-7" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="mb-3">
                <span className="badge bg-brand-soft text-brand px-3 py-2 rounded-pill fw-semibold">
                  <i className="bi bi-lightning-charge-fill me-1"></i> Next-Gen Solution
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3" style={{  lineHeight: '1.2' }}>
                  <span className="text-brand"> Effortless Warehouse</span><br />
                Management 
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.2rem' }}>
               Track, manage, and optimize your stock in real-time with our powerful inventory system. Reduce losses, boost efficiency, and stay in control — anytime, anywhere.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-brand btn-lg px-5 py-3 rounded-pill shadow-sm fw-semibold"
                >
                  Get Started Free
                </button>
                <button onClick={() => navigate('/login')}  className="btn btn-outline-brand btn-lg px-5 py-3 rounded-pill fw-semibold">
                  Login Now
                </button>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex">
                  {[1,2,3,4,5].map(i => <i key={i} className="bi bi-star-fill text-warning me-1"></i>)}
                </div>
                <span className="text-muted fw-semibold">Trusted by 10,000+ businesses worldwide</span>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              
                <img 
                  src="https://images.unsplash.com/vector-1769600501932-672671c4576f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGludmVudG9yeSUyMG1hbmdlbWVudCUyMGlsbHVzdHJhcnRpb258ZW58MHx8MHx8fDA%3D"
                  alt="Warehouse Management Dashboard"
                  className="hero-image"
                />
              
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUSTED BY ================= */}
      <section className="py-5 bg-white border-top border-bottom" style={{ borderColor: '#e5e7eb !important' }}>
        <div className="container">
          <p className="text-center text-muted fw-bold mb-4 small text-uppercase tracking-wide">Trusted by industry leaders</p>
          <div className="row justify-content-center align-items-center g-4">
            {['epiGAMIA', 'BOROSIL', 'Mondelēz', 'TATA CLiQ', 'The Good Glamm'].map((brand, idx) => (
              <div className="col-6 col-md-2 text-center" key={idx}>
                <h5 className="fw-bold text-secondary opacity-50 mb-0" style={{ letterSpacing: '1px' }}>{brand}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-5 py-lg-7" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-brand-soft text-brand px-3 py-2 rounded-pill fw-semibold mb-3">Core Features</span>
            <h2 className="fw-bold mb-3" style={{  fontSize: '2.5rem' }}>Everything You Need to Scale</h2>
            <p className="text-muted fs-5">Streamline your operations with our cutting-edge tools</p>
          </div>
          <div className="row g-4">
            {[
  {
    icon: 'bi-box-seam',
    title: 'Product Management',
    desc: 'Add, update, and delete products. Keep all your product details organized in one place and manage your inventory without any confusion.'
  },
  {
    icon: 'bi-upc-scan',
    title: 'Real-Time Stock Tracking',
    desc: 'Stay updated with current stock levels at all times. Instantly see which products are low or out of stock and avoid shortages.'
  },
  {
    icon: 'bi-speedometer2',
    title: 'Inventory Dashboard',
    desc: 'Get a clear overview of your inventory with a simple dashboard. Monitor total products, stock counts, and key information at a glance.'
  },
  {
    icon: 'bi-shield-lock',
    title: 'Easy Admin Control',
    desc: 'Designed for a single admin user, giving you full control over your inventory system without unnecessary complexity or multiple user management.'
  }
].map((feature, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="card h-100 border-0 shadow-sm p-4 text-center card-hover" style={{ borderRadius: '24px', backgroundColor: 'white' }}>
                  <div className="bg-brand-soft rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                    <i className={`bi ${feature.icon} fs-2 feature-icon text-brand`}></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F6F5F' }}>{feature.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-5 py-lg-7 bg-white" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-brand-soft text-brand px-3 py-2 rounded-pill fw-semibold mb-3">Simple Process</span>
            <h2 className="fw-bold mb-3" style={{  fontSize: '2.5rem' }}>Scale Your Operations in 3 Simple Steps</h2>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="bg-brand-soft rounded-4 p-4 shadow-sm">
                <div className="bg-white rounded-3 p-4 shadow-sm">
                  <div className="d-flex align-items-center mb-3 pb-2" style={{ borderBottom: '2px solid #1F6F5F' }}>
                    <div className="bg-brand rounded-circle me-2" style={{ width: 12, height: 12 }}></div>
                    <div className="bg-warning rounded-circle me-2" style={{ width: 12, height: 12 }}></div>
                    <div className="bg-success rounded-circle me-2" style={{ width: 12, height: 12 }}></div>
                    <small className="text-muted ms-2 fw-semibold">StockMaster Dashboard Live</small>
                  </div>
                  <div className="row g-2">
                    <div className="col-8">
                      <div className="bg-brand-soft rounded p-2 mb-2" style={{ height: '60px' }}></div>
                      <div className="bg-brand-soft rounded p-2" style={{ height: '60px' }}></div>
                    </div>
                    <div className="col-4">
                      <div className="bg-brand rounded p-2 h-100 d-flex align-items-center justify-content-center">
                        <i className="bi bi-graph-up text-white fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {[
                { num: '01', title: 'Add Your Products', desc: 'Add all your products into the system with details. Everything is stored in an organized way for easy access.' },
                { num: '02', title: 'Manage Stock in Real-Time', desc: 'Update stock instantly whenever products are added, sold, or removed. The system keeps your inventory always accurate and up to date.' },
                { num: '03', title: 'Monitor & Control', desc: 'Use the admin dashboard to view total stock, track product status, and manage everything from one simple place with full control.' }
              ].map((step, idx) => (
                <div className="d-flex mb-4 align-items-start" key={idx}>
                  <div className="flex-shrink-0">
                    <div className="bg-brand rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: '48px', height: '48px', color: 'white' }}>
                      {step.num}
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-2" style={{ color: '#1F6F5F' }}>{step.title}</h5>
                    <p className="text-muted mb-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-5 py-lg-7" style={{ paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#f9fafb' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-brand-soft text-brand px-3 py-2 rounded-pill fw-semibold mb-3">Testimonials</span>
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>What Our Clients Say</h2>
            <p className="text-muted fs-5">Loved by businesses worldwide</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Sarah Johnson', role: 'Operations Director', text: 'StockMaster transformed our warehouse operations. The real-time tracking is incredible!', rating: 5 },
              { name: 'Michael Chen', role: 'CEO, TechLogistics', text: 'Best decision we made. Automation features saved us 30% in operational costs.', rating: 5 },
              { name: 'Priya Sharma', role: 'Supply Chain Manager', text: 'Multi-warehouse support is seamless. Highly recommended for growing businesses.', rating: 5 }
            ].map((testimonial, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm p-4 card-hover" style={{ borderRadius: '24px' }}>
                  <div className="d-flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-3 fst-italic">"{testimonial.text}"</p>
                  <div className="mt-auto">
                    <h6 className="fw-bold mb-0" style={{ color: '#1F6F5F' }}>{testimonial.name}</h6>
                    <small className="text-brand">{testimonial.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-5" style={{ backgroundColor: '#1F6F5F' }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3" style={{ color: 'white' }}>Ready to Transform Your Warehouse?</h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>Join thousands of businesses already using StockMaster</p>
          <button 
            onClick={() => navigate('/signup')} 
            className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-semibold pulse-shadow"
            style={{ color: '#1F6F5F', backgroundColor: 'white', border: 'none' }}
          >
            Start Free Trial 
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h4 className="fw-bold mb-3">
                <i className="bi bi-box-seam-fill me-2 text-brand"></i>
                StockMaster
              </h4>
              <p className="text-white-50">Intelligent warehouse management for modern businesses.</p>
            </div>
            <div className="col-md-8">
              <div className="row">
                <div className="col-6 col-md-3">
                  <h6 className="fw-bold mb-3">Product</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#features" className="text-white-50 text-decoration-none">Features</a></li>
                    <li className="mb-2"><a href="#how-it-works" className="text-white-50 text-decoration-none">Pricing</a></li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="fw-bold mb-3">Company</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">About</a></li>
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Blog</a></li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="fw-bold mb-3">Support</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Help Center</a></li>
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Contact</a></li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h6 className="fw-bold mb-3">Legal</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Privacy</a></li>
                    <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-4 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center">
            <p className="text-white-50 mb-0">&copy; 2026 StockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;