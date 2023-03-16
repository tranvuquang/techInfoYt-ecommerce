Luồng khởi động của next như sau:
    01->_app.tsx chay phia server side ở hàm MyApp.getInitialProps
    02-> các next page chay phia server side 
    03-> _app.tsx chay phia client
    04-> các next page chay client

Khi chưa đăng nhập - không có accessToken lưu ở cookie, luồng khởi động như sau:
    01-> vào trang login.tsx đăng nhập thành công
    02-> route sang trang local login.ts(trang này phía server side). Trang này kết nối đến server data nếu kết đăng nhập thành công 
    03-> dữ liệu trả về sẽ đc dispatch vào redux ở server side và response data về trang login.tsx
    04-> ỏ trang login.tsx tiếp tục dispatch data vào redux ở client side và route về trang home
    05->trang home chưa chay ngay ma nhường cho hàm MyApp.getInitialProps ở _app.tsx khởi động trước. Hàm này đẩy dữ liệu vào props chung cho tất cả các next page và lưu data vào redux server side.
    06-> các next page đã có redux data phia server để hoạt động
    07->_app.tsx chạy phía client bằng hàm useMemo và lưu data vào redux client side

Khi đã đăng nhập rồi accessToken được lưu ở cookie và refresh lại trang web, luồng khởi động như sau:
    01-> getInitialProps ở _app.tsx khởi động trước. Hàm này lấy accessToken ở cookies đẩy dữ liệu vào props chung cho tất cả các next page và lưu data vào redux server side.
    02-> các next page đã có redux data phia server để hoạt động
    03->_app.tsx chạy phía client bằng hàm useMemo và lưu data vào redux client side
