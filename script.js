// ========================================
// JOB APPLICATION TRACKER
// ========================================


// ========================================
// GET ELEMENTS
// ========================================

const modal = document.getElementById("modal");

const openAddBtn = document.getElementById("openAddBtn");
const openAddNav = document.getElementById("openAddNav");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const applicationForm =
    document.getElementById("applicationForm");

const applicationsContainer =
    document.getElementById("applicationsContainer");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const modalTitle =
    document.getElementById("modalTitle");

const companyInput =
    document.getElementById("company");

const roleInput =
    document.getElementById("role");

const locationInput =
    document.getElementById("location");

const dateInput =
    document.getElementById("date");

const jobTypeInput =
    document.getElementById("jobType");

const statusInput =
    document.getElementById("status");

const jobUrlInput =
    document.getElementById("jobUrl");

const notesInput =
    document.getElementById("notes");

const editIdInput =
    document.getElementById("editId");

const totalCount =
    document.getElementById("totalCount");

const appliedCount =
    document.getElementById("appliedCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");

const rejectedCount =
    document.getElementById("rejectedCount");


// ========================================
// TOAST SYSTEM
// ========================================

function showToast(message) {

    let toast =
        document.getElementById("toast");

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id = "toast";
        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);
}


// ========================================
// LOCAL STORAGE
// ========================================

let applications = [];

try {

    const savedApplications =
        JSON.parse(
            localStorage.getItem("jobApplications")
        );

    applications =
        Array.isArray(savedApplications)
            ? savedApplications
            : [];

} catch (error) {

    console.error(
        "Error loading applications:",
        error
    );

    applications = [];
}


function saveApplications() {

    try {

        localStorage.setItem(
            "jobApplications",
            JSON.stringify(applications)
        );

    } catch (error) {

        console.error(
            "Error saving applications:",
            error
        );

        showToast(
            "Unable to save application."
        );
    }
}


// ========================================
// EXPORT CSV BUTTON
// ========================================

function createExportButton() {

    const sectionHeader =
        document.querySelector(".section-header");

    if (!sectionHeader) return;

    // Prevent duplicate button
    if (document.getElementById("exportBtn")) {
        return;
    }

    const exportBtn =
        document.createElement("button");

    exportBtn.id = "exportBtn";
    exportBtn.className = "export-btn";
    exportBtn.type = "button";

    exportBtn.innerHTML =
        "📥 Export CSV";

    exportBtn.addEventListener(
        "click",
        exportApplicationsCSV
    );

    sectionHeader.appendChild(exportBtn);
}


function exportApplicationsCSV() {

    if (!applications.length) {

        showToast(
            "No applications to export."
        );

        return;
    }

    const headers = [
        "Company",
        "Role",
        "Location",
        "Application Date",
        "Job Type",
        "Status",
        "Job URL",
        "Notes"
    ];

    const rows =
        applications.map(application => {

            return [
                application.company || "",
                application.role || "",
                application.location || "",
                application.date || "",
                application.jobType || "",
                application.status || "",
                application.jobUrl || "",
                application.notes || ""
            ];
        });


    // CSV escaping
    function escapeCSV(value) {

        const text =
            String(value ?? "");

        return `"${text.replace(/"/g, '""')}"`;
    }


    const csvRows = [
        headers.map(escapeCSV).join(","),
        ...rows.map(
            row =>
                row.map(escapeCSV).join(",")
        )
    ];


    const csvContent =
        csvRows.join("\n");


    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "job-applications.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    showToast(
        "Applications exported successfully."
    );
}


// ========================================
// MODAL
// ========================================

function openModal() {

    modal.classList.add("show");

}


function closeApplicationModal() {

    modal.classList.remove("show");

    resetForm();

}


function resetForm() {

    applicationForm.reset();

    editIdInput.value = "";

    modalTitle.textContent =
        "Add Application";

    dateInput.value =
        new Date()
            .toISOString()
            .split("T")[0];

    statusInput.value =
        "Applied";

    jobTypeInput.value =
        "Full-time";
}


// ========================================
// ADD BUTTONS
// ========================================

openAddBtn.addEventListener(
    "click",
    () => {

        resetForm();
        openModal();

    }
);


openAddNav.addEventListener(
    "click",
    () => {

        resetForm();
        openModal();

    }
);


emptyAddBtn.addEventListener(
    "click",
    () => {

        resetForm();
        openModal();

    }
);


// ========================================
// CLOSE MODAL
// ========================================

closeModal.addEventListener(
    "click",
    closeApplicationModal
);


cancelBtn.addEventListener(
    "click",
    closeApplicationModal
);


modal.addEventListener(
    "click",
    (event) => {

        if (event.target === modal) {

            closeApplicationModal();

        }

    }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeApplicationModal();

        }

    }
);


// ========================================
// ADD / EDIT APPLICATION
// ========================================

applicationForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const company =
            companyInput.value.trim();

        const role =
            roleInput.value.trim();

        const location =
            locationInput.value.trim();

        const date =
            dateInput.value;

        const jobType =
            jobTypeInput.value;

        const status =
            statusInput.value;

        let jobUrl =
            jobUrlInput.value.trim();

        const notes =
            notesInput.value.trim();

        const editId =
            editIdInput.value;


        // ====================================
        // VALIDATION
        // ====================================

        if (!company || !role || !date) {

            showToast(
                "Please fill in all required fields."
            );

            return;
        }


        // ====================================
        // URL VALIDATION
        // ====================================

        if (jobUrl) {

            if (
                !jobUrl.startsWith("http://") &&
                !jobUrl.startsWith("https://")
            ) {

                jobUrl =
                    "https://" + jobUrl;
            }


            try {

                new URL(jobUrl);

            } catch {

                showToast(
                    "Please enter a valid job URL."
                );

                return;
            }
        }


        // ====================================
        // EDIT
        // ====================================

        if (editId) {

            const index =
                applications.findIndex(
                    app => app.id === editId
                );


            if (index !== -1) {

                applications[index] = {

                    ...applications[index],

                    company,
                    role,
                    location,
                    date,
                    jobType,
                    status,
                    jobUrl,
                    notes

                };


                saveApplications();

                renderApplications();

                closeApplicationModal();

                showToast(
                    "Application updated successfully."
                );

                return;
            }
        }


        // ====================================
        // DUPLICATE CHECK
        // ====================================

        const duplicate =
            applications.some(
                app =>

                    String(app.company || "")
                        .trim()
                        .toLowerCase() ===
                        company.toLowerCase()

                    &&

                    String(app.role || "")
                        .trim()
                        .toLowerCase() ===
                        role.toLowerCase()
            );


        if (duplicate) {

            showToast(
                "This application already exists."
            );

            return;
        }


        // ====================================
        // NEW APPLICATION
        // ====================================

        const newApplication = {

            id:
                Date.now().toString(),

            company,
            role,
            location,
            date,
            jobType,
            status,
            jobUrl,
            notes

        };


        applications.unshift(
            newApplication
        );


        saveApplications();

        renderApplications();

        closeApplicationModal();

        showToast(
            "Application added successfully."
        );

    }
);


// ========================================
// RENDER APPLICATIONS
// ========================================

function renderApplications() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    const filteredApplications =
        applications.filter(
            app => {

                const company =
                    String(app.company || "")
                        .toLowerCase();

                const role =
                    String(app.role || "")
                        .toLowerCase();

                const location =
                    String(app.location || "")
                        .toLowerCase();


                const matchesSearch =
                    company.includes(searchTerm) ||
                    role.includes(searchTerm) ||
                    location.includes(searchTerm);


                const matchesStatus =
                    selectedStatus === "all" ||
                    app.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    applicationsContainer.innerHTML = "";


    // ====================================
    // EMPTY / NO RESULTS
    // ====================================

    if (
        filteredApplications.length === 0
    ) {

        emptyState.style.display =
            "block";


        const emptyTitle =
            emptyState.querySelector("h3");

        const emptyText =
            emptyState.querySelector("p");


        const hasFilters =
            searchTerm ||
            selectedStatus !== "all";


        if (hasFilters) {

            emptyTitle.textContent =
                "No matching applications";

            emptyText.textContent =
                "Try changing your search or filter.";

            // Hide Add button when showing
            // search/filter results
            emptyAddBtn.style.display =
                "none";

        } else {

            emptyTitle.textContent =
                "No applications yet";

            emptyText.textContent =
                "Start tracking your job applications by adding your first one.";

            emptyAddBtn.style.display =
                "inline-flex";
        }

    } else {

        emptyState.style.display =
            "none";
    }


    // ====================================
    // CREATE CARDS
    // ====================================

    filteredApplications.forEach(
        application => {

            applicationsContainer.appendChild(
                createApplicationCard(application)
            );

        }
    );


    updateDashboard();
}


// ========================================
// CREATE APPLICATION CARD
// ========================================

function createApplicationCard(
    application
) {

    const card =
        document.createElement("div");

    card.className =
        "application-card";


    const companyInitial =
        String(application.company || "")
            .charAt(0)
            .toUpperCase();


    const statusClass =
        String(application.status || "")
            .toLowerCase();


    const formattedDate =
        formatDate(application.date);


    card.innerHTML = `

        <div class="company-info">

            <div class="company-logo">
                ${escapeHTML(companyInitial)}
            </div>

            <div>

                <h3>
                    ${escapeHTML(
                        application.company
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        application.role
                    )}
                </p>

            </div>

        </div>


        <div class="application-detail">

            <strong>
                📍
                ${escapeHTML(
                    application.location ||
                    "Not specified"
                )}
            </strong>

            <p>
                ${escapeHTML(
                    application.jobType ||
                    "Not specified"
                )}
            </p>

        </div>


        <div class="application-detail">

            <strong>
                ${formattedDate}
            </strong>

            <p>
                Applied Date
            </p>

        </div>


        <div>

            <span class="status-badge status-${escapeHTML(statusClass)}">

                ${escapeHTML(
                    application.status
                )}

            </span>

        </div>


        <div class="card-actions">

            ${
                application.jobUrl
                    ?

                `
                <button
                    class="action-btn"
                    onclick="openJobLink('${encodeURIComponent(
                        application.jobUrl
                    )}')"
                    title="Open Job"
                    type="button"
                >
                    🔗
                </button>
                `

                    :

                ""
            }


            <button
                class="action-btn"
                onclick="editApplication('${application.id}')"
                title="Edit"
                type="button"
            >
                ✏️
            </button>


            <button
                class="action-btn delete"
                onclick="deleteApplication('${application.id}')"
                title="Delete"
                type="button"
            >
                🗑️
            </button>

        </div>


        ${
            application.notes
                ?

            `
            <div
                class="application-notes"
                style="
                    grid-column: 1 / -1;
                    color: #6b7280;
                    font-size: 12px;
                    padding-top: 5px;
                "
            >

                📝 ${escapeHTML(application.notes)}

            </div>
            `

                :

            ""
        }

    `;


    return card;
}


// ========================================
// EDIT
// ========================================

function editApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );


    if (!application) return;


    editIdInput.value =
        application.id;

    companyInput.value =
        application.company || "";

    roleInput.value =
        application.role || "";

    locationInput.value =
        application.location || "";

    dateInput.value =
        application.date || "";

    jobTypeInput.value =
        application.jobType ||
        "Full-time";

    statusInput.value =
        application.status ||
        "Applied";

    jobUrlInput.value =
        application.jobUrl || "";

    notesInput.value =
        application.notes || "";

    modalTitle.textContent =
        "Edit Application";

    openModal();
}


// ========================================
// DELETE
// ========================================

function deleteApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );


    if (!application) return;


    const confirmDelete =
        confirm(
            `Delete ${application.company} application?`
        );


    if (!confirmDelete) return;


    applications =
        applications.filter(
            app => app.id !== id
        );


    saveApplications();

    renderApplications();

    showToast(
        "Application deleted successfully."
    );
}


// ========================================
// JOB LINK
// ========================================

function openJobLink(encodedUrl) {

    const url =
        decodeURIComponent(encodedUrl);


    if (!url) return;


    let finalUrl = url;


    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        finalUrl =
            "https://" + url;

    }


    window.open(
        finalUrl,
        "_blank",
        "noopener,noreferrer"
    );
}


// ========================================
// SEARCH + FILTER
// ========================================

searchInput.addEventListener(
    "input",
    renderApplications
);


statusFilter.addEventListener(
    "change",
    renderApplications
);


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    totalCount.textContent =
        applications.length;


    appliedCount.textContent =
        applications.filter(
            app =>
                app.status === "Applied"
        ).length;


    interviewCount.textContent =
        applications.filter(
            app =>
                app.status === "Interview"
        ).length;


    selectedCount.textContent =
        applications.filter(
            app =>
                app.status === "Selected"
        ).length;


    rejectedCount.textContent =
        applications.filter(
            app =>
                app.status === "Rejected"
        ).length;
}


// ========================================
// DATE
// ========================================

function formatDate(dateString) {

    if (!dateString) {

        return "No date";

    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Invalid date";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ========================================
// HTML SECURITY
// ========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// INITIALIZE
// ========================================

resetForm();

createExportButton();

renderApplications();