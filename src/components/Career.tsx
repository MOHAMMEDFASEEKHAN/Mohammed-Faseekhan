import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My journey <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>DATA ANALYTICS</h4>
                <h5>Projects & Practical Experience</h5>
              </div>
              <h3>2026 — NOW</h3>
            </div>
            <p>
              Building practical data analytics projects using SQL, Excel, Python, Pandas, NumPy, and Power BI to clean, analyze, visualize, and transform data into meaningful insights.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI & AUTOMATION</h4>
                <h5>Projects & Development</h5>
              </div>
              <h3>2026 — NOW</h3>
            </div>
            <p>
              Developing AI-powered automation workflows using AI tools and n8n to automate repetitive tasks, connect processes, and create smarter data-driven solutions.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI-POWERED DEVELOPMENT</h4>
                <h5>Projects & Development</h5>
              </div>
              <h3>2026 — NOW</h3>
            </div>
            <p>
              Building AI-powered websites and applications using AI-assisted development and modern web technologies, taking ideas from concept and development through integration and deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
