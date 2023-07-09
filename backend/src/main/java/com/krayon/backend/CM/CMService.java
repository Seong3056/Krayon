package com.krayon.backend.CM;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.Random;

@Service
@Slf4j
public class CMService {
    public String getData(String drawData) {
        log.info("받아서 전파하는 데이터: {}", drawData);
        return drawData;
    }

    // 랜덤 수 생성
    public int getTargetCode() {
        Random rand = new Random();
        int num = rand.nextInt(100001);  // 0 이상 30000 이하의 난수 생성
        System.out.println(num);
        return num;
    }

    // tag 값의 정보를 가져오는 함수
    public static String getTagValue(String tag, Element eElement) {
        // 결과를 저장할 result 변수 선언
        String result = "";
        NodeList nodeList = eElement.getElementsByTagName(tag);
        if (nodeList != null && nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                result = element.getTextContent();
            }
        }
        return result;
    }

    public String findRandomWord() {
        try {
//            String url = "https://opendict.korean.go.kr/api/view?certkey_no=5609&key=BAAA5C2F46E8178AC1D5714D4775EAB5&&target_type=view&req_type=xml&method=target_code&q="+getTargetCode();
            String url = "https://krdict.korean.go.kr/api/view?key=EDA74127B22EE2D406A4F053EFC0E2BD&method=target_code&q="+getTargetCode();
//
//            log.info();
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(url);

            // 제일 첫 번째 태그
            doc.getDocumentElement().normalize();

            // 파싱할 tag
            NodeList nList = doc.getElementsByTagName("word_info");

            int randomIndex = new Random().nextInt(nList.getLength());

            Node nNode = nList.item(randomIndex);
            if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                Element eElement = (Element) nNode;

                String word = getTagValue("word", eElement);
                log.info("랜덤단어: " + word);

                return word;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
