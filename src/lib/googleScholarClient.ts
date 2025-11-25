/* eslint-disable @typescript-eslint/no-explicit-any */

import * as XLSX from "xlsx";

export function initGoogleScholarClient() {
  if (typeof window === "undefined") return;

  interface Article {
    id: string;
    link: string;
    pdfLink: string | null;
    "Tiêu đề": string;
    "Tác giả": string;
    "Tạp chí": string;
    "Ngày xuất bản": string;
    DOI: string;
    "Tóm tắt": string;
  }

  let extractedData: Article[] = [];
  let allArticles: Article[] = [];
  let currentPage = 1;
  let mainQueryParts: { keyword: string; operator: string }[] = [];
  let searchHistory: string[] = [];
  let downloadHistory: { query: string; page: number; date: string }[] = [];
  let deletionHistory: Article[] = [];

  const excludedIds = new Set<string>();
  const selectedIds = new Set<string>();

  const columnConfig: Record<string, { label: string; default: boolean }> = {
    id: { label: "Mã Scholar", default: true },
    "Tiêu đề": { label: "Tiêu đề", default: true },
    "Tác giả": { label: "Tác giả", default: true },
    "Tạp chí": { label: "Nguồn", default: false },
    "Ngày xuất bản": { label: "Năm", default: false },
    DOI: { label: "DOI", default: false },
    "Tóm tắt": { label: "Tóm tắt", default: false },
  };
  let visibleColumns: string[] = Object.keys(columnConfig).filter(
    (key) => columnConfig[key].default
  );

  const allElements = {
    extractBtn: document.getElementById("extractBtn") as HTMLButtonElement,
    downloadBtn: document.getElementById("downloadBtn") as HTMLButtonElement,
    searchQueryInput: document.getElementById(
      "searchQueryInput"
    ) as HTMLInputElement,
    mainQueryContainer: document.getElementById(
      "mainQueryContainer"
    ) as HTMLDivElement,
    articlesPerPage: document.getElementById(
      "articlesPerPage"
    ) as HTMLInputElement,
    status: document.getElementById("status") as HTMLDivElement,
    results: document.getElementById("results") as HTMLDivElement,
    paginationControls: document.getElementById(
      "paginationControls"
    ) as HTMLDivElement,
    prevBtn: document.getElementById("prevBtn") as HTMLButtonElement,
    nextBtn: document.getElementById("nextBtn") as HTMLButtonElement,
    pageInfo: document.getElementById("pageInfo") as HTMLSpanElement,
    toggleAdvancedBtn: document.getElementById(
      "toggleAdvancedBtn"
    ) as HTMLButtonElement,
    expandableFilters: document.getElementById(
      "expandableFilters"
    ) as HTMLDivElement,
    author: document.getElementById("author") as HTMLInputElement,
    journal: document.getElementById("journal") as HTMLInputElement,
    dateFrom: document.getElementById("dateFrom") as HTMLInputElement,
    dateTo: document.getElementById("dateTo") as HTMLInputElement,
    articleType: document.getElementById("articleType") as HTMLSelectElement,
    speciesHumans: document.getElementById("speciesHumans") as HTMLInputElement,
    speciesAnimals: document.getElementById(
      "speciesAnimals"
    ) as HTMLInputElement,
    sex: document.getElementById("sex") as HTMLSelectElement,
    age: document.getElementById("age") as HTMLSelectElement,
    freeFullText: document.getElementById("freeFullText") as HTMLInputElement,
    dateRangeOptions: document.getElementById(
      "dateRangeOptions"
    ) as HTMLDivElement,
    customDateRange: document.getElementById(
      "customDateRange"
    ) as HTMLDivElement,
    language: document.getElementById("language") as HTMLSelectElement,
    hasAbstract: document.getElementById("hasAbstract") as HTMLInputElement,
    medline: document.getElementById("medline") as HTMLInputElement,
    excludePreprints: document.getElementById(
      "excludePreprints"
    ) as HTMLInputElement,
    searchHistoryList: document.getElementById(
      "searchHistoryList"
    ) as HTMLDivElement,
    downloadHistoryList: document.getElementById(
      "downloadHistoryList"
    ) as HTMLDivElement,
    deletionHistoryList: document.getElementById(
      "deletionHistoryList"
    ) as HTMLDivElement,
    resultsPreviewContainer: document.getElementById(
      "resultsPreviewContainer"
    ) as HTMLDivElement,
    columnOptions: document.getElementById("columnOptions") as HTMLDivElement,
    resultsTableContainer: document.getElementById(
      "resultsTableContainer"
    ) as HTMLDivElement,
    citationModalOverlay: document.getElementById(
      "citation-modal-overlay"
    ) as HTMLDivElement,
    citationModal: document.getElementById("citation-modal") as HTMLDivElement,
    closeCitationModalBtn: document.getElementById(
      "close-citation-modal-btn"
    ) as HTMLButtonElement,
    citationContent: document.getElementById(
      "citation-content"
    ) as HTMLTextAreaElement,
    copyCitationBtn: document.getElementById(
      "copy-citation-btn"
    ) as HTMLButtonElement,
    downloadNbibBtn: document.getElementById(
      "download-nbib-btn"
    ) as HTMLButtonElement,
    citationFormatSelect: document.getElementById(
      "citation-format-select"
    ) as HTMLSelectElement,
    apiKeyBtn: document.getElementById("apiKeyBtn") as HTMLButtonElement,
    apiKeyStatus: document.getElementById("apiKeyStatus") as HTMLSpanElement,
  };

  let serpapiKey = "";

  const renderSearchHistory = () => {
    allElements.searchHistoryList.innerHTML = "";
    const uniqueSearches = [...new Set(searchHistory)];
    uniqueSearches.forEach((keyword) => {
      const item = document.createElement("div");
      item.className = "search-history-item";
      item.textContent = keyword;
      item.title = `Nhấn để tìm kiếm lại: "${keyword}"`;
      item.addEventListener("click", () => {
        mainQueryParts.push({ keyword, operator: "AND" });
        renderMainQueryUI();
      });
      allElements.searchHistoryList.prepend(item);
    });
  };

  const renderDownloadHistory = () => {
    allElements.downloadHistoryList.innerHTML = "";
    downloadHistory.forEach((item) => {
      const element = document.createElement("div");
      element.className = "download-history-item";
      element.innerHTML = `<div class="query">${item.query}</div><div class="details">Trang ${item.page} - ${item.date}</div>`;
      allElements.downloadHistoryList.prepend(element);
    });
  };

  const renderDeletionHistory = () => {
    const { deletionHistoryList } = allElements;
    deletionHistoryList.innerHTML = "";
    if (deletionHistory.length === 0) {
      deletionHistoryList.innerHTML = `<p class="text-xs text-gray-500">Chưa có bài báo nào bị xóa.</p>`;
      return;
    }
    deletionHistory.forEach((article) => {
      const item = document.createElement("div");
      item.className = "deletion-history-item";
      const title = article["Tiêu đề"] || "Không có tiêu đề";
      item.innerHTML = `
        <div class="info">
          <div class="title" title="${title}">${title}</div>
          <div class="details">Mã: ${article.id}</div>
        </div>
        <button class="restore-article-btn" data-id="${article.id}" title="Khôi phục bài báo này">
          <i class="fa-solid fa-undo"></i>
        </button>
      `;
      deletionHistoryList.appendChild(item);
    });
  };

  const saveState = () => {
    try {
      const state = {
        mainQueryParts,
        author: allElements.author.value,
        journal: allElements.journal.value,
        articleType: allElements.articleType.value,
        language: allElements.language.value,
        dateRange: (
          document.querySelector(
            'input[name="dateRange"]:checked'
          ) as HTMLInputElement | null
        )?.value,
        dateFrom: allElements.dateFrom.value,
        dateTo: allElements.dateTo.value,
        speciesHumans: allElements.speciesHumans.checked,
        speciesAnimals: allElements.speciesAnimals.checked,
        sex: allElements.sex.value,
        age: allElements.age.value,
        freeFullText: allElements.freeFullText.checked,
        hasAbstract: allElements.hasAbstract.checked,
        medline: allElements.medline.checked,
        excludePreprints: allElements.excludePreprints.checked,
        articlesPerPage: allElements.articlesPerPage.value,
        searchHistory,
        downloadHistory,
        deletionHistory,
      };
      localStorage.setItem("googleScholarExtractorState", JSON.stringify(state));
      if (serpapiKey) {
        localStorage.setItem("serpapiUserKey", serpapiKey);
      }
    } catch (error) {
      console.error("Could not save state to localStorage:", error);
    }
  };

  const updateApiKeyStatus = () => {
    if (!allElements.apiKeyStatus) return;
    if (serpapiKey) {
      allElements.apiKeyStatus.textContent = "Đã nhập key";
      allElements.apiKeyStatus.className =
        "text-xs text-green-600 font-semibold";
    } else {
      allElements.apiKeyStatus.textContent = "Chưa nhập key";
      allElements.apiKeyStatus.className =
        "text-xs text-red-600 font-semibold";
    }
  };

  const loadState = () => {
    try {
      const savedStateJSON = localStorage.getItem("googleScholarExtractorState");
      if (!savedStateJSON) return;
      const state = JSON.parse(savedStateJSON);
      mainQueryParts = state.mainQueryParts || [];
      searchHistory = state.searchHistory || [];
      downloadHistory = state.downloadHistory || [];
      deletionHistory = state.deletionHistory || [];
      renderMainQueryUI();
      renderSearchHistory();
      renderDownloadHistory();
      renderDeletionHistory();
      allElements.author.value = state.author || "";
      allElements.journal.value = state.journal || "";
      allElements.articleType.value = state.articleType || "";
      allElements.language.value = state.language || "";
      allElements.dateFrom.value = state.dateFrom || "";
      allElements.dateTo.value = state.dateTo || "";
      allElements.speciesHumans.checked = state.speciesHumans || false;
      allElements.speciesAnimals.checked = state.speciesAnimals || false;
      allElements.sex.value = state.sex || "";
      allElements.age.value = state.age || "";
      allElements.freeFullText.checked = state.freeFullText || false;
      allElements.hasAbstract.checked = state.hasAbstract || false;
      allElements.medline.checked = state.medline || false;
      allElements.excludePreprints.checked = state.excludePreprints || false;
      allElements.articlesPerPage.value = state.articlesPerPage || "20";
      if (state.dateRange) {
        const radio = document.querySelector(
          `input[name="dateRange"][value="${state.dateRange}"]`
        ) as HTMLInputElement | null;
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      const storedKey =
        localStorage.getItem("serpapiUserKey") ||
        (typeof process !== "undefined"
          ? process.env.NEXT_PUBLIC_SERPAPI_KEY
          : "") ||
        "";
      serpapiKey = storedKey;
      updateApiKeyStatus();
    } catch (error) {
      console.error("Could not load state from localStorage:", error);
      localStorage.removeItem("googleScholarExtractorState");
    }
  };

  const fetchWithRetries = async (
    url: string,
    retries = 2,
    delay = 1000,
    apiKey?: string
  ): Promise<Response> => {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, {
          headers: apiKey ? { "x-serpapi-key": apiKey } : undefined,
        });
        if (response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Failed to fetch after multiple retries.");
  };

  const buildQuery = () => {
    const parts: string[] = [];
    const {
      author,
      journal,
      dateFrom,
      dateTo,
      articleType,
      speciesHumans,
      speciesAnimals,
      sex,
      age,
      freeFullText,
      language,
      hasAbstract,
      medline,
      excludePreprints,
    } = allElements;

    const mainQueryString = mainQueryParts
      .map(
        (part, index) =>
          `(${part.keyword})${
            index < mainQueryParts.length - 1 ? ` ${part.operator} ` : ""
          }`
      )
      .join("");

    if (mainQueryString) parts.push(mainQueryString);
    if (author.value.trim()) parts.push(`author:"${author.value.trim()}"`);
    if (journal.value.trim()) parts.push(`"${journal.value.trim()}"`);
    if (articleType.value) parts.push(`"${articleType.value}"`);
    if (language.value) parts.push(`language:${language.value}`);
    if (speciesHumans.checked) parts.push("human study");
    if (speciesAnimals.checked) parts.push("animal study");
    if (sex.value) parts.push(sex.value);
    if (age.value) parts.push(age.value);
    if (freeFullText.checked) parts.push('"full text"');
    if (hasAbstract.checked) parts.push('"abstract"');
    if (medline.checked) parts.push("medline");
    if (excludePreprints.checked) parts.push("-preprint");

    if (mainQueryParts.length === 0 && parts.length === 0) {
      alert("Vui lòng nhập từ khóa tìm kiếm hoặc chọn ít nhất một bộ lọc.");
      return null;
    }

    const selectedDateRange = (
      document.querySelector(
        'input[name="dateRange"]:checked'
      ) as HTMLInputElement | null
    )?.value;

    let yearFrom = "";
    let yearTo = "";
    if (selectedDateRange === "custom") {
      yearFrom = allElements.dateFrom.value.split("-")[0] || "";
      yearTo = allElements.dateTo.value.split("-")[0] || "";
    } else if (selectedDateRange && selectedDateRange !== "any") {
      const years = parseInt(selectedDateRange, 10);
      const today = new Date();
      yearTo = today.getFullYear().toString();
      yearFrom = (today.getFullYear() - years).toString();
    }

    return {
      query: parts.join(" "),
      yearFrom: yearFrom || undefined,
      yearTo: yearTo || undefined,
    };
  };

  const updateDownloadButtonText = () => {
    const count = selectedIds.size;
    if (count > 0) {
      allElements.downloadBtn.innerHTML = `Tải xuống ${count} bài báo đã chọn (.xlsx)`;
    } else {
      allElements.downloadBtn.innerHTML = "Tải xuống File Excel (.xlsx)";
    }
  };

  const updateSelectAllCheckboxState = () => {
    const selectAll = document.getElementById(
      "selectAllCheckbox"
    ) as HTMLInputElement | null;
    if (!selectAll) return;
    const articleCheckboxes =
      allElements.resultsTableContainer.querySelectorAll<HTMLInputElement>(
        ".article-checkbox"
      );
    if (articleCheckboxes.length === 0) {
      selectAll.checked = false;
      (selectAll as any).indeterminate = false;
      return;
    }
    const checkedCount = Array.from(articleCheckboxes).filter(
      (cb) => cb.checked
    ).length;
    if (checkedCount === 0) {
      selectAll.checked = false;
      (selectAll as any).indeterminate = false;
    } else if (checkedCount === articleCheckboxes.length) {
      selectAll.checked = true;
      (selectAll as any).indeterminate = false;
    } else {
      selectAll.checked = false;
      (selectAll as any).indeterminate = true;
    }
  };

  const renderMainQueryUI = () => {
    const { mainQueryContainer } = allElements;
    mainQueryContainer.innerHTML = "";
    mainQueryParts.forEach((part, index) => {
      mainQueryContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="flex items-center bg-blue_dark/10 text-blue_dark text-sm font-medium px-2.5 py-1 rounded-full"><span>${part.keyword}</span><button data-index="${index}" class="remove-keyword-btn ml-2 text-blue_dark hover:text-blue_dark font-bold" aria-label="Xóa từ khóa ${part.keyword}">&times;</button></div>`
      );
      if (index < mainQueryParts.length - 1) {
        mainQueryContainer.insertAdjacentHTML(
          "beforeend",
          `<select data-index="${index}" class="main-operator-select px-2 py-1 border border-gray-300 rounded-md focus:ring-blue_dark focus:border-blue_dark text-sm"><option value="AND" ${
            part.operator === "AND" ? "selected" : ""
          }>AND</option><option value="OR" ${
            part.operator === "OR" ? "selected" : ""
          }>OR</option></select>`
        );
      }
    });
  };

  const renderColumnOptions = () => {
    allElements.columnOptions.innerHTML = "";
    for (const key in columnConfig) {
      const { label } = columnConfig[key];
      const isChecked = visibleColumns.includes(key);
      allElements.columnOptions.insertAdjacentHTML(
        "beforeend",
        `
          <label class="flex items-center text-sm">
            <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark column-toggle" data-column="${key}" ${
          isChecked ? "checked" : ""
        }>
            <span class="ml-2 text-gray-700">${label}</span>
          </label>
        `
      );
    }
  };

  const renderResultsTable = () => {
    const { resultsTableContainer } = allElements;

    if (extractedData.length === 0) {
      resultsTableContainer.innerHTML = `<p class="text-center text-gray-500 py-4">Không có bài báo nào để hiển thị trên trang này.</p>`;
      return;
    }

    const headerCells = [
      `<th><input type="checkbox" id="selectAllCheckbox" title="Chọn tất cả / Bỏ chọn tất cả"></th>`,
      ...visibleColumns.map((key) => `<th>${columnConfig[key].label}</th>`),
      `<th>Hành động</th>`,
    ].join("");

    const theadHTML = `<thead><tr>${headerCells}</tr></thead>`;

    const bodyRowsHTML = extractedData
      .map((article) => {
        const isSelected = selectedIds.has(article.id);

        const escapeHtml = (unsafe: string) =>
          unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        const dataCells = visibleColumns
          .map((key) => {
            const content = (article as any)[key] || "";
            return `<td>${escapeHtml(content.toString())}</td>`;
          })
          .join("");

        const pdfLink = article.pdfLink;

        const actionCell = `
          <td>
            <div class="action-cell-content">
              <button
                class="action-btn cite-article-btn"
                data-id="${article.id}"
                title="Trích dẫn bài báo này"
              >
                <i class="fa-solid fa-quote-left"></i>
              </button>

              ${
                pdfLink
                  ? `
                <a
                  href="${pdfLink}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-btn pdf-article-btn"
                  title="Mở PDF toàn văn (mở tab mới)"
                >
                  <i class="fa-solid fa-file-pdf"></i>
                </a>
              `
                  : `
                <button
                  class="action-btn pdf-article-btn"
                  disabled
                  title="Không có PDF miễn phí"
                >
                  <i class="fa-solid fa-file-pdf"></i>
                </button>
              `
              }

              <a
                href="${article.link}"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn full-text-link-btn"
                title="Xem bài báo trên Google Scholar"
              >
                <i class="fa-solid fa-up-right-from-square"></i>
              </a>

              <button
                class="action-btn remove-article-btn"
                data-id="${article.id}"
                title="Loại bỏ bài báo này"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        `;

        return `
          <tr data-id="${article.id}" class="${isSelected ? "selected" : ""}">
            <td>
              <input
                type="checkbox"
                class="article-checkbox"
                value="${article.id}"
                ${isSelected ? "checked" : ""}
              >
            </td>
            ${dataCells}
            ${actionCell}
          </tr>
        `;
      })
      .join("");

    const tbodyHTML = `<tbody>${bodyRowsHTML}</tbody>`;

    resultsTableContainer.innerHTML = `<table class="results-table">${theadHTML}${tbodyHTML}</table>`;
    updateSelectAllCheckboxState();
    updateDownloadButtonText();
  };

  const setLoadingState = (isLoading: boolean) => {
    const {
      extractBtn,
      prevBtn,
      nextBtn,
      downloadBtn,
      paginationControls,
      resultsPreviewContainer,
    } = allElements;
    [extractBtn, prevBtn, nextBtn].forEach((btn) => (btn.disabled = isLoading));
    if (isLoading) {
      downloadBtn.classList.add("hidden");
      paginationControls.classList.add("hidden");
      resultsPreviewContainer.classList.add("hidden");
    }
  };

  const updatePaginationUI = () => {
    const { paginationControls, pageInfo, prevBtn, nextBtn, articlesPerPage } =
      allElements;
    const perPage = parseInt(articlesPerPage.value, 10) || 20;
    const totalPages = Math.ceil(allArticles.length / perPage) || 1;
    paginationControls.classList.remove("hidden");
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  };

  const displayError = (message: string, isPageError = false) => {
    allElements.status.textContent = message;
    allElements.status.className =
      "mt-8 text-center text-red-600 font-semibold";
    allElements.status.classList.remove("hidden");
    setLoadingState(false);
    if (isPageError) updatePaginationUI();
    else allElements.results.classList.add("hidden");
  };

  const mapScholarResult = (result: any): Article => {
    const authors =
      result.publication_info?.authors
        ?.map((a: any) => a.name)
        .filter(Boolean)
        .join(", ") ||
      result.publication_info?.summary ||
      "N/A";

    const journal =
      result.publication_info?.journal ||
      result.publication_info?.summary?.split("-")?.[0]?.trim() ||
      "N/A";

    const year =
      result.publication_info?.year?.toString() ||
      result.publication_info?.summary?.match(/\b(19|20)\d{2}\b/)?.[0] ||
      "N/A";

    const pdfResource = result.resources?.find(
      (res: any) => res.file_format && res.file_format.toUpperCase() === "PDF"
    );

    const doiMatch =
      typeof result.link === "string"
        ? result.link.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)
        : null;

    return {
      id:
        result.result_id ||
        result.cluster_id ||
        `scholar-${result.position || Math.random()}`,
      link:
        result.link ||
        `https://scholar.google.com/scholar?cluster=${result.result_id}`,
      pdfLink: pdfResource?.link || null,
      "Tiêu đề": result.title || "N/A",
      "Tác giả": authors,
      "Tạp chí": journal,
      "Ngày xuất bản": year,
      DOI: doiMatch ? doiMatch[0] : "N/A",
      "Tóm tắt": result.snippet || "N/A",
    };
  };

  const fetchPageData = async (page: number) => {
    const { articlesPerPage, status, results, downloadBtn, resultsPreviewContainer } =
      allElements;
    const perPage = parseInt(articlesPerPage.value, 10) || 20;
    const start = (page - 1) * perPage;
    const pageArticles = allArticles.slice(start, start + perPage);

    if (pageArticles.length === 0) {
      status.textContent = `Không có dữ liệu cho trang ${page}.`;
      setLoadingState(false);
      updatePaginationUI();
      return;
    }
    setLoadingState(true);
    status.textContent = `Đang tải dữ liệu trang ${page}...`;
    status.className = "mt-8 text-center text-blue_dark font-semibold";

    extractedData = pageArticles.filter((article) => !excludedIds.has(article.id));

    status.textContent = `Hoàn tất! Đang hiển thị ${
      extractedData.length
    } bài báo trên Google Scholar cho trang ${page}. Tổng số: ${allArticles.length.toLocaleString(
      "vi-VN"
    )}.`;
    status.className = "mt-8 text-center text-green-600 font-semibold";
    results.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
    resultsPreviewContainer.classList.remove("hidden");
    renderResultsTable();
    setLoadingState(false);
    updatePaginationUI();
  };

  const performSearch = async () => {
    const searchQuery = buildQuery();
    if (!searchQuery) return;

    const queryText = mainQueryParts.map((p) => p.keyword).join(" ");
    if (queryText && !searchHistory.includes(queryText)) {
      searchHistory.push(queryText);
      if (searchHistory.length > 20) searchHistory.shift();
      renderSearchHistory();
    }

    if (!serpapiKey) {
      displayError("Vui lòng nhập SerpAPI Key trước khi tìm kiếm.");
      return;
    }

    saveState();
    setLoadingState(true);
    allElements.status.classList.remove("hidden");
    allElements.status.textContent =
      "Đang tìm kiếm kết quả trên Google Scholar, vui lòng đợi...";
    allElements.status.className =
      "mt-8 text-center text-blue_dark font-semibold";
    allElements.results.classList.add("hidden");
    currentPage = 1;
    excludedIds.clear();
    selectedIds.clear();
    updateDownloadButtonText();

    try {
      const params = new URLSearchParams({
        q: searchQuery.query,
        num: "20",
        start: "0",
      });
      if (searchQuery.yearFrom) params.set("yearFrom", searchQuery.yearFrom);
      if (searchQuery.yearTo) params.set("yearTo", searchQuery.yearTo);

      const searchResponse = await fetchWithRetries(
        `/api/scholar?${params.toString()}`,
        2,
        1000,
        serpapiKey
      );
      if (!searchResponse.ok) {
        let message = `Lỗi API (${searchResponse.status}).`;
        if (searchResponse.status === 400) {
          message = "Truy vấn không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (searchResponse.status === 429) {
          message = "Quá nhiều yêu cầu đến API. Vui lòng đợi một lát.";
        }
        displayError(message);
        return;
      }

      const searchJson = await searchResponse.json();
      if (searchJson.error) {
        displayError(
          `Lỗi từ Google Scholar: ${searchJson.error}${
            searchJson.details ? ` - ${searchJson.details}` : ""
          }`
        );
        return;
      }

      const results = searchJson.organic_results as any[];
      if (!results || results.length === 0) {
        allElements.status.textContent =
          "Không tìm thấy bài báo nào phù hợp trên Google Scholar.";
        allElements.status.className =
          "mt-8 text-center text-amber-600 font-semibold";
        setLoadingState(false);
        return;
      }

      allArticles = results.map(mapScholarResult);
      await fetchPageData(1);
    } catch (error) {
      console.error("Error during search:", error);
      displayError("Lỗi mạng. Vui lòng kiểm tra kết nối internet và thử lại.");
    }
  };

  const generateCitations = (article: Article) => {
    const authors = article["Tác giả"] || "N/A";
    const title = article["Tiêu đề"] || "N/A";
    const journal = article["Tạp chí"] || "N/A";
    const year = article["Ngày xuất bản"].split(" ")[0] || "N/A";
    const pubDate =
      article["Ngày xuất bản"] === "N/A" ? year : article["Ngày xuất bản"];
    const doi = article.DOI !== "N/A" ? article.DOI : "";

    const joinParts = (parts: string[], separator: string = " "): string =>
      parts.filter((p) => p).join(separator);

    return {
      NLM: joinParts(
        [
          `${authors}.`,
          title,
          `${journal}.`,
          `${pubDate}.`,
          doi ? `doi:${doi}` : "",
        ],
        " "
      ).trim(),
      AMA: joinParts(
        [`${authors}.`, title, `${journal}.`, `${year}.`, doi ? `doi:${doi}` : ""],
        " "
      ).trim(),
      APA: joinParts(
        [
          `${authors}.`,
          `(${year}).`,
          title,
          journal ? `*${journal},*` : "",
          doi ? `https://doi.org/${doi}` : "",
        ],
        " "
      ).trim(),
      MLA: joinParts(
        [
          `${authors}.`,
          `"${title}."`,
          journal ? `*${journal},*` : "",
          year,
          doi ? `doi:${doi}.` : "",
        ],
        " "
      ).trim(),
    };
  };

  const generateNbibContent = (article: Article): string => {
    const fields = {
      ID: article.id,
      TI: article["Tiêu đề"],
      AU: article["Tác giả"].split(", ").join("\nAU  - "),
      JT: article["Tạp chí"],
      DP: article["Ngày xuất bản"],
      LID: article.DOI && article.DOI !== "N/A" ? `${article.DOI} [doi]` : "",
      AB: article["Tóm tắt"],
      UR: article.link,
    };

    return Object.entries(fields)
      .filter(([, value]) => value && value !== "N/A")
      .map(([key, value]) => `${key.padEnd(4, " ")} - ${value}`)
      .join("\n");
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showCitationModal = (id: string) => {
    const article = extractedData.find((a) => a.id === id);
    if (!article) return;

    const citations = generateCitations(article);
    type CitationFormat = keyof typeof citations;
    const formats: CitationFormat[] = ["NLM", "AMA", "APA", "MLA"];

    const {
      citationFormatSelect,
      citationContent,
      downloadNbibBtn,
      copyCitationBtn,
    } = allElements;

    citationFormatSelect.innerHTML = formats
      .map((format) => `<option value="${format}">${format}</option>`)
      .join("");
    citationFormatSelect.value = "NLM";

    const updateCitationText = () => {
      const selectedFormat = citationFormatSelect.value as CitationFormat;
      citationContent.value = citations[selectedFormat];
    };

    citationFormatSelect.onchange = updateCitationText;

    copyCitationBtn.onclick = () => {
      navigator.clipboard.writeText(citationContent.value).then(() => {
        const span = copyCitationBtn.querySelector("span")!;
        const originalText = span.textContent || "";
        span.textContent = "Đã sao chép!";
        setTimeout(() => {
          span.textContent = originalText;
        }, 2000);
      });
    };

    downloadNbibBtn.onclick = () => {
      const nbibContent = generateNbibContent(article);
      downloadFile(
        nbibContent,
        `citation-${article.id}.nbib`,
        "application/x-research-info-systems"
      );
    };

    updateCitationText();
    allElements.citationModalOverlay.classList.remove("hidden");
    allElements.citationModalOverlay.classList.add("flex");
    setTimeout(() => {
      allElements.citationModal.classList.remove("scale-95", "opacity-0");
    }, 10);
  };

  const hideCitationModal = () => {
    allElements.citationModal.classList.add("scale-95", "opacity-0");
    setTimeout(() => {
      allElements.citationModalOverlay.classList.add("hidden");
      allElements.citationModalOverlay.classList.remove("flex");
    }, 200);
  };

  const setupEventListeners = () => {
    allElements.apiKeyBtn.addEventListener("click", () => {
      const input = prompt("Nhập SerpAPI Key (sẽ lưu trên trình duyệt):", serpapiKey);
      if (input !== null) {
        const trimmed = input.trim();
        serpapiKey = trimmed;
        if (trimmed) {
          localStorage.setItem("serpapiUserKey", trimmed);
        } else {
          localStorage.removeItem("serpapiUserKey");
        }
        updateApiKeyStatus();
      }
    });

    allElements.toggleAdvancedBtn.addEventListener("click", () => {
      const filters = allElements.expandableFilters;
      const isExpanded = filters.classList.contains("expanded");
      allElements.toggleAdvancedBtn.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );
      filters.classList.toggle("expanded");
      allElements.toggleAdvancedBtn.innerHTML = isExpanded
        ? "Bộ lọc khác ↓"
        : "Bộ lọc khác ↑";
    });

    allElements.dateRangeOptions.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      allElements.customDateRange.classList.toggle(
        "hidden",
        target.value !== "custom"
      );
      allElements.customDateRange.classList.toggle(
        "grid",
        target.value === "custom"
      );
    });

    allElements.extractBtn.addEventListener("click", () => {
      const keyword = allElements.searchQueryInput.value.trim();
      if (keyword) {
        mainQueryParts.push({ keyword, operator: "AND" });
        allElements.searchQueryInput.value = "";
        renderMainQueryUI();
      }
      performSearch();
    });

    allElements.searchQueryInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = allElements.searchQueryInput.value.trim();
        if (keyword) {
          mainQueryParts.push({ keyword, operator: "AND" });
          allElements.searchQueryInput.value = "";
          renderMainQueryUI();
          performSearch();
        }
      }
    });

    allElements.mainQueryContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("remove-keyword-btn")) {
        mainQueryParts.splice(
          parseInt((target as HTMLElement).dataset.index!, 10),
          1
        );
        renderMainQueryUI();
      }
    });

    allElements.mainQueryContainer.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      if (target.classList.contains("main-operator-select")) {
        mainQueryParts[parseInt(target.dataset.index!, 10)].operator =
          target.value;
      }
    });

    allElements.prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchPageData(currentPage);
      }
    });

    allElements.nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(
        allArticles.length /
          (parseInt(allElements.articlesPerPage.value, 10) || 20)
      );
      if (currentPage < totalPages) {
        currentPage++;
        fetchPageData(currentPage);
      }
    });

    allElements.downloadBtn.addEventListener("click", () => {
      let dataToExport: Article[] = [];
      if (selectedIds.size > 0) {
        dataToExport = extractedData.filter((article) =>
          selectedIds.has(article.id)
        );
      } else {
        dataToExport = extractedData;
      }
      if (dataToExport.length === 0) {
        alert("Không có dữ liệu để tải xuống.");
        return;
      }

      const filteredDataForExport = dataToExport.map((article) => {
        const newArticle: Record<string, string | null | undefined> = {};
        visibleColumns.forEach((key) => {
          (newArticle as any)[columnConfig[key].label] = (article as any)[key];
        });
        return newArticle;
      });

      const queryText =
        mainQueryParts.map((p) => p.keyword).join(" ") || "Results";
      downloadHistory.push({
        query: queryText,
        page: currentPage,
        date: new Date().toLocaleString("vi-VN"),
      });
      if (downloadHistory.length > 20) downloadHistory.shift();
      renderDownloadHistory();
      saveState();

      const worksheet = XLSX.utils.json_to_sheet(filteredDataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `GoogleScholar_Page_${currentPage}`
      );
      const filename = `GoogleScholar_Search_${
        queryText.replace(/\s/g, "_") || "results"
      }_Page${currentPage}.xlsx`;
      XLSX.writeFile(workbook, filename);
    });

    allElements.columnOptions.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.classList.contains("column-toggle")) {
        const column = target.dataset.column!;
        if (target.checked) {
          if (!visibleColumns.includes(column)) visibleColumns.push(column);
        } else {
          visibleColumns = visibleColumns.filter((c) => c !== column);
        }
        renderResultsTable();
      }
    });

    allElements.resultsTableContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const actionTarget = target.closest("button, a");

      const removeBtn = actionTarget?.closest(".remove-article-btn");
      if (removeBtn) {
        const id = (removeBtn as HTMLElement).getAttribute("data-id")!;
        const articleToRemove = extractedData.find(
          (article) => article.id === id
        );
        if (articleToRemove) {
          deletionHistory.unshift(articleToRemove);
          if (deletionHistory.length > 50) deletionHistory.pop();
          renderDeletionHistory();
          saveState();
        }

        excludedIds.add(id);
        selectedIds.delete(id);
        extractedData = extractedData.filter((article) => article.id !== id);
        const row = (removeBtn as HTMLElement).closest("tr");
        if (row) {
          row.classList.add("removing");
          row.addEventListener("transitionend", () => row.remove());
        }
        if (extractedData.length === 0) renderResultsTable();
        updateDownloadButtonText();
        updateSelectAllCheckboxState();
        return;
      }

      const citeBtn = actionTarget?.closest(".cite-article-btn");
      if (citeBtn) {
        const id = (citeBtn as HTMLElement).getAttribute("data-id")!;
        showCitationModal(id);
        return;
      }

      if ((target as HTMLElement).id === "selectAllCheckbox") {
        const isChecked = (target as HTMLInputElement).checked;
        const articleCheckboxes =
          allElements.resultsTableContainer.querySelectorAll<HTMLInputElement>(
            ".article-checkbox"
          );
        articleCheckboxes.forEach((checkbox) => {
          checkbox.checked = isChecked;
          const row = checkbox.closest("tr");
          if (row) row.classList.toggle("selected", isChecked);
          if (isChecked) selectedIds.add(checkbox.value);
          else selectedIds.delete(checkbox.value);
        });
        updateDownloadButtonText();
        return;
      }

      if (target.classList.contains("article-checkbox")) {
        const checkbox = target as HTMLInputElement;
        const id = checkbox.value;
        const row = checkbox.closest("tr");
        if (checkbox.checked) {
          selectedIds.add(id);
          row?.classList.add("selected");
        } else {
          selectedIds.delete(id);
          row?.classList.remove("selected");
        }
        updateSelectAllCheckboxState();
        updateDownloadButtonText();
      }
    });

    allElements.deletionHistoryList.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      const restoreBtn = target.closest(
        ".restore-article-btn"
      ) as HTMLElement | null;
      if (restoreBtn) {
        const id = restoreBtn.getAttribute("data-id");
        if (!id) return;
        excludedIds.delete(id);
        deletionHistory = deletionHistory.filter(
          (article) => article.id !== id
        );
        renderDeletionHistory();
        saveState();
        if (allArticles.length > 0) {
          await fetchPageData(currentPage);
        }
      }
    });

    allElements.closeCitationModalBtn.addEventListener("click", hideCitationModal);
    allElements.citationModalOverlay.addEventListener("click", (e) => {
      if (e.target === allElements.citationModalOverlay) {
        hideCitationModal();
      }
    });
  };

  renderColumnOptions();
  setupEventListeners();
  loadState();
  updateApiKeyStatus();
}
