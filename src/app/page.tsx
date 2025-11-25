import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Công cụ Trích xuất</span>
              <span className="block text-primary">Google Scholar Thông minh</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Giải pháp toàn diện để tìm kiếm, trích xuất và quản lý thông tin
              bài báo khoa học từ Google Scholar
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/search"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                >
                  Bắt đầu ngay
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="#features"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Tính năng nổi bật
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Những công cụ mạnh mẽ giúp bạn tối ưu hóa quy trình nghiên cứu
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                    <i className="fas fa-search text-xl text-white"></i>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900">
                  Tìm kiếm Thông minh
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Tìm kiếm nhanh chóng với bộ lọc đa dạng. Kết quả chính xác và
                  phù hợp với nhu cầu của bạn.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                    <i className="fas fa-file-export text-xl text-white"></i>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900">
                  Xuất dữ liệu Dễ dàng
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Xuất kết quả sang nhiều định dạng khác nhau. Tùy chỉnh cột và
                  dữ liệu theo ý muốn.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-4 left-4">
                  <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                    <i className="fas fa-history text-xl text-white"></i>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900">
                  Quản lý Lịch sử
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Theo dõi lịch sử tìm kiếm và tải xuống. Dễ dàng truy cập lại
                  các kết quả trước đó.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary">100+</div>
              <div className="mt-2 text-base text-gray-600">
                Người dùng hoạt động
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary">10K+</div>
              <div className="mt-2 text-base text-gray-600">
                Bài báo đã xuất
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary">5K+</div>
              <div className="mt-2 text-base text-gray-600">Lượt tìm kiếm</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary">24/7</div>
              <div className="mt-2 text-base text-gray-600">
                Hỗ trợ kỹ thuật
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Cách sử dụng
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Chỉ với 4 bước đơn giản
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary text-white rounded-full">
                    <span className="text-lg font-semibold">1</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Nhập từ khóa
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Nhập các từ khóa tìm kiếm và áp dụng bộ lọc phù hợp
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary text-white rounded-full">
                    <span className="text-lg font-semibold">2</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Xem kết quả
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Duyệt qua danh sách kết quả và chọn các bài báo phù hợp
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary text-white rounded-full">
                    <span className="text-lg font-semibold">3</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Tùy chỉnh cột
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Chọn các cột thông tin cần xuất theo nhu cầu
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary text-white rounded-full">
                    <span className="text-lg font-semibold">4</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Xuất dữ liệu
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tải xuống kết quả dưới dạng file Excel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Sẵn sàng bắt đầu?</span>
            <span className="block text-gray-200">
              Bắt đầu sử dụng công cụ ngay hôm nay.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              className="h-12 w-12 mx-auto mb-4"
              src="/favicon128.ico"
              alt="Logo"
              width={48}
              height={48}
            />
            <p className="text-base text-gray-500">
              &copy; 2025 Google Scholar Tool. Phát triển bởi AIoT Lab VN.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
