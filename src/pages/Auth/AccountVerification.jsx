import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo một biến state để biết được là đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản

  // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì chuyển sang trang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Nếu chưa verify xong thì hiện loading

  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail


  return (
    <div>
      test
    </div>
  )
}

export default AccountVerification
