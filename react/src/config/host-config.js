//브라우저에서 현재 클라이언트의 호스트 이름 얻어오기
const clientHostName = window.location.hostname;

let backEndHostName; //백엔드 서버 호스트 이름

if (clientHostName === 'localhost') {
    //개발중
    // backEndHostName = 'http://3.35.144.168';
    backEndHostName = 'localhost:8181';
} else if (
    clientHostName === 'krayon.store.s3-website.ap-northeast-2.amazonaws.com'
) {
    //배포해서 서비스중
    // backEndHostName = 'https://api.spring.com';
    backEndHostName = '13.125.244.151';
} else if (clientHostName === 'krayon.store') {
    //배포해서 서비스중
    // backEndHostName = 'https://api.spring.com';
    backEndHostName = '13.124.169.109';
}
export const BASE_URL = backEndHostName;
