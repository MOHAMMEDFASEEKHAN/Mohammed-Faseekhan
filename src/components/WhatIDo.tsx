import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ScrollTrigger.isTouch) return;

    container
      .querySelectorAll(".what-content")
      .forEach((card) => card.classList.remove("what-noTouch"));
    const onClick = (event: MouseEvent) => {
      const card = (event.target as HTMLElement).closest(".what-content");
      if (card instanceof HTMLDivElement && container.contains(card)) {
        handleClick(card);
      }
    };
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in" ref={containerRef}>
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div className="what-content what-noTouch">
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>ANALYSIS</h3>
              <h4>Description</h4>
              <p>
                I analyze data to uncover meaningful insights and turn raw information into actionable decisions. I work with SQL, Excel, Python, Pandas, NumPy, and Power BI to clean, transform, visualize, and interpret data. I also use AI and automation to make analytical workflows faster and smarter.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">SQL</div>
                <div className="what-tags">Excel</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">Pandas</div>
                <div className="what-tags">NumPy</div>
                <div className="what-tags">Power BI</div>
                <div className="what-tags">Data Cleaning</div>
                <div className="what-tags">Data Analysis</div>
                <div className="what-tags">Data Visualization</div>
                <div className="what-tags">Exploratory Data Analysis</div>
                <div className="what-tags">AI</div>
                <div className="what-tags">n8n</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div className="what-content what-noTouch">
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>DEVELOP</h3>
              <h4>Description</h4>
              <p>
                I develop intelligent, data-driven solutions by combining programming, AI, automation, and analytics. I use Python, AI, n8n, APIs, and modern technologies to automate workflows and turn ideas into practical, functional solutions.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Python</div>
                <div className="what-tags">SQL</div>
                <div className="what-tags">AI</div>
                <div className="what-tags">n8n</div>
                <div className="what-tags">Automation</div>
                <div className="what-tags">APIs</div>
                <div className="what-tags">Data Processing</div>
                <div className="what-tags">Workflow Automation</div>
                <div className="what-tags">JavaScript</div>
                <div className="what-tags">Git & GitHub</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div className="what-content what-noTouch">
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>DESIGN</h3>
              <h4>Description</h4>
              <p>
                I create modern AI-powered websites and applications using AI-assisted development and modern web technologies. I transform ideas into functional digital products, combining user experience, AI, automation, and development from concept to deployment.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">AI-Assisted Development</div>
                <div className="what-tags">AI Website Development</div>
                <div className="what-tags">AI App Development</div>
                <div className="what-tags">HTML</div>
                <div className="what-tags">CSS</div>
                <div className="what-tags">JavaScript</div>
                <div className="what-tags">UI/UX</div>
                <div className="what-tags">Responsive Design</div>
                <div className="what-tags">API Integration</div>
                <div className="what-tags">Automation</div>
                <div className="what-tags">Git & GitHub</div>
                <div className="what-tags">Deployment</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
