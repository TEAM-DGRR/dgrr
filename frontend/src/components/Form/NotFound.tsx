import breadFix from 'assets/images/ico_bread_fix.png';
import { Button } from 'components/Elements/Button/BasicButton';

  export const NotFound = () => {
    
  
    return (
      <div className="NotFound">
        <div className="MenuBody">
        <div className="MenuBtns">
          <img src={breadFix} alt="빵_공사" id="bread_fix"/>
          <p>알 수 없는 페이지입니다.</p>
        </div>
        <div className="MenuBackBtns">
          <Button>홈으로 돌아가기</Button>
        </div>
      </div>
      </div>
    );
  };
  