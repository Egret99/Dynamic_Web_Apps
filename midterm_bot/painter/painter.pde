import java.util.*;
PFont ubuntu;
JSONObject json;

void setup() {
  size(1500, 1200);
  
  //import and setup all the values
  ubuntu = loadFont("AgencyFB-Bold-48.vlw");
  json = loadJSONObject("content.json");
  
  String content = json.getString("content");
  
  color[] colors = {#FFFD82, #FF9B71, #E84855, #B56B45, #2B3A67};
  color[] textColors = {#264653, #2A9D8F, #E9C46A, #F4A261,#E76F51};

  background(colors[(int)random(5)]);

  //create text
  float fontSize = 1500/content.length()*1.5;
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  color originalTextColor = textColors[(int)random(5)];
  fill(originalTextColor);
  text(content, width/2, height/2);

  //change text
  for (int i = 0; i < width*height; i++) {
    //for (int j = 0; j < height; j++) {
      int x = (int)random(width);
      int y = (int)random(height);
      
      color c = get(x, y);
      noStroke();
      if (c == originalTextColor) {
        fill(textColors[(int)random(5)]);
        
        float d = constrain(20, 3, fontSize/11) + (int)random(5);
        ellipse(x, y, d, d);
      }
    //}
  }

  save("pic.png");
  exit();
}
