// =========================================
// DATA
// =========================================

let projects =
    JSON.parse(
        localStorage.getItem("devboardProjects")
    ) || [];


let activities =
    JSON.parse(
        localStorage.getItem("devboardActivities")
    ) || [];


// =========================================
// ELEMENTS
// =========================================

const sidebar =
    document.querySelector("#sidebar");

const mobileMenuBtn =
    document.querySelector("#mobileMenuBtn");

const navLinks =
    document.querySelectorAll(".nav-link");

const pageTitle =
    document.querySelector("#pageTitle");


// Dashboard

const totalProjects =
    document.querySelector("#totalProjects");

const completedProjects =
    document.querySelector("#completedProjects");

const progressProjects =
    document.querySelector("#progressProjects");

const completionRate =
    document.querySelector("#completionRate");

const progressPercentage =
    document.querySelector("#progressPercentage");


// Projects

const projectGrid =
    document.querySelector("#projectGrid");

const emptyState =
    document.querySelector("#emptyState");

const searchInput =
    document.querySelector("#searchInput");

const statusFilter =
    document.querySelector("#statusFilter");


// Modal

const projectModal =
    document.querySelector("#projectModal");

const projectForm =
    document.querySelector("#projectForm");

const modalTitle =
    document.querySelector("#modalTitle");

const editProjectId =
    document.querySelector("#editProjectId");

const projectName =
    document.querySelector("#projectName");

const projectTech =
    document.querySelector("#projectTech");

const projectDescription =
    document.querySelector("#projectDescription");

const projectLink =
    document.querySelector("#projectLink");


// Details

const detailsModal =
    document.querySelector("#detailsModal");

const detailsName =
    document.querySelector("#detailsName");

const detailsStatus =
    document.querySelector("#detailsStatus");

const detailsDescription =
    document.querySelector("#detailsDescription");

const detailsTech =
    document.querySelector("#detailsTech");

const detailsLink =
    document.querySelector("#detailsLink");


// Activities

const activityList =
    document.querySelector("#activityList");

const dashboardActivity =
    document.querySelector("#dashboardActivity");


// Theme

const themeBtn =
    document.querySelector("#themeBtn");

const settingsThemeBtn =
    document.querySelector("#settingsThemeBtn");


// Notifications

const notificationBtn =
    document.querySelector("#notificationBtn");

const notificationPanel =
    document.querySelector("#notificationPanel");

const closeNotification =
    document.querySelector("#closeNotification");


// =========================================
// SAVE DATA
// =========================================

function saveProjects() {

    localStorage.setItem(
        "devboardProjects",
        JSON.stringify(projects)
    );

}


function saveActivities() {

    localStorage.setItem(
        "devboardActivities",
        JSON.stringify(activities)
    );

}


// =========================================
// ACTIVITY
// =========================================

function addActivity(message) {

    const activity = {

        id: Date.now(),

        message: message,

        time: new Date().toLocaleString()

    };


    activities.unshift(activity);


    if (activities.length > 20) {

        activities.pop();

    }


    saveActivities();

    renderActivities();

}


// =========================================
// RENDER ACTIVITIES
// =========================================

function renderActivities() {

    activityList.innerHTML = "";

    dashboardActivity.innerHTML = "";


    if (activities.length === 0) {

        activityList.innerHTML = `
            <div class="activity-item">

                <div class="activity-dot"></div>

                <div>

                    <p>No activity yet.</p>

                    <small>
                        Start by creating a project.
                    </small>

                </div>

            </div>
        `;

        dashboardActivity.innerHTML = `
            <div class="activity-item">

                <div class="activity-dot"></div>

                <div>

                    <p>No recent activity.</p>

                </div>

            </div>
        `;

        return;

    }


    activities.forEach(function(activity) {

        const element =
            document.createElement("div");


        element.classList.add(
            "activity-item"
        );


        element.innerHTML = `

            <div class="activity-dot"></div>

            <div>

                <p>
                    ${activity.message}
                </p>

                <small>
                    ${activity.time}
                </small>

            </div>

        `;


        activityList.appendChild(element);

    });


    activities
        .slice(0, 4)
        .forEach(function(activity) {

            const element =
                document.createElement("div");


            element.classList.add(
                "activity-item"
            );


            element.innerHTML = `

                <div class="activity-dot"></div>

                <div>

                    <p>
                        ${activity.message}
                    </p>

                    <small>
                        ${activity.time}
                    </small>

                </div>

            `;


            dashboardActivity.appendChild(
                element
            );

        });

}


// =========================================
// UPDATE DASHBOARD
// =========================================

function updateDashboard() {

    const total =
        projects.length;


    const completed =
        projects.filter(function(project) {

            return project.completed;

        }).length;


    const progress =
        total - completed;


    const rate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    totalProjects.textContent =
        total;


    completedProjects.textContent =
        completed;


    progressProjects.textContent =
        progress;


    completionRate.textContent =
        rate + "%";


    progressPercentage.textContent =
        rate + "%";

}


// =========================================
// CREATE PROJECT CARD
// =========================================

function createProjectCard(project) {

    const card =
        document.createElement("article");


    card.classList.add(
        "project-card"
    );


    const statusClass =
        project.completed
            ? "status-completed"
            : "status-progress";


    const statusText =
        project.completed
            ? "Completed"
            : "In Progress";


    card.innerHTML = `

        <span class="status-badge ${statusClass}">
            ${statusText}
        </span>


        <h3>
            ${project.name}
        </h3>


        <p class="project-description">
            ${project.description || "No description provided."}
        </p>


        <p class="tech-text">
            ${project.tech}
        </p>


        <div class="project-actions">

            <button
                data-action="view"
                data-id="${project.id}"
            >
                View
            </button>


            <button
                data-action="complete"
                data-id="${project.id}"
            >
                ${project.completed
                    ? "Reopen"
                    : "Complete"}
            </button>


            <button
                data-action="edit"
                data-id="${project.id}"
            >
                Edit
            </button>


            <button
                data-action="delete"
                data-id="${project.id}"
            >
                Delete
            </button>

        </div>

    `;


    return card;

}


// =========================================
// RENDER PROJECTS
// =========================================

function renderProjects() {

    projectGrid.innerHTML = "";


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filter =
        statusFilter.value;


    const filteredProjects =
        projects.filter(function(project) {


            const matchesSearch =

                project.name
                    .toLowerCase()
                    .includes(search)

                ||

                project.tech
                    .toLowerCase()
                    .includes(search);


            const matchesFilter =

                filter === "all"

                ||

                (
                    filter === "completed"
                    &&
                    project.completed
                )

                ||

                (
                    filter === "progress"
                    &&
                    !project.completed
                );


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    if (filteredProjects.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    filteredProjects.forEach(
        function(project) {

            projectGrid.appendChild(
                createProjectCard(project)
            );

        }
    );


    updateDashboard();

}


// =========================================
// OPEN CREATE MODAL
// =========================================

function openCreateModal() {

    projectForm.reset();


    editProjectId.value = "";


    modalTitle.textContent =
        "Create Project";


    projectModal.classList.add(
        "show"
    );


    projectName.focus();

}


// =========================================
// OPEN EDIT MODAL
// =========================================

function openEditModal(project) {

    editProjectId.value =
        project.id;


    projectName.value =
        project.name;


    projectTech.value =
        project.tech;


    projectDescription.value =
        project.description || "";


    projectLink.value =
        project.link || "";


    modalTitle.textContent =
        "Edit Project";


    projectModal.classList.add(
        "show"
    );

}


// =========================================
// CLOSE MODAL
// =========================================

function closeProjectModal() {

    projectModal.classList.remove(
        "show"
    );

}


// =========================================
// CREATE / UPDATE PROJECT
// =========================================

projectForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            projectName.value.trim();


        const tech =
            projectTech.value.trim();


        const description =
            projectDescription.value.trim();


        const link =
            projectLink.value.trim();


        if (!name || !tech) {

            alert(
                "Project name and technologies are required."
            );

            return;

        }


        const id =
            editProjectId.value;


        // EDIT

        if (id) {

            const project =
                projects.find(
                    function(item) {

                        return item.id === Number(id);

                    }
                );


            if (project) {

                project.name =
                    name;

                project.tech =
                    tech;

                project.description =
                    description;

                project.link =
                    link;


                addActivity(
                    `Updated project "${name}"`
                );

            }

        }


        // CREATE

        else {

            const newProject = {

                id: Date.now(),

                name: name,

                tech: tech,

                description:
                    description,

                link: link,

                completed: false

            };


            projects.unshift(
                newProject
            );


            addActivity(
                `Created project "${name}"`
            );

        }


        saveProjects();


        renderProjects();


        closeProjectModal();

    }
);


// =========================================
// PROJECT ACTIONS
// =========================================

projectGrid.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");


        if (!button) {

            return;

        }


        const id =
            Number(
                button.dataset.id
            );


        const action =
            button.dataset.action;


        const project =
            projects.find(
                function(item) {

                    return item.id === id;

                }
            );


        if (!project) {

            return;

        }


        // VIEW

        if (action === "view") {

            detailsName.textContent =
                project.name;


            detailsDescription.textContent =
                project.description ||
                "No description provided.";


            detailsTech.textContent =
                project.tech;


            detailsStatus.textContent =
                project.completed
                    ? "Completed"
                    : "In Progress";


            detailsStatus.className =
                project.completed
                    ? "status-badge status-completed"
                    : "status-badge status-progress";


            if (project.link) {

                detailsLink.href =
                    project.link;

                detailsLink.style.display =
                    "inline-block";

            } else {

                detailsLink.style.display =
                    "none";

            }


            detailsModal.classList.add(
                "show"
            );

        }


        // COMPLETE

        if (action === "complete") {

            project.completed =
                !project.completed;


            saveProjects();


            addActivity(
                project.completed
                    ? `Completed project "${project.name}"`
                    : `Reopened project "${project.name}"`
            );


            renderProjects();

        }


        // EDIT

        if (action === "edit") {

            openEditModal(
                project
            );

        }


        // DELETE

        if (action === "delete") {

            const confirmed =
                confirm(
                    `Delete "${project.name}"?`
                );


            if (!confirmed) {

                return;

            }


            projects =
                projects.filter(
                    function(item) {

                        return item.id !== id;

                    }
                );


            saveProjects();


            addActivity(
                `Deleted project "${project.name}"`
            );


            renderProjects();

        }

    }
);


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    renderProjects
);


// =========================================
// FILTER
// =========================================

statusFilter.addEventListener(
    "change",
    renderProjects
);


// =========================================
// OPEN PROJECT BUTTONS
// =========================================

document
    .querySelector("#openProjectBtn")
    .addEventListener(
        "click",
        openCreateModal
    );


document
    .querySelector("#openProjectBtn2")
    .addEventListener(
        "click",
        openCreateModal
    );


// =========================================
// CLOSE MODAL BUTTONS
// =========================================

document
    .querySelector("#closeModalBtn")
    .addEventListener(
        "click",
        closeProjectModal
    );


document
    .querySelector("#cancelModalBtn")
    .addEventListener(
        "click",
        closeProjectModal
    );


document
    .querySelector("#closeDetailsBtn")
    .addEventListener(
        "click",
        function() {

            detailsModal.classList.remove(
                "show"
            );

        }
    );


// =========================================
// CLOSE MODALS OUTSIDE
// =========================================

projectModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            projectModal
        ) {

            closeProjectModal();

        }

    }
);


detailsModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            detailsModal
        ) {

            detailsModal.classList.remove(
                "show"
            );

        }

    }
);


// =========================================
// THEME
// =========================================

function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );


    const isLight =
        document.body.classList.contains(
            "light"
        );


    localStorage.setItem(
        "devboardTheme",
        isLight
            ? "light"
            : "dark"
    );

}


themeBtn.addEventListener(
    "click",
    toggleTheme
);


settingsThemeBtn.addEventListener(
    "click",
    toggleTheme
);


// Load saved theme

const savedTheme =
    localStorage.getItem(
        "devboardTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light"
    );

}


// =========================================
// CLEAR PROJECTS
// =========================================

document
    .querySelector("#clearProjectsBtn")
    .addEventListener(
        "click",
        function() {

            if (projects.length === 0) {

                alert(
                    "There are no projects to delete."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Delete ALL projects?"
                );


            if (!confirmed) {

                return;

            }


            projects = [];


            saveProjects();


            addActivity(
                "Cleared all projects"
            );


            renderProjects();

        }
    );


// =========================================
// NOTIFICATIONS
// =========================================

notificationBtn.addEventListener(
    "click",
    function() {

        notificationPanel.classList.toggle(
            "show"
        );

    }
);


closeNotification.addEventListener(
    "click",
    function() {

        notificationPanel.classList.remove(
            "show"
        );

    }
);


// =========================================
// MOBILE SIDEBAR
// =========================================

mobileMenuBtn.addEventListener(
    "click",
    function() {

        sidebar.classList.toggle(
            "open"
        );

    }
);


// =========================================
// NAVIGATION
// =========================================

navLinks.forEach(
    function(link) {

        link.addEventListener(
            "click",
            function() {


                navLinks.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );


                const target =
                    link.getAttribute(
                        "href"
                    );


                if (target === "#dashboard") {

                    pageTitle.textContent =
                        "Dashboard";

                }


                if (target === "#projects") {

                    pageTitle.textContent =
                        "Projects";

                }


                if (target === "#activity") {

                    pageTitle.textContent =
                        "Activity";

                }


                if (target === "#settings") {

                    pageTitle.textContent =
                        "Settings";

                }


                if (
                    window.innerWidth <= 800
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

            }
        );

    }
);


// =========================================
// INITIAL LOAD
// =========================================

renderProjects();

renderActivities();

updateDashboard();