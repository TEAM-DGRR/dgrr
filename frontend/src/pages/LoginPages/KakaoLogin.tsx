import { REST_API_KEY, REDIRECT_URI } from './LoginData'
import kakaoImg from 'assets/images/kakao_login_large_wide.png'
import logo from 'assets/images/logo.svg'
import "assets/scss/Login.scss"

export const KakaoLogin = () => {
  const kakaourl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`

  return (
    <div className='kakaoLogin'>
      <img id='logo' src={logo} alt='데구르르 타이틀' />
      <img
          alt="카카오 로그인"
          id='kakaoimg'
          src={kakaoImg}
          onClick={() => window.location.href = kakaourl}
      />
    </div>
  )
}
