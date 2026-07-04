        // --- Smooth Scrolling (Lenis) ---
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // --- Preloader ---
        const preloader = document.getElementById('preloader');
        let preloaderRemoved = false;

        function removePreloader() {
            if (preloaderRemoved || !preloader) return;
            preloaderRemoved = true;
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none'; // Force layout recalculation for Safari
                preloader.remove();
            }, 1200);
        }

        window.addEventListener('load', () => {
            setTimeout(removePreloader, 500);
        });

        // Safety fallback just in case window 'load' hangs (e.g. slow external assets)
        setTimeout(removePreloader, 3000);

        // --- Dark Mode Toggle ---
        const themeToggle = document.getElementById('theme-toggle');
        const transitionLayer = document.getElementById('theme-transition-layer');
        let isDarkMode = false;
        
        if (themeToggle && transitionLayer) {
            themeToggle.addEventListener('click', (e) => {
                const rect = themeToggle.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                isDarkMode = !isDarkMode;
                const newBg = isDarkMode ? '#1a1a1a' : '#f2f2f0';
                const newText = isDarkMode ? '#f2f2f0' : '#1a1a1a';
                const newBorder = isDarkMode ? '#444' : '#b3b3b3';
                
                transitionLayer.style.backgroundColor = newBg;
                transitionLayer.style.transition = 'none';
                transitionLayer.style.clipPath = `circle(0px at ${x}px ${y}px)`;
                
                // Force reflow
                void transitionLayer.offsetWidth;
                
                transitionLayer.style.transition = 'clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                transitionLayer.style.clipPath = `circle(150vw at ${x}px ${y}px)`;
                
                setTimeout(() => {
                    document.documentElement.style.setProperty('--bg-color', newBg);
                    document.documentElement.style.setProperty('--text-color', newText);
                    document.documentElement.style.setProperty('--border-color', newBorder);
                    
                    transitionLayer.style.transition = 'none';
                    transitionLayer.style.clipPath = 'circle(0px at 50% 50%)';
                    const themeIcon = document.getElementById('theme-icon');
                    if (themeIcon) {
                        if (isDarkMode) {
                            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
                        } else {
                            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
                        }
                    }
                }, 800);
            });
        }

        // --- Fluid Canvas Background ---
        const bgCanvas = document.getElementById('bg-canvas');
        if (bgCanvas) {
            const bgCtx = bgCanvas.getContext('2d');
            
            function resizeBg() {
                bgCanvas.width = window.innerWidth;
                bgCanvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeBg);
            resizeBg();
            
            let time = 0;
            function drawBg() {
                const w = bgCanvas.width;
                const h = bgCanvas.height;
                bgCtx.clearRect(0, 0, w, h);
                
                const cx = w/2 + Math.cos(time) * w/4;
                const cy = h/2 + Math.sin(time * 0.8) * h/4;
                
                bgCtx.beginPath();
                const opacity = isDarkMode ? 0.08 : 0.03;
                bgCtx.fillStyle = `rgba(128, 128, 128, ${opacity})`;
                bgCtx.arc(cx, cy, w/1.5, 0, Math.PI * 2);
                bgCtx.fill();
                
                time += 0.005;
                requestAnimationFrame(drawBg);
            }
            drawBg();
        }

        // Modal Logic
        const resumeBtn = document.getElementById('resume-btn');
        const modal = document.getElementById('download-modal');
        const btnCancel = document.getElementById('btn-cancel');
        const btnPdf = document.getElementById('btn-pdf');
        const btnDocx = document.getElementById('btn-docx');

        resumeBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        btnCancel.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Clean, Single-Page Resume Template
        const resumeTemplate = `
            <div style="padding: 35px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; background: #fff; max-width: 800px; margin: 0 auto; box-sizing: border-box; line-height: 1.4;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 34px; margin: 0 0 5px 0; color: #000; letter-spacing: -0.5px; text-transform: uppercase; font-weight: bold;">Aishwarya Chundu</h1>
                        <p style="font-size: 16px; margin: 0; color: #444; font-weight: bold; text-transform: uppercase;">Frontend & QA Engineer</p>
                    </div>
                    <div style="text-align: right; font-size: 13px; color: #444; line-height: 1.4;">
                        <p style="margin: 0 0 2px 0;">India</p>
                        <p style="margin: 0 0 2px 0;"><a href="mailto:aishwarya.darion@gmail.com" style="color: #444; text-decoration: none;">aishwarya.darion@gmail.com</a></p>
                        <p style="margin: 0;"><a href="https://www.linkedin.com/in/aishwarya-chundu-a64a65353" style="color: #444; text-decoration: none;">linkedin.com/in/aishwarya-chundu-a64a65353</a></p>
                    </div>
                </div>

                <!-- 2 Column Layout -->
                <div style="display: flex; gap: 25px;">
                    
                    <!-- Left Column -->
                    <div style="flex: 2;">
                        <!-- Summary -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Professional Summary</h2>
                            <p style="font-size: 13px; margin: 0; text-align: justify; line-height: 1.5;">A passionate and ambitious software professional with a strong interest in frontend engineering, user interface development, and software quality assurance. Focused on transforming complex technical requirements into polished digital experiences by combining robust frontend development practices with comprehensive QA and UX principles.</p>
                        </div>

                        <!-- Experience -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Experience & Projects</h2>
                            
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <h3 style="font-size: 14px; margin: 0 0 3px 0; color: #000;">Enterprise Web Development</h3>
                                    <span style="font-size: 12px; color: #555;">Present</span>
                                </div>
                                <ul style="font-size: 13px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                    <li style="margin-bottom: 4px;">Engineered responsive and mobile-friendly web interfaces by meticulously converting design concepts into production-ready frontend components.</li>
                                    <li style="margin-bottom: 4px;">Conducted rigorous cross-browser and cross-OS testing to identify, report, and systematically resolve complex software defects.</li>
                                    <li>Improved overall usability, elevated accessibility standards, and strictly validated responsive layouts across modern devices.</li>
                                </ul>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <h3 style="font-size: 14px; margin: 0 0 3px 0; color: #000;">Enterprise Learning Management System</h3>
                                    <span style="font-size: 12px; color: #555;">2023</span>
                                </div>
                                <ul style="font-size: 13px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                    <li style="margin-bottom: 4px;">Spearheaded the frontend development of responsive user interfaces specifically tailored for enterprise-scale learning platforms.</li>
                                    <li style="margin-bottom: 4px;">Validated application functionality through extensive manual end-to-end testing of core user workflows and interactive elements.</li>
                                    <li>Documented critical software improvements and supported the rollout of intuitive feature sets that increased end-user engagement.</li>
                                </ul>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <h3 style="font-size: 14px; margin: 0 0 3px 0; color: #000;">Project Management System</h3>
                                    <span style="font-size: 12px; color: #555;">2022</span>
                                </div>
                                <ul style="font-size: 13px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                    <li style="margin-bottom: 4px;">Contributed significantly to core dashboard interface development, building highly responsive grid layouts and reusable UI widgets.</li>
                                    <li style="margin-bottom: 4px;">Designed and optimized complex task management screens and navigation flows to actively reduce user friction.</li>
                                    <li>Executed strict quality validation pipelines and continuous integration checks before large-scale production deployments.</li>
                                </ul>
                            </div>

                            <div style="margin-bottom: 0;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                                    <h3 style="font-size: 14px; margin: 0 0 3px 0; color: #000;">Employee Management Portal</h3>
                                    <span style="font-size: 12px; color: #555;">2021</span>
                                </div>
                                <ul style="font-size: 13px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                    <li style="margin-bottom: 4px;">Participated in the frontend implementation of robust employee profile interfaces and complex data-entry forms.</li>
                                    <li style="margin-bottom: 4px;">Assisted in building administrative dashboards while actively conducting continuous functional testing.</li>
                                    <li>Maintained technical documentation and pioneered minor UX improvements that streamlined routine data processing tasks.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div style="flex: 1;">
                        
                        <!-- Skills -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Technical Skills</h2>
                            <div style="margin-bottom: 10px;">
                                <h3 style="font-size: 13px; margin: 0 0 3px 0; color: #000;">Frontend Development</h3>
                                <p style="font-size: 12px; margin: 0; color: #333; line-height: 1.5;">HTML5, CSS3, JavaScript (ES6+), Responsive Web Design, Flexbox, CSS Grid, DOM Manipulation.</p>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <h3 style="font-size: 13px; margin: 0 0 3px 0; color: #000;">Quality Assurance</h3>
                                <p style="font-size: 12px; margin: 0; color: #333; line-height: 1.5;">Manual Testing, UI/UX Validation, Functional Testing, Regression Testing, Bug Tracking.</p>
                            </div>
                            <div>
                                <h3 style="font-size: 13px; margin: 0 0 3px 0; color: #000;">Tools & Core</h3>
                                <p style="font-size: 12px; margin: 0; color: #333; line-height: 1.5;">Git, GitHub, VS Code, Chrome DevTools, Web Accessibility (a11y), Performance Optimization.</p>
                            </div>
                        </div>

                        <!-- Education -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Education</h2>
                            <div style="margin-bottom: 6px;">
                                <h3 style="font-size: 13px; margin: 0 0 3px 0; color: #000;">Bachelor of Technology</h3>
                                <p style="font-size: 12px; margin: 0; color: #555; line-height: 1.5;">Comprehensive coursework in software engineering, data structures, and human-computer interaction.</p>
                            </div>
                        </div>
                        
                        <!-- Certifications -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Certifications</h2>
                            <ul style="font-size: 12px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                <li style="margin-bottom: 4px;">NPTEL: Joy of Computing Using Python</li>
                                <li>NPTEL: Human-Computer Interaction</li>
                            </ul>
                        </div>

                        <!-- Core Competencies -->
                        <div style="margin-bottom: 20px;">
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Competencies</h2>
                            <ul style="font-size: 12px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                <li style="margin-bottom: 4px;">User-Centric UI Design</li>
                                <li style="margin-bottom: 4px;">Defect Triaging & QA</li>
                                <li style="margin-bottom: 4px;">Technical Documentation</li>
                                <li style="margin-bottom: 4px;">Responsive Architecture</li>
                                <li>Cross-Browser Compatibility</li>
                            </ul>
                        </div>
                        
                        <!-- Languages -->
                        <div>
                            <h2 style="font-size: 15px; text-transform: uppercase; color: #000; border-bottom: 1px solid #aaa; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">Languages</h2>
                            <ul style="font-size: 12px; margin: 0; padding-left: 18px; color: #222; line-height: 1.5;">
                                <li style="margin-bottom: 4px;">English (Professional)</li>
                                <li style="margin-bottom: 4px;">Telugu (Native)</li>
                                <li>Hindi (Conversational)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // PDF Download
        btnPdf.addEventListener('click', () => {
            modal.classList.remove('active');

            const opt = {
                margin: 0,
                filename: 'Aishwarya_Chundu_Resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // Using the template string directly
            html2pdf().set(opt).from(resumeTemplate).save();
        });

        // DOCX Download
        btnDocx.addEventListener('click', () => {
            modal.classList.remove('active');

            const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><" + "head><meta charset='utf-8'><title>Resume</title></" + "head><" + "body>";
            const postHtml = "</" + "body></" + "html>";
            const html = preHtml + resumeTemplate + postHtml;

            const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

            const downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.href = url;
            downloadLink.download = 'Aishwarya_Chundu_Resume.docx';
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });

        // Existing Accordion Logic
        const isMobileView = window.innerWidth <= 768;
        document.querySelectorAll('.details-section').forEach((section, index) => {
            // Keep the first section open on desktop, collapse all on mobile
            if (isMobileView || index !== 0) {
                section.classList.add('collapsed');
            }

            const header = section.querySelector('.details-left');
            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
                setTimeout(drawLines, 300); // Redraw lines when accordion animates
            });
        });

        // --- Interactive Skill Tree Logic ---
        const nodes = document.querySelectorAll('.skill-node');
        const svg = document.getElementById('skill-svg');
        const progressBar = document.getElementById('skill-progress');
        const progressText = document.getElementById('skill-percent');
        const treeGraph = document.getElementById('skill-tree-graph');
        
        let activeNodes = new Set(['root']); // Root starts active
        let totalNodes = nodes.length;

        function updateProgress() {
            if (!progressBar || !progressText) return;
            const percentage = Math.floor((activeNodes.size / totalNodes) * 100);
            progressBar.style.width = percentage + '%';
            progressText.innerText = percentage + '%';
        }

        function drawLines() {
            if (!svg || !treeGraph) return;
            svg.innerHTML = ''; // clear existing lines
            
            const graphRect = treeGraph.getBoundingClientRect();
            
            nodes.forEach(node => {
                const parentId = node.getAttribute('data-parent');
                if (!parentId) return;
                
                const parent = document.querySelector(`.skill-node[data-id="${parentId}"]`);
                if (!parent) return;
                
                // Only draw if graph is visible
                if (graphRect.width === 0) return;
                
                const parentRect = parent.getBoundingClientRect();
                const nodeRect = node.getBoundingClientRect();
                
                // Calculate relative positions within the SVG container
                const startX = parentRect.left + (parentRect.width / 2) - graphRect.left;
                const startY = parentRect.bottom - graphRect.top;
                
                const endX = nodeRect.left + (nodeRect.width / 2) - graphRect.left;
                const endY = nodeRect.top - graphRect.top;
                
                // Draw bezier curve
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const controlY = startY + (endY - startY) / 2;
                
                const d = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;
                path.setAttribute('d', d);
                
                // If both are active, line is active
                if (activeNodes.has(node.getAttribute('data-id')) && activeNodes.has(parentId)) {
                    path.classList.add('active');
                }
                
                svg.appendChild(path);
            });
        }
        
        // Handle Clicks
        nodes.forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const id = node.getAttribute('data-id');
                if (!activeNodes.has(id)) {
                    activeNodes.add(id);
                    node.classList.add('active');
                    
                    // Activate parent automatically
                    let parentId = node.getAttribute('data-parent');
                    while (parentId) {
                        if (!activeNodes.has(parentId)) {
                            activeNodes.add(parentId);
                            const parentNode = document.querySelector(`.skill-node[data-id="${parentId}"]`);
                            if (parentNode) parentNode.classList.add('active');
                        }
                        const p = document.querySelector(`.skill-node[data-id="${parentId}"]`);
                        parentId = p ? p.getAttribute('data-parent') : null;
                    }
                    
                    updateProgress();
                    drawLines();
                }
            });
        });

        // Initial setup
        window.addEventListener('resize', drawLines);
        // Delay drawing slightly to ensure layout is done
        setTimeout(() => {
            drawLines();
            updateProgress();
        }, 300);

        // --- GSAP & Interactive Text Logic ---
        window.addEventListener('load', () => {
            if (typeof gsap === 'undefined') return;
            
            gsap.registerPlugin(ScrollTrigger);
            
            // 1. Hero Reveal Animation (Subtle Fade Up)
            const tl = gsap.timeline();
            
            tl.from('.main-title', {
                y: 30,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            })
            .from('.hero-subtitle', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8")
            .from('.info-row', {
                y: 15,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.6");
            
            // 2. Scroll-Triggered Reveals (Subtle)
            const detailBlocks = document.querySelectorAll('.detail-block');
            
            detailBlocks.forEach(block => {
                const elementsToAnimate = block.querySelectorAll('.block-label, h2');
                
                if (elementsToAnimate.length > 0) {
                    gsap.from(elementsToAnimate, {
                        scrollTrigger: {
                            trigger: block,
                            start: "top 85%",
                        },
                        y: 20,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            });
            
            // 3. Magnetic Hover Effect (Very Subtle)
            const magneticElements = document.querySelectorAll('.nav-pill, header a');
            
            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(el, {
                        x: x * 0.1,
                        y: y * 0.1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.7,
                        ease: "elastic.out(1, 0.3)"
                    });
                });
            });
        });
        // --- QA Bug Hunt Game Logic (Defend the Hero) ---
        let bugsFixed = 0;
        const bugCounter = document.getElementById('bug-counter');
        const qaBadge = document.getElementById('qa-badge');
        const startBtn = document.getElementById('start-qa-btn');
        const gameOverOverlay = document.getElementById('game-over-overlay');
        const retryBtn = document.getElementById('retry-btn');
        const heroImg = document.querySelector('.hero-image-container img');
        
        let gameActive = false;
        let activeIntervals = []; // Keep track of bug intervals to clear on game over
        
        function startGame() {
            if (gameActive) return;
            bugsFixed = 0;
            gameActive = true;
            bugCounter.style.display = 'block';
            bugCounter.innerText = `Bugs Fixed: 0/5`;
            bugCounter.style.borderColor = 'var(--border-color)';
            bugCounter.style.color = 'var(--text-color)';
            setTimeout(() => { bugCounter.style.opacity = '1'; }, 10);
            
            const currentHigh = parseInt(localStorage.getItem('qaHighScore') || '0');
            if (currentHigh > 0) {
                const highScoreEl = document.getElementById('high-score');
                if (highScoreEl) {
                    highScoreEl.innerText = `High Score: ${currentHigh}`;
                    highScoreEl.style.display = 'block';
                    setTimeout(() => { highScoreEl.style.opacity = '1'; }, 10);
                }
            }
            
            startBtn.style.opacity = '0';
            setTimeout(() => { startBtn.style.display = 'none'; }, 200);
            
            gameOverOverlay.style.display = 'none';
            qaBadge.style.display = 'none';
            qaBadge.style.opacity = '0';
            
            scheduleNextBug();
        }
        
        function triggerGameOver() {
            gameActive = false;
            
            // Clear all bug movement intervals
            activeIntervals.forEach(clearInterval);
            activeIntervals = [];
            
            // Remove all existing bugs
            document.querySelectorAll('.qa-bug').forEach(bug => bug.remove());
            
            gameOverOverlay.style.display = 'flex';
        }
        
        function spawnBug() {
            if (!gameActive) return;
            
            const bug = document.createElement('div');
            bug.className = 'qa-bug';
            
            const startEdge = Math.floor(Math.random() * 4);
            let x, y;
            if (startEdge === 0) { x = Math.random() * window.innerWidth; y = -30; }
            else if (startEdge === 1) { x = window.innerWidth + 30; y = Math.random() * window.innerHeight; }
            else if (startEdge === 2) { x = Math.random() * window.innerWidth; y = window.innerHeight + 30; }
            else { x = -30; y = Math.random() * window.innerHeight; }
            
            bug.style.left = x + 'px';
            bug.style.top = y + 'px';
            document.body.appendChild(bug);
            
            let posX = x;
            let posY = y;
            
            const moveInterval = setInterval(() => {
                if (!gameActive) {
                    clearInterval(moveInterval);
                    return;
                }
                
                // Track hero image
                const imgRect = heroImg.getBoundingClientRect();
                const targetX = imgRect.left + imgRect.width / 2;
                const targetY = imgRect.top + imgRect.height / 2;
                
                const angle = Math.atan2(targetY - posY, targetX - posX);
                const wiggle = (Math.random() - 0.5) * 0.4;
                const currentAngle = angle + wiggle;
                
                posX += Math.cos(currentAngle) * 0.8; // slower speed
                posY += Math.sin(currentAngle) * 0.8;
                
                bug.style.left = posX + 'px';
                bug.style.top = posY + 'px';
                bug.style.transform = `rotate(${currentAngle + Math.PI/2}rad)`;
                
                // Collision Detection
                const bugRect = bug.getBoundingClientRect();
                // We shrink the hero img bounding box slightly for a more forgiving hit area
                const hitMargin = 20; 
                if (
                    bugRect.right > imgRect.left + hitMargin &&
                    bugRect.left < imgRect.right - hitMargin &&
                    bugRect.bottom > imgRect.top + hitMargin &&
                    bugRect.top < imgRect.bottom - hitMargin
                ) {
                    // Collision!
                    triggerGameOver();
                }
                
            }, 30);
            
            activeIntervals.push(moveInterval);
            
            bug.addEventListener('mousedown', (e) => {
                e.stopPropagation(); 
                clearInterval(moveInterval);
                createSplat(posX + 12, posY + 12);
                if (bug.parentNode) bug.parentNode.removeChild(bug);
                
                if (!gameActive) return; // Prevent scoring after game over
                
                bugsFixed++;
                bugCounter.innerText = `Bugs Fixed: ${bugsFixed}/5`;
                
                // Track High Score
                const currentHigh = parseInt(localStorage.getItem('qaHighScore') || '0');
                if (bugsFixed > currentHigh) {
                    localStorage.setItem('qaHighScore', bugsFixed);
                    const highScoreEl = document.getElementById('high-score');
                    if (highScoreEl) {
                        highScoreEl.innerText = `High Score: ${bugsFixed}`;
                        highScoreEl.style.display = 'block';
                        highScoreEl.style.opacity = '1';
                    }
                }
                
                if (bugsFixed >= 5) {
                    gameActive = false;
                    activeIntervals.forEach(clearInterval);
                    bugCounter.innerText = `Bugs Fixed: 5/5 (QA Master)`;
                    bugCounter.style.borderColor = 'var(--text-color)';
                    bugCounter.style.color = 'var(--text-color)';
                    startBtn.style.display = 'inline-block';
                    startBtn.innerText = 'Play Again';
                    setTimeout(() => { startBtn.style.opacity = '1'; }, 10);
                    unlockAchievement();
                }
            });
        }

        // Advanced Splat Animation
        function createSplat(x, y) {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'bug-particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                
                // Random size and color mix (splat)
                const size = Math.random() * 8 + 4;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--text-color)' : '#e74c3c';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40 + 10;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                particle.style.transform = `translate(${tx}px, ${ty}px)`;
                
                document.body.appendChild(particle);
                setTimeout(() => {
                    if(particle.parentNode) particle.remove();
                }, 600);
            }
        }
        
        function unlockAchievement() {
            qaBadge.style.display = 'flex';
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0'; flash.style.left = '0';
            flash.style.width = '100vw'; flash.style.height = '100vh';
            flash.style.backgroundColor = 'var(--text-color)';
            flash.style.opacity = '0.1';
            flash.style.zIndex = '9999';
            flash.style.pointerEvents = 'none';
            flash.style.transition = 'opacity 1s ease-out';
            document.body.appendChild(flash);
            
            setTimeout(() => {
                flash.style.opacity = '0';
                qaBadge.style.opacity = '1';
                qaBadge.style.transform = 'translateY(0)';
            }, 100);
            
            setTimeout(() => {
                if(flash.parentNode) flash.parentNode.removeChild(flash);
            }, 1100);
        }
        
        function scheduleNextBug() {
            if (!gameActive) return;
            // Faster spawn rate for a real game feel (1 to 2.5 seconds)
            const delay = Math.random() * 1500 + 1000;
            setTimeout(() => {
                spawnBug();
                scheduleNextBug();
            }, delay);
        }
        
        startBtn.addEventListener('click', startGame);
        retryBtn.addEventListener('click', () => {
            gameOverOverlay.style.display = 'none';
            startGame();
        });
        // --- Global Mouse Click Ripple Effect ---
        document.addEventListener('mousedown', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
            }, 500);
        });

        // --- Content Protection Logic ---
        // 1. Hide image in Inspect Element by drawing to Canvas
        const heroContainer = document.querySelector('.hero-image-container');
        if (heroContainer) {
            const img = heroContainer.querySelector('img');
            if (img) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                img.style.display = 'none';
                
                const newImg = new Image();
                newImg.onload = function() {
                    canvas.width = newImg.width;
                    canvas.height = newImg.height;
                    
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                    canvas.style.maxHeight = '400px';
                    canvas.style.display = 'block';
                    canvas.style.objectFit = 'cover';
                    canvas.style.backgroundColor = '#d88c27';
                    canvas.style.pointerEvents = 'none'; // Prevent interactions
                    
                    ctx.drawImage(newImg, 0, 0);
                    heroContainer.appendChild(canvas);
                    
                    // Remove original img completely from DOM
                    img.remove();
                };
                newImg.src = img.src;
            }
        }

        // 2. Prevent right-click globally
        document.addEventListener('contextmenu', e => e.preventDefault());

        // 3. Advanced Screenshot & DevTools Protection
        
        // Hide content when window loses focus (Snipping Tool, Cmd+Shift+4, Alt-Tab)
        window.addEventListener('blur', () => {
            document.body.style.opacity = '0';
            document.body.style.filter = 'blur(10px)';
        });
        
        // Restore content when window regains focus
        window.addEventListener('focus', () => {
            document.body.style.opacity = '1';
            document.body.style.filter = 'none';
        });

        // Hide content when page is hidden (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.style.opacity = '0';
            } else {
                document.body.style.opacity = '1';
            }
        });

        // Hide content if user tries to print (Ctrl+P)
        window.addEventListener('beforeprint', () => {
            document.body.style.display = 'none';
        });
        window.addEventListener('afterprint', () => {
            document.body.style.display = 'block';
        });

        // Aggressive DevTools blocking via debugger loop
        setInterval(() => {
            const before = new Date().getTime();
            debugger;
            const after = new Date().getTime();
            if (after - before > 100) {
                // If debugger triggered, obscure screen
                document.body.style.display = 'none';
                window.location.reload();
            }
        }, 1000);

        document.addEventListener('keydown', (e) => {
            // Block PrintScreen (Clear clipboard and blur screen momentarily)
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText(''); // Attempt to clear clipboard
                document.body.style.opacity = '0';
                setTimeout(() => { document.body.style.opacity = '1'; }, 2000);
            }
            
            // Mac Screenshot shortcuts Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
            if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
                document.body.style.opacity = '0';
                setTimeout(() => { document.body.style.opacity = '1'; }, 2000);
            }
            
            // Block DevTools Shortcuts
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
                (e.ctrlKey && e.key === 'U') ||
                (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
                (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'U'))
            ) {
                e.preventDefault();
                return false;
            }
        });
