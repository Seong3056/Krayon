package com.krayon.backend.wordmatch;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
public class WMService {

//    public String getData(String drawData) {
//        log.info("받아서 전파하는 데이터: {}", drawData);
//        return drawData;
//    }

    // 랜덤 수 생성
    public int getTargetCode() {
        Random rand = new Random();
        int num = rand.nextInt(30001);  // 0 이상 30000 이하의 난수 생성
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


    public Map<String, String> findRandomWord() {

        try {
            String url = "https://opendict.korean.go.kr/api/view?certkey_no=5609&key=BAAA5C2F46E8178AC1D5714D4775EAB5&&target_type=view&req_type=xml&method=target_code&q=" + getTargetCode();


            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(url);

            // 제일 첫 번째 태그
            doc.getDocumentElement().normalize();


            // 파싱할 tag
            NodeList senseInfoList = doc.getElementsByTagName("senseInfo");
            NodeList wordInfoList = doc.getElementsByTagName("wordInfo");


            int randomIndex = new Random().nextInt(senseInfoList.getLength());

            Node senseInfoNode = senseInfoList.item(randomIndex);
            Node wordInfoNode = wordInfoList.item(randomIndex);
            if (senseInfoNode.getNodeType() == Node.ELEMENT_NODE) {
                Element senseInfoElement = (Element) senseInfoNode;
                Element wordInfoElement = (Element) wordInfoNode;

                String definition = getTagValue("definition", senseInfoElement).replace(".", "");
                String word = getTagValue("word", wordInfoElement).replace("-", "");
                String pos = getTagValue("pos", senseInfoElement);
                log.info("품사: " + pos);
                log.info("랜덤 단어: " + word);
                log.info("뜻: " + definition);

                Map<String, String> result = new HashMap<>();

//                if(pos.equals("명사")) {
//                    result.put("definition", definition);
//                    result.put("word", word);
//                    return result;
//                }
                result.put("definition", definition);
                result.put("word", word);
                result.put("pos", pos);
                return result;


            }
        } catch (Exception e) {
            e.printStackTrace();
            log.info("서비스 에러");
        }
        return null;
    }

    public Map<String, String> wordFilter() {
        Map<String, String> result;
        while (true) {
            result = findRandomWord();
            if (result.get("pos").equals("명사")) break;
        }
        return result;
    }


}
