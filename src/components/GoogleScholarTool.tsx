"use client";

import { useEffect } from "react";
import { initGoogleScholarClient } from "@/lib/googleScholarClient";

export default function GoogleScholarTool() {
  useEffect(() => {
    initGoogleScholarClient();
  }, []);

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <aside id="searchHistoryPanel" className="sidebar">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Lịch sử Tìm kiếm
        </h2>
        <div id="searchHistoryList" className="space-y-2" />
      </aside>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-2 py-8 md:py-12 max-w-fulll main-content">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue_dark">
            Công cụ trích xuất Google Scholar
          </h1>
          <p className="mt-2 text-gray-600">
            Tìm kiếm và trích xuất bài báo một cách dễ dàng.
          </p>
        </header>

        <main className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          {/* API Key */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-gray-700 font-semibold">
                SerpAPI Key
              </p>
              <p className="text-xs text-gray-500">
                Dán key để sử dụng Google Scholar (lưu trong trình duyệt).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="apiKeyBtn"
                className="bg-blue_dark text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue_dark"
              >
                Nhập API Key
              </button>
              <span id="apiKeyStatus" className="text-xs text-red-600 font-semibold">
                Chưa nhập key
              </span>
            </div>
          </div>

          {/* Query chính */}
          <div>
            <label
              htmlFor="searchQueryInput"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Xây dựng truy vấn chính
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                id="searchQueryInput"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark text-lg"
                placeholder="Nhập từ khóa và nhấn Enter..."
              />
            </div>
            <div
              id="mainQueryContainer"
              className="mt-2 flex flex-wrap items-center gap-2 min-h-[38px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hãy nhập nội dung như cách mà bạn tìm kiếm trên Google Scholar.
            </p>
          </div>

          {/* Nút mở/đóng bộ lọc */}
          <div className="mt-6 text-center">
            <button
              id="toggleAdvancedBtn"
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue_dark"
              aria-expanded={false}
              aria-controls="expandableFilters"
            >
              Bộ lọc khác ↓
            </button>
          </div>

          {/* Khu bộ lọc mở rộng */}
          <div id="expandableFilters" className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-6 mt-4 border-t">
              {/* Bộ lọc xuất bản */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Bộ lọc Xuất bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Tác giả
                    </label>
                    <input
                      type="text"
                      id="author"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                      placeholder="ví dụ: Smith J"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="journal"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Tạp chí
                    </label>
                    <input
                      type="text"
                      id="journal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                      placeholder="ví dụ: Lancet"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="articleType"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Loại bài báo
                    </label>
                    <select
                      id="articleType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    >
                      <option value="">Tất cả các loại</option>
                      <option value="Case Reports">Case Reports</option>
                      <option value="Clinical Study">Clinical Study</option>
                      <option value="Clinical Trial">Clinical Trial</option>
                      <option value="Comment">Comment</option>
                      <option value="Comparative Study">Comparative Study</option>
                      <option value="Dataset">Dataset</option>
                      <option value="Editorial">Editorial</option>
                      <option value="Evaluation Study">Evaluation Study</option>
                      <option value="Guideline">Guideline</option>
                      <option value="Letter">Letter</option>
                      <option value="Meta-Analysis">Meta-Analysis</option>
                      <option value="News">News</option>
                      <option value="Observational Study">
                        Observational Study
                      </option>
                      <option value="Practice Guideline">
                        Practice Guideline
                      </option>
                      <option value="Preprint">Preprint</option>
                      <option value="Randomized Controlled Trial">
                        Randomized Controlled Trial
                      </option>
                      <option value="Review">Review</option>
                      <option value="Systematic Review">Systematic Review</option>
                      <option value="Technical Report">Technical Report</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Ngôn ngữ
                    </label>
                    <select
                      id="language"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    >
                      <option value="">Tất cả</option>
                      <option value="english">Tiếng Anh</option>
                      <option value="vietnamese">Tiếng Việt</option>
                      <option value="chinese">Tiếng Trung</option>
                      <option value="french">Tiếng Pháp</option>
                      <option value="german">Tiếng Đức</option>
                      <option value="japanese">Tiếng Nhật</option>
                      <option value="korean">Tiếng Hàn</option>
                      <option value="russian">Tiếng Nga</option>
                      <option value="spanish">Tiếng Tây Ban Nha</option>
                      <option value="afrikaans">Afrikaans</option>
                      <option value="albanian">Albanian</option>
                      <option value="arabic">Arabic</option>
                      <option value="armenian">Armenian</option>
                      <option value="azerbaijani">Azerbaijani</option>
                      <option value="bosnian">Bosnian</option>
                      <option value="bulgarian">Bulgarian</option>
                      <option value="catalan">Catalan</option>
                      <option value="croatian">Croatian</option>
                      <option value="czech">Czech</option>
                      <option value="danish">Danish</option>
                      <option value="dutch">Dutch</option>
                      <option value="estonian">Estonian</option>
                      <option value="finnish">Finnish</option>
                      <option value="georgian">Georgian</option>
                      <option value="hebrew">Hebrew</option>
                      <option value="hungarian">Hungarian</option>
                      <option value="icelandic">Icelandic</option>
                      <option value="indonesian">Indonesian</option>
                      <option value="italian">Italian</option>
                      <option value="latvian">Latvian</option>
                      <option value="lithuanian">Lithuanian</option>
                      <option value="macedonian">Macedonian</option>
                      <option value="malay">Malay</option>
                      <option value="norwegian">Norwegian</option>
                      <option value="persian">Persian</option>
                      <option value="polish">Polish</option>
                      <option value="portuguese">Portuguese</option>
                      <option value="romanian">Romanian</option>
                      <option value="serbian">Serbian</option>
                      <option value="slovak">Slovak</option>
                      <option value="slovenian">Slovenian</option>
                      <option value="swedish">Swedish</option>
                      <option value="thai">Thai</option>
                      <option value="turkish">Turkish</option>
                      <option value="ukrainian">Ukrainian</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bộ lọc thời gian */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Bộ lọc Thời gian
                </h3>
                <div
                  className="flex flex-wrap items-center gap-x-4 gap-y-2"
                  id="dateRangeOptions"
                >
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value="any"
                      className="h-4 w-4 border-gray-300 text-blue_dark focus:ring-blue_dark"
                      defaultChecked
                    />
                    <span className="ml-2 text-gray-700">Bất kỳ</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value="1"
                      className="h-4 w-4 border-gray-300 text-blue_dark focus:ring-blue_dark"
                    />
                    <span className="ml-2 text-gray-700">1 năm</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value="5"
                      className="h-4 w-4 border-gray-300 text-blue_dark focus:ring-blue_dark"
                    />
                    <span className="ml-2 text-gray-700">5 năm</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value="10"
                      className="h-4 w-4 border-gray-300 text-blue_dark focus:ring-blue_dark"
                    />
                    <span className="ml-2 text-gray-700">10 năm</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value="custom"
                      className="h-4 w-4 border-gray-300 text-blue_dark focus:ring-blue_dark"
                    />
                    <span className="ml-2 text-gray-700">Tùy chọn...</span>
                  </label>
                </div>

                <div
                  id="customDateRange"
                  className="hidden grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                >
                  <div>
                    <label
                      htmlFor="dateFrom"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Từ ngày
                    </label>
                    <input
                      type="date"
                      id="dateFrom"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateTo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Đến ngày
                    </label>
                    <input
                      type="date"
                      id="dateTo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    />
                  </div>
                </div>
              </div>

              {/* Đối tượng & chất lượng */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Bộ lọc Đối tượng &amp; Chất lượng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Đối tượng nghiên cứu
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="speciesHumans"
                          className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                        />
                        <span className="ml-2 text-gray-700">Người</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          id="speciesAnimals"
                          className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                        />
                        <span className="ml-2 text-gray-700">Động vật</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="sex"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Giới tính
                    </label>
                    <select
                      id="sex"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    >
                      <option value="">Tất cả</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="age"
                      className="block text-sm font-bold text-gray-700 mb-1"
                    >
                      Độ tuổi
                    </label>
                    <select
                      id="age"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                    >
                      <option value="">Tất cả</option>
                      <option value="infant, newborn">
                        Sơ sinh (0-23 tháng)
                      </option>
                      <option value="child, preschool">Trẻ em (2-5 tuổi)</option>
                      <option value="child">Trẻ em (6-12 tuổi)</option>
                      <option value="adolescent">Thanh thiếu niên (13-18)</option>
                      <option value="adult">Người trưởng thành (19-44)</option>
                      <option value="middle aged">Trung niên (45-64)</option>
                      <option value="aged">Người cao tuổi (65+)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Các tùy chọn khác
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasAbstract"
                        className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                      />
                      <span className="ml-2 text-gray-700">Có tóm tắt</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="freeFullText"
                        className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                      />
                      <span className="ml-2 text-gray-700">Toàn văn miễn phí</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="medline"
                        className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                      />
                      <span className="ml-2 text-gray-700">Chỉ mục MEDLINE</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        id="excludePreprints"
                        className="h-4 w-4 rounded border-gray-300 text-blue_dark focus:ring-blue_dark"
                      />
                      <span className="ml-2 text-gray-700">
                        Loại trừ bản thảo (Preprints)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Điều khiển tìm kiếm */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
              <div>
                <label
                  htmlFor="articlesPerPage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số lượng bài mỗi trang
                </label>
                <input
                  type="number"
                  id="articlesPerPage"
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark"
                  defaultValue={20}
                  min={1}
                  max={200}
                />
              </div>
              <button
                id="extractBtn"
                className="w-full sm:w-auto bg-blue_dark text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue_dark transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Status + Results */}
          <div
            id="status"
            className="mt-8 text-center text-gray-600 hidden"
            role="status"
            aria-live="polite"
          />
          <div id="results" className="mt-6 hidden">
            <button
              id="downloadBtn"
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 hidden"
            >
              Tải xuống File Excel (.xlsx)
            </button>
            <div
              id="paginationControls"
              className="mt-4 flex justify-between items-center hidden"
            >
              <button
                id="prevBtn"
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                &larr; Trang trước
              </button>
              <span id="pageInfo" className="text-sm font-medium text-gray-700">
                Trang 1 / 1
              </span>
              <button
                id="nextBtn"
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Trang tiếp theo &rarr;
              </button>
            </div>

            {/* Preview + cột */}
            <div id="resultsPreviewContainer" className="mt-8 hidden">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Xem trước kết quả &amp; Tùy chọn cột
              </h3>
              <div
                id="columnOptions"
                className="mb-4 p-4 bg-gray-50 rounded-lg border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              />
              <div id="resultsTableContainer" className="overflow-x-auto" />
            </div>
          </div>
        </main>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside id="downloadHistoryPanel" className="sidebar">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Lịch sử Tải về</h2>
        <div id="downloadHistoryList" className="space-y-2" />
        <h2 className="text-xl font-bold text-gray-700 mt-6 mb-4">
          Lịch sử Xóa
        </h2>
        <div id="deletionHistoryList" className="space-y-2" />
      </aside>

      {/* Citation Modal */}
      <div
        id="citation-modal-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50"
      >
        <div
          id="citation-modal"
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all scale-95 opacity-0"
        >
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-xl font-semibold text-gray-800">
              Trích dẫn bài báo
            </h3>
            <button
              id="close-citation-modal-btn"
              className="text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Đóng"
            >
              &times;
            </button>
          </div>
          <div className="mt-4">
            <textarea
              id="citation-content"
              readOnly
              className="w-full h-40 p-3 bg-gray-100 rounded-md text-sm font-mono border border-gray-200 focus:ring-blue_dark focus:border-blue_dark resize-none"
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                id="copy-citation-btn"
                className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue_dark"
              >
                <i className="fa-regular fa-copy" />
                <span>Sao chép</span>
              </button>
              <button
                id="download-nbib-btn"
                className="flex items-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue_dark"
              >
                <i className="fa-solid fa-download" />
                <span>Download .nbib</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="citation-format-select"
                className="text-sm font-medium text-gray-700"
              >
                Format:
              </label>
              <select
                id="citation-format-select"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue_dark focus:border-blue_dark text-sm bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
