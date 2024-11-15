// Function to generate a unique ID for the resume based on the username
function generateUniqueId(username) {
    return username.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now();  // Ensure no spaces in username
}

// Save resume data to localStorage
function saveResumeData(id, data) {
    localStorage.setItem(id, JSON.stringify(data));
}

// Handle form submission to generate the shareable link and save data
document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const username = document.getElementById('username').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());

    // Create resume data object
    const resumeData = { username, education, experience, skills };
    
    // Generate a unique ID for the resume and save data
    const uniqueId = generateUniqueId(username);
    saveResumeData(uniqueId, resumeData);

    // Create the shareable link
    const shareableLink = `${window.location.origin}?resume=${uniqueId}`;

    // Show the generated link and provide options for copy and download
    document.getElementById('link-section').style.display = 'block';
    document.getElementById('shareable-link').value = shareableLink;

    // Handle copy link button
    document.getElementById('copy-link').addEventListener('click', function() {
        navigator.clipboard.writeText(shareableLink).then(() => {
            alert('Link copied to clipboard!');
        });
    });

    // Handle download PDF button
    document.getElementById('download-pdf').addEventListener('click', function() {
        generateAndDownloadPDF(resumeData);
    });
});

// Generate the resume and allow the user to download it as PDF
function generateAndDownloadPDF(resumeData) {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Resume - ${resumeData.username}`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Full Name: ${resumeData.username}`, 20, 30);
    doc.text(`Education: ${resumeData.education}`, 20, 40);
    doc.text(`Work Experience: ${resumeData.experience}`, 20, 50);
    doc.text(`Skills: ${resumeData.skills.join(', ')}`, 20, 60);

    doc.save(`${resumeData.username}-resume.pdf`);
}

// --- New Functionality to Display the Resume ---
function displayResume() {
    const params = new URLSearchParams(window.location.search);  // Get query parameters
    const uniqueId = params.get('resume');  // Extract unique ID from query string

    // Retrieve resume data from localStorage
    const resumeData = localStorage.getItem(uniqueId);
    
    if (resumeData) {
        const data = JSON.parse(resumeData);
        const resumeContent = `
            <h2>${data.username}</h2>
            <p><strong>Education:</strong> ${data.education}</p>
            <p><strong>Experience:</strong> ${data.experience}</p>
            <p><strong>Skills:</strong> ${data.skills.join(', ')}</p>
        `;
        
        // Insert the resume content into the page
        document.getElementById('resume-content').innerHTML = resumeContent;
        document.getElementById('resume-display').style.display = 'block';

        // Handle PDF download on the resume page
        document.getElementById('download-pdf-resume').addEventListener('click', function() {
            generateAndDownloadPDF(data);
        });
    } else {
        document.body.innerHTML = `
            <div class="container">
                <header>
                    <h1>Resume Not Found</h1>
                    <p>It looks like the resume you're looking for does not exist.</p>
                </header>
            </div>
        `;
    }
}

// Check if we're on the resume page (query parameter ?resume=uniqueID) and display the resume
if (window.location.search.includes('resume=')) {
    displayResume();
}
