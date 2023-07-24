## 좋아요 버튼 & 개수 UI
- onClick() 안에는 함수 넣어주기(함수이름만 넣어도 되고 함수 만드는 문법을 바로 넣어줘도 된다)
- state는 등호로 변경하면 안 된다
```js
function App() {

  // 좋아요 버튼, state 변경함수
  let [좋아요, 좋아요변경] = useState(0); 

  return (
    <div className="App">
      <div className='list'>
        {/* eventhandler onClick 추가 */}
        <h4>{ 글제목[0] } <span onClick={() => {좋아요변경(좋아요+1)}}>👍</span> {좋아요} </h4>
      </div>
    </div>
  );
}
```

## 누르면 제목이 바뀌는 버튼
```js
let [글제목, 제목변경] = useState(['남자 코트 추천', '우동맛집', '파이썬독학'])

<button onClick={()=> {
  // array/object 다룰 때 원본은 보존하는 게 좋음
  let copy = [...글제목];
  copy[0] = '여자 코트 추천'
  제목변경(copy)
}}>글 수정</button>
```
- state 변경 함수 특징
  - 기존 state == 신규 state 일 땐 변경 안해줌
- array, object 특징
  ```js
  let arr = [1, 2, 3]
  ```
  - 변수에 배열이 저장되는 것이 아니라 배열을 가리키는 화살표만 저장됨
  ```js
  let [글제목, 제목변경] = useState(['남자 코트 추천', '우동맛집', '파이썬독학'])

  <button onClick={()=> {
    // 글제목이라는 화살표를 가져온 것이라서 변경되지않음
    let copy = 글제목;
    copy[0] = '여자 코트 추천'
    제목변경(copy)
  }}>글 수정</button>
  ```
  - 변수1, 변수2 화살표가 같으면 state 변경 안 해줌
- 정리 : state가 array, object 이면 독립적 카피본을 만들어서 수정해야 함

## 누르면 정렬이 되는 버튼 만들기
```js
<button onClick={()=>{
  let sorted = [...글제목].sort();
  제목변경(sorted)
}}>정렬</button>
```

## 상세페이지 모달 > component
- html을 깔끔하게 만들어줄 수 있음
```js
// 기존
<div className='modal'>
  <h4>제목</h4>
  <p>날짜</p>
  <p>상세내용</p>
</div>

// 변경 후
<Modal></Modal>
```
- 컴포넌트 만드는 법
  - function 만들고(다른 함수 바깥에 만들어야함)
  - return 안에 html 담기
  - <함수명></함수명> 쓰기(<함수명/> 하나만 써도 상관없음)
  ```js
  // 방법 1
  function Modal() {
  return (
    <div className='modal'>
      <h4>제목</h4>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
    )
  }

  // 방법 2
  // const는 나중에 실수로 수정했을 때 에러메시지를 보여준다
  const Modal = () => {
    return ()
  }
  ```
- return에 div 두 개 넣고싶을 때
  ```js
  return (
    <>
      <div>
        <p></p>
      </div>
      <div></div>
    </>
  )
  ```
  - 의미없는 \<div> 대신 <></> 사용 가능
- 컴포넌트는 언제 사용하는 걸까
  - 반복적인 html 축약할 때
  - 큰 페이지들
  - 자주 변경되는 것들
- 컴포넌트의 단점
  - state를 가져다쓸 때 문제생김(다른 함수에 있는 변수 사용 불가)


## 동적인 UI 만들기
- 만드는 법
  - html, css로 미리 디자인 완성
  - UI의 현재 상태를 state로 저장
  - state에 따라 UI가 어떻게 보일지 조건문으로 작성
```js
// 좋아요 버튼, state 변경함수
let [좋아요, 좋아요변경] = useState(0); 

// 현재 상태 저장해두기
let [modal, setModal] = useState(false);

// 삼항연산자를 사용하여 보일 때 안 보일 때 나눠줌
{
  modal == true ? <Modal/> : null
}

// 누르면 모달이 보였다 안 보였다하도록 해주기
<h4 onClick={()=>{setModal(!modal)}}>{ 글제목[2] }</h4>
```


## 많은 div들을 반복문으로 줄이고 싶을 때
- map 사용
```js
{
  글제목.map(function(제목, i){
    return (
      <div className='list' key={i}>
        <h4 onClick={()=>{setModal(!modal)}}>{ 글제목[i] } { 제목 }</h4>
        <p>2월 17일 발행</p>
      </div>
    )
  })
}
```


## 좋아요 개수 개별로 기록하기
```js
let [좋아요, 좋아요변경] = useState([0, 0, 0]); 

{
  글제목.map(function(제목, i){
    return (
      <div className='list' key={i}>
        <h4 onClick={()=>{setModal(!modal)}}>
          { 글제목[i] } { 제목 }
        </h4>
        <span onClick={() => {
          let like = [...좋아요]
          like[i] += 1
          좋아요변경(like)}}>👍</span> { 좋아요[i] }
        <p>2월 17일 발행</p>
      </div>
    )
  })
}
```

## props
```js
// 부모에서 자식한테 state를 전달할 때 props 문법 사용
<Modal 글제목={글제목}/>

// props parameter 등록 후 사용
function Modal(props) {
  return (
    <div className='modal'>
      <h4>{props.글제목}</h4>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
  )
}
```
- props 전송은 부모 > 자식만 가능
- 컴포넌트가 많아지면 props 쓰기 귀찮아짐
```js
// 다양한 색상의 모달창도 만들 수 있다
<Modal color={'yellow'} 글제목={글제목}/>

function Modal(props) {
  return (
    <div className='modal' style={{background : props.color}}>
      <h4>{props.글제목[0]}</h4>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
  )
}
```
- 누른 글 제목이 모달창에 뜨게하기
```js
// 제목 state 저장
let [title, setTitle] = useState(0)

// 제목 전송해주기
<Modal title={title} 제목변경={제목변경} color={'yellow'} 글제목={글제목}/>

function Modal(props) {
  return (
    <div className='modal' style={{background : props.color}}>
      <h4>{props.글제목[props.title]}</h4>
      <p>날짜</p>
      <p>상세내용</p>
      <button onClick={()=>{
        let a = [...props.글제목]
        a[0] = '여자 코트 추천'
        props.제목변경(a)
      }}>글수정</button>
    </div>
  )
}
```
- state 만드는 곳은 state를 사용하는 컴포넌트 중 최상위 컴포넌트
