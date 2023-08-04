//브라우저에서 현재 클라이언트의 호스트 이름 얻어오기
const clientHostName = window.location.hostname;

let backEndHostName; //백엔드 서버 호스트 이름

if (clientHostName === 'localhost') {
    //개발중
    // backEndHostName = 'http://3.35.144.168';
    backEndHostName = 'localhost:8181';
} else if (clientHostName === 'krayon.store') {
    backEndHostName = '43.201.18.202';
} else if (clientHostName === '175.114.130.19') {
    backEndHostName = '175.114.130.19';
}
export const BASE_URL = backEndHostName;
