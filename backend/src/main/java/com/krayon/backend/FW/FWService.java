package com.krayon.backend.FW;

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
public class FWService {

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

    public int checkWord(String searchWord){
        try{
            String url = "https://krdict.korean.go.kr/api/search?certkey_no=5597&key=EDA74127B22EE2D406A4F053EFC0E2BD&type_search=search&part=word&q="+searchWord+"&sort=dict";
            log.info(url);
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

                return 1;
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return 0;
        }
        return 0;

    }
}
