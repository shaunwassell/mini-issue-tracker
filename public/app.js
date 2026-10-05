const issuesElement = document.getElementById("issues");
const issueForm = document.getElementById("issue-form");
const searchForm = document.getElementById("search-form");
const showAllButton = document.getElementById("show-all");

async function loadIssues() {
  const response = await fetch("/api/issues");
  const issues = await response.json();

  renderIssues(issues);
}

function renderIssues(issues) {
  issuesElement.innerHTML = "";

  for (const issue of issues) {
    const element = document.createElement("article");

    // INTENTIONALLY VULNERABLE:
    // User-controlled content is inserted directly into HTML.
    element.innerHTML = `
      <h3>${issue.title}</h3>
      <p>${issue.description}</p>
      <small>Issue #${issue.id}</small>
    `;

    issuesElement.appendChild(element);
  }
}

issueForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  await fetch("/api/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      description
    })
  });

  issueForm.reset();

  await loadIssues();
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = document.getElementById("search").value;

  const response = await fetch(
    `/api/issues/search?q=${encodeURIComponent(query)}`
  );

  const issues = await response.json();

  renderIssues(issues);
});

showAllButton.addEventListener("click", loadIssues);

loadIssues();