import { db } from "./firebase-config.js";
import { 
    collection, 
    query, 
    orderBy, 
    where, 
    limit, 
    startAfter,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const campaignsContainer = document.getElementById("campaigns-container");
    const categoryFilter = document.getElementById("category-filter");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const currentPageSpan = document.getElementById("current-page");

    let currentPage = 1;
    let lastVisibleDoc = null;
    const CAMPAIGNS_PER_PAGE = 9;
    let selectedCategory = "";
    let paginationStack = [];

    async function fetchCampaigns() {
        campaignsContainer.innerHTML = "<p class='loading'>Loading campaigns...</p>";
        
        try {
            let q;
            const baseQuery = collection(db, "campaigns");
            
            // Construct base query
            if (selectedCategory) {
                q = query(
                    baseQuery,
                    where("cause", "==", selectedCategory),
                    orderBy("createdAt", "desc"),
                    limit(CAMPAIGNS_PER_PAGE)
                );
            } else {
                q = query(
                    baseQuery,
                    orderBy("createdAt", "desc"),
                    limit(CAMPAIGNS_PER_PAGE)
                );
            }

            // Apply pagination cursor
            if (lastVisibleDoc) {
                q = query(q, startAfter(lastVisibleDoc));
            }

            // Real-time listener
            const unsubscribe = onSnapshot(q, 
                (snapshot) => {
                    handleQueryResult(snapshot);
                },
                (error) => {
                    handleQueryError(error);
                }
            );

        } catch (error) {
            handleQueryError(error);
        }
    }

    function handleQueryResult(snapshot) {
        campaignsContainer.innerHTML = "";
        
        if (snapshot.empty) {
            campaignsContainer.innerHTML = "<p class='empty'>No campaigns found. Be the first to create one!</p>";
            resetPagination();
            return;
        }

        // Process documents
        snapshot.forEach(doc => {
            renderCampaign(doc.data());
        });

        // Update pagination state
        lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
        updatePaginationControls(snapshot.size);
    }

    function handleQueryError(error) {
        console.error("Firestore Error:", error);
        campaignsContainer.innerHTML = `
            <p class="error">
                Error loading campaigns: ${error.message}
                <br>Please refresh the page
            </p>
        `;
        resetPagination();
    }

    function renderCampaign(data) {
        const raised = data.donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
        const progress = Math.min((raised / data.goal * 100).toFixed(0), 100);

        campaignsContainer.innerHTML += `
            <div class="campaign-card">
                <img src="${data.image}" alt="${data.title}">
                <div class="campaign-content">
                    <h3>${data.title}</h3>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="stats">
                        <span>$${raised} raised $${data.goal} goal</span>
                        
                    </div>
                    <p class="description">${data.description}</p>
                    <div class="meta">
                        <span class="cause">${data.cause}</span>
                        <span class="organizer">By ${data.organizer}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function updatePaginationControls(docsCount) {
        currentPageSpan.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = docsCount < CAMPAIGNS_PER_PAGE;
    }

    function resetPagination() {
        currentPage = 1;
        lastVisibleDoc = null;
        paginationStack = [];
        updatePaginationControls(0);
    }

    // Event Listeners
    categoryFilter.addEventListener("change", (e) => {
        selectedCategory = e.target.value;
        resetPagination();
        fetchCampaigns();
    });

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            lastVisibleDoc = paginationStack.pop();
            fetchCampaigns();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        paginationStack.push(lastVisibleDoc);
        currentPage++;
        fetchCampaigns();
    });

    // Initial load
    fetchCampaigns();
});
