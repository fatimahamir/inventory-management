function Navbar({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-box-seam"></i> StockMaster
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link text-white">
                <i className="bi bi-person-circle"></i> Admin
              </span>
            </li>
            <li className="nav-item">
              <button onClick={onLogout} className="btn btn-outline-light btn-sm ms-2">
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;