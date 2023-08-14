import breadAwkward from 'assets/images/ico_bread_awkward.png';
import { Button } from 'components/Elements/Button/BasicButton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

  export const Unauthorized = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    })

    const onClick = () => {
      navigate("/");  
    }
    
  
    return (
      <div className="NotFound">
        <div className="MenuBody">
        <div className="MenuBtns">
          <img src={breadAwkward} alt="빵_어색" id="bread_awkward"/>
          <p>비정상적 접근입니다. 다시 로그인해주세요.</p>
        </div>
        <div className="MenuBackBtns">
          <Button onClick={onClick}>홈으로 돌아가기</Button>
        </div>
      </div>
      </div>
    );
  };
  